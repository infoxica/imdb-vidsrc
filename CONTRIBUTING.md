# Contributing to IMDb × VidSrc

Thank you for your interest in contributing! This is a community-driven userscript and every improvement helps.

---

## 🚀 Getting Started

1. **Fork** the repository and clone it locally.
2. Make your changes to `imdb-vidsrc.user.js`.
3. Test in your browser with Tampermonkey or Violentmonkey (load the local file directly).
4. Open a Pull Request against `master`.

---

## 📋 Development Guidelines

### Code Style
- Plain vanilla JavaScript — no build tools, no npm, no bundlers.
- Keep all logic in the single `imdb-vidsrc.user.js` file.
- Use `const` / `let` (no `var`). Arrow functions preferred.
- Comment non-obvious logic clearly.
- No external CDN dependencies — the script must work fully offline.

### Versioning
This project uses [Semantic Versioning](https://semver.org/):

| Change type | Version bump |
|------------|-------------|
| Bug fixes, minor tweaks | Patch (`1.0.x`) |
| New features, backwards-compatible | Minor (`1.x.0`) |
| Breaking changes (rare) | Major (`x.0.0`) |

**Always bump `@version` in the userscript header** when making any functional code change. Doc-only changes (README, CONTRIBUTING, etc.) do not need a version bump.

### Commit Messages
Follow conventional commits:
```
fix: description of the bug fix
feat: description of the new feature
chore: maintenance, docs, tooling
```

### Testing Checklist
Before submitting a PR, test on:
- [ ] A movie page (e.g. `imdb.com/title/tt0068646/`)
- [ ] A TV series page (e.g. `imdb.com/title/tt0903747/`)
- [ ] A TV episodes list page (e.g. `imdb.com/title/tt0388629/episodes/`)
- [ ] An anime page (e.g. `imdb.com/title/tt6673774/`)
- [ ] IMDb Top 250 chart (`imdb.com/chart/top/`)
- [ ] IMDb Watchlist or any list page

---

## 🐛 Reporting Bugs

Please use the [bug report template](https://github.com/infoxica/imdb-vidsrc/issues/new?template=bug_report.yml).

## ✨ Requesting Features

Please use the [feature request template](https://github.com/infoxica/imdb-vidsrc/issues/new?template=feature_request.yml).

---

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms.
