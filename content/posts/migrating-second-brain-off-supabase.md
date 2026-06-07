+++
title = "Migrating Second Brain Off Supabase to Stop Paying for Egress"
date = 2026-06-07T10:00:00+05:30
description = "How a growing bill pushed me to move a production app's database and storage off Supabase onto two small VPSes — and why I left auth exactly where it was."
tags = ["postgres", "infrastructure", "devops", "self-hosted", "migration"]
slug = "migrating-second-brain-off-supabase"
draft = false
+++

Second Brain is a personal knowledge app I run in production. It holds notes, embeddings, and the source files behind them. For most of its life it ran entirely on Supabase — database, object storage, and auth, all in one place. That convenience is exactly what Supabase sells, and for a while it was the right trade.

Then the bill started talking.

## The Bill That Started It

The free plan was generous, and I had quietly outgrown it. The part that actually stung was egress. Every time the app pulled data out — and a knowledge app pulls data out constantly — I was being metered for the privilege. The numbers were not catastrophic, but they were the wrong shape: a cost that grew with usage, on data that was already mine, moving between services I was already paying for.

The fix was sitting right there. I run a couple of small VPSes on DigitalOcean, and DigitalOcean lets those machines talk to each other over a private network for free. No egress meter on the private link. If I moved the database onto my own box and let the app reach it across that private VPC, the egress line on my bill would simply disappear.

So the goal was never "escape Supabase." It was "stop paying to move my own bytes."

## What Moved, and What Didn't

Three things lived on Supabase: the database, object storage, and auth. I made a deliberate decision about each.

**The database had to move.** It was the source of the egress, and it was already shaped entirely around Postgres — vector embeddings, JSON columns, concurrent reads and writes from both the API and a background worker. Moving it to a different *managed* Postgres would have just relocated the same problem. Running my own Postgres on a machine I control made the egress vanish and gave me a database nobody could meter.

**Object storage had to move too**, though it was almost an afterthought. The whole store was about 2,000 files totalling 13 MB. That is not a storage problem; it is a rounding error that happens to sit behind an egress meter. It belonged on a plain filesystem.

**Auth stayed.** This is the part people find surprising. Supabase Auth is genuinely excellent, and on the free plan it is generous enough that it costs me nothing. More importantly, auth is not where the egress was — nobody is streaming gigabytes through a login flow. Replacing it would have meant rebuilding token issuance, sessions, and OAuth, taking on real user-facing risk, to solve a problem that did not exist. So I left it exactly as it was. The clean line turned out to be: move the data that costs money, keep the service that doesn't.

## Two Boxes, Not One

My first instinct was to drop Postgres onto the server that already ran the app. One machine, fewer moving parts. I talked myself out of it within an hour. That box was already running nginx, the Go API, a background worker, and Redis, and it was memory-tight. Postgres is hungry, and under load it would have fought everything else for the same scarce RAM. The failure mode there is the worst kind: fine in testing, ugly at the exact moment of real traffic.

I had a second VPS sitting nearly idle. Postgres went there. The two machines speak over DigitalOcean's private network, and Postgres listens *only* on that private interface — never on a public port. The app reaches the database across the private link, which is both the secure arrangement and, not coincidentally, the free one.

The end state:

- **App server** — nginx, frontend, Go API, worker, Redis, and filesystem object storage
- **Database server** — PostgreSQL with pgvector, private network only
- **Supabase** — auth, and nothing else

## The Migration Itself

The first thing I learned is that Supabase's database backup does *not* include your storage files. They look like one product in the dashboard, but they are two systems wearing the same logo. Any plan that treats them as a single export will quietly lose half your data. So I ran two separate migrations.

For the **database**, I didn't pull the data down to my laptop and push it back up — that would have meant paying egress on the way out *and* burning an afternoon. Instead I let the database server pull directly from Supabase: dump straight across, restore locally, fix up ownership, and check the row counts against the original. The one subtlety was that Supabase keeps user records in its own schema that some of my tables referenced, so I stubbed out a minimal placeholder for that during the restore — enough to satisfy the references, while real identity kept living in Supabase Auth. When the counts matched, the data was home.

For **storage**, a small script running on the app server pulled every object straight from Supabase's storage API using short-lived credentials, dropped them onto disk in the same path layout the app already expected, and then the credentials were thrown away. Because the on-disk paths mirrored the old bucket paths, the application code didn't need to learn anything new — I just pointed it at the filesystem instead of the network.

On the app side, the changes were almost boring, which is the goal. The database connection became a single environment variable. The storage backend flipped from "Supabase" to "filesystem" with three settings and zero code changes, because that abstraction had been there all along. The only thing I had to walk back was auth: my first pass migrated a little too aggressively and briefly stood in its own login mechanism, and a follow-up put the boundary back where it belonged — Supabase Auth, untouched.

## Knowing It Actually Worked

Migrations are easy to *declare* done and hard to *prove* done. Before I believed it, I watched the health checks return clean, confirmed the app's state endpoint responded, saw the cache doing its job, ran a real login end to end, and read through the API and worker logs looking for anything unhappy. Nothing complained. The row count on the new database matched the old one exactly.

Only then did I clean up: I took verified backups of everything first, then emptied the old data out of Supabase, deleted the storage buckets, and left the project itself alive — because auth still lives there, and that was always the plan.

## The Payoff

The egress line is gone. The data that used to cost money every time it moved now travels across a private link that costs nothing. The database sits on a box I control, the files sit on a disk I own, and the one service I still lean on — auth — is the one that was never charging me in the first place.

The lesson I'm keeping: you don't have to leave a platform to stop overpaying for it. You just have to move the part that's metered and keep the part that isn't. Migrating off a service is a project. Migrating off a *line item* is an afternoon.
