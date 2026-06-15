import { ROW_COUNT } from './constants.js?v=20260615-4';
import { GS } from './state.js?v=20260615-4';
import { getCellVw, getWildName, getSymbolPool } from './utils.js?v=20260615-4';

function findSymbolAtRow(reelEl, row) {
    const cellVw = getCellVw();
    const targetTop = row * cellVw;
    return Array.from(reelEl.getElementsByClassName('symbol'))
        .find(el => Math.abs(parseFloat(el.style.top) - targetTop) < 0.01) || null;
}

export function applyPreviousWildOverlays() {
    const mode     = GS.activeMode;
    const wildName = getWildName(mode);
    const wildEls  = document.querySelectorAll(`[data-name="${wildName}"]`);
    wildEls.forEach(img => createStickyWildOverlay(img, mode));
}

// Creates a fixed-position overlay over a sticky wild symbol.
// Reel 0 is excluded: wilds there shift off the left edge on the next spin.
export function createStickyWildOverlay(imgElement, mode) {
    const reelEl = imgElement.closest('.reel');
    if (!reelEl) return;

    const allReels  = Array.from(reelEl.parentElement.querySelectorAll('.reel'));
    const reelIndex = allReels.indexOf(reelEl);
    if (reelIndex < 1) return;

    const cellVw   = getCellVw();
    const topVal   = parseFloat(imgElement.parentElement.style.top);
    const row      = Math.round(topVal / cellVw);
    if (row < 0 || row >= ROW_COUNT) return;

    const overlay = document.createElement('img');
    overlay.className = 'eye-overlay';
    overlay.src       = mode === 'superspins' ? './assets/golden_eye.png' : './assets/eye.png';
    overlay.dataset.reel = String(reelIndex);
    overlay.dataset.row  = String(row);

    const rect = imgElement.getBoundingClientRect();
    overlay.style.position = 'fixed';
    overlay.style.top      = `${rect.top}px`;
    overlay.style.left     = `${rect.left}px`;
    overlay.style.width    = `${rect.width}px`;
    overlay.style.height   = `${rect.height}px`;
    overlay.style.zIndex   = '999';

    document.body.appendChild(overlay);
}

export function moveWildOverlays() {
    const reels = Array.from(document.getElementsByClassName('reel'));

    document.querySelectorAll('.eye-overlay').forEach(overlay => {
        const reelIndex = Number(overlay.dataset.reel);
        const row       = Number(overlay.dataset.row);
        const targetReel = reels[reelIndex - 1];
        if (!targetReel) return;

        const targetSymbol = findSymbolAtRow(targetReel, row);
        if (!targetSymbol) return;

        const targetRect  = targetSymbol.getBoundingClientRect();
        const targetTop   = targetRect.top;
        const targetLeft  = targetRect.left;
        const startTop   = parseFloat(overlay.style.top);
        const startLeft  = parseFloat(overlay.style.left);
        const duration   = 360;

        overlay.classList.remove('eye-overlay--landed');
        overlay.getAnimations().forEach(animation => animation.cancel());
        overlay.style.transition = 'none';
        overlay.style.left       = `${startLeft}px`;
        overlay.style.top        = `${startTop}px`;
        overlay.style.opacity    = '1';
        overlay.style.transform  = 'translate3d(0, 0, 0) scale(1)';

        requestAnimationFrame(() => {
            overlay.style.transition = [
                `left ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                `top ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                'opacity 180ms linear'
            ].join(', ');
            overlay.style.left      = `${targetLeft}px`;
            overlay.style.top       = `${targetTop}px`;
        });
    });
}

export function removeAllWildOverlays() {
    document.querySelectorAll('.eye-overlay').forEach(el => el.remove());
}

export function shiftEyePositions() {
    GS.shiftedEyePositions = GS.eyePositions
        .filter(p => p.reel > 0)
        .map(p => ({ reel: p.reel - 1, row: p.row }));
}

// Rebuilds symbolSettings atomically from shiftedEyePositions (Bug 8 fix).
export function updateSymbolSettings() {
    const mode     = GS.activeMode;
    const wildName = getWildName(mode);
    const pool     = getSymbolPool(mode);
    const wildSym  = pool.find(s => s.name === wildName);
    if (!wildSym) return;

    GS.symbolSettings = {};
    GS.shiftedEyePositions.forEach(({ reel, row }) => {
        if (!GS.symbolSettings[reel]) GS.symbolSettings[reel] = {};
        GS.symbolSettings[reel][row] = wildSym;
    });
}
