document.getElementById('spin-button').addEventListener('click', spinReels);

const symbols = [
    { name: 'Eye', src: './assets/eye.svg', probability: 0.10 },
    { name: 'J', src: './assets/J.svg', probability: 0.16 },
    { name: 'Q', src: './assets/Q.svg', probability: 0.14 },
    { name: 'K', src: './assets/K.svg', probability: 0.13 },
    { name: 'A', src: './assets/A.svg', probability: 0.12 },
    { name: 'Medusa', src: './assets/medusa.jpg', probability: 0.09 },
    { name: 'Achilles', src: './assets/achilles.jpg', probability: 0.08 },
    { name: 'Aristoteles', src: './assets/aristoteles.jpg', probability: 0.07 },
    { name: 'Alexander', src: './assets/alexander.jpg', probability: 0.06 },
    { name: 'Zeus', src: './assets/zeus.jpg', probability: 0.05 }
];

const powerspinSymbols = [
    { name: 'Medusa', src: './assets/medusa.jpg', probability: 0.30 },
    { name: 'Achilles', src: './assets/achilles.jpg', probability: 0.25 },
    { name: 'Aristoteles', src: './assets/aristoteles.jpg', probability: 0.20 },
    { name: 'Alexander', src: './assets/alexander.jpg', probability: 0.15 },
    { name: 'Zeus', src: './assets/zeus.jpg', probability: 0.10 }
];

const lines = [
    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], // Linie 1: obere Reihe
    [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]], // Linie 2: mittlere Reihe
    [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]], // Linie 3: untere Reihe
    [[0, 0], [1, 1], [2, 2], [3, 1], [4, 0]], // Linie 4: V-Form
    [[0, 2], [1, 1], [2, 0], [3, 1], [4, 2]], // Linie 5: umgekehrte V-Form
    [[0, 0], [1, 0], [2, 1], [3, 2], [4, 2]], // Linie 6: Z-Form
    [[0, 2], [1, 2], [2, 1], [3, 0], [4, 0]], // Linie 7: umgekehrte Z-Form
    [[0, 1], [1, 0], [2, 0], [3, 0], [4, 1]], // Linie 8: obere V-Form
    [[0, 1], [1, 2], [2, 2], [3, 2], [4, 1]], // Linie 9: untere Z-Form
];

let powerspinsPopup = document.getElementById('powerspins-popup');
let bankValue = Number(document.getElementById('bank').innerText);
let selectBetBox = document.getElementById('select-bet');
let betValue = selectBetBox.value;
let powerspins = false;
let powerspinsTotal = 0;
let powerspinCount = 0;
let powerspinWin = 0;

const symbolPayouts = {
    'J': { 3: 1, 4: 2, 5: 3 },
    'Q': { 3: 1, 4: 2, 5: 3 },
    'K': { 3: 2, 4: 3, 5: 4 },
    'A': { 3: 2, 4: 3, 5: 4 },
    'Medusa': { 2: 1, 3: 2, 4: 4, 5: 5 },
    'Achilles': { 2: 1, 3: 3, 4: 4, 5: 5 },
    'Aristoteles': { 2: 2, 3: 3.5, 4: 4.5, 5: 6 },
    'Alexander': { 2: 2, 3: 4, 4: 6, 5: 10 },
    'Zeus': { 2: 3, 3: 5, 4: 8, 5: 15 }
};

let results = [];
let isSpinning = false; // Variable zur Verfolgung des Spinnstatus

function getRandomSymbol() {
    let rand = Math.random();
    let cumulativeProbability = 0;

    let symbolsToUse;

    if (powerspins) {
        symbolsToUse = powerspinSymbols;

    } else {
        symbolsToUse = symbols;
    }

    for (let symbolToUse of symbolsToUse) {
        cumulativeProbability += symbolToUse.probability;
        if (rand < cumulativeProbability) {
            return symbolToUse;
        }
    }

    // Fallback (shouldn't happen if probabilities sum to 1)
    return symbols[symbols.length - 1];
}

function createReelSymbols(reel) {
    for (let i = 0; i < 5; i++) {
        let symbol = document.createElement('div');
        symbol.className = 'symbol';
        
        if (window.matchMedia("(max-width: 930px)").matches) {
            symbol.style.top = `${i * 15}vw`;
        } else {
            symbol.style.top = `${i * 10}vw`;
        }

        let img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        
        symbol.appendChild(img);
        reel.appendChild(symbol);
    }
}

function spinReels() {

    if (powerspinCount == 7) {
        powerspinsPopup.style.opacity = '0';    //hide the element
        document.getElementById("powerspin-win").innerHTML = "";
        powerspinWin = 0;
        document.getElementById('powerspins')
        togglePowerspins();
        powerspinCount = 0;
        powerspinsTotal = 0;
    }

    let symbolsToUse;
    if (powerspins) {
        powerspinsPopup.style.opacity = '0'; // //hide the element

        powerspinCount += 1;
        symbolsToUse = powerspinSymbols;

    } else {
        symbolsToUse = symbols;
    }

    if (isSpinning) return; // Verhindert mehrfaches Starten des Spins
    isSpinning = true;
    document.getElementById('spin-button').disabled = true;

    if (!powerspins) {
        bankValue -= betValue;
        document.getElementById('bank').innerText = bankValue;
    }

    results = []; // Reset results array
    let reels = document.getElementsByClassName('reel');
    let completedReels = 0; // Zähler für abgeschlossene Walzen

    // Entferne die roten Rahmen von vorherigen Spins
    removeHighlightFromSymbols();

    for (let i = 0; i < reels.length; i++) {
        let reel = reels[i];
        setTimeout(() => {
            animateReel(reel, i, () => {
                completedReels++;
                if (completedReels === reels.length) {
                    isSpinning = false; // Spin abgeschlossen
                    if (powerspinCount == 7) {
                        document.getElementById('popup-description').style.display = 'none';
                        document.getElementById('powerspin-win').style.display = 'block';
                        if(selectBetBox.disabled){
                            console.log("disabled")
                            selectBetBox.disabled = false;
                            if(!selectBetBox.disabled){
                                console.log("enabled")
                            }
                        }
                        powerspinsPopup.style.opacity = '1';    //show the element
                    }
                    document.getElementById('spin-button').disabled = false; // Entsperre den Button nach allen Spins
                    if (!powerspins) {
                        checkForPowerspins();
                    }
                    checkForWins(); // Überprüfe auf Gewinne
                }
            });
        }, i * 250); // Verzögerung von 250ms zwischen den Walzen
    }
    //console.log("Powerspins left "+powerspinsTotal)
    //console.log("Powerspin Nr: "+ powerspinCount)
    //console.log(powerspins)
}

function removeHighlightFromSymbols() {
    let reels = document.getElementsByClassName('reel');
    for (let reel of reels) {
        let symbols = reel.getElementsByClassName('symbol');
        for (let symbol of symbols) {
            symbol.firstChild.classList.remove('win-symbol');
        }
    }
}

function animateReel(reel, reelIndex, callback) {
    let position = 0;
    let speed = 25;
    let symbols = reel.getElementsByClassName('symbol');
    
    function animate() {
        position += speed;
        let newPos = 0;
        for (let symbol of symbols) {
            if (window.matchMedia("(max-width: 930px)").matches) {
                let newPos = (parseInt(symbol.style.top) + position) % 75;
                symbol.style.top = `${newPos - 15}vw`;
            } else {
                let newPos = (parseInt(symbol.style.top) + position) % 50;
                symbol.style.top = `${newPos - 10}vw`;
            }

            // Neue Symbole während des Spinnens generieren
            if (newPos - 100 < 0) {
                let chosenSymbol = getRandomSymbol();
                symbol.firstChild.src = chosenSymbol.src;
                symbol.firstChild.dataset.name = chosenSymbol.name; // Name als Datenattribut speichern
            }
        }
        

        if (window.matchMedia("(max-width: 930px)").matches) {
            if (position < 750) {
                requestAnimationFrame(animate);
            } else {
                // Ausgabe der Symbole nach dem Spin
                logReelSymbols(reel, reelIndex);
                callback(); // Rufe den Callback nach Abschluss des Spins auf
            }
        } else {
            if (position < 1000) {
                requestAnimationFrame(animate);
            } else {
                // Ausgabe der Symbole nach dem Spin
                logReelSymbols(reel, reelIndex);
                callback(); // Rufe den Callback nach Abschluss des Spins auf
            }
        }
    }
    animate();
}

function logReelSymbols(reel, reelIndex) {
    let symbols = reel.getElementsByClassName('symbol');
    results[reelIndex] = [];
    for (let i = 0; i < 3; i++) {
        let symbol = symbols[i];
        let symbolName = symbol.firstChild.dataset.name;
        results[reelIndex].push(symbolName);
    }
}

function checkForPowerspins () {

    let zeuscount = 0;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            let symbolName = results[i][j];
            if (symbolName == 'Zeus') {
                zeuscount++;
            }
        }
    }

    //console.log(zeuscount);

    if (zeuscount > 2) {
        togglePowerspins();
        powerspinsTotal = 7;
        selectBetBox.disabled = true;
        document.getElementById('popup-description').style.display = 'flex';
        document.getElementById('powerspin-win').style.display = 'none';
        powerspinsPopup.style.opacity = '1'; // show the element
    }
}

function togglePowerspins() {
    powerspins = !powerspins;
    //console.log("toogled to: "+powerspins)
}

function checkForWins() {
    let winningLines = {};
    let totalWin = 0;
  
    for (let line of lines) {
      let consecutiveCount = 0;
      let lastSymbol = null;
      let currentWinningPositions = [];
  
      for (let i = 0; i < line.length; i++) {
        let position = line[i];
        let reelIndex = position[0];    //reelIndex: Spalte
        let symbolIndex = position[1];  //symbolIndex: Zeile
        let symbolName = results[reelIndex][symbolIndex];
  
        if (lastSymbol == null && results[0][symbolIndex] == 'Eye') {

          let nextPosition = line[i+1];
          let nextReelIndex = nextPosition[0];    //reelIndex: Spalte
          let nextSymbolIndex = nextPosition[1];  //symbolIndex: Zeile
          let nextSymbolName = results[nextReelIndex][nextSymbolIndex];

          symbolName = nextSymbolName;
          lastSymbol = symbolName;

          if (nextSymbolName == 'Eye') {

            let TwoNextPosition = line[i+2];
            let TwoNextReelIndex = TwoNextPosition[0];    //reelIndex: Spalte
            let TwoNextSymbolIndex = TwoNextPosition[1];  //symbolIndex: Zeile
            let TwoNextSymbolName = results[TwoNextReelIndex][TwoNextSymbolIndex];

            symbolName = TwoNextSymbolName;
            lastSymbol = symbolName;

            if (TwoNextSymbolName == 'Eye') {

                let ThreeNextPosition = line[i+3];
                let ThreeNextReelIndex = ThreeNextPosition[0];    //reelIndex: Spalte
                let ThreeNextSymbolIndex = ThreeNextPosition[1];  //symbolIndex: Zeile
                let ThreeNextSymbolName = results[ThreeNextReelIndex][ThreeNextSymbolIndex];

                symbolName = ThreeNextSymbolName;
                lastSymbol = symbolName;

                if (ThreeNextSymbolName == 'Eye') {

                    let FourNextPosition = line[i+4];
                    let FourNextReelIndex = FourNextPosition[0];    //reelIndex: Spalte
                    let FourNextSymbolIndex = FourNextPosition[1];  //symbolIndex: Zeile
                    let FourNextSymbolName = results[FourNextReelIndex][FourNextSymbolIndex];

                    symbolName = FourNextSymbolName;
                    lastSymbol = symbolName;

                    if (FourNextSymbolName == 'Eye') {
                        symbolName = 'Zeus';
                        lastSymbol = symbolName;
                    }
                }
            }
          }
        } if (i === 0 || symbolName === lastSymbol || symbolName == 'Eye') {
            if ( symbolName == 'Eye') {
              symbolName = lastSymbol;
            }
          consecutiveCount++;
          lastSymbol = symbolName;
          currentWinningPositions.push(position); // Position zur potenziellen Gewinnreihe hinzufügen
        } else {
          break; // Unterbrechung der Kette, keine weiteren Symbole in dieser Linie prüfen
      }
  
        if (consecutiveCount >= 2 && symbolPayouts[symbolName] && symbolPayouts[symbolName][consecutiveCount]) {
          if (!winningLines[line] || consecutiveCount > winningLines[line].consecutiveCount) {
                    winningLines[line] = { symbolName, consecutiveCount, positions: [...currentWinningPositions] };
                }
          }
        }
      }
  
    // Berechnung des gesamten Gewinns und Hervorhebung aller Gewinnlinien
    for (let line in winningLines) {
      let win = winningLines[line];
        //console.log("betValue: "+betValue)
      totalWin += Number(symbolPayouts[win.symbolName][win.consecutiveCount]) * betValue;
        //console.log(`Gewinn mit Symbol "${win.symbolName}" auf Linie "${JSON.stringify(line)}". Anzahl der aufeinanderfolgenden Symbole: ${win.consecutiveCount}`);        
        highlightWinningSymbols(win.positions);
    }
    
    if (powerspinCount > 0) {
        powerspinWin += totalWin;
        console.log("Powerspin "+powerspinCount+", Gewinn: "+totalWin+", Gesamt: "+powerspinWin)
    }
    if (powerspinCount == 7) {
        document.getElementById("powerspin-win").innerHTML = powerspinWin;
    }

    // Anzeigen des gesamten Gewinns
    document.getElementById('win').innerText = totalWin; // Den Gewinn anzeigen
    bankValue += totalWin;
    document.getElementById('bank').innerText = bankValue; // Den Gewinn anzeigen
}

function highlightWinningSymbols(positions) {
    for (let position of positions) {
        let reelIndex = position[0];
        let symbolIndex = position[1];
        let reel = document.getElementsByClassName('reel')[reelIndex];
        let symbol = reel.getElementsByClassName('symbol')[symbolIndex];
        symbol.firstChild.classList.add('win-symbol'); // Anwenden der Klasse auf das Bild-Element
    }
}

// Initial setup
window.onload = function() {
    let reels = document.getElementsByClassName('reel');
    for (let reel of reels) {
        createReelSymbols(reel);
    }
};

// Event Listener für Tastendruck (z.B. Leertaste)
document.addEventListener('keydown', keyPressHandler);

function keyPressHandler(event) {
    // Überprüfen, ob die gedrückte Taste die Leertaste ist (keyCode 32 oder key " ")
    if ((event.keyCode === 32 || event.key === " ") && !isSpinning) {
        // Führe die spinReels Funktion aus
        spinReels();
    }
}

document.addEventListener('DOMContentLoaded', (event) => {

    selectBetBox.addEventListener('change', (event) => {
        betValue = event.target.value;
    });
});

