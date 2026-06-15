import { GS } from './state.js?v=20260615-4';
import { getCellVw } from './utils.js?v=20260615-4';

const MODE_META = {
    freegames: {
        title: 'FREEGAMES',
        award: 'FREEGAME',
        accent: 'gold',
        introMarkup: `
            <div class="popup-description">
                <img src="./assets/eye.png" alt="Eye">
                <div>Sticky Wild</div>
            </div>
        `,
    },
    powerspins: {
        title: 'POWERSPINS',
        award: 'POWERSPIN',
        accent: 'blue',
        introMarkup: `
            <div class="popup-description">
                <div class="popup-description-img">
                    <img src="./assets/medusa.png" alt="Medusa">
                    <img src="./assets/achilles.png" alt="Achilles">
                    <img src="./assets/aristoteles.png" alt="Aristoteles">
                    <img src="./assets/alexander.png" alt="Alexander">
                    <img src="./assets/zeus.jpg" alt="Zeus">
                </div>
                <div>remain</div>
            </div>
        `,
    },
    superspins: {
        title: 'SUPERSPINS',
        award: 'SUPERSPIN',
        accent: 'gold',
        introMarkup: `
            <div class="popup-description">
                <div class="popup-description-img">
                    <img src="./assets/eye.png" alt="Eye">
                    <div>&#9866;</div>
                    <div>TURNS TO</div>
                    <div>&rightarrow;</div>
                    <img src="./assets/golden_eye.png" alt="Golden Eye">
                </div>
                <div>Sticky Wild &amp; Total Wins x2</div>
            </div>
        `,
    },
};

let awardHideTimer = 0;

export function renderBank()    { document.getElementById('bank').textContent = GS.bank; }
export function renderWin(amt)  { document.getElementById('win').textContent  = amt;     }

export function setSpinButtonEnabled(on) {
    document.getElementById('spin-button').disabled = !on;
}

export function clearHighlights() {
    document.querySelectorAll('.win-symbol').forEach(el => el.classList.remove('win-symbol'));
    document.querySelectorAll('.reel.has-win').forEach(el => el.classList.remove('has-win'));
}

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
        if (reels[reelIdx]) reels[reelIdx].classList.add('has-win');
    }
}

function buildPopupMarkup(mode, variant, value = 0) {
    const meta = MODE_META[mode];
    if (!meta) return '';

    const body = variant === 'summary'
        ? `<p class="bonus-popup-win">${value}</p>`
        : meta.introMarkup;

    return `
        <div class="bonus-popup glass-modal" data-popup-mode="${mode}" data-popup-variant="${variant}">
            <h2>${meta.title}</h2>
            ${body}
        </div>
    `;
}

export function showPopup(mode, variant = 'intro', value = 0) {
    hidePopup(mode);
    document.body.insertAdjacentHTML('beforeend', buildPopupMarkup(mode, variant, value));
}

export function hidePopup(mode) {
    document.querySelector(`.bonus-popup[data-popup-mode="${mode}"]`)?.remove();
}

export function hideAllPopups() {
    document.querySelectorAll('.bonus-popup').forEach(el => el.remove());
}

function getModeView(mode) {
    const meta = MODE_META[mode];
    if (!meta) return null;

    const state = GS[mode];
    const played = Math.min(state.count, state.total);
    const left = Math.max(state.total - state.count, 0);
    const progressSep = GS.isMobile ? '/' : ' of ';
    const detailSep = GS.isMobile ? ' · ' : ' • ';

    return {
        ...meta,
        progress: `${played}${progressSep}${state.total}`,
        detail: `${left} left${detailSep}Win ${state.totalWin}`,
    };
}

function renderModePanel(mode) {
    const panel = document.getElementById('mode-panel');
    const title = document.getElementById('mode-panel-title');
    const progress = document.getElementById('mode-panel-progress');
    const detail = document.getElementById('mode-panel-detail');
    const view = getModeView(mode);

    panel.classList.toggle('is-visible', Boolean(view));
    panel.dataset.mode = view?.accent || 'default';

    if (!view) {
        title.textContent = '';
        progress.textContent = '';
        detail.textContent = '';
        return;
    }

    title.textContent = view.title;
    progress.textContent = view.progress;
    detail.textContent = view.detail;
}

export function changeHead(mode) {
    const logo      = document.getElementById('logo');
    const logoSmall = document.getElementById('logo-small');
    const psHead    = document.getElementById('alt-head-ps');
    const fgHead    = document.getElementById('alt-head-fg');
    const ssHead    = document.getElementById('alt-head-ss');

    logo.style.display = logoSmall.style.display =
    psHead.style.display = fgHead.style.display = ssHead.style.display = 'none';

    renderModePanel(mode);

    if (mode === 'default' || mode === 'normal') {
        (GS.isMobile ? logoSmall : logo).style.display = 'block';
    }
}

export function updateHeadCount(mode) {
    renderModePanel(mode);
}

export function setReelSpinState(reelEl, state) {
    if (!reelEl) return;
    reelEl.classList.remove('is-spinning', 'is-settling');

    if (state === 'spinning') {
        reelEl.classList.add('is-spinning');
        return;
    }

    if (state === 'settling') {
        reelEl.classList.add('is-settling');
    }
}

export function animateAddedSpins(mode, amount) {
    if (!amount) return;

    updateHeadCount(mode);

    const meta = MODE_META[mode];
    if (!meta) return;

    document.querySelector('.spin-award-pop')?.remove();

    const pop = document.createElement('div');
    pop.className = 'spin-award-pop is-active';
    pop.dataset.mode = meta.accent;
    pop.textContent = `+${amount} ${meta.award}${amount > 1 ? 'S' : ''}`;
    document.body.appendChild(pop);

    window.clearTimeout(awardHideTimer);
    awardHideTimer = window.setTimeout(() => pop.remove(), 1450);
}
