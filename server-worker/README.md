# server-worker — blog API on Workers + D1

A Cloudflare Workers port of the Go `blog-api` (`../server/main.go`) and the
Python view counter (`/srv/counter/counter.py`). Same routes, same JSON, so the
Hugo front-end needs **no changes**:

| Method | Path | Body / query | Response |
|---|---|---|---|
| GET | `/api/interactions` | `?post=<path>` | `{ likes, comments: [{ id, parentId?, name, text, createdAt }] }` |
| POST | `/api/interactions` | `{ action:"like"\|"unlike", post }` | `{ likes }` |
| POST | `/api/interactions` | `{ action:"comment", post, text, name?, parentId? }` | the created comment |
| GET | `/api/counter` | — | `{ count }` (increments per request) |

## One-time setup

```sh
cd server-worker

# 1. Create the D1 database and copy its id into wrangler.toml
npx --yes wrangler@4.166.0 d1 create blog-interactions
#    -> paste the printed database_id over REPLACE_WITH_D1_DATABASE_ID

# 2. Apply the schema
npx --yes wrangler@4.166.0 d1 execute blog-interactions --remote --file=schema.sql

# 3. Deploy (test on the workers.dev URL first — see wrangler.toml tip)
npx --yes wrangler@4.166.0 deploy
```

Needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in the environment (the
same values already used by the mango-sg repo), or `wrangler login` locally.

## Migrating existing data (optional — the DBs are tiny)

Likes/comments live in `/srv/blog/data/interactions.db` (a few KB):

```sh
# Dump only the data (schema is applied by schema.sql)
sqlite3 /srv/blog/data/interactions.db .dump | grep -E '^INSERT' > /tmp/interactions-data.sql
npx --yes wrangler@4.166.0 d1 execute blog-interactions --remote --file=/tmp/interactions-data.sql
```

View counter — seed from the file counter:

```sh
COUNT=$(cat /srv/counter/count.txt)
npx --yes wrangler@4.166.0 d1 execute blog-interactions --remote \
  --command="UPDATE counter SET count = ${COUNT} WHERE id = 1;"
```

## Verify

```sh
curl 'https://abhijitmohanty.com/api/interactions?post=/posts/hello/'
curl -X POST https://abhijitmohanty.com/api/interactions \
  -H 'content-type: application/json' \
  -d '{"action":"like","post":"/posts/hello/"}'
curl https://abhijitmohanty.com/api/counter
```

## Notes / caveats

- **Routing vs Pages.** The `wrangler.toml` route `abhijitmohanty.com/api/*`
  lets the Worker handle `/api/*` while Pages serves the rest of the site. If
  you ever see a routing conflict, the alternative is Cloudflare Pages
  Functions: drop this handler into the Pages project as
  `functions/api/[[path]].js` and bind D1 there — no Worker route needed.
- **Public write endpoints.** `comment` is unauthenticated, exactly like the Go
  version. If spam becomes a problem, add Cloudflare Turnstile + a rate limit
  (Workers has a built-in rate-limit binding) — not implemented here to keep
  parity.
- **Free tier** is far more than this blog uses: D1 gives 5 GB storage,
  5M row-reads/day, 100k row-writes/day.
- `crypto.randomUUID()` replaces the Go `UnixNano` id; `Date.toISOString()`
  replaces RFC3339 timestamps. Both are still JSON strings and the front-end
  treats ids as opaque.
