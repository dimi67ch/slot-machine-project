import { ROW_COUNT } from './constants.js';
import { GS } from './state.js';
import { spinReels } from './spin.js';
import { setSpinButtonEnabled } from './rendering.js';
import { getCellVw, isCompactScreen, normalizeReelSymbolTops } from './utils.js';

function initReels() {
    const cellVw  = getCellVw();
    const numSyms = ROW_COUNT + 1;

    const reels = document.getElementsByClassName('reel');
    for (const reel of reels) {
        for (let i = 0; i < numSyms; i++) {
            const div = document.createElement('div');
            div.className  = 'symbol';
            div.style.top  = `${i * cellVw}vw`;

            const img = document.createElement('img');
            img.style.width      = '100%';
            img.style.height     = '100%';
            img.style.objectFit  = 'cover';
            img.style.display    = 'block';

            div.appendChild(img);
            reel.appendChild(div);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    GS.isMobile = isCompactScreen();

    initReels();
    normalizeReelSymbolTops();

    window.addEventListener('orientationchange', () => {
        window.setTimeout(() => {
            GS.isMobile = isCompactScreen();
            if (GS.isSpinning) return;
            normalizeReelSymbolTops();
        }, 150);
    });

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
