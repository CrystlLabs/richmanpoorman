# Rich Man Poor Man 🤝

A Crystl Labs game: guess what the filthy rich and the dirt poor have in common — the middle class always loses. Inspired by the classic comedy premise (no creator attribution on-site, by design).

**Status: publish-ready.** Fully static, no backend, works offline after first visit.

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire game — markup, styles (Tailwind CDN), data, and logic |
| `sw.js` | Service worker: network-first navigations, cache-first assets. **Bump `CACHE` version on every deploy** |
| `manifest.webmanifest` | PWA manifest (installable, standalone, portrait) |
| `icons/` | App icons: 192, 512, maskable 512, apple-touch 180 |
| `og.png` | 1200×630 social share card (regenerate via PIL if branding changes) |

## How the game works

- **370 scenarios** in the `ITEMS` array in `index.html` — categories: `both` (150, the point of the game), `rich` (79), `poor` (71), `mid` (70). Each has statement `s`, answer `a`, three joke lines `r`/`p`/`m`, and seeded like-count `L`.
- **Daily Challenge**: deck seeded from the local date (`mulberry32(hashStr('rmpm' + YYYY-MM-DD))`) — same 10 rounds for every player each day. Daily #N counts from `DAY0 = 2026-07-10`. Streaks in localStorage.
- **Free Play**: random 10 (always 4 both / 2 rich / 2 poor / 2 mid).
- Scoring: 100/correct + 25×streak bonus from streak 2. Ranks from "Peak Middle Class" to "Economic Horseshoe Genius."
- **Hall of Fame** (top 5 by likes) and **Community Picks** (12 seeded submissions + user submissions) — votes and submissions are **localStorage-only** (no backend yet).
- **Submissions** pass a client-side content check (`contentOk()`: profanity/slur list + leetspeak normalization). *Planned: replace with AI moderation — see roadmap.*
- **Sharing**: Web Share API, X/Facebook/WhatsApp/Reddit/Telegram intents, clipboard, plus per-card "Share it" on every reveal.
- Keyboard: 1–4 to answer, Enter/Space for next.

## Local dev

```
python -m http.server 8377   # from sites/, then open localhost:8377/richmanpoorman/
```

Service worker gotcha: navigations are network-first so edits show up on reload, but bump `CACHE` in `sw.js` anyway so asset caches refresh. DevTools → Application → "Update on reload" helps during dev.

## Deploy (agreed plan: GitHub Pages + Namecheap)

1. Create repo `richmanpoorman`, push this folder's contents to root.
2. Repo Settings → Pages → deploy from `main`/root → custom domain `richmanpoorman.crystllabs.com`.
3. Namecheap → crystllabs.com → Advanced DNS → CNAME: host `richmanpoorman` → `<github-username>.github.io`.
4. Tick "Enforce HTTPS" once the cert provisions (required for the service worker + install prompt).
5. Optional hardening: verify crystllabs.com as a GitHub Pages verified domain (TXT record).

The OG/Twitter meta URLs in `index.html` assume `https://richmanpoorman.crystllabs.com/` — update if the domain differs.

## Roadmap (agreed with owner)

1. **Deploy** to the subdomain (above).
2. **AI moderation backend**: small Cloudflare Worker + Claude Haiku to approve submissions (replaces the client-side word list) and make submissions/votes shared across players. Needs owner's Cloudflare account + Anthropic API key. Required before Play Store (UGC policy).
3. **Android app**: Bubblewrap TWA wrapping this site (owner has a Play company dev account). Needs the site live on HTTPS first + `assetlinks.json`. Monetization: AdMob rewarded video — "1 free round/day, watch a vid for more" in the app; web stays unlimited.

## Conventions

- Dark theme, gold `#d4af37` (rich) / green `#3fb950` (poor), Playfair Display + Permanent Marker + Inter.
- `<meta name="darkreader-lock">` — site is already dark; keeps the Dark Reader extension from recoloring it.
- No creator names or disclaimers on-site; all joke text is original.
- Footer: "A Crystl Labs Experiment" → crystllabs.com.
