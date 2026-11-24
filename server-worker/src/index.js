// Workers + D1 port of the Go `blog-api` (server/main.go) and the Python
// view counter (counter.py). The HTTP contract is kept identical so the Hugo
// front-end (layouts/partials/post_interactions.html and extend_footer.html)
// needs zero changes:
//
//   GET  /api/interactions?post=<path>   -> { likes, comments: [...] }
//   POST /api/interactions               -> body { action, post, text?, name?, parentId? }
//        action = "like" | "unlike"      -> { likes }
//        action = "comment"              -> the created comment object
//   GET  /api/counter                    -> { count }   (increments on each GET)
//
// Binding: env.DB  (D1 database, see wrangler.toml + schema.sql)

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "cache-control": "no-store",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });

const error = (message, status) => json({ error: message }, status);

// ---- GET /api/interactions ------------------------------------------------
async function getInteractions(env, request) {
  const post = new URL(request.url).searchParams.get("post");
  if (!post) return error("missing post parameter", 400);

  const likeRow = await env.DB.prepare(
    "SELECT count FROM likes WHERE post = ?"
  )
    .bind(post)
    .first();
  const likes = likeRow ? likeRow.count : 0;

  const { results } = await env.DB.prepare(
    "SELECT id, parent_id, name, text, created_at FROM comments WHERE post = ? ORDER BY created_at ASC"
  )
    .bind(post)
    .all();

  const comments = (results || []).map((r) => {
    const c = {
      id: r.id,
      name: r.name ?? "",
      text: r.text,
      createdAt: r.created_at,
    };
    if (r.parent_id) c.parentId = r.parent_id;
    return c;
  });

  return json({ likes, comments });
}

// ---- POST /api/interactions ----------------------------------------------
async function postInteractions(env, request) {
  let req;
  try {
    req = await request.json();
  } catch {
    return error("invalid JSON", 400);
  }

  const post = String(req?.post ?? "").trim();
  if (!post) return error("missing post", 400);

  switch (req?.action) {
    case "like":
      return like(env, post);
    case "unlike":
      return unlike(env, post);
    case "comment":
      return comment(env, post, req);
    default:
      return error("unknown action", 400);
  }
}

async function like(env, post) {
  await env.DB.prepare(
    "INSERT INTO likes (post, count) VALUES (?, 1) ON CONFLICT(post) DO UPDATE SET count = count + 1"
  )
    .bind(post)
    .run();

  const row = await env.DB.prepare("SELECT count FROM likes WHERE post = ?")
    .bind(post)
    .first();
  return json({ likes: row ? row.count : 0 });
}

async function unlike(env, post) {
  await env.DB.prepare(
    "UPDATE likes SET count = MAX(count - 1, 0) WHERE post = ?"
  )
    .bind(post)
    .run();

  const row = await env.DB.prepare("SELECT count FROM likes WHERE post = ?")
    .bind(post)
    .first();
  return json({ likes: row ? row.count : 0 });
}

async function comment(env, post, req) {
  const text = String(req.text ?? "").trim();
  if (text.length === 0 || text.length > 500) {
    return error("text must be 1-500 characters", 400);
  }

  let name = String(req.name ?? "").trim();
  if (name.length > 50) name = name.slice(0, 50);

  const parentId = String(req.parentId ?? "").trim();

  // A reply's parent must exist, belong to the same post, and be top-level.
  if (parentId) {
    const parent = await env.DB.prepare(
      "SELECT 1 AS ok FROM comments WHERE id = ? AND post = ? AND parent_id IS NULL"
    )
      .bind(parentId, post)
      .first();
    if (!parent) return error("parent comment not found", 400);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO comments (id, post, parent_id, name, text, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(id, post, parentId || null, name, text, now)
    .run();

  const created = { id, name, text, createdAt: now };
  if (parentId) created.parentId = parentId;
  return json(created);
}

// ---- GET /api/counter -----------------------------------------------------
// Single-row table; the UPSERT + RETURNING is atomic. Falls back to
// increment-then-read if RETURNING is unavailable on the runtime.
async function counter(env) {
  let count = null;
  try {
    const row = await env.DB.prepare(
      "INSERT INTO counter (id, count) VALUES (1, 1) ON CONFLICT(id) DO UPDATE SET count = count + 1 RETURNING count"
    ).first();
    count = row ? row.count : null;
  } catch {
    await env.DB.prepare(
      "INSERT INTO counter (id, count) VALUES (1, 1) ON CONFLICT(id) DO UPDATE SET count = count + 1"
    ).run();
  }

  if (count == null) {
    const row = await env.DB.prepare(
      "SELECT count FROM counter WHERE id = 1"
    ).first();
    count = row ? row.count : 0;
  }

  return json({ count });
}

// ---- router ---------------------------------------------------------------
export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": "content-type",
        },
      });
    }

    if (path === "/api/interactions" || path === "/api/interactions/") {
      if (request.method === "GET") return getInteractions(env, request);
      if (request.method === "POST") return postInteractions(env, request);
      return error("method not allowed", 405);
    }

    if (path === "/api/counter" || path === "/api/counter/") {
      if (request.method === "GET") return counter(env);
      return error("method not allowed", 405);
    }

    return error("not found", 404);
  },
};
