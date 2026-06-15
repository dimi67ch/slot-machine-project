import { ROW_COUNT } from './constants.js?v=20260615-10';
import { GS } from './state.js?v=20260615-10';
import { spinReels } from './spin.js?v=20260615-10';
import { changeHead, setSpinButtonEnabled } from './rendering.js?v=20260615-10';
import { getCellVw, isCompactScreen, normalizeReelSymbolTops } from './utils.js?v=20260615-10';

function renderGuidePayouts() {
    document.querySelectorAll('.guide-payout').forEach(el => {
        const multiplier = Number(el.dataset.multiplier || 0);
        const total = Number(GS.bet) * multiplier;
        el.textContent = `${total}`;
    });
}

function fitGuideToViewport() {
    const guide = document.getElementById('guide');
    const frame = document.getElementById('guide-scale-frame');
    const sheet = document.getElementById('guide-sheet');
    if (!guide || !frame || !sheet) return;

    const guideIsOpen = Number.parseFloat(getComputedStyle(guide).opacity) > 0;
    if (!guideIsOpen) return;

    frame.style.width = '';
    frame.style.height = '';
    sheet.style.transform = 'scale(1)';

    const availableWidth = window.innerWidth - 56;
    const availableHeight = window.innerHeight - 56;
    const naturalWidth = sheet.scrollWidth;
    const naturalHeight = sheet.scrollHeight;

    if (!naturalWidth || !naturalHeight) return;

    const scale = Math.min(
        availableWidth / naturalWidth,
        availableHeight / naturalHeight,
        1
    );

    frame.style.width = `${naturalWidth * scale}px`;
    frame.style.height = `${naturalHeight * scale}px`;
    sheet.style.transform = `scale(${scale})`;
}

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
    renderGuidePayouts();
    changeHead('default');

    window.addEventListener('orientationchange', () => {
        window.setTimeout(() => {
            GS.isMobile = isCompactScreen();
            if (GS.isSpinning) return;
            normalizeReelSymbolTops();
            fitGuideToViewport();
        }, 150);
    });

    window.addEventListener('resize', fitGuideToViewport);

    document.getElementById('spin-button').addEventListener('click', spinReels);

    document.addEventListener('keydown', e => {
        if ((e.key === ' ' || e.keyCode === 32) && !GS.isSpinning) spinReels();
    });

    document.getElementById('select-bet').addEventListener('change', e => {
        GS.bet = Number(e.target.value);
        renderGuidePayouts();
    });

    document.getElementById('guide-button').addEventListener('click', () => {
        const guide = document.getElementById('guide');
        renderGuidePayouts();
        guide.style.opacity = '1';
        guide.style.zIndex  = '2000';
        setSpinButtonEnabled(false);
        requestAnimationFrame(() => {
            requestAnimationFrame(fitGuideToViewport);
        });
    });

    document.getElementById('close-guide').addEventListener('click', () => {
        const guide = document.getElementById('guide');
        guide.style.opacity = '0';
        guide.style.zIndex  = '-1000';
        document.getElementById('guide-scale-frame').style.width = '';
        document.getElementById('guide-scale-frame').style.height = '';
        document.getElementById('guide-sheet').style.transform = 'scale(1)';
        if (!GS.isSpinning) setSpinButtonEnabled(true);
    });
});
