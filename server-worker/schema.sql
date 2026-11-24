-- D1 schema for the blog interactions API + view counter.
-- Mirrors server/main.go's migrate() output, plus a single-row counter table.

CREATE TABLE IF NOT EXISTS likes (
  post  TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS comments (
  id         TEXT PRIMARY KEY,
  post       TEXT NOT NULL,
  parent_id  TEXT,
  name       TEXT NOT NULL DEFAULT '',
  text       TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post);

CREATE TABLE IF NOT EXISTS counter (
  id    INTEGER PRIMARY KEY CHECK (id = 1),
  count INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO counter (id, count) VALUES (1, 0);
