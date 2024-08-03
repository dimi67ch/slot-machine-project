document.getElementById('spin-button').addEventListener('click', spinReels);

const symbols = [
    { name: 'Eye', src: './assets/eye.png', probability: 0.05 },
    { name: 'J', src: './assets/J.svg', probability: 0.14 },
    { name: 'Q', src: './assets/Q.svg', probability: 0.14 },
    { name: 'K', src: './assets/K.svg', probability: 0.12 },
    { name: 'A', src: './assets/A.svg', probability: 0.12 },
    { name: 'Medusa', src: './assets/medusa.png', probability: 0.10 },
    { name: 'Achilles', src: './assets/achilles.png', probability: 0.08 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.08 },
    { name: 'Archimedes', src: './assets/archimedes.png', probability: 0.06 },
    { name: 'Alexander', src: './assets/alexander.png', probability: 0.06 },
    { name: 'Zeus', src: './assets/zeus.jpg', probability: 0.05 }
];

const powerspinSymbols = [
    { name: 'Medusa', src: './assets/medusa.png', probability: 0.23 },
    { name: 'Achilles', src: './assets/achilles.png', probability: 0.22 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.20 },
    { name: 'Archimedes', src: './assets/archimedes.png', probability: 0.15 },
    { name: 'Alexander', src: './assets/alexander.png', probability: 0.10 },
    { name: 'Zeus', src: './assets/zeus.jpg', probability: 0.10 }
];

const freegamesSymbols = [
    { name: 'Eye', src: './assets/eye.png', probability: 0.02 },
    { name: 'J', src: './assets/J.svg', probability: 0.14 },
    { name: 'Q', src: './assets/Q.svg', probability: 0.14 },
    { name: 'K', src: './assets/K.svg', probability: 0.12 },
    { name: 'A', src: './assets/A.svg', probability: 0.12 },
    { name: 'Medusa', src: './assets/medusa.png', probability: 0.10 },
    { name: 'Achilles', src: './assets/achilles.png', probability: 0.09 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.09 },
    { name: 'Archimedes', src: './assets/archimedes.png', probability: 0.07 },
    { name: 'Alexander', src: './assets/alexander.png', probability: 0.07 },
    { name: 'Zeus', src: './assets/zeus.jpg', probability: 0.04 }
];

const superspinSymbols = [
    { name: 'GoldenEye', src: './assets/golden_eye.png', probability: 0.02 },
    { name: 'Medusa', src: './assets/medusa.png', probability: 0.27 },
    { name: 'Achilles', src: './assets/achilles.png', probability: 0.25 },
    { name: 'Aristoteles', src: './assets/aristoteles.png', probability: 0.21 },
    { name: 'Alexander', src: './assets/alexander.png', probability: 0.15 },
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
let freegamesPopup = document.getElementById('freegames-popup');
let superspinsPopup = document.getElementById('superspins-popup');

let bankValue = Number(document.getElementById('bank').innerText);
let selectBetBox = document.getElementById('select-bet');
let betValue = selectBetBox.value;
let results = [];
let isSpinning = false; // Variable zur Verfolgung des Spinnstatus

let powerspins = false;
let powerspinsTotal = 7;
let powerspinCount = 0;
let powerspinWin = 0;
let powerspinsPopupActive = false;
let introPowerspins = false;

let freegames = false;
let freegamesTotal = 10;
let freegamesCount = 0;
let freegamesWin = 0;
let freegamesPopupActive = false;
let introFreegames = false;

let superspins = false;
let superspinsTotal = 10;
let superspinCount = 0;
let superspinWin = 0;
let superspinsPopupActive = false;
let introSuperspins = false;

let symbolSettings = {}; // { reelIndex: { positionIndex: symbol } }
let eyePositions = [];
let shiftedEyePositions = [];

const symbolPayouts = {
    'J': { 3: 1, 4: 4, 5: 20 },
    'Q': { 3: 1, 4: 4, 5: 20 },
    'K': { 3: 2, 4: 5, 5: 25 },
    'A': { 3: 2, 4: 5, 5: 25 },
    'Medusa': { 2: 1, 3: 6, 4: 50, 5: 250 },
    'Achilles': { 2: 2, 3: 10, 4: 25, 5: 500 },
    'Aristoteles': { 2: 2, 3: 10, 4: 25, 5: 500 },
    'Archimedes' : {2: 2, 3: 15, 4: 100, 5: 1000},
    'Alexander': { 2: 2, 3: 15, 4: 100, 5: 1000 },
    'Zeus': { 2: 3, 3: 20, 4: 500, 5: 2000 }
};

function getRandomSymbol() {
    let rand = Math.random();
    let cumulativeProbability = 0;

    let symbolsToUse;

    if (powerspins) {
        symbolsToUse = powerspinSymbols;
    } else if (freegames) {
        symbolsToUse = freegamesSymbols;
    } else if (superspins) {
        symbolsToUse = superspinSymbols;
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

    // ========== INTROS ==========

    if (introPowerspins) {
        document.getElementById('popup-description').style.display = 'flex';
        document.getElementById('powerspin-win').style.display = 'none';
        togglePowerspinsPopup(true); // show the element
        introPowerspins = false;
        changeHead('powerspins');
        return;
    }
    
    if (introFreegames) {
        document.getElementById('popup-description').style.display = 'flex';
        document.getElementById('freegames-win').style.display = 'none';
        toggleFreegamesPopup(true); // show the element
        introFreegames = false;
        changeHead('freegames');
        return;
    }

    if (introSuperspins) {
        document.getElementById('popup-description').style.display = 'flex';
        document.getElementById('superspin-win').style.display = 'none';
        toggleSuperspinsPopup(true); // show the element
        introSuperspins = false;
        changeHead('superspins');
        return;
    }

    // ========== END SPECIAL SPINS ==========

    if (powerspinCount == powerspinsTotal) {
        togglePowerspinsPopup(false);   //hide the element
        document.getElementById("powerspin-win").innerHTML = "";
        powerspinWin = 0;
        togglePowerspins();
        powerspinCount = 0;
        powerspinsTotal = 7;
        changeHead('default');
        selectBetBox.disabled = false;
    }

    if (freegamesCount == freegamesTotal) {
        toggleFreegamesPopup(false);    //hide the element
        document.getElementById("freegames-win").innerHTML = "";
        freegamesWin = 0;
        toggleFreegames();
        freegamesCount = 0;
        freegamesTotal = 10;
        changeHead('default');
        selectBetBox.disabled = false;
    }

    if (superspinCount == superspinsTotal) {
        toggleSuperspinsPopup(false);   //hide the element
        document.getElementById("superspin-win").innerHTML = "";
        superspinWin = 0;
        toggleSuperspins();
        superspinCount = 0;
        superspinsTotal = 10;
        changeHead('default');
        selectBetBox.disabled = false;
    }

    // ========== START SPECIAL SPINS ==========

    let symbolsToUse;
    if (powerspins) {
        togglePowerspinsPopup(false); // //hide the element
        powerspinCount += 1;
        symbolsToUse = powerspinSymbols;
        updateHead('powerspins');
    } else if (freegames) {
        toggleFreegamesPopup(false); // //hide the element
        freegamesCount += 1;
        symbolsToUse = freegamesSymbols;
        updateHead('freegames');

        if (freegamesCount > 1) {
            // Find all Eye symbols and create overlay images
            let eyeSymbols = document.querySelectorAll('[data-name="Eye"]');
            eyeSymbols.forEach(symbol => createEyeOverlay(symbol));
        }
    } else if (superspins) {
        toggleSuperspinsPopup(false); // //hide the element
        superspinCount += 1;
        symbolsToUse = superspinSymbols;
        updateHead('superspins');

        if (superspinCount > 1) {
            // Find all Eye symbols and create overlay images
            let eyeSymbols = document.querySelectorAll('[data-name="GoldenEye"]');
            eyeSymbols.forEach(symbol => createEyeOverlay(symbol));
        }
    }
    else {
        symbolsToUse = symbols;
    }

    if (isSpinning) return; // Verhindert mehrfaches Starten des Spins
    isSpinning = true;
    document.getElementById('spin-button').disabled = true;

    eyePositions = [];
    shiftedEyePositions = [];

    if (!powerspins && !freegames && !superspins) {
        bankValue -= betValue;
        document.getElementById('bank').innerText = bankValue;
    }

    results = []; // Reset results array
    let reels = document.getElementsByClassName('reel');
    let completedReels = 0; // Zähler für abgeschlossene Walzen

    // Convert HTMLCollection to Array for easier manipulation
    reels = Array.from(reels);

    // Entferne die roten Rahmen von vorherigen Spins
    removeHighlightFromSymbols();

    let reelDelay;
    if (window.matchMedia("(max-width: 930px)").matches) {
        reelDelay = 180;
    } else {
        reelDelay = 250;
    }


    // Force a reflow to ensure initial styles are applied
    setTimeout(() => {

        if (freegamesCount > 1 || superspinCount > 1) {
            // Move the overlays
            moveEyeOverlays();
        }

        reels.forEach((reel, i) => {
            setTimeout(() => {
                animateReel(reel, i, () => {
                    completedReels++;
                    if (completedReels === reels.length) {
                        isSpinning = false; // Spin abgeschlossen
                        document.getElementById('spin-button').disabled = false; // Entsperre den Button nach allen Spins
                        // Hier
                        if (!freegames && !powerspins) {
                            checkForSuperspins();
                        }
                        if (!freegames && !superspins) {
                            checkForPowerspins();
                        }
                        if (!superspins) {
                            checkForFreegames();
                        }
                        if (powerspinCount == powerspinsTotal) {
                            document.getElementById('popup-description').style.display = 'none';
                            document.getElementById('powerspin-win').style.display = 'block';
                            togglePowerspinsPopup(true);    //show the element
                        }
                        if (freegamesCount == freegamesTotal) {
                            document.getElementById('popup-description').style.display = 'none';
                            document.getElementById('freegames-win').style.display = 'block';
                            toggleFreegamesPopup(true);    //show the element
                        }
                        if (superspinCount == superspinsTotal) {
                            document.getElementById('popup-description-img').style.display = 'none';
                            document.getElementById('superspin-win').style.display = 'block';
                            toggleSuperspinsPopup(true);    //show the element
                        }
                        checkForWins(); // Überprüfe auf Gewinne
                        
                        if (freegamesCount > 0 || superspinCount > 0) {
                            symbolSettings = {}; // Reset symbolSettings for each spin
                            shiftEyePositions();
                            updateSymbolSettings();
                            
                            // Remove all overlays after the spin
                            removeAllEyeOverlays();
                        }
                    }
                });
            }, i * reelDelay); // Verzögerung von 250ms zwischen den Walzen
        });
    }, 200);
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
        for (let i = 0; i < symbols.length; i++) {
            let symbol = symbols[i];
            if (window.matchMedia("(max-width: 930px)").matches) {
                let newPos = (parseInt(symbol.style.top) + position) % 75;
                symbol.style.top = `${newPos - 15}vw`;
            } else {
                let newPos = (parseInt(symbol.style.top) + position) % 50;
                symbol.style.top = `${newPos - 10}vw`;
            }

            // Neue Symbole während des Spinnens generieren
            let x;

            if (window.matchMedia("(max-width: 930px)").matches) {
                x = 50;
            } else {
                x = 100;
            }

            if (newPos - x < 0) {
                let chosenSymbol = symbolSettings[reelIndex] && symbolSettings[reelIndex][i]
                    && (freegames || superspins)
                    ? symbolSettings[reelIndex][i]
                    : getRandomSymbol();
                symbol.firstChild.src = chosenSymbol.src;
                symbol.firstChild.dataset.name = chosenSymbol.name; // Name als Datenattribut speichern
            }
        }

        if (window.matchMedia("(max-width: 930px)").matches) {
            if (position < 375) {
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

    wild = returnWild();
    let symbols = reel.getElementsByClassName('symbol');
    results[reelIndex] = [];
    for (let i = 0; i < 3; i++) {
        let symbol = symbols[i];
        let symbolName = symbol.firstChild.dataset.name;
        results[reelIndex].push(symbolName);

        if (symbolName == wild) {
            eyePositions.push({ reel: reelIndex, position: i });
        }
    }
}

function checkForPowerspins() {

    let zeuscount = 0;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            let symbolName = results[i][j];
            if (symbolName == 'Zeus') {
                zeuscount++;
            }
        }
    }

    if (zeuscount > 2) {
        if (powerspins) {
            powerspinsTotal += 3;
        } else {
            togglePowerspins();
            selectBetBox.disabled = true;
            introPowerspins = true;
        }
    }
}

function checkForFreegames() {
    let eyeCount = 0;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            let symbolName = results[i][j];
            if (symbolName == 'Eye') {
                eyeCount++;
            }
        }
    }

    if (freegames) {
        if (eyeCount > 0) {
            freegamesTotal++;
        }
    } else if (!freegames && eyeCount > 2) {
        toggleFreegames();
        selectBetBox.disabled = true;
        introFreegames = true;
    }
}

function checkForSuperspins () {
    let eyeCount = 0;
    let goldenEyeCount = 0;
    let zeusCount = 0;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            let symbolName = results[i][j];
            if (symbolName == 'Eye') {
                eyeCount++;
            }
            if (symbolName == 'GoldenEye') {
                goldenEyeCount++;
            }
            if (symbolName == 'Zeus') {
                zeusCount++;
            }
        }
    }

    if (superspins) {
        if (goldenEyeCount > 0) {
            superspinsTotal++;
        }
    } else if (!superspins && eyeCount > 2 && zeusCount > 2) {
        toggleSuperspins();
        selectBetBox.disabled = true;
        introSuperspins = true;
    }
}

function togglePowerspins() {
    powerspins = !powerspins;
}

function togglePowerspinsPopup (status) {
    powerspinsPopupActive = status;

    if (powerspinsPopupActive) {
        powerspinsPopup.style.opacity = '1';    //show the element
    } else {
        powerspinsPopup.style.opacity = '0';    //hide the element

    }
}

function toggleFreegamesPopup (status) {
    freegamesPopupActive = status;

    if (freegamesPopupActive) {
        freegamesPopup.style.opacity = '1';    //show the element
    } else {
        freegamesPopup.style.opacity = '0';    //hide the element
    }
}

function toggleSuperspinsPopup (status) {
    superspinsPopupActive = status;

    if (superspinsPopupActive) {
        superspinsPopup.style.opacity = '1';    //show the element
    } else {
        superspinsPopup.style.opacity = '0';    //hide the element
    }
}

function toggleFreegames() {
    freegames = !freegames;
}

function toggleSuperspins() {
    superspins = !superspins;
}

function checkForWins() {
    let winningLines = {};
    let totalWin = 0;

    let wild = returnWild();
  
    for (let line of lines) {
        let consecutiveCount = 0;
        let lastSymbol = null;
        let currentWinningPositions = [];
  
        for (let i = 0; i < line.length; i++) {
            let position = line[i];
            let reelIndex = position[0];    //reelIndex: Spalte
            let symbolIndex = position[1];  //symbolIndex: Zeile
            let symbolName = results[reelIndex][symbolIndex];
  
            if (lastSymbol == null && results[0][symbolIndex] == wild) {

                let nextPosition = line[i+1];
                let nextReelIndex = nextPosition[0];    //reelIndex: Spalte
                let nextSymbolIndex = nextPosition[1];  //symbolIndex: Zeile
                let nextSymbolName = results[nextReelIndex][nextSymbolIndex];

                symbolName = nextSymbolName;
                lastSymbol = symbolName;

                if (nextSymbolName == wild) {

                    let TwoNextPosition = line[i+2];
                    let TwoNextReelIndex = TwoNextPosition[0];    //reelIndex: Spalte
                    let TwoNextSymbolIndex = TwoNextPosition[1];  //symbolIndex: Zeile
                    let TwoNextSymbolName = results[TwoNextReelIndex][TwoNextSymbolIndex];

                    symbolName = TwoNextSymbolName;
                    lastSymbol = symbolName;

                    if (TwoNextSymbolName == wild) {

                        let ThreeNextPosition = line[i+3];
                        let ThreeNextReelIndex = ThreeNextPosition[0];    //reelIndex: Spalte
                        let ThreeNextSymbolIndex = ThreeNextPosition[1];  //symbolIndex: Zeile
                        let ThreeNextSymbolName = results[ThreeNextReelIndex][ThreeNextSymbolIndex];

                        symbolName = ThreeNextSymbolName;
                        lastSymbol = symbolName;

                        if (ThreeNextSymbolName == wild) {

                            let FourNextPosition = line[i+4];
                            let FourNextReelIndex = FourNextPosition[0];    //reelIndex: Spalte
                            let FourNextSymbolIndex = FourNextPosition[1];  //symbolIndex: Zeile
                            let FourNextSymbolName = results[FourNextReelIndex][FourNextSymbolIndex];

                            symbolName = FourNextSymbolName;
                            lastSymbol = symbolName;

                            if (FourNextSymbolName == wild) {
                                symbolName = 'Zeus';
                                lastSymbol = symbolName;
                            }
                        }
                    }
                }
            } 
            
            if (i === 0 || symbolName === lastSymbol || symbolName == wild) {
                if ( symbolName == wild) {
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

    let goldenEyeCount = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
                let symbolName = results[i][j];
                if (symbolName == 'GoldenEye') {
                    goldenEyeCount++;
                }
            }
        }
        if (goldenEyeCount > 0) {
            totalWin *= goldenEyeCount * 2;
        }
    
    if (powerspinCount > 0) {
        powerspinWin += totalWin;
        //console.log("Powerspin "+powerspinCount+" / "+powerspinsTotal+", Gewinn: "+totalWin+", Gesamt: "+powerspinWin)
    }
    if (powerspinCount == powerspinsTotal) {
        document.getElementById("powerspin-win").innerHTML = powerspinWin;
    }

    if (freegamesCount > 0) {
        freegamesWin += totalWin;
        //console.log("Freegame "+freegamesCount+" / "+freegamesTotal+", Gewinn: "+totalWin+", Gesamt: "+freegamesWin)
    }
    if (freegamesCount == freegamesTotal) {
        document.getElementById("freegames-win").innerHTML = freegamesWin;
    }

    if (superspinCount > 0) {
        superspinWin += totalWin;
        //console.log("Superspin "+superspinCount+" / "+superspinsTotal+", Gewinn: "+totalWin+", Gesamt: "+superspinWin)
    }
    if (superspinCount == superspinsTotal) {
        document.getElementById("superspin-win").innerHTML = superspinWin;
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

function createEyeOverlay(imgElement) {
    let container = getClosestAncestor(imgElement, '.reel');

    let reelIndex = Array.from(container.parentElement.children).indexOf(container);

    if (reelIndex >= 1 && reelIndex <= 4) {
        let rowIndex = Array.from(container.children).indexOf(imgElement.parentElement);
        if (rowIndex >= 0 && rowIndex <= 2) {
            let grandParent = getClosestAncestor(imgElement, '.reel').parentElement;

            let grandParentTop = parseFloat(window.getComputedStyle(grandParent).top);
            
            if ( ((window.matchMedia("(max-width: 930px)").matches)
                && (isNaN(grandParentTop) || grandParentTop <= 0 || grandParentTop >= 30))
                || ((isNaN(grandParentTop) || grandParentTop <= 0 || grandParentTop >= 20)) ) {

                let overlay = document.createElement('img');
                overlay.className = 'eye-overlay';

                if (superspins) {
                    overlay.src = './assets/golden_eye.png';
                } else {
                    overlay.src = './assets/eye.png';
                }

                let rect = imgElement.getBoundingClientRect();
                overlay.style.position = 'absolute';
                overlay.style.top = `${rect.top + window.scrollY}px`;
                overlay.style.left = `${rect.left + window.scrollX}px`;
                overlay.style.width = `${rect.width}px`;
                overlay.style.height = `${rect.height}px`;
                
                imgElement.src = "";
                document.body.appendChild(overlay);
            }
        }
    }
}

function getClosestAncestor(element, selector) {
    return element.closest(selector);
}

function removeAllEyeOverlays() {
    const overlays = document.querySelectorAll('.eye-overlay');
    overlays.forEach(overlay => overlay.remove());
}

function moveEyeOverlays() {
    // Select all eye-overlay elements
    let overlays = document.querySelectorAll('.eye-overlay');

    // Trigger reflow
    overlays.forEach(overlay => {
        // Apply the initial transform to force reflow
        overlay.style.transform = 'translateX(0)';
    });

    // Force a reflow
    overlays.forEach(overlay => {
        // Trigger the animation
        overlay.style.transition = 'transform 0.5s ease';

        if (window.matchMedia("(max-width: 930px)").matches) {
            overlay.style.transform = 'translateX(calc(-15vw))';
        } else {
            overlay.style.transform = 'translateX(calc(-10vw))';
        }
    });
}

function setSymbolPositions(reelIndex, positions) {
    symbolSettings[reelIndex] = positions;
}

function shiftEyePositions() {
    shiftedEyePositions = eyePositions
        .filter(pos => pos.reel > 0)
        .map(pos => {
            return { reel: pos.reel - 1, position: pos.position };
        });
}

function updateSymbolSettings() {

    let symbolsToUse;

    if (superspins) {
        symbolsToUse = superspinSymbols;
    } else {
        symbolsToUse = symbols;
    }
    // Setze die Eye Symbole basierend auf shiftedEyePositions
    let wild = returnWild();

    shiftedEyePositions.forEach(pos => {
        if (!symbolSettings[pos.reel]) {
            symbolSettings[pos.reel] = {};
        }
        symbolSettings[pos.reel][pos.position] = symbolsToUse.find(symbol => symbol.name == wild);
    });
}

function changeHead(event) {
    let logo = document.getElementById('logo');
    let logoSmall = document.getElementById('logo-small');
    let psHead = document.getElementById('alt-head-ps');
    let fgHead = document.getElementById('alt-head-fg');
    let ssHead = document.getElementById('alt-head-ss');

    if (event == 'powerspins') {
        logo.style.display = 'none';
        logoSmall.style.display = 'none';
        let psHead = document.getElementById('alt-head-ps');
        psHead.innerHTML = "POWERSPIN " + `${powerspinCount} ` + "von " + `${powerspinsTotal}`;
        psHead.style.display = 'block';
    } else if (event == 'freegames') {
        logo.style.display = 'none';
        logoSmall.style.display = 'none';
        fgHead.innerHTML = "FREEGAME " + `${freegamesCount} ` + "von " + `${freegamesTotal}`
        fgHead.style.display = 'block'
    } else if (event == 'superspins') {
        logo.style.display = 'none';
        logoSmall.style.display = 'none';
        ssHead.innerHTML = "SUPERSPIN " + `${superspinCount} ` + "von " + `${superspinsTotal}`
        ssHead.style.display = 'block'
    } else if (event == 'default') {
        psHead.style.display = 'none';
        fgHead.style.display = 'none';
        ssHead.style.display = 'none';
        if (window.matchMedia("(max-width: 930px)").matches) {
            logoSmall.style.display = 'block';
        } else {
            logo.style.display = 'block';
        }
    }
}

function updateHead(event) {
    if (event == 'powerspins') {
        let psHead = document.getElementById('alt-head-ps');
        if (window.matchMedia("(max-width: 930px)").matches) {
            psHead.innerHTML = "POWERSPIN " + `${powerspinCount} ` + "/ " + `${powerspinsTotal}`;

        } else {
            psHead.innerHTML = "POWERSPIN " + `${powerspinCount} ` + "von " + `${powerspinsTotal}`;
        }

    } else if (event == 'freegames') {
        let fgHead = document.getElementById('alt-head-fg');
        
        if (window.matchMedia("(max-width: 930px)").matches) {
            fgHead.innerHTML = "FREEGAME " + `${freegamesCount} ` + "/ " + `${freegamesTotal}`;

        } else {
            fgHead.innerHTML = "FREEGAME " + `${freegamesCount} ` + "von " + `${freegamesTotal}`;
        }    
    } else if (event == 'superspins') {
        let ssHead = document.getElementById('alt-head-ss');
        
        if (window.matchMedia("(max-width: 930px)").matches) {
            ssHead.innerHTML = "SUPERSPINS " + `${superspinCount} ` + "/ " + `${superspinsTotal}`;

        } else {
            ssHead.innerHTML = "SUPERSPINS " + `${superspinCount} ` + "von " + `${superspinsTotal}`;
        }    
    }
}

function returnWild () {
    if (superspins) {
        return 'GoldenEye';
    } else {
        return 'Eye';
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

document.getElementById('guide-button').addEventListener('click', function() {
    let guide = document.getElementById('guide');
    guide.style.opacity = '1';
    guide.style.zIndex = '2000';
    document.getElementById('spin-button').disabled = true;
});

document.getElementById('close-guide').addEventListener('click', function() {
    let guide = document.getElementById('guide');
    guide.style.opacity = '0';
    guide.style.zIndex = '-1000';
    document.getElementById('spin-button').disabled = false;
});