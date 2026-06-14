import { GS } from './state.js';
import { getCellVw } from './utils.js';

export function renderBank()    { document.getElementById('bank').textContent = GS.bank; }
export function renderWin(amt)  { document.getElementById('win').textContent  = amt;     }

export function setSpinButtonEnabled(on) {
    document.getElementById('spin-button').disabled = !on;
}

export function clearHighlights() {
    document.querySelectorAll('.win-symbol').forEach(el => el.classList.remove('win-symbol'));
}

// Finds the .symbol div that visually occupies the given row in a reel element
function findSymbolAtRow(reelEl, row) {
    const cellVw    = getCellVw();
    const targetTop = row * cellVw;
    const symEls    = reelEl.getElementsByClassName('symbol');
    for (const el of symEls) {
        if (Math.abs(parseFloat(el.style.top) - targetTop) < 0.01) return el;
    }
    return null;
}

export function highlightWins(positions) {
    const reels = document.getElementsByClassName('reel');
    for (const [reelIdx, rowIdx] of positions) {
        const symEl = findSymbolAtRow(reels[reelIdx], rowIdx);
        if (symEl) symEl.firstChild.classList.add('win-symbol');
    }
}

export function showPopup(mode) {
    const ids = { freegames: 'freegames-popup', powerspins: 'powerspins-popup', superspins: 'superspins-popup' };
    if (ids[mode]) document.getElementById(ids[mode]).style.opacity = '1';
}

export function hidePopup(mode) {
    const ids = { freegames: 'freegames-popup', powerspins: 'powerspins-popup', superspins: 'superspins-popup' };
    if (ids[mode]) document.getElementById(ids[mode]).style.opacity = '0';
}

export function hideAllPopups() {
    ['freegames', 'powerspins', 'superspins'].forEach(hidePopup);
}

export function changeHead(mode) {
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

export function updateHeadCount(mode) {
    const sep = GS.isMobile ? '/' : 'of';
    const map = {
        powerspins: ['alt-head-ps', `POWERSPIN ${GS.powerspins.count} ${sep} ${GS.powerspins.total}`],
        freegames:  ['alt-head-fg', `FREEGAME ${GS.freegames.count} ${sep} ${GS.freegames.total}`],
        superspins: ['alt-head-ss', `SUPERSPIN ${GS.superspins.count} ${sep} ${GS.superspins.total}`],
    };
    if (map[mode]) document.getElementById(map[mode][0]).textContent = map[mode][1];
}
