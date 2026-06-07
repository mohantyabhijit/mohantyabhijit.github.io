# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev server (drafts visible)
hugo server -D                         # http://localhost:1313

# New post
hugo new posts/my-new-post.md

# Production build
hugo --minify --baseURL "https://abhijitmohanty.com/"

# Go API server (from /server)
go build -o blog-api .
./blog-api -addr 127.0.0.1:9090 -db /path/to/interactions.db

# If port 1313 is already in use
lsof -ti:1313 | xargs kill
```

No linting, formatting, or test tooling configured.

## Architecture

Hugo static site (PaperMod theme, vendored in `themes/PaperMod/`) with a Go backend for post interactions.

**Content → URL mapping:**
- `content/posts/*.md` → `/posts/:slug/` (TOML frontmatter, `+++` fences)
- `content/about.md`, `projects.md`, `reads.md`, `resume.md` → standalone pages

**Two separate systems to be aware of:**
1. **Hugo site** — everything except `server/`
2. **Go API server** (`server/main.go`) — SQLite-backed, serves `/api/interactions` (likes + threaded comments). Deployed as a systemd service on the DigitalOcean droplet alongside the static files.

**Deployment pipeline (two stages):**
- Push to `main` → GitHub Actions builds Hugo → auto-deploys to GitHub Pages (staging at `mohantyabhijit.github.io`)
- Manual approval in GitHub Actions → rsync to DigitalOcean droplet (production at `abhijitmohanty.com`) using timestamped release dirs + `current` symlink for instant rollback

## Conventions

**Theme customization:** Override PaperMod by placing files in top-level `layouts/` — never edit `themes/PaperMod/` directly. Custom CSS goes in `assets/css/extended/` (PaperMod auto-includes anything there).

**Hardcoded content pages:** `reads` and `resume` pages have their content directly in layout templates (`layouts/_default/reads.html`, `layouts/_default/resume.html`), not in their markdown files. Editing `content/reads.md` or `content/resume.md` has no visible effect on those pages.

**Resume PDF:** `static/Abhijit-Mohanty-Resume.pdf` is compiled from `static/resume.tex` via Docker + texlive. The `.tex` file is the source of truth — don't edit the PDF directly.

**JavaScript:** All JS is inlined in Hugo partials (no bundler, no external JS files). The view counter fetches `/api/counter`. Like state is stored in `localStorage`.

**`showCoffee` param:** Pages with `showCoffee = true` in frontmatter (currently `projects.md`) load the Stripe buy-button script via `extend_head.html`.

**Post frontmatter (required):** `title` and `date`. Optional: `draft`, `tags`, `description`, `cover`.

**API contract:** `GET /api/interactions?slug=<slug>` → fetch counts. `POST /api/interactions` with JSON `{slug, action}` where `action` is `like`, `unlike`, or `comment`.
