+++
title = "Migrating Second Brain Off Supabase: Database, Storage, and the Line We Didn't Cross"
date = 2026-06-07T10:00:00+05:30
description = "How I moved a production app from Supabase's managed Postgres and object storage to self-hosted Postgres and filesystem storage — without touching auth."
tags = ["postgres", "infrastructure", "devops", "self-hosted", "migration"]
slug = "migrating-second-brain-off-supabase"
draft = false
+++

Second Brain is a personal knowledge app I run in production. It stores notes, embeddings, and source files. For a long time it ran entirely on Supabase: the database, object storage, and auth all lived there.

On June 4, 2026, I moved the database and object storage off Supabase and onto two small VPSes I control. Supabase Auth stayed. This post explains why, how, and what the migration actually looked like.

## Why Move at All

The honest reason: I did not want the app to stop working if Supabase access or billing became a problem. Supabase is a real product and I have no complaint about it, but any managed service is a dependency you cannot fully control. The database was already shaped entirely around Postgres — `pgvector`, `jsonb`, UUID defaults, `pgx`, concurrent API and worker writes. Moving to a different managed Postgres would not reduce operational risk by much. Running my own Postgres on a machine I control does.

Object storage was a similar story but easier. The data was small: about 2,059 objects totalling 13 MB. That fits easily on a filesystem.

Auth was different. Supabase Auth is not just a database table — it handles token issuance, OAuth flows, and session management. Replacing it would have been a project on its own with real user-facing risk. So I left it alone.

## The Two-VPS Layout

My first instinct was to put everything on one server. The app (`ubuntu-sgp`) was already running nginx, a Go API, a background worker, and Redis. Adding Postgres there seemed obvious.

It was not a safe plan. That server is memory-tight. Postgres under load plus the Go processes plus Redis would have competed for the same pool and created unpredictable pressure. I had a second VPS (`codex-crapbox`) sitting mostly idle. Postgres went there instead.

The two machines are connected by a private VPC. Postgres listens only on the private network interface. The app server talks to the database over the private link. The database port is never exposed publicly.

Final runtime layout:

- **App server**: nginx, static frontend, Go API, background worker, Redis, filesystem object storage
- **Database server**: PostgreSQL 17 with pgvector
- **Supabase**: Auth only

## Splitting the Migration in Two

Supabase's database backup does not include Storage object bytes. They are separate systems that happen to share a project dashboard. This matters because any migration plan that treats them as one step will fail or miss data.

I split the work into two independent migrations:

1. Database schema and data
2. Storage objects

## Database Migration

The database was not dumped locally and then uploaded. The transfer happened directly between Supabase and the database server:

1. Pass the Supabase connection string securely to the database server
2. Run `pg_dump` on the database server, pulling from Supabase
3. Write the dump locally on the database server
4. Create a fresh database with the right owner
5. Pre-create required extensions and a minimal `auth.users` stub
6. Run `pg_restore` locally
7. Fix ownership and grants
8. Verify row counts

The Supabase connection string was passed through macOS Keychain to avoid ever writing a credential to disk in plaintext:

```bash
security find-generic-password -a "$USER" -s "second-brain/SUPABASE_DB_URL" -w \
  | ssh db-server 'umask 077; cat > /home/deploy/.supabase-source-url.tmp'

ssh db-server 'bash -s' <<'REMOTE'
set -euo pipefail
SOURCE_DATABASE_URL="$(cat /home/deploy/.supabase-source-url.tmp)"
TARGET_DATABASE_URL="$(cat /home/deploy/.second-brain-database-url)"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
workdir="/home/deploy/second-brain-migration-$stamp"
mkdir -p "$workdir"
dump_file="$workdir/supabase-public.dump"

cleanup() {
  rm -f /home/deploy/.supabase-source-url.tmp
}
trap cleanup EXIT

pg_dump "$SOURCE_DATABASE_URL" \
  --format=custom \
  --no-owner \
  --no-acl \
  --schema=public \
  --file="$dump_file"

sudo -u postgres dropdb --if-exists second_brain --force
sudo -u postgres createdb -O second_brain_app second_brain

sudo -u postgres psql -v ON_ERROR_STOP=1 -d second_brain <<'SQL'
CREATE EXTENSION IF NOT EXISTS vector;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY,
  email text,
  created_at timestamptz DEFAULT now()
);
SQL

pg_restore \
  --dbname="$TARGET_DATABASE_URL" \
  --no-owner \
  --no-acl \
  --role=second_brain_app \
  --verbose \
  "$dump_file" > "$workdir/restore.log" 2>&1

sudo -u postgres psql -v ON_ERROR_STOP=1 -d second_brain <<'SQL'
ALTER SCHEMA public OWNER TO second_brain_app;
GRANT USAGE ON SCHEMA public TO second_brain_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO second_brain_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO second_brain_app;
SQL
REMOTE
```

A few things worth noting:

**The `auth.users` stub.** Supabase puts user records in a schema called `auth`. The `public.user_profiles` table had a foreign key pointing there. I created a minimal stub table so the restore did not fail on a missing schema reference. This stub is local and does not participate in actual authentication — that still happens in Supabase.

**No-owner, no-acl.** The dump was taken from Supabase, where roles are managed by the platform. Importing those roles into a fresh Postgres instance would fail. `--no-owner --no-acl` strips them out. The `--role=second_brain_app` flag on restore ensures the restored objects land under the right application user.

**Dump format is custom.** The custom format is parallel-restorable and compresses well. For a dump this size it does not matter, but it is a better habit than plain SQL.

After the restore, row counts confirmed the data was all there. The `knowledge_runs` table had 226 rows, matching Supabase.

## Storage Migration

The storage export cannot be reconstructed precisely because the export script was not committed to the repo. What I can say with confidence:

- Objects lived in two Supabase buckets: `sources` and `second-brain`
- A script ran on the app server and pulled objects directly from Supabase's storage API — no local laptop involved
- The script used temporary credentials scoped to the export job, which were removed afterward
- Objects landed at `/srv/second-brain/object-storage/{bucket}/{path}` on the app server

About 2,059 objects, 13 MB total. The export was fast.

The destination path structure meant the app could be pointed at the filesystem backend with no path-mapping logic. The same relative paths that worked in Supabase Storage worked on disk.

## Runtime Changes

### Database

`DATABASE_URL` became the canonical environment variable for the database connection. The migration scripts were split:

- `scripts/migrate-postgres.sh` — provider-neutral, works against any Postgres
- `scripts/migrate-supabase.sh` — kept as a compatibility wrapper

### Storage

Three environment variables switched the storage backend:

```
OBJECT_STORAGE_BACKEND=filesystem
OBJECT_STORAGE_ROOT=/srv/second-brain/object-storage
OBJECT_STORAGE_BUCKET=sources
```

No code path changed. The backend abstraction was already there.

### Auth: One Follow-Up Correction

The first pass of the migration went slightly too far on auth. It temporarily replaced auth with an admin token mechanism while things were being wired up. A follow-up pass restored the intended boundary: Supabase Auth only, no local auth.

The concrete fix was removing the foreign key from `public.user_profiles.auth_user_id` to the local `auth.users` compatibility stub. With that constraint gone, Supabase-issued user IDs can live in `user_profiles` without the database trying to resolve them against a local table. The migration file for this was `supabase/migrations/202606040001_external_supabase_auth_identity.sql`.

## Deploy After Migration

The deploy sequence after the runtime changes were ready:

1. Build Linux binaries and the static frontend locally
2. Package under `artifacts/manual-deploy`
3. Push artifacts to the app server
4. Update environment variables to point at the self-hosted database
5. Run migrations against the new database
6. Restart the API and worker
7. Verify health endpoints

## What We Verified

Before calling it done:

- `npm run ci` passed
- Production health check returned `200`
- `/api/app-state` returned `200`
- Cache headers showed `X-Second-Brain-Cache: hit`
- Protected auth flow worked end to end
- API and worker logs had no warnings or errors
- Row count on the migrated database matched Supabase

## Cleanup and Backups

After the runtime was stable, cleanup reduced Supabase's `public` schema from roughly 731 MB to 19 MB. Legacy application tables were emptied while schema and migration history were preserved. The `sources` and `second-brain` storage buckets were deleted. The Supabase project itself was not deleted — Auth still depends on it.

Before cleanup, three backup artifacts were created and verified:

- Supabase pre-cleanup dump: ~376 MB
- Self-hosted Postgres dump taken at the same time: ~410 MB
- Object storage archive: ~3.1 MB

All three were validated with `pg_restore --list` and SHA-256 checksums.

## What Stayed on Supabase

One thing. Auth. And that was intentional.

Supabase Auth is not just a row in a database table. It handles token issuance, session lifetimes, and OAuth. Replacing it in the same week as the database migration would have been two migrations at once with user-facing consequences if anything went wrong. Keeping Auth on Supabase and moving data off it is a clean boundary. The data is mine, the identity layer is delegated, and the app keeps working.

That is the line I did not cross. Not because I could not, but because it was not worth crossing yet.
