export const REEL_COUNT = 5;
export const ROW_COUNT  = 3;

export const SYMBOLS = [
    { name: 'Eye',         src: './assets/eye.png',         probability: 0.05 },
    { name: 'J',           src: './assets/J.svg',           probability: 0.14 },
    { name: 'Q',           src: './assets/Q.svg',           probability: 0.14 },
    { name: 'K',           src: './assets/K.svg',           probability: 0.12 },
    { name: 'A',           src: './assets/A.svg',           probability: 0.12 },
    { name: 'Medusa',      src: './assets/medusa.png',      probability: 0.10 },
    { name: 'Achilles',    src: './assets/achilles.png',    probability: 0.08 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.08 },
    { name: 'Archimedes',  src: './assets/archimedes.png',  probability: 0.06 },
    { name: 'Alexander',   src: './assets/alexander.png',   probability: 0.06 },
    { name: 'Zeus',        src: './assets/zeus.jpg',        probability: 0.05 },
];

export const POWERSPIN_SYMBOLS = [
    { name: 'Medusa',      src: './assets/medusa.png',      probability: 0.23 },
    { name: 'Achilles',    src: './assets/achilles.png',    probability: 0.22 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.20 },
    { name: 'Archimedes',  src: './assets/archimedes.png',  probability: 0.15 },
    { name: 'Alexander',   src: './assets/alexander.png',   probability: 0.10 },
    { name: 'Zeus',        src: './assets/zeus.jpg',        probability: 0.10 },
];

export const FREEGAMES_SYMBOLS = [
    { name: 'Eye',         src: './assets/eye.png',         probability: 0.02 },
    { name: 'J',           src: './assets/J.svg',           probability: 0.14 },
    { name: 'Q',           src: './assets/Q.svg',           probability: 0.14 },
    { name: 'K',           src: './assets/K.svg',           probability: 0.12 },
    { name: 'A',           src: './assets/A.svg',           probability: 0.12 },
    { name: 'Medusa',      src: './assets/medusa.png',      probability: 0.10 },
    { name: 'Achilles',    src: './assets/achilles.png',    probability: 0.09 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.09 },
    { name: 'Archimedes',  src: './assets/archimedes.png',  probability: 0.07 },
    { name: 'Alexander',   src: './assets/alexander.png',   probability: 0.07 },
    { name: 'Zeus',        src: './assets/zeus.jpg',        probability: 0.04 },
];

export const SUPERSPIN_SYMBOLS = [
    { name: 'GoldenEye',   src: './assets/golden_eye.png', probability: 0.02 },
    { name: 'Medusa',      src: './assets/medusa.png',      probability: 0.27 },
    { name: 'Achilles',    src: './assets/achilles.png',    probability: 0.25 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.21 },
    { name: 'Alexander',   src: './assets/alexander.png',   probability: 0.15 },
    { name: 'Zeus',        src: './assets/zeus.jpg',        probability: 0.10 },
];

export const LINES = [
    [[0,0],[1,0],[2,0],[3,0],[4,0]], // top row
    [[0,1],[1,1],[2,1],[3,1],[4,1]], // middle row
    [[0,2],[1,2],[2,2],[3,2],[4,2]], // bottom row
    [[0,0],[1,1],[2,2],[3,1],[4,0]], // V-shape
    [[0,2],[1,1],[2,0],[3,1],[4,2]], // inverted V
    [[0,0],[1,0],[2,1],[3,2],[4,2]], // Z-shape
    [[0,2],[1,2],[2,1],[3,0],[4,0]], // inverted Z
    [[0,1],[1,0],[2,0],[3,0],[4,1]], // top arch
    [[0,1],[1,2],[2,2],[3,2],[4,1]], // bottom arch
];

export const SYMBOL_PAYOUTS = {
    'J':           { 3: 1,  4: 4,   5: 20   },
    'Q':           { 3: 1,  4: 4,   5: 20   },
    'K':           { 3: 2,  4: 5,   5: 25   },
    'A':           { 3: 2,  4: 5,   5: 25   },
    'Medusa':      { 3: 6,  4: 50,  5: 250  },
    'Achilles':    { 3: 10, 4: 25,  5: 500  },
    'Aristoteles': { 3: 10, 4: 25,  5: 500  },
    'Archimedes':  { 2: 2,  3: 15,  4: 100, 5: 1000 },
    'Alexander':   { 2: 2,  3: 15,  4: 100, 5: 1000 },
    'Zeus':        { 2: 3,  3: 20,  4: 500, 5: 2000 },
};
