# mohantyabhijit.github.io

## Project Overview

Abhijit Mohanty's personal blog and portfolio website at **https://abhijitmohanty.com**. A Hugo static site with a Go backend API for post interactions (likes and threaded comments). Two-stage deployment: push to `main` auto-deploys to GitHub Pages (staging), then manual approval deploys to a DigitalOcean droplet (production).

## Tech Stack

- **Hugo** (Extended, v0.157.0) with **PaperMod** theme (vendored)
- **Go** (1.25.0) — backend API server (`net/http` + `modernc.org/sqlite`)
- **HTML** (Hugo templates) / **CSS** / **JavaScript** (inline in templates)
- **Markdown** — all content
- **TOML** — Hugo config and frontmatter
- **GitHub Actions** — 3 workflows (deploy, Claude Code, Claude Code Review)
- **Apache** with mod_rewrite + certbot on production
- **Fonts**: Manrope (body), Newsreader (logo), Inconsolata (monospace)

## Project Structure

```
mohantyabhijit.github.io/
├── config.toml                     # Hugo site configuration
├── content/
│   ├── _index.md                   # Home page
│   ├── about.md, projects.md, reads.md, resume.md
│   └── posts/                      # Blog articles (8 posts)
├── layouts/
│   ├── index.html                  # Custom home page (profile-page)
│   ├── _default/
│   │   ├── single.html             # Post layout (adds interactions)
│   │   ├── reads.html              # Custom reads page
│   │   └── resume.html             # Custom resume page
│   ├── posts/list.html             # Year-grouped blog list
│   ├── partials/
│   │   ├── header.html, footer.html
│   │   ├── extend_head.html        # Google Fonts preconnect
│   │   ├── extend_footer.html      # Vine SVGs + view counter JS
│   │   └── post_interactions.html  # Likes + threaded comments
│   └── shortcodes/
│       ├── rawhtml.html
│       └── svg.html
├── assets/css/extended/
│   └── antfu-inspired.css          # Custom theme (1082 lines, light+dark)
├── server/
│   ├── main.go                     # Go API server (likes, comments, SQLite)
│   ├── go.mod, go.sum
│   └── blog-api.service            # systemd unit file
├── static/
│   ├── Abhijit-Mohanty-Resume.pdf, resume.tex, generate_resume.py
├── themes/PaperMod/                # Vendored PaperMod theme
├── .github/workflows/
│   ├── deploy.yml                  # Build + deploy pipeline
│   ├── claude.yml                  # Claude Code bot
│   └── claude-code-review.yml      # Claude auto code review
├── HOWTO.md                        # Guide for writing/publishing posts
└── DEPLOY_DO.md                    # DigitalOcean deployment runbook
```

## How to Run

```bash
# Hugo dev server with drafts
hugo server -D                      # http://localhost:1313

# Production build
hugo --minify --baseURL "https://abhijitmohanty.com/"

# Go backend
cd server
go build -o blog-api .
./blog-api -addr 127.0.0.1:9090 -db /path/to/interactions.db

# New post
hugo new posts/my-new-post.md
```

## Deployment

- **Staging**: Push to `main` → Hugo build → GitHub Pages
- **Production**: Manual approval → rsync to DigitalOcean + Go binary via SCP
- **Symlink releases**: Timestamped release dirs with `current` symlink for instant rollbacks

## Conventions

- **Theme customization via overrides**: Override PaperMod partials/layouts in top-level `layouts/`, don't modify the theme directly. Custom CSS in `assets/css/extended/` (PaperMod auto-includes it).
- **Content**: TOML frontmatter (`+++` fences). Required fields: `title`, `date`. File naming: lowercase with hyphens. Permalinks: `/posts/:slug/`.
- **API**: Single `/api/interactions` endpoint. GET to fetch, POST with `action` field (`like`, `unlike`, `comment`). Client stores like state in `localStorage`.
- **Inline JS**: All JavaScript inlined in Hugo partials (no bundler, no external JS files).
- **Hardcoded content pages**: Reads and resume pages have content directly in layout templates, not in markdown.
- **Design**: antfu.me-inspired. Dotted background, decorative vine SVGs, Manrope/Newsreader/Inconsolata fonts. Full dark mode via `data-theme` attribute + CSS variables.

## No Linting / No Tests

No linting, formatting, or test configuration. No `CLAUDE.md` file.
