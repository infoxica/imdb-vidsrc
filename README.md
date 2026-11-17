<div align="center">

# 🎬 IMDb - Watch on VidSrc

**A sleek, native-feeling Tampermonkey userscript that embeds intuitive watch buttons into IMDb movies, TV series, anime, and episode pages.**

[![Version](https://img.shields.io/badge/version-1.0.1-f5c518.svg?style=flat-square)](https://github.com/infoxica/imdb-vidsrc/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-00485B.svg?style=flat-square&logo=tampermonkey)](https://www.tampermonkey.net/)
[![Violentmonkey](https://img.shields.io/badge/Violentmonkey-Compatible-orange.svg?style=flat-square)](https://violentmonkey.github.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/infoxica/imdb-vidsrc/pulls)

[Installation](#-installation) • [Features](#-key-features) • [How It Works](#-how-it-works) • [Configuration](#-universal-domain-configuration) • [Disclaimer](#-disclaimer)

</div>

---

## 🌟 Key Features

### 🎨 Native IMDb UI & Design System
- **Right-Top Action Placement**: Anchored neatly in the top-right corner outside IMDb's central content column, sitting cleanly below the navbar without ever intruding into search boxes or navigation menus.
- **Single-Line Wording**: Polished button labels (`▶ Watch Now`, `▶ Watch Series`, `▶ Watch S5 • E14`) with guaranteed single-line typography in IMDb's signature golden-yellow (`#f5c518`).
- **High-Visibility List Buttons**: Styled to seamlessly match IMDb's native *"Mark as watched"* button styling with high-contrast surfaces (`#252525`), crisp borders, and yellow vector play icons on charts, search results, and custom lists.

### 📺 Full TV Series, Anime & Episode Support
- **Episode-Level Precision**: Supports individual episode pages (e.g. `https://www.imdb.com/title/tt2301451/` — *Breaking Bad: Ozymandias S5·E14*).
- **Automatic Hierarchy Extraction**: Inspects JSON-LD, `__NEXT_DATA__`, and breadcrumb trees to resolve parent series ID, season number, and episode number.
- **Universal Routing**: Routes to `/embed/tv/{seriesId}/{season}/{episode}` for episodes, `/embed/tv/{seriesId}` for TV shows, and `/embed/movie/{id}` for movies.
- **Anime Ready**: Full support for anime series (*Attack on Titan*, *Arcane*, *Frieren*) and anime films (*Spirited Away*, *Your Name*).

### 🌐 Universal Domain Management
- **Set Once, Works Everywhere**: Configure your preferred VidSrc mirror once. Your preference is saved universally across all IMDb pages and sessions.
- **No Cluttered Dropdowns**: Goodbye to the fixed dropdown covering IMDb's navbar! Access settings anytime via a sleek, native dark-mode modal or the userscript menu (`⚙ Configure VidSrc Domain`).
- **Pre-Configured Fast Mirrors**: Built-in support for `vidsrc.sh` (Recommended), `vidsrc2.ru` (Fast Mirror), `vidsrc.ir` (Alternative), plus custom proxy/domain support.

### ⚡ Viewport Lazy Loading & Parallel Checking
- **IntersectionObserver Driven**: On 250-item lists and charts, only titles scrolled into view are queried.
- **Parallel Concurrency Queue**: Asynchronous worker pool checks up to 4 titles simultaneously. UI updates reactively item-by-item with zero browser lag.
- **Dual-Layer Caching**: In-memory and `sessionStorage` caching (30-minute TTL) ensures scrolling back and forth triggers zero redundant network calls.

### 💎 Embedded Lucide Vector Icons
- Inlined SVG icons (Play, Settings, Spinners, Check indicators) for instantaneous rendering, zero network overhead, and zero CSP friction.

---

## 🚀 Installation

### Step 1: Install a Userscript Manager
If you don't already have one, install a userscript extension for your browser:
- [**Tampermonkey**](https://www.tampermonkey.net/) (*Recommended* for Chrome, Firefox, Edge, Safari, Opera, Brave)
- [**Violentmonkey**](https://violentmonkey.github.io/) (*Open source alternative*)
- [**Userscripts**](https://github.com/quoid/userscripts) (*for Safari macOS / iOS*)

### Step 2: Install the Script
Click the link below to install:

👉 [**Install imdb-vidsrc.user.js**](https://raw.githubusercontent.com/infoxica/imdb-vidsrc/main/imdb-vidsrc.user.js)

Your userscript manager will prompt you to review and confirm the installation.

---

## 📖 How It Works

```
IMDb Page Load
   │
   ├── Movie Page (e.g. Inception /title/tt1375666)
   │     └─► Watch Movie ────────► https://{domain}/embed/movie/tt1375666
   │
   ├── TV Series Page (e.g. Breaking Bad /title/tt0903747)
   │     └─► Watch Series ───────► https://{domain}/embed/tv/tt0903747
   │
   ├── Episode Page (e.g. Ozymandias /title/tt2301451)
   │     └─► Parse Parent Series (tt0903747) + Season (5) + Episode (14)
   │           └─► Watch S5 • E14 ─► https://{domain}/embed/tv/tt0903747/5/14
   │
   └── Charts & Lists (e.g. /chart/top, /list/ls...)
         └─► IntersectionObserver ─► Parallel Concurrency Queue (4 max)
               └─► Live Availability Verification & Cache
```

### Availability Indicators

| Dot Color | State | Description |
| :---: | :---: | :--- |
| 🟢 | **Available** | Verified on server with reported quality (e.g., 1080p). Ready to stream. |
| 🟠 | **Checking** | Querying VidSrc metadata endpoint. |
| 🔴 | **Missing** | Title or specific episode has not yet been indexed on the chosen server. |
| ⚪ | **Direct / Ready** | Direct streaming link prepared. |

---

## ⚙️ Universal Domain Configuration

Click the **gear icon (`⚙`)** next to the Watch button on any title page, or choose **"⚙ Configure VidSrc Domain"** from the Tampermonkey / Violentmonkey extension menu:

1. **vidsrc.sh** — Official / Recommended primary domain.
2. **vidsrc2.ru** — High-speed verified mirror.
3. **vidsrc.ir** — Backup mirror.
4. **Custom Domain** — Enter any proxy, alternative mirror, or self-hosted endpoint (e.g. `vidsrc.net`).

All changes are stored universally via `GM_setValue` and immediately update all buttons.

---

## 📱 Browser & Mobile Compatibility

| Browser | Extension | Status |
| :--- | :--- | :---: |
| **Google Chrome / Chromium** | Tampermonkey / Violentmonkey | ✅ Supported |
| **Mozilla Firefox** | Tampermonkey / Violentmonkey | ✅ Supported |
| **Microsoft Edge** | Tampermonkey | ✅ Supported |
| **Brave Browser** | Tampermonkey | ✅ Supported |
| **Apple Safari (macOS / iOS)** | Userscripts / Stay | ✅ Supported |
| **Android (Kiwi / Firefox)** | Tampermonkey / Violentmonkey | ✅ Supported |

---

## 🛠️ Development & Testing

```bash
# Clone the repository
git clone https://github.com/infoxica/imdb-vidsrc.git
cd imdb-vidsrc

# Verify script syntax
node -c imdb-vidsrc.user.js
```

---

## ⚖️ Disclaimer

This userscript is created for educational and personal convenience purposes only. It does not host, store, or stream any media files or copyrighted content. It merely constructs standard web links to third-party services. The authors do not endorse or take responsibility for content provided by third-party services.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Contributions, bug reports, and pull requests are welcome!
