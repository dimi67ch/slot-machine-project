import { SYMBOLS, POWERSPIN_SYMBOLS, FREEGAMES_SYMBOLS, SUPERSPIN_SYMBOLS,
         LINES, SYMBOL_PAYOUTS, REEL_COUNT, ROW_COUNT } from './constants.js?v=20260615-4';

export function isCompactScreen() {
    return window.matchMedia('(max-width: 930px)').matches;
}

export function getCellVw() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--symbol-h');
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : (isCompactScreen() ? 15 : 10);
}

export function normalizeReelSymbolTops() {
    const cellVw = getCellVw();
    const reels = document.getElementsByClassName('reel');

    for (const reel of reels) {
        const symEls = Array.from(reel.getElementsByClassName('symbol'))
            .sort((a, b) => parseFloat(a.style.top || '0') - parseFloat(b.style.top || '0'));

        symEls.forEach((el, idx) => {
            el.style.transition = '';
            el.style.transform = '';
            el.style.top = `${(idx - 1) * cellVw}vw`;
        });
    }
}

export function getWildName(mode) {
    return mode === 'superspins' ? 'GoldenEye' : 'Eye';
}

export function getSymbolPool(mode) {
    if (mode === 'powerspins') return POWERSPIN_SYMBOLS;
    if (mode === 'freegames')  return FREEGAMES_SYMBOLS;
    if (mode === 'superspins') return SUPERSPIN_SYMBOLS;
    return SYMBOLS;
}

export function getRandomSymbol(pool) {
    const rand = Math.random();
    let cum = 0;
    for (const sym of pool) {
        cum += sym.probability;
        if (rand < cum) return sym;
    }
    return pool[pool.length - 1];
}

// Finds the symbol with the highest payout at a given match count.
// Used as fallback when an entire win line consists of wilds (Bug 4 fix).
export function findHighestPayoutSymbol(count) {
    let bestName = 'Zeus', bestPayout = 0;
    for (const [name, payouts] of Object.entries(SYMBOL_PAYOUTS)) {
        const p = payouts[count] || 0;
        if (p > bestPayout) { bestPayout = p; bestName = name; }
    }
    return bestName;
}

function resolveLeadingWilds(line, results, wildName, startIdx) {
    for (let j = startIdx + 1; j < line.length; j++) {
        const [r, w] = line[j];
        if (results[r][w] !== wildName) return results[r][w];
    }
    return findHighestPayoutSymbol(line.length);
}

// Pure function: returns { lineIdx → {symbolName, count, positions} }
export function buildWinLines(results, wildName) {
    const wins = {};
    LINES.forEach((line, idx) => {
        let count = 0, lastSym = null;
        const pos = [];

        for (let i = 0; i < line.length; i++) {
            const [reel, row] = line[i];
            let sym = results[reel][row];

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

export function countSymbol(results, name) {
    let n = 0;
    for (let r = 0; r < REEL_COUNT; r++)
        for (let row = 0; row < ROW_COUNT; row++)
            if (results[r][row] === name) n++;
    return n;
}

export function getSymbolByName(name) {
    return [
        ...SYMBOLS,
        ...POWERSPIN_SYMBOLS,
        ...FREEGAMES_SYMBOLS,
        ...SUPERSPIN_SYMBOLS,
    ].find(symbol => symbol.name === name) || null;
}
