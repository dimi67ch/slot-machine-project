import { REEL_COUNT, ROW_COUNT } from './constants.js?v=20260615-4';

export const GS = {
    bank: 1000,
    bet: 10,
    isSpinning: false,

    freegames:  { active: false, count: 0, total: 10, totalWin: 0, intro: false },
    powerspins: { active: false, count: 0, total: 7,  totalWin: 0, intro: false },
    superspins: { active: false, count: 0, total: 10, totalWin: 0, intro: false },

    results: [],
    eyePositions: [],
    shiftedEyePositions: [],
    symbolSettings: {},
    isMobile: false,

    get activeMode() {
        if (this.freegames.active)  return 'freegames';
        if (this.powerspins.active) return 'powerspins';
        if (this.superspins.active) return 'superspins';
        return 'normal';
    },

    resetSpin() {
        this.results = Array.from({ length: REEL_COUNT }, () => Array(ROW_COUNT).fill(null));
        this.eyePositions = [];
        this.shiftedEyePositions = [];
    },
};
