import { REEL_COUNT, SYMBOL_PAYOUTS } from './constants.js';
import { GS } from './state.js';
import { getCellVw, getSymbolByName, getWildName, buildWinLines, countSymbol, isCompactScreen } from './utils.js';
import { renderWin, renderBank, setSpinButtonEnabled, clearHighlights,
         highlightWins, hideAllPopups, updateHeadCount } from './rendering.js';
import { animateReel } from './animation.js';
import { applyPreviousWildOverlays, moveWildOverlays, removeAllWildOverlays,
         shiftEyePositions, updateSymbolSettings } from './wilds.js';
import { handleIntro, handleEndOfSpecialMode,
         checkForFreegames, checkForPowerspins, checkForSuperspins } from './bonuses.js';
import { playBeep, playClick } from './sounds.js';

let lastSpinWin = 0;

function syncVisibleSymbolsToResults() {
    const reels = Array.from(document.getElementsByClassName('reel'));
    const cellVw = getCellVw();

    for (let reelIndex = 0; reelIndex < GS.results.length; reelIndex++) {
        const reel = reels[reelIndex];
        if (!reel) continue;

        for (let row = 0; row < GS.results[reelIndex].length; row++) {
            const name = GS.results[reelIndex][row];
            const symbol = getSymbolByName(name);
            if (!symbol) continue;

            const symEl = Array.from(reel.getElementsByClassName('symbol'))
                .find(el => Math.abs(parseFloat(el.style.top) - row * cellVw) < 0.01);
            if (!symEl?.firstChild) continue;

            symEl.firstChild.src = symbol.src;
            symEl.firstChild.dataset.name = symbol.name;
            symEl.firstChild.style.opacity = '';
        }
    }
}

export function spinReels() {
    GS.isMobile = isCompactScreen();

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

    handleEndOfSpecialMode(mode);
    syncVisibleSymbolsToResults();
    requestAnimationFrame(syncVisibleSymbolsToResults);

    GS.isSpinning = false;
    setSpinButtonEnabled(true); // always last (Bug 6)
}

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
