document.getElementById('spin-button').addEventListener('click', spinReels);

const symbols = [
    { name: 'Eye', src: '../assets/eye.svg', probability: 0.05 },
    { name: 'J', src: '../assets/J.svg', probability: 0.17 },
    { name: 'Q', src: '../assets/Q.svg', probability: 0.15 },
    { name: 'K', src: '../assets/K.svg', probability: 0.13 },
    { name: 'A', src: '../assets/A.svg', probability: 0.12 },
    { name: 'Medusa', src: '../assets/medusa.jpg', probability: 0.10 },
    { name: 'Achilles', src: '../assets/achilles.jpg', probability: 0.09 },
    { name: 'Aristoteles', src: '../assets/aristoteles.jpg', probability: 0.08 },
    { name: 'Alexander', src: '../assets/alexander.jpg', probability: 0.06 },
    { name: 'Zeus', src: '../assets/zeus.jpg', probability: 0.05 }
];

let results = [];
let isSpinning = false;

function getRandomSymbol() {
    let rand = Math.random();
    let cumulativeProbability = 0;

    for (let symbol of symbols) {
        cumulativeProbability += symbol.probability;
        if (rand < cumulativeProbability) {
            return symbol;
        }
    }
    return symbols[symbols.length - 1];
}

function createReelSymbols(reel) {
    for (let i = 0; i < 5; i++) {
        let symbol = document.createElement('div');
        symbol.className = 'symbol';
        symbol.style.top = `${i * 10}vw`;

        let img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        
        symbol.appendChild(img);
        reel.appendChild(symbol);
    }
}


function spinReels() {
    if (isSpinning) return;
    isSpinning = true;
    document.getElementById('spin-button').disabled = true;

    // Define and use the reels variable here
    let reels = document.getElementsByClassName('reel');
    let completedReels = 0;
    
    // Convert HTMLCollection to Array for easier manipulation
    reels = Array.from(reels);


    reels.forEach((reel, i) => {
        setTimeout(() => {
            animateReel(reel, i, () => {
                completedReels++;
                if (completedReels === reels.length) {
                    isSpinning = false;
                    document.getElementById('spin-button').disabled = false;
                }
            });
        }, i * 250);
    });
}


function animateReel(reel, reelIndex, callback) {
    let position = 0;
    let speed = 25;
    let symbols = reel.getElementsByClassName('symbol');

    function animate() {
        position += speed;

        for (let i = 0; i < symbols.length; i++) {
            let symbol = symbols[i];
            let newPos = (parseInt(symbol.style.top) + position) % 50;
            symbol.style.top = `${newPos - 10}vw`;

            if (newPos - 100 < 0) {
                let chosenSymbol = getRandomSymbol();
                symbol.firstChild.src = chosenSymbol.src;
                symbol.firstChild.dataset.name = chosenSymbol.name;
            }
        }

        if (position < 1000) {
            requestAnimationFrame(animate);
        } else {
            logReelSymbols(reel, reelIndex);
            callback();
        }
    }
    animate();
}


function logReelSymbols(reel, reelIndex) {
    let reelSymbols = reel.getElementsByClassName('symbol');
    results[reelIndex] = [];

    for (let i = 0; i < 3; i++) {
        let symbol = reelSymbols[i];
        let symbolName = symbol.firstChild.dataset.name;
        results[reelIndex].push(symbolName);
    }
}

window.onload = function() {
    let reels = document.getElementsByClassName('reel');
    for (let reel of reels) {
        createReelSymbols(reel);
    }
};

document.addEventListener('keydown', keyPressHandler);

function keyPressHandler(event) {
    // Überprüfen, ob die gedrückte Taste die Leertaste ist (keyCode 32 oder key " ")
    if ((event.keyCode === 32 || event.key === " ") && !isSpinning) {
        // Führe die spinReels Funktion aus
        spinReels();
    }
}

