<div align="center">

# 🎬 IMDb - Watch on VidSrc

**Stream any movie, TV show, anime, or episode directly from IMDb with a single click.**

[![Version](https://img.shields.io/badge/version-1.0.2-f5c518.svg?style=flat-square)](https://github.com/infoxica/imdb-vidsrc/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-00485B.svg?style=flat-square&logo=tampermonkey)](https://www.tampermonkey.net/)
[![Violentmonkey](https://img.shields.io/badge/Violentmonkey-Compatible-orange.svg?style=flat-square)](https://violentmonkey.github.io/)

[Install](#-installation) • [Features](#-features) • [Configuration](#-mirror-configuration) • [Compatibility](#-browser-support) • [License](#-license)

</div>

---

## ✨ Features

- **One-Click Playback**: Adds clean, intuitive **Watch** buttons across IMDb title pages, episode guides, top charts, and search results.
- **Native Look & Feel**: Designed to blend naturally with IMDb's dark UI theme and button styling.
- **Full Episode Support**: Works seamlessly on individual episode pages and season listings, taking you straight to the exact season and episode.
- **Anime & Movies**: Supports all movies, TV series, anime films, and ongoing shows indexed on IMDb.
- **Live Stream Availability**: Displays a subtle status indicator showing whether the title is ready to play along with reported video quality (e.g. 1080p).
- **Custom Mirrors & Proxies**: Easily switch between working VidSrc mirrors or enter your own custom endpoint anytime.
- **Fast & Lightweight**: Built with smart lazy-loading so scrolling through IMDb Top 250 and long lists remains smooth and lag-free.

---

## 🚀 Installation

### 1. Install a Userscript Manager

Install a compatible userscript extension for your browser:

| Browser                   | Recommended Extension                                                                                                                                          |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Chrome / Brave / Edge** | [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)                                                             |
| **Firefox**               | [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) or [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/) |
| **Safari (macOS / iOS)**  | [Userscripts](https://github.com/quoid/userscripts) or [Stay](https://stayfork.app/)                                                                           |
| **Android**               | [Firefox for Android](https://www.mozilla.org/firefox/browsers/mobile/android/) or [Kiwi Browser](https://kiwibrowser.com/) + Tampermonkey                     |

### 2. Install the Userscript

Click the button below to install:

<div align="center">

[![Install Userscript](https://img.shields.io/badge/⚡_Install_Userscript-imdb--vidsrc.user.js-f5c518?style=for-the-badge&logo=tampermonkey&logoColor=black)](https://raw.githubusercontent.com/infoxica/imdb-vidsrc/master/imdb-vidsrc.user.js)

</div>

_Your userscript extension will open a prompt — click **Install** to confirm._

---

## 🎯 How It Works

Once installed, visit IMDb as you normally would:

| Page Type                    | Button                           | Action                                        |
| :--------------------------- | :------------------------------- | :-------------------------------------------- |
| **Movie Page**               | `▶ Watch Now`                    | Opens the movie stream                        |
| **TV Series Page**           | `▶ Watch Series`                 | Opens the series player with episode selector |
| **Episode Page**             | `▶ Watch S{season} • E{episode}` | Streams the specific episode directly         |
| **Season Episodes List**     | `▶ Watch S{season} • E{episode}` | Injected beside each episode in the list      |
| **Top 250 / Lists / Charts** | `▶ Watch`                        | Added to each title card for quick access     |

### Availability Status

| Status          | Indicator | Meaning                                                 |
| :-------------- | :-------: | :------------------------------------------------------ |
| **Available**   |    🟢     | Ready to stream (reported quality shown on hover)       |
| **Checking**    |    🟠     | Verifying stream status                                 |
| **Unavailable** |    🔴     | Title or episode is not currently indexed on the server |
| **Ready**       |    ⚪     | Direct link ready                                       |

---

## ⚙️ Mirror Configuration

To change your preferred streaming mirror, click the **Settings (`⚙`)** icon next to the Watch button, or select **"⚙ Configure VidSrc Domain"** from your userscript extension menu.

Pre-configured options include:

- `vidsrc.sh` (Default / Recommended)
- `vidsrc2.ru` (Fast Mirror)
- `vidsrc.ir` (Alternative Mirror)
- **Custom Domain** (Use your own mirror or proxy)

Your preference is saved automatically across all pages and sessions.

---

## 🌐 Browser Support

| Browser                      | Extension                    |    Status    |
| :--------------------------- | :--------------------------- | :----------: |
| **Google Chrome / Chromium** | Tampermonkey / Violentmonkey | ✅ Supported |
| **Mozilla Firefox**          | Tampermonkey / Violentmonkey | ✅ Supported |
| **Microsoft Edge**           | Tampermonkey / Violentmonkey | ✅ Supported |
| **Brave Browser**            | Tampermonkey / Violentmonkey | ✅ Supported |
| **Apple Safari**             | Userscripts / Stay           | ✅ Supported |
| **Android (Kiwi / Firefox)** | Tampermonkey / Violentmonkey | ✅ Supported |

---

## ⚖️ Disclaimer

This userscript is an open-source project intended for educational and personal convenience purposes only. It does not host, store, stream, or distribute any media files or copyrighted content. All links are dynamically generated to point to third-party services. The author does not endorse or take responsibility for content provided by external websites.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
