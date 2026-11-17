// ==UserScript==
// @name         IMDb - Watch on VidSrc
// @namespace    https://github.com/infoxica/imdb-vidsrc
// @version      1.0.3
// @description  Adds native IMDb-styled Watch buttons with episode/anime support, universal domain settings, and parallel viewport lazy-loading.
// @author       infoxica
// @match        https://www.imdb.com/*
// @icon         https://www.imdb.com/favicon.ico
// @updateURL    https://raw.githubusercontent.com/infoxica/imdb-vidsrc/master/imdb-vidsrc.user.js
// @downloadURL  https://raw.githubusercontent.com/infoxica/imdb-vidsrc/master/imdb-vidsrc.user.js
// @supportURL   https://github.com/infoxica/imdb-vidsrc/issues
// @homepageURL  https://github.com/infoxica/imdb-vidsrc
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      vidsrc.sh
// @connect      vidsrc2.ru
// @connect      vidsrc.ir
// @connect      *
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // CONFIGURATION & CONSTANTS
    // -------------------------------------------------------------------------
    const SCRIPT_ID = 'imdb-vsrc';
    const CACHE_KEY_PREFIX = `${SCRIPT_ID}-cache-`;
    const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

    const PRESET_DOMAINS = [
        { host: 'vidsrc.sh', label: 'vidsrc.sh (Recommended)' },
        { host: 'vidsrc2.ru', label: 'vidsrc2.ru (Fast Mirror)' },
        { host: 'vidsrc.ir', label: 'vidsrc.ir (Alternative Mirror)' }
    ];

    // SVG Icons (Lucide)
    const ICONS = {
        play: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
        playSmall: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
        settings: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
        check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
        x: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        spinner: `<svg class="imdb-vsrc-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
        external: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
    };

    // -------------------------------------------------------------------------
    // SETTINGS & STORAGE
    // -------------------------------------------------------------------------
    function getDomain() {
        let domain = null;
        if (typeof GM_getValue === 'function') {
            domain = GM_getValue('vidsrc_domain', null);
        }
        if (!domain) {
            domain = localStorage.getItem(`${SCRIPT_ID}-domain`);
        }
        return domain || PRESET_DOMAINS[0].host;
    }

    function setDomain(domain) {
        if (!domain) return;
        const clean = domain.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
        if (typeof GM_setValue === 'function') {
            GM_setValue('vidsrc_domain', clean);
        }
        localStorage.setItem(`${SCRIPT_ID}-domain`, clean);
    }

    // Register Userscript Menu
    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('⚙ Configure VidSrc Domain', openSettingsModal);
    }

    // -------------------------------------------------------------------------
    // STYLES (Native IMDb Design System)
    // -------------------------------------------------------------------------
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        /* General button typography & reset */
        .imdb-vsrc-btn {
            font-family: Roboto, Helvetica, Arial, sans-serif !important;
            text-decoration: none !important;
            cursor: pointer;
            transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
            box-sizing: border-box;
            user-select: none;
            white-space: nowrap !important;
        }

        /* Title / Episode Page: Fixed Right-Top Action Group (Outside standard 1280px container) */
        #imdb-vsrc-hero-group,
        .imdb-vsrc-hero-group {
            position: fixed !important;
            top: 72px !important; /* Cleanly below IMDb fixed navbar (~56px) + safe buffer */
            right: 16px !important; /* Aligned right, away from search bar */
            z-index: 9999 !important; /* Below IMDb's nav (10000+) so it sits under it, not inside */
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            background: rgba(18, 18, 18, 0.95) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            padding: 5px 6px !important;
            border-radius: 9999px !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6) !important;
        }

        #imdb-vsrc-hero-group:hover,
        .imdb-vsrc-hero-group:hover {
            border-color: rgba(245, 197, 24, 0.5) !important;
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.75) !important;
        }

        /* Hero Primary Action Button (Yellow IMDb accent, single line) */
        .imdb-vsrc-hero-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            background-color: #f5c518 !important;
            color: #000000 !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            line-height: 20px !important;
            padding: 8px 18px !important;
            border-radius: 9999px !important;
            border: none !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4) !important;
            white-space: nowrap !important;
            text-decoration: none !important;
        }

        .imdb-vsrc-hero-btn:hover {
            background-color: #e2b616 !important;
            color: #000000 !important;
        }

        .imdb-vsrc-hero-btn:active {
            transform: scale(0.97) !important;
        }

        .imdb-vsrc-label {
            white-space: nowrap !important;
            display: inline-block !important;
        }

        /* Hero Secondary Settings Button */
        .imdb-vsrc-hero-settings {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: #f5f5f5 !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 9999px !important;
            padding: 8px 10px !important;
            cursor: pointer !important;
            transition: background-color 0.15s ease, border-color 0.15s ease !important;
        }

        .imdb-vsrc-hero-settings:hover {
            background-color: rgba(255, 255, 255, 0.2) !important;
            border-color: #f5c518 !important;
            color: #f5c518 !important;
        }

        /* High-Visibility Card & Episode Button (Matches IMDb's "Mark as watched") */
        .imdb-vsrc-card-btn {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            margin: 4px 6px 4px 0 !important;
            vertical-align: middle !important;
            white-space: nowrap !important;
            text-decoration: none !important;
            cursor: pointer !important;
            box-sizing: border-box !important;
        }

        .imdb-vsrc-card-btn .ipc-btn__icon--pre {
            display: inline-flex !important;
            align-items: center !important;
            color: #f5c518 !important; /* Yellow vector Play Icon */
            flex-shrink: 0 !important;
            margin-right: 4px !important;
        }

        .imdb-vsrc-card-btn .ipc-btn__text {
            white-space: nowrap !important;
            font-weight: 600 !important;
        }

        .imdb-vsrc-card-btn:hover {
            border-color: #f5c518 !important;
            transform: translateY(-1px);
        }

        /* Status Dot Indicator */
        .imdb-vsrc-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            background-color: #94a3b8; /* idle neutral */
            flex-shrink: 0;
            transition: background-color 0.2s ease;
        }

        .imdb-vsrc-status-dot.available {
            background-color: #22c55e !important; /* Green */
            box-shadow: 0 0 6px rgba(34, 197, 94, 0.6) !important;
        }

        .imdb-vsrc-status-dot.checking {
            background-color: #f59e0b !important; /* Amber */
        }

        .imdb-vsrc-status-dot.missing {
            background-color: #ef4444 !important; /* Red */
        }

        .imdb-vsrc-status-dot.error {
            background-color: #64748b !important; /* Slate */
        }

        /* Animated Spinner */
        @keyframes imdb-vsrc-spin {
            100% { transform: rotate(360deg); }
        }
        .imdb-vsrc-spin {
            animation: imdb-vsrc-spin 0.8s linear infinite;
        }

        /* Settings Modal Backdrop & Dialog */
        #imdb-vsrc-modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            z-index: 10000000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
        }

        #imdb-vsrc-modal {
            background: #1f1f1f;
            color: #f5f5f5;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 12px;
            width: 100%;
            max-width: 440px;
            padding: 24px;
            font-family: Roboto, Helvetica, Arial, sans-serif;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7);
        }

        #imdb-vsrc-modal h3 {
            margin: 0 0 8px 0;
            font-size: 18px;
            font-weight: 700;
            color: #f5c518;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #imdb-vsrc-modal p {
            font-size: 13px;
            color: #a3a3a3;
            margin: 0 0 16px 0;
            line-height: 18px;
        }

        .imdb-vsrc-domain-option {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            margin-bottom: 8px;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.03);
            transition: background 0.15s, border-color 0.15s;
        }

        .imdb-vsrc-domain-option:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .imdb-vsrc-domain-option.active {
            border-color: #f5c518;
            background: rgba(245, 197, 24, 0.08);
        }

        .imdb-vsrc-domain-option input[type="radio"] {
            accent-color: #f5c518;
        }

        .imdb-vsrc-custom-input {
            width: 100%;
            padding: 10px 12px;
            background: #141414;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            color: #fff;
            font-size: 13px;
            box-sizing: border-box;
            margin-top: 6px;
        }

        .imdb-vsrc-custom-input:focus {
            outline: none;
            border-color: #f5c518;
        }

        .imdb-vsrc-modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .imdb-vsrc-modal-btn {
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            border: none;
        }

        .imdb-vsrc-modal-btn-cancel {
            background: rgba(255, 255, 255, 0.1);
            color: #d4d4d4;
        }
        .imdb-vsrc-modal-btn-cancel:hover {
            background: rgba(255, 255, 255, 0.16);
            color: #fff;
        }

        .imdb-vsrc-modal-btn-save {
            background: #f5c518;
            color: #000;
        }
        .imdb-vsrc-modal-btn-save:hover {
            background: #e2b616;
        }
    `;
    document.head.appendChild(styleEl);

    // -------------------------------------------------------------------------
    // CONCURRENCY QUEUE (Non-blocking parallel batching)
    // -------------------------------------------------------------------------
    class ConcurrencyQueue {
        constructor(maxConcurrent = 4) {
            this.maxConcurrent = maxConcurrent;
            this.running = 0;
            this.queue = [];
        }

        push(taskFn) {
            return new Promise((resolve, reject) => {
                this.queue.push({ taskFn, resolve, reject });
                this.next();
            });
        }

        next() {
            if (this.running >= this.maxConcurrent || this.queue.length === 0) return;
            this.running++;
            const { taskFn, resolve, reject } = this.queue.shift();

            taskFn()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    this.next();
                });
        }
    }

    const requestQueue = new ConcurrencyQueue(4);
    const memoryCache = new Map();

    // -------------------------------------------------------------------------
    // CACHE HELPERS
    // -------------------------------------------------------------------------
    function getCache(key) {
        if (memoryCache.has(key)) {
            const entry = memoryCache.get(key);
            if (Date.now() - entry.time < CACHE_TTL_MS) return entry.data;
            memoryCache.delete(key);
        }
        try {
            const raw = sessionStorage.getItem(CACHE_KEY_PREFIX + key);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Date.now() - parsed.time < CACHE_TTL_MS) {
                    memoryCache.set(key, parsed);
                    return parsed.data;
                }
                sessionStorage.removeItem(CACHE_KEY_PREFIX + key);
            }
        } catch (_) {}
        return null;
    }

    function setCache(key, data) {
        const entry = { time: Date.now(), data };
        memoryCache.set(key, entry);
        try {
            sessionStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(entry));
        } catch (_) {}
    }

    // -------------------------------------------------------------------------
    // METADATA PARSING (Movie, TV Series, Anime & Episode support)
    // -------------------------------------------------------------------------
    function parsePageMetadata() {
        const match = window.location.pathname.match(/\/title\/(tt\d+)/);
        if (!match) return null;

        const currentId = match[1];
        const meta = {
            id: currentId,
            type: 'movie',
            seriesId: null,
            season: null,
            episode: null,
            isEpisode: false,
            title: document.title.replace(/\s*-\s*IMDb.*$/i, '').trim()
        };

        // 1. Inspect Schema.org JSON-LD
        const jsonScripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of jsonScripts) {
            try {
                const json = JSON.parse(script.textContent);
                const items = [json, ...(json['@graph'] || [])];
                for (const item of items) {
                    const type = Array.isArray(item['@type']) ? item['@type'].join(' ') : (item['@type'] || '');

                    if (/TVEpisode/i.test(type)) {
                        meta.isEpisode = true;
                        meta.type = 'tv';
                        if (item.episodeNumber != null) {
                            meta.episode = parseInt(item.episodeNumber, 10);
                        }
                        if (item.partOfSeason?.seasonNumber != null) {
                            meta.season = parseInt(item.partOfSeason.seasonNumber, 10);
                        }
                        if (item.partOfSeries) {
                            const sUrl = item.partOfSeries.url || item.partOfSeries.sameAs || '';
                            const sm = sUrl.match(/\/title\/(tt\d+)/);
                            if (sm) meta.seriesId = sm[1];
                        }
                        break;
                    } else if (/TVSeries|TVMiniSeries/i.test(type)) {
                        meta.type = 'tv';
                    }
                }
            } catch (_) {}
        }

        // 2. Fallback to __NEXT_DATA__
        if ((!meta.isEpisode || !meta.seriesId) && window.__NEXT_DATA__) {
            try {
                const mainCol = window.__NEXT_DATA__.props?.pageProps?.mainColumnData;
                if (mainCol?.series) {
                    meta.isEpisode = true;
                    meta.type = 'tv';
                    meta.seriesId = mainCol.series.id || meta.seriesId;
                    if (mainCol.seasonNumber != null) meta.season = parseInt(mainCol.seasonNumber, 10);
                    if (mainCol.episodeNumber != null) meta.episode = parseInt(mainCol.episodeNumber, 10);
                } else if (mainCol?.titleType?.isSeries) {
                    meta.type = 'tv';
                }
            } catch (_) {}
        }

        // 3. Fallback to DOM Series Links (for episode pages)
        if (!meta.isEpisode) {
            const seriesLink = document.querySelector('a[data-testid="hero-title-block__series-link"], a[href*="/title/tt"][class*="series"]');
            if (seriesLink) {
                const sm = seriesLink.getAttribute('href')?.match(/\/title\/(tt\d+)/);
                if (sm) {
                    meta.isEpisode = true;
                    meta.type = 'tv';
                    meta.seriesId = sm[1];
                }
            }
        }

        // 4. Fallback Episode Season/Number extraction from text (e.g., "S11.E1" or "S11 E1")
        if (meta.isEpisode && (meta.season == null || meta.episode == null)) {
            const heroText = document.body.innerText.slice(0, 3000);
            const seMatch = heroText.match(/S(\d+)\s*[\.·\s]\s*E(\d+)/i);
            if (seMatch) {
                if (meta.season == null) meta.season = parseInt(seMatch[1], 10);
                if (meta.episode == null) meta.episode = parseInt(seMatch[2], 10);
            }
        }

        // 5. Parent Series ID fallback from episodes navigation
        if (meta.isEpisode && !meta.seriesId) {
            const epNav = document.querySelector('a[href*="/episodes/?season="], a[href*="/episodes/"]');
            if (epNav) {
                const sm = epNav.getAttribute('href')?.match(/\/title\/(tt\d+)/);
                if (sm) meta.seriesId = sm[1];
            }
        }

        return meta;
    }

    function buildEmbedUrl(meta, domain) {
        if (meta.isEpisode && meta.seriesId && meta.season != null && meta.episode != null) {
            return `https://${domain}/embed/tv/${meta.seriesId}/${meta.season}/${meta.episode}`;
        }
        if (meta.type === 'tv' || meta.isEpisode) {
            const id = meta.seriesId || meta.id;
            return `https://${domain}/embed/tv/${id}`;
        }
        return `https://${domain}/embed/movie/${meta.id}`;
    }

    function buildInfoUrl(meta, domain) {
        const id = (meta.isEpisode && meta.seriesId) ? meta.seriesId : meta.id;
        const type = (meta.isEpisode || meta.type === 'tv') ? 'tv' : 'movie';
        return `https://${domain}/info/${type}/${id}.json`;
    }

    // -------------------------------------------------------------------------
    // AVAILABILITY CHECKER
    // -------------------------------------------------------------------------
    function checkAvailability(meta, domain) {
        const cacheKey = `${domain}:${meta.type}:${meta.id}${meta.isEpisode ? `:${meta.season}:${meta.episode}` : ''}`;
        const cached = getCache(cacheKey);
        if (cached) return Promise.resolve(cached);

        const infoUrl = buildInfoUrl(meta, domain);

        return new Promise((resolve) => {
            if (typeof GM_xmlhttpRequest !== 'function') {
                resolve({ state: 'available', quality: '', message: 'Direct link ready' });
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: infoUrl,
                timeout: 8000,
                headers: {
                    'Accept': 'application/json'
                },
                onload: (response) => {
                    let result = { state: 'missing', quality: '', message: 'Unavailable' };

                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            let available = true;

                            // If this is an individual episode, verify episode exists in series season data
                            if (meta.isEpisode && meta.season != null && meta.episode != null && Array.isArray(data.seasons)) {
                                const targetSeason = data.seasons.find(s => Number(s.season) === Number(meta.season));
                                if (targetSeason) {
                                    if (targetSeason.episodes && meta.episode > targetSeason.episodes) {
                                        available = false;
                                        result = { state: 'missing', quality: '', message: `Episode ${meta.episode} not indexed` };
                                    } else {
                                        result = {
                                            state: 'available',
                                            quality: targetSeason.quality || data.quality || 'HD',
                                            message: `Available (${targetSeason.quality || 'HD'})`
                                        };
                                    }
                                } else {
                                    result = { state: 'missing', quality: '', message: `Season ${meta.season} not indexed` };
                                    available = false;
                                }
                            } else {
                                result = {
                                    state: 'available',
                                    quality: data.quality || 'HD',
                                    message: `Available (${data.quality || 'HD'})`
                                };
                            }
                        } catch (_) {
                            result = { state: 'available', quality: '', message: 'Available' };
                        }
                    } else if (response.status === 404) {
                        result = { state: 'missing', quality: '', message: 'Title not found on server' };
                    } else {
                        result = { state: 'error', quality: '', message: `HTTP ${response.status}` };
                    }

                    setCache(cacheKey, result);
                    resolve(result);
                },
                onerror: () => {
                    const res = { state: 'error', quality: '', message: 'Connection failed' };
                    resolve(res);
                },
                ontimeout: () => {
                    const res = { state: 'error', quality: '', message: 'Timed out' };
                    resolve(res);
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // TITLE / EPISODE PAGE RENDERING
    // -------------------------------------------------------------------------
    function renderTitlePage() {
        const meta = parsePageMetadata();
        if (!meta) return;

        const currentDomain = getDomain();
        const existingHero = document.getElementById(`${SCRIPT_ID}-hero-btn`);

        if (existingHero && existingHero.dataset.id === meta.id && existingHero.dataset.domain === currentDomain) {
            return; // Already up to date
        }

        // Clean up previous injected elements if navigating between titles
        document.getElementById(`${SCRIPT_ID}-hero-group`)?.remove();

        const embedUrl = buildEmbedUrl(meta, currentDomain);

        // Build Fixed Top-Right Hero Group (outside standard 1280px container, cleanly below navbar)
        const heroGroup = document.createElement('div');
        heroGroup.id = `${SCRIPT_ID}-hero-group`;
        heroGroup.className = 'imdb-vsrc-hero-group';
        heroGroup.style.cssText = 'position: fixed !important; top: 72px !important; right: 16px !important; z-index: 9999 !important; display: inline-flex !important; align-items: center !important; gap: 6px !important;';

        const heroBtn = document.createElement('a');
        heroBtn.id = `${SCRIPT_ID}-hero-btn`;
        heroBtn.className = 'imdb-vsrc-btn imdb-vsrc-hero-btn';
        heroBtn.href = embedUrl;
        heroBtn.target = '_blank';
        heroBtn.rel = 'noopener noreferrer';
        heroBtn.dataset.id = meta.id;
        heroBtn.dataset.domain = currentDomain;

        let labelText = 'Watch Now';
        if (meta.isEpisode && meta.season != null && meta.episode != null) {
            labelText = `Watch S${meta.season} • E${meta.episode}`;
        } else if (meta.type === 'tv') {
            labelText = 'Watch Series';
        }

        heroBtn.innerHTML = `
            ${ICONS.play}
            <span class="imdb-vsrc-label">${labelText}</span>
            <span class="imdb-vsrc-status-dot checking" title="Checking availability..."></span>
        `;

        // Settings Button beside Watch Now
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'imdb-vsrc-btn imdb-vsrc-hero-settings';
        settingsBtn.title = `VidSrc Settings (${currentDomain})`;
        settingsBtn.innerHTML = ICONS.settings;
        settingsBtn.type = 'button';
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openSettingsModal();
        });

        heroGroup.appendChild(heroBtn);
        heroGroup.appendChild(settingsBtn);

        // Mount directly to document.body (Guarantees it never gets trapped inside search bar or headers)
        document.body.appendChild(heroGroup);

        // Check availability asynchronously
        const statusDot = heroBtn.querySelector('.imdb-vsrc-status-dot');
        requestQueue.push(() => checkAvailability(meta, currentDomain)).then((res) => {
            if (!statusDot) return;
            statusDot.className = `imdb-vsrc-status-dot ${res.state}`;
            const tooltip = `${res.message} • ${currentDomain}`;
            statusDot.title = tooltip;
            heroBtn.title = tooltip;
        });
    }

    // -------------------------------------------------------------------------
    // LISTS & CHARTS: VIEWPORT LAZY-LOADING WITH INTERSECTION OBSERVER
    // -------------------------------------------------------------------------
    const NATIVE_BTN_CLASSES = 'ipc-btn ipc-btn--half-padding ipc-btn--left-align-content ipc-btn--default-height ipc-btn--core-base ipc-btn--theme-base ipc-btn--button-radius ipc-btn--on-accent2 ipc-text-button';

    let cardObserver = null;

    function initCardObserver() {
        if (cardObserver) return;

        cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const btn = entry.target;
                    cardObserver.unobserve(btn);

                    // Pull metadata and trigger parallel check
                    const meta = {
                        id: btn.dataset.id,
                        type: btn.dataset.type || 'movie',
                        isEpisode: btn.dataset.isEpisode === 'true',
                        seriesId: btn.dataset.seriesId || null,
                        season: btn.dataset.season ? parseInt(btn.dataset.season, 10) : null,
                        episode: btn.dataset.episode ? parseInt(btn.dataset.episode, 10) : null
                    };
                    const domain = getDomain();

                    requestQueue.push(() => checkAvailability(meta, domain)).then((res) => {
                        const dot = btn.querySelector('.imdb-vsrc-status-dot');
                        if (dot) {
                            dot.className = `imdb-vsrc-status-dot ${res.state}`;
                            btn.title = `${res.message} • ${domain}`;
                        }
                    });
                }
            });
        }, {
            rootMargin: '250px 0px',
            threshold: 0.01
        });
    }

    function processListCards() {
        initCardObserver();

        const currentDomain = getDomain();
        const titleLinks = document.querySelectorAll('a[href*="/title/tt"]');

        titleLinks.forEach((link) => {
            const match = link.href.match(/\/title\/(tt\d+)/);
            if (!match) return;
            const imdbId = match[1];

            // Locate IMDb summary card
            const card = link.closest(
                'li.ipc-metadata-list-summary-item, ' +
                '.ipc-metadata-list-summary-item, ' +
                '[data-testid^="title-list-item"], ' +
                '.lister-item'
            );
            if (!card) return;

            // Prevent duplicate buttons on same card
            if (card.querySelector(`.${SCRIPT_ID}-card-btn[data-id="${imdbId}"]`)) return;
            if (card.querySelector(`.${SCRIPT_ID}-card-btn`)) return;

            // Detect type if card indicates Series
            const cardText = card.innerText || '';
            const isTv = /TV Series|TV Mini-Series|TV Special|Episode/i.test(cardText);
            const type = isTv ? 'tv' : 'movie';

            const meta = { id: imdbId, type, isEpisode: false };
            const embedUrl = buildEmbedUrl(meta, currentDomain);

            const btn = document.createElement('a');
            btn.href = embedUrl;
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
            btn.dataset.id = imdbId;
            btn.dataset.type = type;

            // Find "Mark as watched" button to match placement and style
            const actionControls = Array.from(card.querySelectorAll('button, a, [role="button"]'));
            const watchedBtn = actionControls.find((el) =>
                /mark as watched/i.test(el.innerText || '') ||
                /mark.*watched/i.test(el.getAttribute('aria-label') || '') ||
                /watched/i.test(el.getAttribute('title') || '')
            );

            // Inherit native button classes from reference button if present
            const nativeClasses = (watchedBtn && watchedBtn.className) ? watchedBtn.className : NATIVE_BTN_CLASSES;
            btn.className = `${nativeClasses} imdb-vsrc-btn imdb-vsrc-card-btn ${SCRIPT_ID}-card-btn`;

            btn.innerHTML = `
                <span class="ipc-btn__icon ipc-btn__icon--pre">${ICONS.playSmall}</span>
                <span class="ipc-btn__text">Watch</span>
                <span class="imdb-vsrc-status-dot checking" title="Checking..."></span>
            `;

            if (watchedBtn) {
                watchedBtn.insertAdjacentElement('afterend', btn);
            } else {
                const targetArea =
                    card.querySelector('.ipc-metadata-list-summary-item__tc') ||
                    card.querySelector('[data-testid="title-list-item"]') ||
                    card.querySelector('.lister-item-content') ||
                    card;
                targetArea.appendChild(btn);
            }

            // Lazy check availability when scrolled into view
            cardObserver.observe(btn);
        });
    }

    // -------------------------------------------------------------------------
    // EPISODES LIST PAGE: EPISODE-LEVEL BUTTONS (/title/tt.../episodes/)
    // -------------------------------------------------------------------------
    function processEpisodesPage(seriesId) {
        initCardObserver();

        const currentDomain = getDomain();
        const episodeCards = document.querySelectorAll(
            'article.episode-item-wrapper, ' +
            '[data-testid^="episodes-card"], ' +
            '[data-testid^="episode-card"], ' +
            '.eplist .list_item, ' +
            '.episode-item-wrapper'
        );

        // Extract season from URL if present (e.g. ?season=2)
        const paramSeason = new URLSearchParams(window.location.search).get('season');
        const defaultSeason = (paramSeason && /^\d+$/.test(paramSeason)) ? parseInt(paramSeason, 10) : 1;

        episodeCards.forEach((card, index) => {
            const epLink = card.querySelector('a[href*="/title/tt"]');
            if (!epLink) return;

            const match = epLink.href.match(/\/title\/(tt\d+)/);
            if (!match) return;
            const epId = match[1];

            // Prevent duplicate buttons on same card
            if (card.querySelector(`.${SCRIPT_ID}-ep-btn[data-id="${epId}"]`)) return;
            if (card.querySelector(`.${SCRIPT_ID}-ep-btn`)) return;

            const cardText = card.innerText || '';

            // Extract Season & Episode numbers
            let seasonNum = defaultSeason;
            let epNum = null;

            // Pattern: S1. E1, S1, Ep1, S01.E05, S1 E1
            const seMatch = cardText.match(/S(\d+)\s*[\.·\s,]\s*E(?:p)?(\d+)/i);
            if (seMatch) {
                seasonNum = parseInt(seMatch[1], 10);
                epNum = parseInt(seMatch[2], 10);
            } else {
                // Tracking ref like ?ref_=ttep_ep1
                const refMatch = epLink.href.match(/ttep_ep(\d+)/i);
                if (refMatch) {
                    epNum = parseInt(refMatch[1], 10);
                } else {
                    const epMatch = cardText.match(/Episode\s*#?(\d+)|Ep\.?\s*(\d+)/i);
                    if (epMatch) {
                        epNum = parseInt(epMatch[1] || epMatch[2], 10);
                    } else {
                        epNum = index + 1;
                    }
                }
            }

            const meta = {
                id: epId,
                type: 'tv',
                isEpisode: true,
                seriesId: seriesId,
                season: seasonNum,
                episode: epNum
            };

            const embedUrl = buildEmbedUrl(meta, currentDomain);

            const btn = document.createElement('a');
            btn.href = embedUrl;
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
            btn.dataset.id = epId;
            btn.dataset.type = 'tv';
            btn.dataset.isEpisode = 'true';
            btn.dataset.seriesId = seriesId;
            btn.dataset.season = String(seasonNum);
            if (epNum != null) btn.dataset.episode = String(epNum);

            // Locate "Mark as watched" button
            const actionControls = Array.from(card.querySelectorAll('button, a, [role="button"]'));
            const watchedBtn = actionControls.find((el) =>
                /mark as watched/i.test(el.innerText || '') ||
                /mark.*watched/i.test(el.getAttribute('aria-label') || '') ||
                /watched/i.test(el.getAttribute('title') || '')
            );

            const nativeClasses = (watchedBtn && watchedBtn.className) ? watchedBtn.className : NATIVE_BTN_CLASSES;
            btn.className = `${nativeClasses} imdb-vsrc-btn imdb-vsrc-card-btn ${SCRIPT_ID}-card-btn ${SCRIPT_ID}-ep-btn`;

            let label = 'Watch';
            if (seasonNum != null && epNum != null) {
                label = `Watch S${seasonNum} • E${epNum}`;
            } else if (epNum != null) {
                label = `Watch E${epNum}`;
            }

            btn.innerHTML = `
                <span class="ipc-btn__icon ipc-btn__icon--pre">${ICONS.playSmall}</span>
                <span class="ipc-btn__text">${label}</span>
                <span class="imdb-vsrc-status-dot checking" title="Checking..."></span>
            `;

            if (watchedBtn) {
                watchedBtn.insertAdjacentElement('afterend', btn);
            } else {
                const targetArea =
                    card.querySelector('.ipc-metadata-list-summary-item__tc') ||
                    card.querySelector('[data-testid="episode-card-content"]') ||
                    card.querySelector('.ipl-rating-widget') ||
                    card.querySelector('.info') ||
                    card;
                targetArea.appendChild(btn);
            }

            // Lazy check availability when scrolled into view
            cardObserver.observe(btn);
        });
    }

    // -------------------------------------------------------------------------
    // SETTINGS MODAL DIALOG
    // -------------------------------------------------------------------------
    function openSettingsModal() {
        if (document.getElementById('imdb-vsrc-modal-backdrop')) return;

        const currentDomain = getDomain();

        const backdrop = document.createElement('div');
        backdrop.id = 'imdb-vsrc-modal-backdrop';

        const isPreset = PRESET_DOMAINS.some(p => p.host === currentDomain);

        backdrop.innerHTML = `
            <div id="imdb-vsrc-modal">
                <h3>${ICONS.settings} VidSrc Domain Configuration</h3>
                <p>Choose your preferred VidSrc streaming domain. Settings are universally applied across all movies, series, and lists.</p>

                <div id="imdb-vsrc-options">
                    ${PRESET_DOMAINS.map(p => `
                        <label class="imdb-vsrc-domain-option ${currentDomain === p.host ? 'active' : ''}">
                            <input type="radio" name="imdb-vsrc-opt" value="${p.host}" ${currentDomain === p.host ? 'checked' : ''} />
                            <div>
                                <div style="font-weight: 600; font-size: 13px;">${p.label}</div>
                                <div style="font-size: 11px; color: #737373;">https://${p.host}/</div>
                            </div>
                        </label>
                    `).join('')}

                    <label class="imdb-vsrc-domain-option ${!isPreset ? 'active' : ''}">
                        <input type="radio" name="imdb-vsrc-opt" value="custom" ${!isPreset ? 'checked' : ''} />
                        <div style="width: 100%;">
                            <div style="font-weight: 600; font-size: 13px;">Custom Domain / Proxy</div>
                            <input type="text" id="imdb-vsrc-custom-field" class="imdb-vsrc-custom-input" placeholder="e.g. vidsrc.net" value="${!isPreset ? currentDomain : ''}" />
                        </div>
                    </label>
                </div>

                <div class="imdb-vsrc-modal-actions">
                    <button type="button" class="imdb-vsrc-modal-btn imdb-vsrc-modal-btn-cancel" id="imdb-vsrc-btn-cancel">Cancel</button>
                    <button type="button" class="imdb-vsrc-modal-btn imdb-vsrc-modal-btn-save" id="imdb-vsrc-btn-save">Save & Apply</button>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);

        // Highlight active radio on selection
        const radios = backdrop.querySelectorAll('input[name="imdb-vsrc-opt"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                backdrop.querySelectorAll('.imdb-vsrc-domain-option').forEach(el => el.classList.remove('active'));
                radio.closest('.imdb-vsrc-domain-option')?.classList.add('active');
            });
        });

        // Cancel
        const closeModal = () => backdrop.remove();
        backdrop.querySelector('#imdb-vsrc-btn-cancel').addEventListener('click', closeModal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });

        // Save
        backdrop.querySelector('#imdb-vsrc-btn-save').addEventListener('click', () => {
            const selectedRadio = backdrop.querySelector('input[name="imdb-vsrc-opt"]:checked')?.value;
            let targetDomain = selectedRadio;

            if (selectedRadio === 'custom') {
                const customVal = backdrop.querySelector('#imdb-vsrc-custom-field').value.trim();
                if (!customVal) {
                    alert('Please enter a valid domain.');
                    return;
                }
                targetDomain = customVal;
            }

            setDomain(targetDomain);
            closeModal();

            // Refresh UI with new domain
            memoryCache.clear();
            sessionStorage.clear();
            renderTitlePage();
            const epMatch = window.location.pathname.match(/\/title\/(tt\d+)\/episodes/);
            if (epMatch) {
                processEpisodesPage(epMatch[1]);
            } else {
                processListCards();
            }
        });
    }

    // -------------------------------------------------------------------------
    // PAGE ROUTING & SPA OBSERVER
    // -------------------------------------------------------------------------
    let debounceTimer;

    function handleDomUpdate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const path = window.location.pathname;

            if (path.includes('/episodes')) {
                // TV / Anime Series Episodes List Page (e.g. /title/tt0388629/episodes/)
                const m = path.match(/\/title\/(tt\d+)/);
                if (m) {
                    renderTitlePage();
                    processEpisodesPage(m[1]);
                }
            } else if (path.startsWith('/title/')) {
                renderTitlePage();
                processListCards();
            } else {
                processListCards();
            }
        }, 200);
    }

    // Initial run
    handleDomUpdate();

    // Observe dynamic SPA content changes
    const mutationObserver = new MutationObserver(() => {
        handleDomUpdate();
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Intercept pushState & popState for IMDb client-side routing
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        const ret = originalPushState.apply(this, args);
        handleDomUpdate();
        return ret;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
        const ret = originalReplaceState.apply(this, args);
        handleDomUpdate();
        return ret;
    };

    window.addEventListener('popstate', handleDomUpdate);

})();
