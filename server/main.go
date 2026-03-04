package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func main() {
	addr := flag.String("addr", "127.0.0.1:9090", "listen address")
	dbPath := flag.String("db", "/srv/blog/data/interactions.db", "SQLite database path")
	flag.Parse()

	var err error
	db, err = sql.Open("sqlite3", *dbPath+"?_journal_mode=WAL&_busy_timeout=5000")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := migrate(db); err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/api/interactions", handleInteractions)
	log.Printf("listening on %s (db: %s)", *addr, *dbPath)
	log.Fatal(http.ListenAndServe(*addr, nil))
}

func migrate(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS likes (
			post TEXT PRIMARY KEY,
			count INTEGER NOT NULL DEFAULT 0
		);
		CREATE TABLE IF NOT EXISTS comments (
			id         TEXT PRIMARY KEY,
			post       TEXT NOT NULL,
			parent_id  TEXT,
			text       TEXT NOT NULL,
			created_at TEXT NOT NULL
		);
		CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post);
	`)
	return err
}

type interactionsResponse struct {
	Likes    int       `json:"likes"`
	Comments []comment `json:"comments"`
}

type comment struct {
	ID        string `json:"id"`
	ParentID  string `json:"parentId,omitempty"`
	Text      string `json:"text"`
	CreatedAt string `json:"createdAt"`
}

type actionRequest struct {
	Action   string `json:"action"`
	Post     string `json:"post"`
	Text     string `json:"text,omitempty"`
	ParentID string `json:"parentId,omitempty"`
}

func handleInteractions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		handleGet(w, r)
	case http.MethodPost:
		handlePost(w, r)
	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)
	default:
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func handleGet(w http.ResponseWriter, r *http.Request) {
	post := r.URL.Query().Get("post")
	if post == "" {
		http.Error(w, `{"error":"missing post parameter"}`, http.StatusBadRequest)
		return
	}

	var likes int
	err := db.QueryRow("SELECT count FROM likes WHERE post = ?", post).Scan(&likes)
	if err == sql.ErrNoRows {
		likes = 0
	} else if err != nil {
		http.Error(w, `{"error":"internal error"}`, http.StatusInternalServerError)
		return
	}

	rows, err := db.Query(
		"SELECT id, parent_id, text, created_at FROM comments WHERE post = ? ORDER BY created_at ASC",
		post,
	)
	if err != nil {
		http.Error(w, `{"error":"internal error"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	comments := []comment{}
	for rows.Next() {
		var c comment
		var parentID sql.NullString
		if err := rows.Scan(&c.ID, &parentID, &c.Text, &c.CreatedAt); err != nil {
			continue
		}
		if parentID.Valid {
			c.ParentID = parentID.String
		}
		comments = append(comments, c)
	}

	resp := interactionsResponse{Likes: likes, Comments: comments}
	json.NewEncoder(w).Encode(resp)
}

func handlePost(w http.ResponseWriter, r *http.Request) {
	var req actionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid JSON"}`, http.StatusBadRequest)
		return
	}

	req.Post = strings.TrimSpace(req.Post)
	if req.Post == "" {
		http.Error(w, `{"error":"missing post"}`, http.StatusBadRequest)
		return
	}

	switch req.Action {
	case "like":
		handleLike(w, req)
	case "comment":
		handleComment(w, req)
	default:
		http.Error(w, `{"error":"unknown action"}`, http.StatusBadRequest)
	}
}

func handleLike(w http.ResponseWriter, req actionRequest) {
	_, err := db.Exec(`
		INSERT INTO likes (post, count) VALUES (?, 1)
		ON CONFLICT(post) DO UPDATE SET count = count + 1
	`, req.Post)
	if err != nil {
		http.Error(w, `{"error":"internal error"}`, http.StatusInternalServerError)
		return
	}

	var count int
	db.QueryRow("SELECT count FROM likes WHERE post = ?", req.Post).Scan(&count)
	json.NewEncoder(w).Encode(map[string]int{"likes": count})
}

func handleComment(w http.ResponseWriter, req actionRequest) {
	text := strings.TrimSpace(req.Text)
	if text == "" || len(text) > 500 {
		http.Error(w, `{"error":"text must be 1-500 characters"}`, http.StatusBadRequest)
		return
	}

	id := fmt.Sprintf("%d", time.Now().UnixNano())

	var parentID sql.NullString
	if req.ParentID != "" {
		var exists int
		err := db.QueryRow("SELECT 1 FROM comments WHERE id = ? AND post = ? AND parent_id IS NULL", req.ParentID, req.Post).Scan(&exists)
		if err != nil {
			http.Error(w, `{"error":"parent comment not found"}`, http.StatusBadRequest)
			return
		}
		parentID = sql.NullString{String: req.ParentID, Valid: true}
	}

	now := time.Now().UTC().Format(time.RFC3339)
	_, err := db.Exec(
		"INSERT INTO comments (id, post, parent_id, text, created_at) VALUES (?, ?, ?, ?, ?)",
		id, req.Post, parentID, text, now,
	)
	if err != nil {
		http.Error(w, `{"error":"internal error"}`, http.StatusInternalServerError)
		return
	}

	c := comment{ID: id, Text: text, CreatedAt: now}
	if parentID.Valid {
		c.ParentID = parentID.String
	}
	json.NewEncoder(w).Encode(c)
}
