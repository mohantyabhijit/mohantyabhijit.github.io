+++
title = "Coding on Your Phone with Claude"
date = 2026-03-02T10:00:00+05:30
description = "How to connect Claude Code to GitHub and write, review, and ship blog posts straight from the Claude app on your phone — with automatic staging and one-tap production deploys."
tags = ["claude", "ai", "workflow", "devops", "tutorial"]
slug = "coding-on-your-phone-with-claude"
draft = false
+++

My entire blog pipeline runs through GitHub Actions. Push to `main`, it deploys to staging on GitHub Pages, I review it, then approve the production deploy to my DigitalOcean droplet. The system works great at a desk.

But what about writing from a phone? What if I want to draft a post on the couch, fix a typo I noticed on the train, or ship a quick update without opening a laptop?

The answer turned out to be Claude — specifically, connecting Claude Code to GitHub and coding through the Claude app on iOS or Android. This post documents exactly how I set that up and how it works day to day.

## What Claude Code on Mobile Actually Does

Claude is not just a chatbot. When you connect it to a GitHub repository, it becomes an agent with real capabilities:

- Read any file in the repo
- Write and edit files
- Create git branches and commits
- Push branches to the remote
- Open pull requests

You describe what you want in plain English. Claude does the work. On mobile, that conversation replaces the terminal.

The key thing to understand: Claude operates on GitHub through the API. It does not need to clone the repo locally on your phone. It reads and writes directly via GitHub. Your phone is just the interface.

## Step 1: Connect Claude to GitHub

Open the Claude app or go to [claude.ai](https://claude.ai) on your phone.

Navigate to **Settings → Integrations** (or look for a "Connect" option in a new conversation). You will see an option to connect GitHub.

Tap it. Claude will open GitHub's OAuth authorization page. Log in to GitHub and grant Claude access to your repositories. You can grant access to all repos or select specific ones — I recommend selecting specific repos at first to keep things tidy.

Once authorized, Claude can see your repositories. That is the entire setup from the auth side.

## Step 2: Start a Coding Session

In a new Claude conversation, you will see an option to attach a repository or tool. Select your GitHub integration and pick the repo you want to work in.

You can now talk to Claude about your code:

> "Show me the latest blog post."

> "Write a new post about Go error handling. Use the same frontmatter style as the existing posts."

> "Fix the typo in content/posts/how-i-built-this.md — 'recieve' should be 'receive'."

Claude reads the files, makes the changes, creates a commit on a new branch, and pushes it. You never touch a terminal.

## Step 3: Review the Branch on GitHub

After Claude pushes a branch, go to your GitHub repo (github.com works fine on mobile, or use the GitHub mobile app). You will see a banner: "Branch `claude/your-description` had recent pushes."

Tap **Compare & pull request**. GitHub shows you the diff — exactly what changed. Review it. If it looks right, merge the PR into `main`.

That merge is the trigger.

## Step 4: Staging Deploys Automatically

The moment `main` gets a new commit — whether from a terminal, a PR merge, or Claude pushing directly — GitHub Actions kicks off.

The workflow builds the Hugo site and deploys it to GitHub Pages:

```
Merge to main
    │
    ▼
GitHub Actions: build Hugo
    │
    ▼
Deploy to GitHub Pages → https://mohantyabhijit.github.io (staging)
    │
    ▼
deploy-production job pauses: "Waiting for review"
```

Within about 60 seconds, the staging site is live. Open it on your phone and check the post. Does the formatting look right? Did the frontmatter parse correctly? Is the slug what you expected?

## Step 5: Approve Production from Your Phone

If staging looks good, approve production without touching a laptop.

Open the GitHub app or go to github.com on your phone:

1. Tap **Actions** in the repo
2. Tap the latest workflow run
3. Find the `deploy-production` job — it shows **Waiting for review**
4. Tap **Review deployments**
5. Check **production**
6. Tap **Approve and deploy**

GitHub Actions resumes, rebuilds the site with the production base URL, and deploys it to the DigitalOcean droplet via SSH and rsync. The symlink swap is atomic. The old version stays available in `/srv/blog/releases/` for instant rollback.

Total time from "Claude, write this post" to live on production: under five minutes.

## The Full Flow in One Diagram

```
Claude app on phone
    │
    │ "Write a post about X"
    ▼
Claude reads repo via GitHub API
    │
    ▼
Claude writes files, commits, pushes branch
    │
    ▼
You open GitHub app, review diff, merge PR
    │
    ▼
GitHub Actions triggers on main push
    │
    ▼
Hugo build → deploy to GitHub Pages (staging)
    │
    ▼
You check staging on phone
    │
    ▼
You approve production in GitHub Actions
    │
    ▼
Hugo rebuild → rsync to DigitalOcean droplet → live
```

No laptop. No terminal. No local Hugo install needed.

## Setting Up the GitHub Actions Workflow

If you do not already have this pipeline, here is the relevant part of the GitHub Actions workflow that makes this work. The critical pieces are the two environments — `github-pages` for automatic staging, and `production` for the manual-approval gate:

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

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: "0.157.0"
          extended: true

      - name: Build for staging
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

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-pages
    environment:
      name: production   # <-- this is where the manual gate lives
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: "0.157.0"
          extended: true

      - name: Build for production
        run: hugo --minify --baseURL "https://yourdomain.com/"

      - name: Deploy to server
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.DO_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -p "${{ secrets.DO_PORT }}" \
            "${{ secrets.DO_HOST }}" >> ~/.ssh/known_hosts

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
             ls -1dt /srv/blog/releases/* | tail -n +8 | xargs -r rm -rf"
```

The `production` environment is configured in **Settings → Environments → production** in the GitHub repo. Enable **Required reviewers** and add yourself. That single checkbox is what creates the approval gate.

## Giving Claude the Right Context

Claude works best when it understands the conventions of your repo. In a new session, I usually start with one sentence of context:

> "This is a Hugo blog using TOML frontmatter. Posts go in `content/posts/`. The frontmatter fields are title, date, description, tags, slug, and draft."

Or I ask Claude to read an existing post first:

> "Read `content/posts/how-i-built-and-deploy-this-website.md` and use the same style for the new post."

Claude reads the file and matches the format. The resulting post needs minimal cleanup.

## What Works Well

**Quick fixes** — typos, broken links, frontmatter corrections. These are trivial for Claude and zero friction from mobile. Notice an error on your phone? Fix it in the same session.

**Drafting posts** — Claude writes a solid first draft from a short prompt. The draft usually needs editing, but it handles structure, formatting, and code blocks correctly. Starting from a blank file is the hard part. Claude removes that friction.

**Reviewing diffs** — The GitHub app's diff view is genuinely good on mobile. Reviewing a 50-line change to a Markdown file is easy. For larger changes, you might want a desktop.

**Approving deploys** — The GitHub Actions approval UI works perfectly on mobile. Tap four times and the site is live.

## What to Watch

**Large refactors** — If you are restructuring multiple files or doing something architecturally complex, a phone screen is limiting. Claude handles the code, but reviewing the output is harder on mobile. Save that for a desk.

**Submodule updates** — Hugo themes are often git submodules. If a theme update breaks something, debugging that from mobile is painful. The build output in GitHub Actions is readable on phone, but iterating is slow.

**Conflicting changes** — If you have uncommitted local changes and Claude pushes a branch, you will need to merge or rebase. Keep the repo clean and mobile editing stays simple.

## The Habit This Creates

The interesting side effect of this setup is that the friction to publish drops to nearly zero. An idea on the commute becomes a draft. A draft becomes a post. A post goes through staging and production — all from the phone before getting home.

The laptop is still better for complex work. But for writing and shipping content, the phone-plus-Claude workflow is genuinely complete. There is nothing missing.

## Summary

1. Connect Claude to GitHub via **Settings → Integrations** in the Claude app
2. Start a conversation, attach your repo, and ask Claude to write or edit
3. Claude commits and pushes a branch
4. Review and merge the PR on GitHub mobile
5. GitHub Actions deploys automatically to staging (GitHub Pages)
6. Check staging on your phone, then approve production in the Actions UI
7. Live in under five minutes, no laptop required

The deployment pipeline you already have works. Claude just gives you a terminal you can use with your thumbs.
