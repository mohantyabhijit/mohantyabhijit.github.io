+++
title = "How I Built and Deploy This Website"
date = 2026-02-28T10:00:00+05:30
description = "A complete walkthrough of building a personal site with Hugo, deploying to staging on GitHub Pages, and shipping to production on a DigitalOcean droplet — all automated with GitHub Actions."
tags = ["devops", "hugo", "infrastructure", "tutorial"]
slug = "how-i-built-and-deploy-this-website"
draft = false
+++

This site runs on Hugo, deploys to GitHub Pages for staging, and ships to a DigitalOcean droplet for production. The entire pipeline is a single GitHub Actions workflow. Push to `main`, preview on staging, approve, and it goes live.

Here is exactly how it works, step by step. If you want to build something similar, this post is your blueprint.

## Why Hugo

Hugo is a static site generator written in Go. It takes Markdown files, applies a theme, and outputs plain HTML. No database, no server-side rendering, no JavaScript framework. Just files.

I picked Hugo for three reasons:

1. **Speed** — builds the entire site in under 300ms
2. **Simplicity** — content is Markdown, config is a single TOML file
3. **Zero runtime dependencies** — the output is static HTML that any web server can serve

There are other options — Jekyll, Astro, Next.js — but Hugo hits the sweet spot of fast builds and minimal complexity.

## Setting Up Hugo Locally

Install Hugo (on macOS):

```bash
brew install hugo
```

Create a new site:

```bash
hugo new site mysite
cd mysite
```

Add a theme. I use [PaperMod](https://github.com/adityatelange/hugo-PaperMod/), which is clean and fast:

```bash
git init
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

Configure the site in `config.toml`:

```toml
baseURL = "https://yourdomain.com/"
languageCode = "en-us"
title = "Your Name"
theme = "PaperMod"

[params]
  description = "Your tagline here."
  defaultTheme = "light"
  ShowReadingTime = true
  ShowPostNavLinks = true

[menu]
  [[menu.main]]
    name = "Blog"
    url = "/posts/"
    weight = 10
```

Write your first post:

```bash
hugo new posts/hello-world.md
```

Edit the file in `content/posts/hello-world.md`:

```markdown
+++
title = "Hello World"
date = 2026-02-28
description = "My first post."
tags = ["intro"]
draft = false
+++

This is my first blog post. Written in Markdown, built by Hugo.
```

Preview locally:

```bash
hugo server -D
```

Open `http://localhost:1313` and you have a working site.

## The Two-Stage Deployment Model

I use a two-stage deployment:

1. **Staging** → GitHub Pages (free, automatic on every push)
2. **Production** → DigitalOcean Droplet (manual approval required)

This means every push to `main` gets a live preview at your GitHub Pages URL. You review it, and if it looks good, approve the production deployment from the GitHub Actions UI. No broken deploys to production.

```
Push to main
    │
    ▼
GitHub Actions builds Hugo
    │
    ▼
Deploys to GitHub Pages (staging)
    │
    ▼
You review the preview
    │
    ▼
Approve production deployment
    │
    ▼
Rebuilds and deploys to DigitalOcean
```

## Setting Up the DigitalOcean Droplet

Create a droplet on DigitalOcean. The cheapest option ($6/month, 1 vCPU, 1 GB RAM) is more than enough for a static site. Pick Ubuntu 24.04 and a region close to your audience.

### Install Apache

SSH into the droplet and install Apache:

```bash
sudo apt update && sudo apt install -y apache2
```

### Create a Deploy User

Never deploy as root. Create a dedicated user:

```bash
sudo useradd -m -s /bin/bash deploy
sudo mkdir -p /srv/blog/releases
sudo chown -R deploy:deploy /srv/blog
```

### Set Up SSH Keys for Automated Deployment

On your local machine, generate a key pair:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/do_deploy_key -N ""
```

Copy the public key to the droplet:

```bash
ssh root@YOUR_DROPLET_IP \
  'mkdir -p /home/deploy/.ssh && cat >> /home/deploy/.ssh/authorized_keys' \
  < ~/.ssh/do_deploy_key.pub

ssh root@YOUR_DROPLET_IP \
  'chown -R deploy:deploy /home/deploy/.ssh && \
   chmod 700 /home/deploy/.ssh && \
   chmod 600 /home/deploy/.ssh/authorized_keys'
```

### Configure Apache

Create `/etc/apache2/sites-available/blog.conf`:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com

    DocumentRoot /srv/blog/current

    <Directory /srv/blog/current>
        Options FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    DirectoryIndex index.html
    ErrorDocument 404 /404.html
</VirtualHost>
```

Enable the site:

```bash
sudo a2enmod rewrite
sudo a2ensite blog.conf
sudo a2dissite 000-default.conf
sudo systemctl reload apache2
```

### Set Up HTTPS

Use Let's Encrypt with certbot:

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

Certbot handles certificate renewal automatically. Free HTTPS, zero maintenance.

## The GitHub Actions Workflow

This is the heart of the system. A single workflow file at `.github/workflows/deploy.yml` handles everything:

```yaml
name: Build and Deploy

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # Stage 1: Build and deploy to GitHub Pages (automatic)
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: "0.157.0"
          extended: true

      - name: Build site for staging
        run: hugo --minify --baseURL "https://yourusername.github.io/"

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy-pages:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

  # Stage 2: Deploy to production (manual approval)
  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-pages
    environment:
      name: production
    steps:
      - uses: actions/checkout@v4

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: "0.157.0"
          extended: true

      - name: Build site for production
        run: hugo --minify --baseURL "https://yourdomain.com/"

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.DO_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -p "${{ secrets.DO_PORT }}" \
            "${{ secrets.DO_HOST }}" >> ~/.ssh/known_hosts

      - name: Deploy to DigitalOcean
        run: |
          TS=$(date +%Y%m%d%H%M%S)
          RELEASE="/srv/blog/releases/$TS"

          ssh -p "${{ secrets.DO_PORT }}" \
            "${{ secrets.DO_USER }}@${{ secrets.DO_HOST }}" \
            "mkdir -p $RELEASE"

          rsync -az --delete \
            -e "ssh -p ${{ secrets.DO_PORT }}" \
            public/ \
            "${{ secrets.DO_USER }}@${{ secrets.DO_HOST }}:$RELEASE/"

          ssh -p "${{ secrets.DO_PORT }}" \
            "${{ secrets.DO_USER }}@${{ secrets.DO_HOST }}" \
            "ln -sfn $RELEASE /srv/blog/current && \
             ls -1dt /srv/blog/releases/* | tail -n +8 | \
             xargs -r rm -rf"
```

The production deploy uses a symlink-based release strategy. Each deploy creates a new timestamped directory, rsyncs the built site into it, and atomically swaps the `/srv/blog/current` symlink. Old releases are cleaned up automatically, keeping the last 7.

### GitHub Repository Secrets

In your repo settings under **Settings → Secrets → Actions**, add:

| Secret | Value |
|--------|-------|
| `DO_HOST` | Your droplet IP address |
| `DO_USER` | `deploy` |
| `DO_PORT` | `22` |
| `DO_SSH_KEY` | Contents of `~/.ssh/do_deploy_key` (private key) |

### Requiring Approval for Production

In your repo settings, go to **Settings → Environments → production** and enable **Required reviewers**. Add yourself. Now every production deploy pauses and waits for your approval.

## The Daily Workflow

Writing and publishing a post is three steps:

```bash
# 1. Write
hugo new posts/my-new-post.md
# edit the file

# 2. Preview locally
hugo server -D

# 3. Ship
git add . && git commit -m "New post: my new post" && git push
```

After pushing, GitHub Actions builds the site and deploys to staging. Check the preview at your GitHub Pages URL. If it looks good, go to the Actions tab, click the run, and approve the production deployment.

The whole cycle from writing to live takes under two minutes.

## Rollback

If something breaks in production, rollback is instant. SSH into the droplet:

```bash
cd /srv/blog/releases && ls -1dt */
sudo ln -sfn /srv/blog/releases/<previous_release> /srv/blog/current
```

Apache follows the symlink automatically. No restart needed. You are back to the previous version in seconds.

## Cost

The entire setup costs about $6/month:

- **Hugo** — free and open source
- **GitHub Pages (staging)** — free
- **GitHub Actions** — free for public repos
- **DigitalOcean Droplet** — $6/month (cheapest option)
- **Let's Encrypt SSL** — free
- **Domain** — whatever your registrar charges

You get a fast, reliable personal website with a proper staging-to-production pipeline for the price of two coffees.

## Final Thoughts

This setup is intentionally simple. There is no Docker, no Kubernetes, no CDN, no build cache. Just Hugo, Apache, and a straightforward deployment script.

The staging environment catches mistakes before they go live. The manual approval gate means you never accidentally ship a broken post. The symlink-based releases mean rollbacks are instant.

If you are thinking about starting a personal website, stop overthinking the stack. Pick Hugo, pick a cheap server, set up a deployment pipeline, and start writing. The infrastructure should disappear. The writing is what matters.
