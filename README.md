<div align="center">

# IMDb × VidSrc

**Watch any movie or TV show directly from IMDb — one click, no fuss.**

A lightweight userscript that injects native-styled **Watch** buttons into every IMDb page — title pages, episode lists, charts, and watchlists — linking instantly to free streams via [VidSrc](https://vidsrc.sh).

[![Install](https://img.shields.io/badge/Install%20Script-Tampermonkey-00485b?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/infoxica/imdb-vidsrc/master/imdb-vidsrc.user.js)
[![Version](https://img.shields.io/github/v/release/infoxica/imdb-vidsrc?style=for-the-badge&color=f5c518&label=Version)](https://github.com/infoxica/imdb-vidsrc/releases/latest)
[![License](https://img.shields.io/github/license/infoxica/imdb-vidsrc?style=for-the-badge)](LICENSE)
[![Issues](https://img.shields.io/github/issues/infoxica/imdb-vidsrc?style=for-the-badge)](https://github.com/infoxica/imdb-vidsrc/issues)

</div>

---

## ✨ What It Does

Browse IMDb the way you always have — the script quietly adds **Watch** buttons that feel like they were always there.

| Where you are | What you get |
|---|---|
| Movie page | ▶ **Watch Now** button (top-right, fixed) |
| TV series page | ▶ **Watch Series** button |
| Episode page | ▶ **Watch S2 • E5** button |
| Episodes list (`/episodes/`) | ▶ **Watch S1 • E1** button on every episode card |
| Top 250, Watchlist, any list | ▶ **Watch** button beside each title |

Each button shows a live **availability dot** (🟢 available / 🔴 unavailable / 🟡 unknown) checked in the background — only for titles currently visible on screen.

---

## 📸 Screenshots

<!-- Screenshots are taken from live IMDb pages with the script active -->

| Movie Title Page | TV Series Page |
|---|---|
| ![Movie title page](screenshots/movie-title.png) | ![TV series page](screenshots/tv-series.png) |

| Episodes List | IMDb Top 250 |
|---|---|
| ![Episodes list](screenshots/episodes-list.png) | ![Top 250 chart](screenshots/top-chart.png) |

---

## 🗂️ Content Coverage

Powered by **VidSrc** — one of the largest open streaming index networks:

| Metric | Coverage |
|---|---|
| 🎬 Movies indexed | **50,000+** |
| 📺 TV shows & anime | **10,000+** |
| 🎞️ Stream quality | Up to **1080p** |
| 🌍 Mirrors available | 3 built-in + custom |
| 🔄 Catalog updates | Continuously |

> VidSrc aggregates streams from across the web and indexes them by IMDb ID — the same ID IMDb already shows you. No searching required.

---

## ⚙️ Installation

### Step 1 — Install a userscript manager

| Browser | Recommended manager |
|---|---|
| Chrome / Edge / Brave | [Tampermonkey](https://www.tampermonkey.net/) |
| Firefox | [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/) |
| Safari | [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) |

### Step 2 — Install the script

Click the button below — your userscript manager will open an install dialog.

[![Install IMDb VidSrc](https://img.shields.io/badge/%E2%96%B6%20Install%20Now-IMDb%20%C3%97%20VidSrc-f5c518?style=for-the-badge&logo=tampermonkey&logoColor=000)](https://raw.githubusercontent.com/infoxica/imdb-vidsrc/master/imdb-vidsrc.user.js)

### Step 3 — Go to any IMDb page

Navigate to [imdb.com](https://www.imdb.com) and you're done. Buttons appear automatically.

> **Auto-updates** — The script updates itself whenever a new version is released. No manual reinstall needed.

---

## 🎯 Features

### 🎬 Works everywhere on IMDb
- Movie and TV title pages
- Anime series and episodes
- `/episodes/` season pages with per-episode buttons
- Charts: Top 250, Most Popular, Box Office
- Personal watchlists and custom lists

### 🎨 Native IMDb design
Buttons use IMDb's own CSS classes and design tokens — the same style as the "Mark as Watched" button. They look and feel like a first-party feature, not a plugin.

### ⚡ Smart lazy-loading
On list and chart pages, availability is checked **only for titles visible on screen**, in parallel, using `IntersectionObserver`. Scrolling down triggers checks for newly visible items — no bulk API hammering.

### 🌐 Universal domain selector
One setting, applied everywhere. Click the ⚙ gear icon beside any Watch Now button (or use the userscript manager menu) to switch between:
- `vidsrc.sh` *(recommended)*
- `vidsrc2.ru` *(fast mirror)*
- `vidsrc.ir` *(alternative mirror)*
- Any custom domain / proxy

### 🔵 Live availability dots
Each button shows a small dot indicating stream status — checked once per session and cached for 30 minutes to avoid unnecessary requests.

### 🔄 SPA-aware
IMDb is a single-page application. The script watches for navigation events and re-renders buttons when you move between pages without a full reload.

---

## 🎮 Usage

### Watching a movie
1. Open any IMDb movie page (e.g. [The Dark Knight](https://www.imdb.com/title/tt0468569/))
2. Click **▶ Watch Now** in the top-right corner
3. The stream opens in a new tab

### Watching a TV series
1. Open an IMDb TV series page (e.g. [Breaking Bad](https://www.imdb.com/title/tt0903747/))
2. Click **▶ Watch Series** — goes to S1 E1 by default
3. Use VidSrc's built-in episode selector to navigate episodes

### Watching specific episodes
1. Open the episodes page (e.g. `.../episodes/?season=2`)
2. Each episode card shows **▶ Watch S2 • E1**, **▶ Watch S2 • E2**, etc.
3. Click the button on the episode you want

### Switching VidSrc mirror
1. Click the **⚙** (gear) button beside any Watch Now button
2. Select a domain from the list, or enter a custom one
3. Click **Save & Apply** — takes effect everywhere immediately

---

## ❓ FAQ

**Does this work for anime?**  
Yes. Anime is treated as a TV series on IMDb (e.g. `tt6673774` = One Piece). Episode-level buttons work on anime season pages.

**Which browsers are supported?**  
Any browser that supports Tampermonkey or Violentmonkey: Chrome, Firefox, Edge, Brave, Opera, and Safari.

**Is the stream quality good?**  
VidSrc indexes streams up to 1080p. Quality depends on what's available for each title. The availability dot turns green when a stream is found.

**A title shows a red dot — does that mean it won't play?**  
The dot reflects what VidSrc's index API reports. Occasionally a title is indexed but streams have changed. Try clicking through anyway, or switch to a different VidSrc mirror.

**How do I switch VidSrc mirrors?**  
Click the ⚙ gear button beside any Watch Now button, pick a domain, and save. The setting applies to all pages globally.

**Does this script collect any data?**  
No. The script runs entirely in your browser. It makes anonymous requests to VidSrc APIs to check availability — no personal data, no accounts, no tracking.

**Will this break if IMDb updates its UI?**  
Possibly, since it depends on IMDb's DOM structure. If buttons stop appearing after an IMDb update, [open an issue](https://github.com/infoxica/imdb-vidsrc/issues) and it'll be fixed promptly.

**How do I update the script?**  
If you have auto-update enabled in Tampermonkey/Violentmonkey (the default), it updates automatically. You can also manually click "Check for updates" in the userscript manager dashboard.

**Can I add a domain that isn't in the list?**  
Yes — in the domain settings modal, choose "Custom Domain / Proxy" and enter any `vidsrc`-compatible domain.

**Does it work with Greasemonkey?**  
Partial support. `GM_getValue` / `GM_setValue` for domain storage requires Greasemonkey 4+. Tampermonkey or Violentmonkey recommended for the best experience.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

- 🐛 [Report a bug](https://github.com/infoxica/imdb-vidsrc/issues/new?template=bug_report.yml)
- ✨ [Request a feature](https://github.com/infoxica/imdb-vidsrc/issues/new?template=feature_request.yml)
- 📖 [Contributing guide](CONTRIBUTING.md)

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

---

## 📄 License

[MIT](LICENSE) © [infoxica](https://github.com/infoxica) & Contributors

---

<div align="center">

**If this saves you time, consider starring ⭐ the repo.**

</div>
