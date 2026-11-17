# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (`master`) | ✅ Yes |
| Older versions | ❌ No — please update |

The script auto-updates via Tampermonkey/Violentmonkey when a new version is pushed to `master`. Always keep your userscript manager set to auto-update.

---

## Reporting a Vulnerability

If you discover a security vulnerability, **please do not open a public issue**.

Instead, use **[GitHub Private Security Advisories](https://github.com/infoxica/imdb-vidsrc/security/advisories/new)** to report it privately.

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional but appreciated)

We aim to respond within **48 hours** and will work with you to coordinate a fix and disclosure timeline.

---

## Scope

This userscript runs entirely in your browser and does not collect, transmit, or store any personal data. It only:
- Reads the current IMDb page URL and title metadata from the DOM
- Makes anonymous HTTP requests to VidSrc APIs to check stream availability
- Stores your chosen VidSrc domain preference in `localStorage` / userscript storage

No accounts, no tracking, no external analytics.
