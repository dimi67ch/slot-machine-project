import { GS } from './state.js';
import { countSymbol } from './utils.js';
import { showPopup, changeHead } from './rendering.js';

export function handleIntro() {
    for (const mode of ['freegames', 'powerspins', 'superspins']) {
        if (GS[mode].intro) {
            const descIds = {
                freegames:  'popup-description-fg',
                powerspins: 'popup-description-ps',
                superspins: 'popup-description-ss',
            };
            const winIds = {
                freegames:  'freegames-win',
                powerspins: 'powerspin-win',
                superspins: 'superspin-win',
            };
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

export function handleEndOfSpecialMode(mode) {
    if (mode === 'normal') return;
    const s = GS[mode];
    if (s.count < s.total) return;

    const descIds = {
        freegames:  'popup-description-fg',
        powerspins: 'popup-description-ps',
        superspins: 'popup-description-ss',
    };
    const winIds = {
        freegames:  'freegames-win',
        powerspins: 'powerspin-win',
        superspins: 'superspin-win',
    };

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

export function checkForFreegames() {
    const n = countSymbol(GS.results, 'Eye');
    if (GS.freegames.active) {
        if (n > 0) GS.freegames.total += n;
    } else if (n >= 3) {
        GS.freegames.active = true;
        GS.freegames.intro  = true;
        document.getElementById('select-bet').disabled = true;
    }
}

export function checkForPowerspins() {
    const n = countSymbol(GS.results, 'Zeus');
    if (GS.powerspins.active) {
        if (n >= 3) GS.powerspins.total += 3;
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
        if (gold > 0) GS.superspins.total += gold;
    } else if (eyes >= 3 && zeus >= 3) {
        GS.superspins.active = true;
        GS.superspins.intro  = true;
        document.getElementById('select-bet').disabled = true;
    }
}
