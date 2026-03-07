+++
title = "How DNS Works: A Records, AAAAs, CNAMEs, and NS — Explained from First Principles"
date = 2026-03-05T10:00:00+05:30
description = "A deep dive into DNS resolution — how your browser turns 'google.com' into an IP address, what each record type does, and how the whole distributed system hangs together."
tags = ["dns", "networking", "infrastructure", "explainer", "web"]
slug = "how-dns-works"
cover.image = "images/posts/how-dns-works/cover.svg"
cover.alt = "DNS resolution flow from browser to authoritative nameserver"
draft = false
+++

Type `abhijitmohanty.com` into a browser and hit enter. About 50 milliseconds later, a server somewhere responds with HTML. That jump — from a human-readable name to a machine-reachable address — is DNS. It happens billions of times a day and almost nobody thinks about it.

This post breaks down exactly how it works: the lookup chain, the record types, and how all the distributed pieces fit together.

---

## The Problem DNS Solves

Computers talk to each other using IP addresses — numbers like `192.0.2.1` or `2001:db8::1`. Humans are bad at remembering numbers. DNS (Domain Name System) is the phone book that maps names to numbers.

But it is not a single phone book. It is a distributed, hierarchical, globally-consistent database with over a trillion entries, maintained by thousands of independent operators, that is somehow fast enough to query before a web page loads.

---

## The Hierarchy: How the Namespace Is Organised

Every domain name is a path through a tree.

```
                        . (root)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
       com             net             org
        │
   ┌────┴─────┐
   │          │
google     abhijitmohanty
   │              │
  www           www, blog, api, ...
```

- **Root (`.`)** — the very top. Thirteen root server clusters manage this.
- **TLD (`.com`, `.net`, `.io`)** — top-level domains, run by registries like Verisign.
- **Second-level domain (`google.com`, `abhijitmohanty.com`)** — what you register with a registrar.
- **Subdomain (`www.`, `api.`, `blog.`)** — whatever the domain owner adds.

When a resolver looks up `www.abhijitmohanty.com.`, it traverses this tree from right to left: root → `com` → `abhijitmohanty` → `www`.

---

## A Full DNS Lookup, Step by Step

Here is what happens when you type `abhijitmohanty.com` into your browser on a machine that has never seen the domain before.

```
Your Browser
     │
     │ 1. "What is abhijitmohanty.com?"
     ▼
┌─────────────────────┐
│  Stub Resolver      │  ← tiny client built into your OS
│  (OS / systemd)     │
└──────────┬──────────┘
           │ 2. asks your configured DNS server
           ▼
┌─────────────────────┐
│  Recursive Resolver │  ← provided by your ISP, or 1.1.1.1, 8.8.8.8
│  (full-service)     │
└──────────┬──────────┘
           │
           │ 3. not in cache — start from the top
           ▼
┌─────────────────────┐
│   Root Nameserver   │  ← one of 13 clusters (a.root-servers.net, etc.)
│   "I don't know,    │
│    but ask .com NS" │
└──────────┬──────────┘
           │ 4. "who handles .com?"  →  gets back .com nameserver addresses
           ▼
┌─────────────────────┐
│  .com TLD Server    │  ← run by Verisign
│  "I don't know,     │
│   but ask their NS" │
└──────────┬──────────┘
           │ 5. "who handles abhijitmohanty.com?"  →  gets back authoritative NS
           ▼
┌─────────────────────────────┐
│  Authoritative Nameserver   │  ← your registrar / DNS provider
│  (e.g. ns1.cloudflare.com)  │
│  "Here is the A record:     │
│   104.21.5.10"              │
└──────────┬──────────────────┘
           │ 6. answer travels back up the chain
           ▼
┌─────────────────────┐
│  Recursive Resolver │  caches the answer (TTL seconds)
└──────────┬──────────┘
           │ 7. returns IP to your machine
           ▼
┌─────────────────────┐
│  Your Browser       │  opens TCP connection to 104.21.5.10
└─────────────────────┘
```

**Steps 3–5 are the "iterative" phase** — the recursive resolver chases referrals down the tree. Your browser only ever talks to the recursive resolver. The recursive resolver does the legwork.

After the first lookup, responses are cached at the recursive resolver. Step 3–5 get skipped on every subsequent request until the TTL expires.

---

## The Record Types

The authoritative nameserver stores a **zone file** — a list of records mapping names to values. Each record has a type. Here are the ones you need to know.

---

### A Record — IPv4 Address

The most fundamental record. Maps a hostname to a 32-bit IPv4 address.

```
┌────────────────────────────────────────────────────┐
│  NAME              TYPE   TTL     VALUE            │
│  ──────────────    ────   ─────   ───────────────  │
│  abhijitmohanty.com  A    3600    104.21.5.10      │
│  www               A    3600    104.21.5.10        │
│  api               A    300     203.0.113.42       │
└────────────────────────────────────────────────────┘
```

When the resolver asks "what is `abhijitmohanty.com`?", the nameserver returns this: the name resolves directly to `104.21.5.10`. Done.

**Multiple A records** for the same name are valid and common — the resolver returns all of them and the client picks one (typically for load balancing).

```
abhijitmohanty.com   A   104.21.5.10
abhijitmohanty.com   A   104.21.5.11
abhijitmohanty.com   A   104.21.5.12
```

---

### AAAA Record — IPv6 Address

Same idea as A, but for 128-bit IPv6 addresses. The four As stand for "Address", and IPv6 is four times the size of IPv4.

```
┌────────────────────────────────────────────────────────────────────┐
│  NAME               TYPE    TTL    VALUE                           │
│  ─────────────────  ──────  ─────  ─────────────────────────────  │
│  abhijitmohanty.com  AAAA   3600   2606:4700:3035::ac43:0b28      │
│  www                AAAA   3600   2606:4700:3035::ac43:0b28      │
└────────────────────────────────────────────────────────────────────┘
```

A domain can have both A and AAAA records simultaneously. Modern clients try AAAA first (Happy Eyeballs algorithm), fall back to A if IPv6 is not reachable.

```
Resolution for abhijitmohanty.com:

         Query AAAA           Query A (parallel or fallback)
              │                        │
              ▼                        ▼
    2606:4700:3035::...          104.21.5.10
              │                        │
         IPv6 path              IPv4 path
```

---

### CNAME Record — Canonical Name (Alias)

A CNAME says "this name is an alias for another name". The resolver follows it.

```
www.abhijitmohanty.com   CNAME   abhijitmohanty.com
```

When a client asks for `www.abhijitmohanty.com`:

```
Client: "What is www.abhijitmohanty.com?"
              │
              ▼
   ┌──────────────────────────┐
   │ CNAME → abhijitmohanty.com │
   └────────────┬─────────────┘
                │ resolver follows the chain
                ▼
   ┌──────────────────────────┐
   │  A → 104.21.5.10         │
   └──────────────────────────┘
                │
                ▼
           104.21.5.10
```

**CNAMEs chain.** A points to B, B points to C, C has an A record. The resolver follows until it hits an A (or AAAA).

**Where CNAMEs shine — third-party services:**

```
blog.abhijitmohanty.com   CNAME   mohantyabhijit.github.io
```

Now GitHub Pages controls the IP. When GitHub migrates servers, they update their A record. You do not touch your DNS. The CNAME keeps pointing correctly.

```
You control:                     GitHub controls:
─────────────────────────        ─────────────────────────
blog.abhijitmohanty.com          mohantyabhijit.github.io
    │                                 │
    │ CNAME →                         │ A →
    │                                 ▼
    └────────────────────────▶  185.199.108.153
```

**CNAME restriction:** You cannot use a CNAME at the zone apex (the root domain itself). `abhijitmohanty.com` cannot be a CNAME — it would break MX records and other records at the apex. Some DNS providers (Cloudflare, Route 53) work around this with "CNAME flattening" or ALIAS records that behave like CNAMEs but return A record responses.

---

### NS Record — Name Server

NS records delegate authority for a zone to a set of nameservers.

```
abhijitmohanty.com   NS   ns1.cloudflare.com
abhijitmohanty.com   NS   ns2.cloudflare.com
```

These live in two places:

1. **In the parent zone** (`.com` TLD servers) — so the world can find your nameservers
2. **In your own zone** (your authoritative server) — the authoritative copy

The NS records in the parent zone are called a **delegation**. When the recursive resolver asks Verisign "who has `abhijitmohanty.com`?", it gets back those NS records plus **glue records** — A records for the nameservers themselves, needed to avoid a bootstrap paradox.

```
┌────────────────────────────────────────────────┐
│  .com TLD Server                               │
│                                                │
│  abhijitmohanty.com  NS   ns1.cloudflare.com   │
│  abhijitmohanty.com  NS   ns2.cloudflare.com   │
│                                                │
│  (glue) ns1.cloudflare.com  A  108.162.192.1   │
│  (glue) ns2.cloudflare.com  A  108.162.193.1   │
└────────────────────────────────────────────────┘
```

Without the glue records, the resolver would need to look up `ns1.cloudflare.com` to find `abhijitmohanty.com`'s nameserver... but to look up `ns1.cloudflare.com` it needs a nameserver... infinite loop. Glue breaks the cycle.

**Changing nameservers** is how you move DNS from one provider to another. You update the NS delegation at your registrar. The change propagates as old NS records TTL out — typically 24–48 hours worldwide.

---

## How All the Records Connect

Here is a complete map of how the record types relate:

```
                  ┌─── NS ───▶ ns1.cloudflare.com ──┐
                  │                                  │
  abhijitmohanty.com                                 │ authoritative
                  │                                  │ for the zone
                  ├─── A ────▶ 104.21.5.10           │
                  │                                  │
                  ├─── AAAA ─▶ 2606:4700:3035::...   │
                  │                                  │
                  └─── MX ───▶ mail.protonmail.ch    │
                                                     │
  www.abhijitmohanty.com                             │
                  └─── CNAME ▶ abhijitmohanty.com    │
                                    │                │
                                    └─── A ──────────┘
                                        104.21.5.10

  blog.abhijitmohanty.com
                  └─── CNAME ▶ mohantyabhijit.github.io
                                    │
                                    └─── A ──▶ 185.199.108.153
                                         (GitHub controls this)
```

---

## TTL: The Cache Lifetime

Every DNS record has a TTL — Time To Live — in seconds. It tells resolvers how long to cache the answer before asking again.

```
abhijitmohanty.com   A   3600   104.21.5.10
                         ^^^^
                         cache for 1 hour
```

- **High TTL (86400 = 1 day):** Good for stable records. Resolvers cache aggressively. DNS changes take a day to propagate.
- **Low TTL (60 = 1 minute):** Good for records you might need to change fast. Every query hits your nameserver. More load, faster failover.

**Before a migration:** Reduce TTL to 60 seconds a day in advance. Make the change. Increase TTL again after the dust settles.

---

## A Concrete Example End-to-End

Let us trace `blog.abhijitmohanty.com` all the way through:

```
1. Browser asks OS: "What is blog.abhijitmohanty.com?"
           │
           ▼
2. OS asks recursive resolver (1.1.1.1)
           │
           ├─ Cache hit? No.
           │
           ▼
3. Resolver asks root server: "NS for .com?"
   Root says: "a.gtld-servers.net handles .com"
           │
           ▼
4. Resolver asks a.gtld-servers.net: "NS for abhijitmohanty.com?"
   TLD says: "ns1.cloudflare.com, ns2.cloudflare.com"
           │
           ▼
5. Resolver asks ns1.cloudflare.com: "blog.abhijitmohanty.com?"
   Cloudflare says:
     blog.abhijitmohanty.com  CNAME  mohantyabhijit.github.io
           │
           │ CNAME — follow the chain
           ▼
6. Resolver asks ns1.cloudflare.com (or GitHub's NS):
     "mohantyabhijit.github.io?"
   GitHub DNS says:
     mohantyabhijit.github.io  A  185.199.108.153
           │
           ▼
7. Resolver returns 185.199.108.153 to OS, caches both records
           │
           ▼
8. Browser opens TCP connection to 185.199.108.153:443
   Sends: Host: blog.abhijitmohanty.com
           │
           ▼
9. GitHub Pages serves the correct site based on the Host header
```

Notice step 8: the IP belongs to GitHub, but the `Host` header tells the server which site to serve. Many sites can share one IP — this is virtual hosting, and it is why the `Host` header exists.

---

## Quick Reference

```
┌──────────┬────────────────────────────────────────────────────────┐
│ Record   │ What it does                                           │
├──────────┼────────────────────────────────────────────────────────┤
│ A        │ Name → IPv4 address (e.g. 104.21.5.10)                 │
│ AAAA     │ Name → IPv6 address (e.g. 2606:4700:...)               │
│ CNAME    │ Name → another name (alias, follows chain)             │
│ NS       │ Zone → which nameservers are authoritative             │
│ MX       │ Domain → mail server hostname (not covered here)       │
│ TXT      │ Name → arbitrary text (used for SPF, DKIM, ownership)  │
└──────────┴────────────────────────────────────────────────────────┘
```

---

## The Part That Trips People Up

**CNAME and A are mutually exclusive for the same name.** If `www` has a CNAME, it cannot also have an A record. The CNAME says "the whole identity of this name is defined elsewhere."

**You cannot CNAME the zone apex.** `abhijitmohanty.com` itself cannot be a CNAME. This breaks things like MX (mail) records which must live at or under the zone apex. Use ALIAS/ANAME records (Cloudflare, Route 53) which flatten the CNAME at query time and return A records.

**NS records in your zone do not move your domain.** Only the NS delegation at your registrar matters to the outside world. Editing NS in your own zone file is mostly cosmetic.

**Negative caching exists.** "This record does not exist" responses are also cached — for the SOA record's negative TTL. A typo in a DNS record does not fail silently; it caches the failure.

---

## Tooling

You do not have to take DNS on faith. Look it up yourself:

```bash
# A record
dig abhijitmohanty.com A

# AAAA record
dig abhijitmohanty.com AAAA

# CNAME
dig www.abhijitmohanty.com CNAME

# NS delegation (ask the TLD server directly, skip cache)
dig abhijitmohanty.com NS @a.gtld-servers.net

# Trace the full resolution chain
dig +trace abhijitmohanty.com

# All records
dig abhijitmohanty.com ANY
```

`dig +trace` is the best learning tool. It shows every referral step — root to TLD to authoritative — exactly as the recursive resolver sees it.

---

DNS is a 1983 design that underpins the entire internet. RFC 1034 and 1035 are still the foundational specs. The core ideas — hierarchical delegation, record types, caching — have not changed. The scale has grown by twelve orders of magnitude.

Next time a site does not load, `dig +trace` the domain. You will almost always find the answer.
