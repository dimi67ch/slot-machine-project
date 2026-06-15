import { GS } from './state.js?v=20260615-4';
import { countSymbol } from './utils.js?v=20260615-4';
import { animateAddedSpins, showPopup, changeHead } from './rendering.js?v=20260615-4';

export function handleIntro() {
    for (const mode of ['freegames', 'powerspins', 'superspins']) {
        if (GS[mode].intro) {
            showPopup(mode, 'intro');
            GS[mode].intro = false;
            changeHead(mode);
            return true;
        }
    }
    return false;
}

export function handleEndOfSpecialMode(mode) {
    if (mode === 'normal') return;
    const s = GS[mode];
    if (s.count < s.total) return;
    showPopup(mode, 'summary', s.totalWin);

    s.active   = false;
    s.count    = 0;
    s.total    = mode === 'powerspins' ? 7 : 10;
    s.totalWin = 0;

    GS.symbolSettings = {};
    changeHead('default');
    document.getElementById('select-bet').disabled = false;
}

export function checkForFreegames() {
    const n = countSymbol(GS.results, 'Eye');
    if (GS.freegames.active) {
        if (n > 0) {
            GS.freegames.total += 1;
            animateAddedSpins('freegames', 1);
        }
    } else if (n >= 3) {
        GS.freegames.active = true;
        GS.freegames.intro  = true;
        document.getElementById('select-bet').disabled = true;
    }
}

export function checkForPowerspins() {
    const n = countSymbol(GS.results, 'Zeus');
    if (GS.powerspins.active) {
        if (n >= 3) {
            GS.powerspins.total += 3;
            animateAddedSpins('powerspins', 3);
        }
    } else if (n >= 3) {
        GS.powerspins.active = true;
        GS.powerspins.intro  = true;
        document.getElementById('select-bet').disabled = true;
    }
}

export function checkForSuperspins() {
    const eyes = countSymbol(GS.results, 'Eye');
    const zeus = countSymbol(GS.results, 'Zeus');
    const gold = countSymbol(GS.results, 'GoldenEye');
    if (GS.superspins.active) {
        if (gold > 0) {
            GS.superspins.total += gold;
            animateAddedSpins('superspins', gold);
        }
    } else if (eyes >= 3 && zeus >= 3) {
        GS.superspins.active = true;
        GS.superspins.intro  = true;
        document.getElementById('select-bet').disabled = true;
    }
}
