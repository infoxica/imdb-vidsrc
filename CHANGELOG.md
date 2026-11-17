# Changelog

All notable changes to **IMDb × VidSrc** are documented here.

Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

---

## [1.0.3] — 2026-11-17

### Fixed
- **Watch Now button placement** — Reduced z-index from `999999` to `9999` to properly sit *below* IMDb's fixed navbar (instead of inside it). Adjusted `top` offset to `72px` and `right` to `16px` for clean visual separation from the search bar.

---

## [1.0.2] — 2026-11-17

### Fixed
- **Button placement on title pages** — ID mismatch between `SCRIPT_ID` and CSS selectors caused the Watch Now button to render at the page bottom; unified to `imdb-vsrc` prefix.
- Added defense-in-depth inline `style.cssText` to guarantee fixed positioning regardless of stylesheet injection order.

### Added
- **Auto-update support** — `@updateURL` and `@downloadURL` headers added; Tampermonkey/Violentmonkey will automatically update the script when a new version is pushed to `master`.

---

## [1.0.1] — 2026-11-17

### Added
- **Episode-level Watch buttons** on `/episodes/` list pages (e.g. `S1 • E1`).
- Buttons inherit exact native IMDb `ipc-btn` class chain to match the "Mark as Watched" button style.
- Settings button beside Watch Now opens a modal for universal domain configuration.
- Viewport lazy-loading with `IntersectionObserver` — availability checks only fire for visible cards.
- Parallel availability checks (no sequential loop).

### Fixed
- TV series and anime episode pages now correctly detected and routed.

---

## [1.0.0] — 2026-11-17

### Added
- Initial release.
- Watch Now / Watch Series / Watch Episode buttons on IMDb title pages.
- Watch buttons on IMDb list and chart pages (Top 250, Watchlist, etc.).
- Universal domain selector modal (vidsrc.sh, vidsrc2.ru, vidsrc.ir, custom).
- Availability status dots (green / red / yellow) with VidSrc API checks.
- 30-minute response cache to minimize redundant API calls.
- Lucide SVG icons throughout.
- SPA navigation support via `pushState` / `popState` / `MutationObserver`.
