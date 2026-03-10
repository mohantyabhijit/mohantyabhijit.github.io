+++
title = "Protect Your Website with Cloudflare's Free Plan"
date = 2026-03-10T10:00:00+05:30
description = "How to put Cloudflare in front of your site for free — DDoS protection, a CDN, free SSL, and bot mitigation without spending a rupee."
tags = ["cloudflare", "security", "infrastructure", "tutorial", "web"]
slug = "protect-your-site-with-cloudflare-free"
draft = false
+++

You have a site running on a server somewhere. It works. But right now, anyone who knows your IP address can hit it directly, bots can crawl it without limits, and you are relying on Let's Encrypt renewals not breaking at 3 AM. Cloudflare's free plan fixes all of this in about fifteen minutes.

This post walks through the setup end to end: what Cloudflare actually does, how to put it in front of your site, and which free features are worth turning on.

---

## What Cloudflare Actually Does

Cloudflare is a reverse proxy. Instead of visitors connecting directly to your server, they connect to Cloudflare's edge network first. Cloudflare then forwards the request to your server (which Cloudflare calls the "origin").

```
visitor → Cloudflare edge (nearest PoP) → your origin server
```

This gives you three things for free:

1. **DDoS protection** — Cloudflare absorbs attack traffic at the edge before it reaches your server.
2. **A CDN** — Static assets get cached at Cloudflare's 300+ data centres worldwide. Visitors get content from the nearest one.
3. **Free SSL** — Cloudflare terminates TLS at the edge and issues free certificates. No more managing Let's Encrypt yourself (though you still should encrypt the Cloudflare-to-origin connection).

---

## Step 1: Add Your Site to Cloudflare

Go to [dash.cloudflare.com](https://dash.cloudflare.com) and create a free account if you do not have one.

Click **Add a Site**, enter your domain (e.g. `yourdomain.com`), and select the **Free** plan.

Cloudflare will scan your existing DNS records. Review them — it is usually accurate, but double-check that your A records and CNAMEs are all there. Any record it misses will break after the switch.

---

## Step 2: Change Your Nameservers

Cloudflare will give you two nameservers, something like:

```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

Go to your domain registrar (Namecheap, GoDaddy, wherever you bought the domain) and replace the existing nameservers with Cloudflare's. This is what hands DNS control to Cloudflare.

Propagation can take anywhere from a few minutes to 48 hours, but in practice it is usually under an hour. Cloudflare will email you when it is active.

**Important:** Once nameservers are changed, you manage all DNS records from the Cloudflare dashboard, not your registrar.

---

## Step 3: Set Your SSL/TLS Mode

Go to **SSL/TLS → Overview** in the Cloudflare dashboard.

You will see four modes:

| Mode | What it does |
|------|-------------|
| **Off** | No encryption. Do not use this. |
| **Flexible** | Encrypts visitor → Cloudflare, but Cloudflare → origin is plain HTTP. Better than nothing, but not great. |
| **Full** | Encrypts both hops. Origin needs a certificate, but it can be self-signed. |
| **Full (Strict)** | Same as Full, but the origin certificate must be valid (trusted CA or Cloudflare Origin CA). |

**Use Full (Strict).** It is the only mode that actually protects the whole path.

If your origin does not have a certificate yet, Cloudflare provides free **Origin CA certificates** (SSL/TLS → Origin Server → Create Certificate). These are trusted by Cloudflare's edge but not by browsers directly — which is fine, because browsers talk to Cloudflare, not your origin.

Install the origin certificate on your server (nginx, Apache, whatever you use), and you have end-to-end encryption with zero cost.

---

## Step 4: Turn On "Always Use HTTPS"

Go to **SSL/TLS → Edge Certificates** and enable:

- **Always Use HTTPS** — Redirects all HTTP requests to HTTPS.
- **Automatic HTTPS Rewrites** — Fixes mixed content by rewriting HTTP URLs in your HTML to HTTPS.

Both are free. Both should be on.

---

## Step 5: Enable the Free Security Features

Here is what is worth turning on from the free plan. All of these are in the Cloudflare dashboard under **Security**.

### Bot Fight Mode

**Security → Bots → Bot Fight Mode** — Toggle it on.

This challenges traffic that Cloudflare identifies as automated bots. It will not block Googlebot or other verified crawlers, but it will stop scrapers and credential stuffers.

### Browser Integrity Check

**Security → Settings → Browser Integrity Check** — Should be on by default.

This evaluates HTTP headers to detect common bot signatures. Requests that look suspicious get challenged.

### Security Level

**Security → Settings → Security Level** — Set to **Medium** or **High**.

This determines how aggressively Cloudflare challenges visitors based on their IP reputation. Medium is a good default. High adds more challenges but may annoy some legitimate users on shared IPs (like VPN users).

### Firewall Rules (now called WAF Custom Rules)

The free plan gives you **5 custom rules**. Use them to:

- Block entire countries you do not expect traffic from.
- Block known bad user agents.
- Rate-limit aggressive IPs.

Example: block all traffic from a country you do not serve:

```
Field: Country
Operator: equals
Value: [select country]
Action: Block
```

---

## Step 6: Cache Settings

Go to **Caching → Configuration**.

The free plan caches static files automatically (JS, CSS, images, fonts). A few things to set:

- **Caching Level** — Set to **Standard**. This is the default and works well.
- **Browser Cache TTL** — Set to something reasonable like **4 hours** or **1 day**. This tells browsers how long to keep cached files before checking again.
- **Always Online** — Enable this. If your origin goes down, Cloudflare will serve a cached version of your pages instead of an error.

For a static site (like a Hugo blog), you can also create a **Page Rule** to cache everything:

```
URL: yourdomain.com/*
Setting: Cache Level → Cache Everything
```

This tells Cloudflare to cache HTML pages too, not just static assets. The free plan gives you **3 page rules**.

---

## Step 7: Hide Your Origin IP

This is the step people forget. Cloudflare only protects you if attackers cannot bypass it and hit your server directly. If your origin IP is exposed, someone can just skip Cloudflare entirely.

Check if your IP is already leaked:

- Look at historical DNS records on sites like SecurityTrails — your pre-Cloudflare A record is probably cached there.
- Check if your server responds to direct IP requests.

To lock it down:

1. **Configure your firewall** to only accept HTTP/HTTPS traffic from [Cloudflare's IP ranges](https://www.cloudflare.com/ips/). On a Linux server with `ufw`:

```bash
# Allow Cloudflare IPs only on ports 80 and 443
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
    sudo ufw allow from $ip to any port 80,443 proto tcp
done

# Deny all other HTTP/HTTPS traffic
sudo ufw deny 80/tcp
sudo ufw deny 443/tcp
```

2. **Do not expose your IP in emails.** If your server sends mail, use a separate mail service or a different IP.

3. **Do not use the same IP for subdomains that are not proxied.** If `mail.yourdomain.com` resolves to the same IP as your web server and is set to DNS-only (grey cloud), you have leaked the IP.

---

## The Orange Cloud vs Grey Cloud

In Cloudflare's DNS settings, each record has a proxy toggle:

- **Orange cloud (Proxied)** — Traffic goes through Cloudflare. You get DDoS protection, CDN, and SSL.
- **Grey cloud (DNS only)** — Cloudflare just resolves the DNS. Traffic goes directly to your server. No protection.

Your main A/AAAA records should be **orange**. Records for things like SSH or mail servers should be **grey** (Cloudflare does not proxy non-HTTP traffic on the free plan).

---

## What You Do NOT Get on the Free Plan

Be clear about the limits:

- **No WAF managed rulesets** — The free plan has custom rules, but the managed ruleset (OWASP, Cloudflare Specials) that auto-blocks SQL injection, XSS, etc. is paid.
- **No advanced bot management** — Bot Fight Mode is basic. Paid plans get ML-based bot scoring.
- **No custom SSL certificates** — You get Cloudflare's shared Universal SSL cert. It works fine, but the certificate shows Cloudflare's name, not yours.
- **No priority support** — Free plan gets community support only.
- **Limited Page Rules** — Only 3 on the free plan.
- **No image optimisation** — Polish, Mirage, and image resizing are paid.

For a personal site, a blog, or a small project, the free plan is more than enough.

---

## Quick Checklist

Here is everything in order:

- [ ] Create Cloudflare account and add your site
- [ ] Switch nameservers at your registrar
- [ ] Wait for Cloudflare to confirm activation
- [ ] Set SSL/TLS mode to Full (Strict)
- [ ] Install an Origin CA certificate on your server
- [ ] Enable Always Use HTTPS and Automatic HTTPS Rewrites
- [ ] Turn on Bot Fight Mode
- [ ] Set Security Level to Medium
- [ ] Enable Always Online
- [ ] Add a "Cache Everything" page rule for static sites
- [ ] Restrict your origin firewall to Cloudflare IPs only
- [ ] Verify your origin IP is not leaked through other DNS records

---

## Wrapping Up

Cloudflare's free plan is genuinely generous. You get a global CDN, DDoS protection, free SSL, and basic bot mitigation for literally nothing. The main thing to remember is that Cloudflare only helps if traffic actually goes through it — so lock down your origin, proxy your DNS records, and set SSL to Full (Strict).

Fifteen minutes of setup and your site is meaningfully harder to take down, faster to load, and encrypted end to end.
