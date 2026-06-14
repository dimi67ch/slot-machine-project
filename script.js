(function () {
'use strict';

/* ============================================================
   A — CONSTANTS
   ============================================================ */

const REEL_COUNT = 5;
const ROW_COUNT  = 3;

const SYMBOLS = [
    { name: 'Eye',         src: './assets/eye.png',         probability: 0.05 },
    { name: 'J',           src: './assets/J.svg',           probability: 0.14 },
    { name: 'Q',           src: './assets/Q.svg',           probability: 0.14 },
    { name: 'K',           src: './assets/K.svg',           probability: 0.12 },
    { name: 'A',           src: './assets/A.svg',           probability: 0.12 },
    { name: 'Medusa',      src: './assets/medusa.png',      probability: 0.10 },
    { name: 'Achilles',    src: './assets/achilles.png',    probability: 0.08 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.08 },
    { name: 'Archimedes',  src: './assets/archimedes.png',  probability: 0.06 },
    { name: 'Alexander',   src: './assets/alexander.png',   probability: 0.06 },
    { name: 'Zeus',        src: './assets/zeus.jpg',        probability: 0.05 },
];

const POWERSPIN_SYMBOLS = [
    { name: 'Medusa',      src: './assets/medusa.png',      probability: 0.23 },
    { name: 'Achilles',    src: './assets/achilles.png',    probability: 0.22 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.20 },
    { name: 'Archimedes',  src: './assets/archimedes.png',  probability: 0.15 },
    { name: 'Alexander',   src: './assets/alexander.png',   probability: 0.10 },
    { name: 'Zeus',        src: './assets/zeus.jpg',        probability: 0.10 },
];

const FREEGAMES_SYMBOLS = [
    { name: 'Eye',         src: './assets/eye.png',         probability: 0.02 },
    { name: 'J',           src: './assets/J.svg',           probability: 0.14 },
    { name: 'Q',           src: './assets/Q.svg',           probability: 0.14 },
    { name: 'K',           src: './assets/K.svg',           probability: 0.12 },
    { name: 'A',           src: './assets/A.svg',           probability: 0.12 },
    { name: 'Medusa',      src: './assets/medusa.png',      probability: 0.10 },
    { name: 'Achilles',    src: './assets/achilles.png',    probability: 0.09 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.09 },
    { name: 'Archimedes',  src: './assets/archimedes.png',  probability: 0.07 },
    { name: 'Alexander',   src: './assets/alexander.png',   probability: 0.07 },
    { name: 'Zeus',        src: './assets/zeus.jpg',        probability: 0.04 },
];

const SUPERSPIN_SYMBOLS = [
    { name: 'GoldenEye',   src: './assets/golden_eye.png', probability: 0.02 },
    { name: 'Medusa',      src: './assets/medusa.png',      probability: 0.27 },
    { name: 'Achilles',    src: './assets/achilles.png',    probability: 0.25 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.21 },
    { name: 'Alexander',   src: './assets/alexander.png',   probability: 0.15 },
    { name: 'Zeus',        src: './assets/zeus.jpg',        probability: 0.10 },
];

const LINES = [
    [[0,0],[1,0],[2,0],[3,0],[4,0]], // top row
    [[0,1],[1,1],[2,1],[3,1],[4,1]], // middle row
    [[0,2],[1,2],[2,2],[3,2],[4,2]], // bottom row
    [[0,0],[1,1],[2,2],[3,1],[4,0]], // V-shape
    [[0,2],[1,1],[2,0],[3,1],[4,2]], // inverted V
    [[0,0],[1,0],[2,1],[3,2],[4,2]], // Z-shape
    [[0,2],[1,2],[2,1],[3,0],[4,0]], // inverted Z
    [[0,1],[1,0],[2,0],[3,0],[4,1]], // top arch
    [[0,1],[1,2],[2,2],[3,2],[4,1]], // bottom arch
];

const SYMBOL_PAYOUTS = {
    'J':           { 3: 1,  4: 4,   5: 20   },
    'Q':           { 3: 1,  4: 4,   5: 20   },
    'K':           { 3: 2,  4: 5,   5: 25   },
    'A':           { 3: 2,  4: 5,   5: 25   },
    'Medusa':      { 3: 6,  4: 50,  5: 250  },
    'Achilles':    { 3: 10, 4: 25,  5: 500  },
    'Aristoteles': { 3: 10, 4: 25,  5: 500  },
    'Archimedes':  { 2: 2,  3: 15,  4: 100, 5: 1000 },
    'Alexander':   { 2: 2,  3: 15,  4: 100, 5: 1000 },
    'Zeus':        { 2: 3,  3: 20,  4: 500, 5: 2000 },
};

/* ============================================================
   B — GAME STATE SINGLETON
   ============================================================ */

const GS = {
    bank: 1000,
    bet: 10,
    isSpinning: false,

    freegames:  { active: false, count: 0, total: 10, totalWin: 0, intro: false },
    powerspins: { active: false, count: 0, total: 7,  totalWin: 0, intro: false },
    superspins: { active: false, count: 0, total: 10, totalWin: 0, intro: false },

    results: [],            // REEL_COUNT × ROW_COUNT
    eyePositions: [],       // [{reel, row}] found this spin
    shiftedEyePositions: [],// shifted one reel left for next spin
    symbolSettings: {},     // [reelIndex][row] → symbolObject (sticky wilds)
    isMobile: false,        // cached once per spin

    get activeMode() {
        if (this.freegames.active)  return 'freegames';
        if (this.powerspins.active) return 'powerspins';
        if (this.superspins.active) return 'superspins';
        return 'normal';
    },

    resetSpin() {
        this.results = Array.from({ length: REEL_COUNT }, () => Array(ROW_COUNT).fill(null));
        this.eyePositions = [];
        this.shiftedEyePositions = [];
    },
};

/* ============================================================
   C — PURE UTILITIES
   ============================================================ */

function getWildName(mode) {
    return mode === 'superspins' ? 'GoldenEye' : 'Eye';
}

function getSymbolPool(mode) {
    if (mode === 'powerspins') return POWERSPIN_SYMBOLS;
    if (mode === 'freegames')  return FREEGAMES_SYMBOLS;
    if (mode === 'superspins') return SUPERSPIN_SYMBOLS;
    return SYMBOLS;
}

function getRandomSymbol(pool) {
    const rand = Math.random();
    let cum = 0;
    for (const sym of pool) {
        cum += sym.probability;
        if (rand < cum) return sym;
    }
    return pool[pool.length - 1];
}

// Finds the symbol name with highest payout at a given match count.
// Used as the fallback when an entire win line consists of wilds (Bug 4 fix).
function findHighestPayoutSymbol(count) {
    let bestName = 'Zeus', bestPayout = 0;
    for (const [name, payouts] of Object.entries(SYMBOL_PAYOUTS)) {
        const p = payouts[count] || 0;
        if (p > bestPayout) { bestPayout = p; bestName = name; }
    }
    return bestName;
}

// Pure function: returns { lineIdx → {symbolName, count, positions} }
function buildWinLines(results, wildName) {
    const wins = {};
    LINES.forEach((line, idx) => {
        let count = 0, lastSym = null;
        const pos = [];

        for (let i = 0; i < line.length; i++) {
            const [reel, row] = line[i];
            let sym = results[reel][row];

            // Resolve leading wilds: look ahead to find real symbol identity
            if (i === 0 && sym === wildName) {
                sym = resolveLeadingWilds(line, results, wildName, i);
            }

            if (i === 0 || sym === lastSym || sym === wildName) {
                if (sym !== wildName) lastSym = sym;
                count++;
                pos.push(line[i]);
            } else {
                break;
            }

            if (lastSym && count >= 2 && SYMBOL_PAYOUTS[lastSym]?.[count]) {
                wins[idx] = { symbolName: lastSym, count, positions: [...pos] };
            }
        }
    });
    return wins;
}

function resolveLeadingWilds(line, results, wildName, startIdx) {
    for (let j = startIdx + 1; j < line.length; j++) {
        const [r, w] = line[j];
        if (results[r][w] !== wildName) return results[r][w];
    }
    // Entire line is wilds — use best payout symbol (Bug 4 fix, no hardcoded 'Zeus')
    return findHighestPayoutSymbol(line.length);
}

function countSymbol(results, name) {
    let n = 0;
    for (let r = 0; r < REEL_COUNT; r++)
        for (let row = 0; row < ROW_COUNT; row++)
            if (results[r][row] === name) n++;
    return n;
}

/* ============================================================
   D — RENDERING
   ============================================================ */

function renderBank()    { document.getElementById('bank').textContent = GS.bank; }
function renderWin(amt)  { document.getElementById('win').textContent  = amt;     }

function setSpinButtonEnabled(on) {
    document.getElementById('spin-button').disabled = !on;
}

function clearHighlights() {
    document.querySelectorAll('.win-symbol').forEach(el => el.classList.remove('win-symbol'));
}

function highlightWins(positions) {
    const reels = document.getElementsByClassName('reel');
    for (const [reelIdx, rowIdx] of positions) {
        // Find the symbol DOM element that visually occupies this row
        const symEl = findSymbolAtRow(reels[reelIdx], rowIdx);
        if (symEl) symEl.firstChild.classList.add('win-symbol');
    }
}

// Finds the .symbol div whose style.top corresponds to the given visual row
function findSymbolAtRow(reelEl, row) {
    const cellVw   = GS.isMobile ? 15 : 10;
    const targetTop = row * cellVw;
    const symEls   = reelEl.getElementsByClassName('symbol');
    for (const el of symEls) {
        if (parseInt(el.style.top) === targetTop) return el;
    }
    return null;
}

function showPopup(mode) {
    const ids = { freegames: 'freegames-popup', powerspins: 'powerspins-popup', superspins: 'superspins-popup' };
    if (ids[mode]) document.getElementById(ids[mode]).style.opacity = '1';
}
function hidePopup(mode) {
    const ids = { freegames: 'freegames-popup', powerspins: 'powerspins-popup', superspins: 'superspins-popup' };
    if (ids[mode]) document.getElementById(ids[mode]).style.opacity = '0';
}
function hideAllPopups() {
    ['freegames', 'powerspins', 'superspins'].forEach(hidePopup);
}

function changeHead(mode) {
    const logo      = document.getElementById('logo');
    const logoSmall = document.getElementById('logo-small');
    const psHead    = document.getElementById('alt-head-ps');
    const fgHead    = document.getElementById('alt-head-fg');
    const ssHead    = document.getElementById('alt-head-ss');

    logo.style.display = logoSmall.style.display =
    psHead.style.display = fgHead.style.display = ssHead.style.display = 'none';

    if (mode === 'powerspins') {
        psHead.textContent   = `POWERSPIN ${GS.powerspins.count} of ${GS.powerspins.total}`;
        psHead.style.display = 'block';
    } else if (mode === 'freegames') {
        fgHead.textContent   = `FREEGAME ${GS.freegames.count} of ${GS.freegames.total}`;
        fgHead.style.display = 'block';
    } else if (mode === 'superspins') {
        ssHead.textContent   = `SUPERSPIN ${GS.superspins.count} of ${GS.superspins.total}`;
        ssHead.style.display = 'block';
    } else {
        (GS.isMobile ? logoSmall : logo).style.display = 'block';
    }
}

function updateHeadCount(mode) {
    const sep = GS.isMobile ? '/' : 'of';
    const map = {
        powerspins: ['alt-head-ps', `POWERSPIN ${GS.powerspins.count} ${sep} ${GS.powerspins.total}`],
        freegames:  ['alt-head-fg', `FREEGAME ${GS.freegames.count} ${sep} ${GS.freegames.total}`],
        superspins: ['alt-head-ss', `SUPERSPIN ${GS.superspins.count} ${sep} ${GS.superspins.total}`],
    };
    if (map[mode]) document.getElementById(map[mode][0]).textContent = map[mode][1];
}

/* ============================================================
   E — INIT
   ============================================================ */

function initReels() {
    const cellVw = GS.isMobile ? 15 : 10;
    const numSyms = ROW_COUNT + 1; // one extra buffer symbol above/below

    const reels = document.getElementsByClassName('reel');
    for (const reel of reels) {
        for (let i = 0; i < numSyms; i++) {
            const div = document.createElement('div');
            div.className  = 'symbol';
            div.style.top  = `${i * cellVw}vw`; // 0, 10, 20, 30vw

            const img = document.createElement('img');
            img.style.width  = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.display   = 'block';

            div.appendChild(img);
            reel.appendChild(div);
        }
    }
}

/* ============================================================
   E2 — CORE SPIN FLOW
   ============================================================ */

function spinReels() {
    GS.isMobile = window.matchMedia('(max-width: 930px) and (orientation: landscape)').matches;

    hideAllPopups();

    if (handleIntro()) return;

    const mode = GS.activeMode;
    if (GS.isSpinning) return;

    GS.isSpinning = true;
    setSpinButtonEnabled(false);

    if (mode === 'normal') {
        GS.bank -= Number(GS.bet);
        renderBank();
    }

    GS.resetSpin();
    clearHighlights();

    if (mode === 'freegames')  { GS.freegames.count++;  updateHeadCount('freegames');  }
    if (mode === 'powerspins') { GS.powerspins.count++; updateHeadCount('powerspins'); }
    if (mode === 'superspins') { GS.superspins.count++; updateHeadCount('superspins'); }

    // Show sticky wild overlays from previous spin (spin 2+ in freegames/superspins)
    if ((mode === 'freegames' && GS.freegames.count > 1) ||
        (mode === 'superspins' && GS.superspins.count > 1)) {
        applyPreviousWildOverlays();
    }

    const reelDelay = GS.isMobile ? 180 : 250;
    const reelEls   = Array.from(document.getElementsByClassName('reel'));
    let completed   = 0;

    setTimeout(() => {
        if ((mode === 'freegames' && GS.freegames.count > 1) ||
            (mode === 'superspins' && GS.superspins.count > 1)) {
            moveWildOverlays();
        }

        reelEls.forEach((reelEl, i) => {
            setTimeout(() => {
                animateReel(reelEl, i, () => {
                    if (mode === 'normal') {
                        GS.results[i].forEach(name => {
                            if (name === 'Eye')  playBeep();
                            if (name === 'Zeus') playClick();
                        });
                    }
                    completed++;
                    if (completed === REEL_COUNT) onAllReelsComplete();
                });
            }, i * reelDelay);
        });
    }, 250);
}

function onAllReelsComplete() {
    const mode = GS.activeMode;

    processWins();

    if (mode !== 'superspins' && mode !== 'freegames')  checkForPowerspins();
    if (mode !== 'superspins' && mode !== 'powerspins') checkForFreegames();
    if (mode !== 'superspins')                          checkForSuperspins();

    if (mode === 'freegames')  GS.freegames.totalWin  += lastSpinWin;
    if (mode === 'powerspins') GS.powerspins.totalWin += lastSpinWin;
    if (mode === 'superspins') GS.superspins.totalWin += lastSpinWin;

    if (mode === 'freegames' || mode === 'superspins') {
        shiftEyePositions();
        updateSymbolSettings();
        removeAllWildOverlays();
    }

    handleEndOfSpecialMode(mode); // Bug 5: fires at end of last spin, not on next click

    GS.isSpinning = false;
    setSpinButtonEnabled(true); // always last (Bug 6)
}

let lastSpinWin = 0;

function processWins() {
    const mode     = GS.activeMode;
    const wildName = getWildName(mode);
    const wins     = buildWinLines(GS.results, wildName);

    let total = 0;
    for (const win of Object.values(wins)) {
        total += (SYMBOL_PAYOUTS[win.symbolName][win.count] || 0) * Number(GS.bet);
        highlightWins(win.positions);
    }

    const goldenCount = countSymbol(GS.results, 'GoldenEye');
    if (goldenCount > 0) total *= goldenCount * 2;

    lastSpinWin = total;
    renderWin(total);
    GS.bank += total;
    renderBank();
}

function handleIntro() {
    for (const mode of ['freegames', 'powerspins', 'superspins']) {
        if (GS[mode].intro) {
            const descIds = { freegames: 'popup-description-fg', powerspins: 'popup-description-ps', superspins: 'popup-description-ss' };
            const winIds  = { freegames: 'freegames-win',        powerspins: 'powerspin-win',        superspins: 'superspin-win'        };
            document.getElementById(descIds[mode]).style.display = 'flex';
            document.getElementById(winIds[mode]).style.display  = 'none';
            showPopup(mode);
            GS[mode].intro = false;
            changeHead(mode);
            return true;
        }
    }
    return false;
}

function handleEndOfSpecialMode(mode) {
    if (mode === 'normal') return;
    const s = GS[mode];
    if (s.count < s.total) return;

    const descIds = { freegames: 'popup-description-fg', powerspins: 'popup-description-ps', superspins: 'popup-description-ss' };
    const winIds  = { freegames: 'freegames-win',        powerspins: 'powerspin-win',        superspins: 'superspin-win'        };

    document.getElementById(descIds[mode]).style.display = 'none';
    document.getElementById(winIds[mode]).style.display  = 'block';
    document.getElementById(winIds[mode]).textContent    = s.totalWin;
    showPopup(mode);

    s.active   = false;
    s.count    = 0;
    s.total    = mode === 'powerspins' ? 7 : 10;
    s.totalWin = 0;

    GS.symbolSettings = {};
    changeHead('default');
    document.getElementById('select-bet').disabled = false;
}

function checkForFreegames() {
    const n = countSymbol(GS.results, 'Eye');
    if (GS.freegames.active) {
        if (n > 0) GS.freegames.total += n;
    } else if (n >= 3) {
        GS.freegames.active = true;
        GS.freegames.intro  = true;
        document.getElementById('select-bet').disabled = true;
    }
}

function checkForPowerspins() {
    const n = countSymbol(GS.results, 'Zeus');
    if (GS.powerspins.active) {
        if (n >= 3) GS.powerspins.total += 3;
    } else if (n >= 3) {
        GS.powerspins.active = true;
        GS.powerspins.intro  = true;
        document.getElementById('select-bet').disabled = true;
    }
}

function checkForSuperspins() {
    const eyes  = countSymbol(GS.results, 'Eye');
    const zeus  = countSymbol(GS.results, 'Zeus');
    const gold  = countSymbol(GS.results, 'GoldenEye');
    if (GS.superspins.active) {
        if (gold > 0) GS.superspins.total += gold;
    } else if (eyes >= 3 && zeus >= 3) {
        GS.superspins.active = true;
        GS.superspins.intro  = true;
        document.getElementById('select-bet').disabled = true;
    }
}

/* ============================================================
   E3 — REEL ANIMATION
   Using 4 symbols (3 visible + 1 buffer) so all 3 rows fill cleanly.
   Per-frame delta (speed) keeps positions predictable.
   finalizeReel snaps to clean grid and sets deterministic final images.
   ============================================================ */

function animateReel(reelEl, reelIndex, onComplete) {
    const isMobile   = GS.isMobile; // cached (Bug 7)
    const cellVw     = isMobile ? 15 : 10;
    const numSyms    = ROW_COUNT + 1; // 4
    const totalVw    = numSyms * cellVw; // 40 or 60
    const speed      = 25;
    // Total distance chosen so positions land cleanly: multiple of totalVw
    const totalDist  = isMobile ? 600 : 1000; // 600=10×60, 1000=25×40
    const totalFrames = totalDist / speed;     // 24 or 40

    const mode   = GS.activeMode;
    const pool   = getSymbolPool(mode);
    let frames   = 0;
    const symEls = reelEl.getElementsByClassName('symbol');

    function frame() {
        frames++;
        for (let i = 0; i < symEls.length; i++) {
            const el     = symEls[i];
            const curTop = parseInt(el.style.top) + speed; // per-frame delta (Bug 2 fix)
            // Positive modulo to handle wrapping correctly
            const newPos = ((curTop % totalVw) + totalVw) % totalVw;
            el.style.top = `${newPos - cellVw}vw`;

            // Symbol just wrapped to top of cycle: assign random image (visual blur effect)
            if (newPos < cellVw) {
                const sym = getRandomSymbol(pool);
                el.firstChild.src          = sym.src;
                el.firstChild.dataset.name = sym.name;
            }
        }

        if (frames < totalFrames) {
            requestAnimationFrame(frame);
        } else {
            finalizeReel(reelEl, reelIndex, pool, mode, onComplete);
        }
    }

    frame();
}

// After animation: snap to clean grid, set deterministic final symbols, log results.
function finalizeReel(reelEl, reelIndex, pool, mode, onComplete) {
    const isMobile  = GS.isMobile;
    const cellVw    = isMobile ? 15 : 10;
    const wildName  = getWildName(mode);

    // Sort symbol elements by current top value
    const symEls = Array.from(reelEl.getElementsByClassName('symbol'));
    symEls.sort((a, b) => parseInt(a.style.top) - parseInt(b.style.top));

    // After totalDist frames the layout is:
    //   symEls[0] at -cellVw (hidden buffer above reel)
    //   symEls[1] at 0       (row 0)
    //   symEls[2] at cellVw  (row 1)
    //   symEls[3] at 2×cellVw(row 2)
    // Assign final symbols to the 3 visible positions
    const finalSymbols = [];
    for (let row = 0; row < ROW_COUNT; row++) {
        const locked = GS.symbolSettings[reelIndex]?.[row];
        const sym    = (locked && (mode === 'freegames' || mode === 'superspins'))
            ? locked
            : getRandomSymbol(pool);
        finalSymbols.push(sym);

        const el = symEls[row + 1]; // +1 skips the buffer symbol
        el.style.top               = `${row * cellVw}vw`;
        el.firstChild.src          = sym.src;
        el.firstChild.dataset.name = sym.name;
    }

    // Park buffer symbol above the reel (hidden)
    symEls[0].style.top               = `${-cellVw}vw`;
    symEls[0].firstChild.dataset.name = '';

    // Store results and track wild positions
    GS.results[reelIndex] = finalSymbols.map(s => s.name);
    finalSymbols.forEach((sym, row) => {
        if (sym.name === wildName) {
            GS.eyePositions.push({ reel: reelIndex, row });
        }
    });

    onComplete();
}

/* ============================================================
   E4 — STICKY WILD OVERLAYS
   ============================================================ */

function applyPreviousWildOverlays() {
    const mode     = GS.activeMode;
    const wildName = getWildName(mode);
    const wildEls  = document.querySelectorAll(`[data-name="${wildName}"]`);
    wildEls.forEach(img => createStickyWildOverlay(img, mode));
}

// Creates a fixed-position image overlay over a sticky wild.
// Reel 0 is intentionally excluded: wilds there would shift off the left edge
// on the next spin, so there is no valid target position for the overlay.
function createStickyWildOverlay(imgElement, mode) {
    const reelEl = imgElement.closest('.reel');
    if (!reelEl) return;

    const allReels  = Array.from(reelEl.parentElement.querySelectorAll('.reel'));
    const reelIndex = allReels.indexOf(reelEl);
    if (reelIndex < 1) return; // reel 0 excluded (see comment above)

    // Determine visual row from style.top
    const isMobile  = GS.isMobile;
    const cellVw    = isMobile ? 15 : 10;
    const topVal    = parseInt(imgElement.parentElement.style.top);
    const row       = Math.round(topVal / cellVw);
    if (row < 0 || row >= ROW_COUNT) return; // hidden buffer symbol

    const overlay = document.createElement('img');
    overlay.className = 'eye-overlay';
    overlay.src       = mode === 'superspins' ? './assets/golden_eye.png' : './assets/eye.png';

    const rect = imgElement.getBoundingClientRect();
    overlay.style.position = 'fixed';
    overlay.style.top      = `${rect.top}px`;
    overlay.style.left     = `${rect.left}px`;
    overlay.style.width    = `${rect.width}px`;
    overlay.style.height   = `${rect.height}px`;
    overlay.style.zIndex   = '999';

    imgElement.src = ''; // hide underlying image while overlay covers it
    document.body.appendChild(overlay);
}

function moveWildOverlays() {
    const shiftVw = GS.isMobile ? '-15vw' : '-10vw';
    document.querySelectorAll('.eye-overlay').forEach(overlay => {
        // Bug 3 fix: single threshold computed from cached isMobile
        overlay.style.transform = 'translateX(0)';
        void overlay.offsetWidth; // force reflow so transition fires from zero
        overlay.style.transition = 'transform 0.5s ease';
        overlay.style.transform  = `translateX(${shiftVw})`;
    });
}

function removeAllWildOverlays() {
    document.querySelectorAll('.eye-overlay').forEach(el => el.remove());
}

function shiftEyePositions() {
    // Reel 0 wilds fall off the left edge — exclude them
    GS.shiftedEyePositions = GS.eyePositions
        .filter(p => p.reel > 0)
        .map(p => ({ reel: p.reel - 1, row: p.row }));
}

function updateSymbolSettings() {
    const mode     = GS.activeMode;
    const wildName = getWildName(mode);
    const pool     = getSymbolPool(mode);
    const wildSym  = pool.find(s => s.name === wildName);
    if (!wildSym) return;

    // Rebuild atomically — no stale partial state (Bug 8 fix)
    GS.symbolSettings = {};
    GS.shiftedEyePositions.forEach(({ reel, row }) => {
        if (!GS.symbolSettings[reel]) GS.symbolSettings[reel] = {};
        GS.symbolSettings[reel][row] = wildSym;
    });
}

/* ============================================================
   E5 — SOUNDS
   ============================================================ */

function playBeep()  { new Audio('./assets/beep.mp3').play().catch(() => {}); }
function playClick() { new Audio('./assets/click.mp3').play().catch(() => {}); }

/* ============================================================
   F — EVENT WIRING
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    GS.isMobile = window.matchMedia('(max-width: 930px) and (orientation: landscape)').matches;

    initReels();

    document.getElementById('spin-button').addEventListener('click', spinReels);

    document.addEventListener('keydown', e => {
        if ((e.key === ' ' || e.keyCode === 32) && !GS.isSpinning) spinReels();
    });

    document.getElementById('select-bet').addEventListener('change', e => {
        GS.bet = Number(e.target.value);
    });

    document.getElementById('guide-button').addEventListener('click', () => {
        const guide = document.getElementById('guide');
        guide.style.opacity = '1';
        guide.style.zIndex  = '2000';
        setSpinButtonEnabled(false);
    });

    document.getElementById('close-guide').addEventListener('click', () => {
        const guide = document.getElementById('guide');
        guide.style.opacity = '0';
        guide.style.zIndex  = '-1000';
        if (!GS.isSpinning) setSpinButtonEnabled(true);
    });
});

})();
