import { ROW_COUNT } from './constants.js?v=20260615-4';
import { GS } from './state.js?v=20260615-4';
import { setReelSpinState } from './rendering.js?v=20260615-4';
import { getCellVw, getWildName, getSymbolPool, getRandomSymbol } from './utils.js?v=20260615-4';

export function animateReel(reelEl, reelIndex, onComplete) {
    const cellVw   = getCellVw();
    const numSyms  = ROW_COUNT + 1;
    const totalVw  = numSyms * cellVw;
    const mode     = GS.activeMode;
    const pool     = getSymbolPool(mode);

    setReelSpinState(reelEl, 'spinning');

    const ACCEL   = 150;
    const SPIN    = 380 + reelIndex * 90;  // cascade: each reel slightly longer
    const DECEL   = 580;
    const TOTAL   = ACCEL + SPIN + DECEL;
    const baseDistance = 0.32 * (ACCEL / 3 + SPIN + DECEL / 5);
    const targetDistance = Math.round(baseDistance / cellVw) * cellVw;
    const spinSteps = Math.round(targetDistance / cellVw);
    const MAX_SPD = targetDistance / (ACCEL / 3 + SPIN + DECEL / 5);

    const symEls = Array.from(reelEl.getElementsByClassName('symbol'));

    // Convert each symbol from top-based to transform-based positioning.
    // cyclePos[i] is the position in the 0..totalVw cycle:
    //   ≈ 0          → buffer (hidden above reel)
    //   ≈ cellVw     → row 0
    //   ≈ 2*cellVw   → row 1
    //   ≈ 3*cellVw   → row 2
    const startPos = symEls.map(el => {
        const raw = parseFloat(el.style.top) + cellVw;
        const pos = ((raw % totalVw) + totalVw) % totalVw;
        el.style.top       = '0';
        el.style.transform = `translateY(${pos - cellVw}vw)`;
        return pos;
    });
    const cyclePos = [...startPos];
    const orderedAtStart = symEls
        .map((el, i) => ({ el, pos: startPos[i] }))
        .sort((a, b) => a.pos - b.pos);

    const reelStrip = orderedAtStart.map(({ el }) => {
        const name = el.firstChild.dataset.name;
        return pool.find(s => s.name === name) || getRandomSymbol(pool);
    });

    while (reelStrip.length < numSyms + spinSteps + 1) {
        reelStrip.push(getRandomSymbol(pool));
    }

    orderedAtStart.forEach(({ el }, idx) => {
        const sym = reelStrip[idx];
        el.firstChild.src = sym.src;
        el.firstChild.dataset.name = sym.name;
    });

    let stripCursor = numSyms;

    let t0 = null;
    let prevDist = 0;

    function getDistance(elapsed) {
        const t = Math.min(elapsed, TOTAL);

        if (t <= ACCEL) {
            return MAX_SPD * (t * t * t) / (3 * ACCEL * ACCEL);
        }

        const accelDistance = MAX_SPD * ACCEL / 3;

        if (t <= ACCEL + SPIN) {
            return accelDistance + MAX_SPD * (t - ACCEL);
        }

        const decelElapsed = t - ACCEL - SPIN;
        const p = decelElapsed / DECEL;
        const decelDistance = MAX_SPD * DECEL * (1 - Math.pow(1 - p, 5)) / 5;

        return accelDistance + MAX_SPD * SPIN + decelDistance;
    }

    function frame(ts) {
        if (t0 === null) t0 = ts;
        const elapsed = ts - t0;
        const dist = elapsed < TOTAL ? getDistance(elapsed) : targetDistance;

        for (let i = 0; i < symEls.length; i++) {
            const start = startPos[i];
            const prevWraps = Math.floor((start + prevDist) / totalVw);
            const nextWraps = Math.floor((start + dist) / totalVw);
            let next = ((start + dist) % totalVw + totalVw) % totalVw;
            if (Math.abs(next - totalVw) < 0.0001 || next > totalVw - 0.0001) next = 0;
            symEls[i].style.transform = `translateY(${next - cellVw}vw)`;

            // Symbol crossed the wrap boundary → advance through the
            // precomputed reel strip so the spin stays visually consistent.
            for (let wrap = prevWraps; wrap < nextWraps; wrap++) {
                const sym = reelStrip[stripCursor++] || getRandomSymbol(pool);
                symEls[i].firstChild.src          = sym.src;
                symEls[i].firstChild.dataset.name = sym.name;
            }

            cyclePos[i] = next;
        }

        prevDist = dist;

        if (elapsed < TOTAL) {
            requestAnimationFrame(frame);
        } else {
            finalize();
        }
    }

    function finalize() {
        const wildName  = getWildName(mode);
        setReelSpinState(reelEl, 'settling');

        // Sort by cyclePos: index 0 = buffer, 1-3 = rows 0-2
        const order = symEls
            .map((el, i) => ({ el, pos: cyclePos[i] }))
            .sort((a, b) => a.pos - b.pos);

        // Determine final symbols from what is actually visible at the end of
        // the spin. The reel strip keeps the spin visually consistent while
        // this step prevents a last-moment symbol swap on settle.
        const finalSymbols = [];
        for (let row = 0; row < ROW_COUNT; row++) {
            const el = order[row + 1].el;
            const locked = GS.symbolSettings[reelIndex]?.[row];
            const sym = (locked && (mode === 'freegames' || mode === 'superspins'))
                ? locked
                : (pool.find(s => s.name === el.firstChild.dataset.name) || getRandomSymbol(pool));
            finalSymbols.push(sym);
        }

        // Commit game state immediately (before settle delay)
        GS.results[reelIndex] = finalSymbols.map(s => s.name);
        finalSymbols.forEach((sym, row) => {
            if (sym.name === wildName) GS.eyePositions.push({ reel: reelIndex, row });
        });

        // The total travel distance ends on an exact symbol grid step, so we
        // can switch back to top-based positioning without any settle phase.
        order[0].el.style.transition = '';
        order[0].el.style.transform  = '';
        order[0].el.style.top        = `${-cellVw}vw`;
        order[0].el.firstChild.dataset.name = '';

        for (let row = 0; row < ROW_COUNT; row++) {
            const el = order[row + 1].el;
            const sym = finalSymbols[row];
            el.firstChild.src = sym.src;
            el.firstChild.dataset.name = sym.name;
            el.style.transition = '';
            el.style.transform  = '';
            el.style.top        = `${row * cellVw}vw`;
        }

        window.setTimeout(() => reelEl.classList.remove('is-settling'), 260);
        onComplete();
    }

    requestAnimationFrame(frame);
}
