//Hämta användarens val

//Slumpa datorns val

//Avgör vinnare

//Visa vinnare

import { manageHighscore } from './modules/highscore.js';

let userWeapon; //Här sparar vi valet som användaren gör
let computerWeapon; //Här sparar vi datorns val
let matches = 0;
let stats = {
    wins: 0,
    loses: 0,
    draws: 0,
    username: ''
}
const usernameElem = document.querySelector('#username');
//Det gör här är att vi hämtar knappen och kör kod när användaren klickar på knappen.
document.getElementById('rock').addEventListener('click', function() {
    userWeapon = 'sten';
    console.log(`Du har valt: ${userWeapon}`);
    getWinner();
});

document.getElementById('scissor').addEventListener('click', function() {
    userWeapon = 'sax';
    console.log(`Du har valt: ${userWeapon}`);
    getWinner();
});

document.getElementById('paper').addEventListener('click', function() {
    userWeapon = 'påse';
    console.log(`Du har valt: ${userWeapon}`);
    getWinner();
});

function resetGame() {
    matches = 0;
    stats = {
        wins: 0,
        loses: 0,
        draws: 0
    }
}

function showWinner(winner) {
    document.getElementById('winner').innerHTML = 'Vinnare avgörs...';
    matches++;
    setTimeout(async () => {
        if (matches === 3) {
            document.getElementById('winner').innerHTML = `
                <p>Vinster: ${stats.wins}</p>
                <p>Förluster: ${stats.loses}</p>
                <p>Oavgjort: ${stats.draws}</p>
            `
            stats.username = usernameElem.value.toLowerCase();
            manageHighscore(stats);

            resetGame();
        } else {
            document.getElementById('winner').innerHTML = winner;
        }
    }, 2000) // Kör denna funktion efter 2s
}

function getWinner() {
    computerWeapon = Math.round(Math.random() * 2); //Slumpa ett nummer mellan 0-2.

    if (computerWeapon == 0) {
        computerWeapon = 'sten';
    } else if(computerWeapon == 1) {
        computerWeapon = 'sax';
    } else if(computerWeapon == 2) {
        computerWeapon = 'påse';
    }

    console.log(`Ditt vapen: ${userWeapon} Datorns vapen: ${computerWeapon}`);

    //Avgör vinnare. Kollar först om det blir blivit oavgjort annars vem som vann.
    if (userWeapon == computerWeapon) {
        stats.draws++;
        showWinner('Det blev oavgjort');
    } else if (userWeapon == 'sten') {
        if (computerWeapon == 'sax') {
            stats.wins++;
            showWinner('Du vann!');
        } else {
            stats.loses++;
            showWinner('Datorn vann!');
        }
    } else if (userWeapon == 'sax') {
        if (computerWeapon == 'påse') {
            stats.wins++;
            showWinner('Du vann!');
        } else {
            stats.loses++;
            showWinner('Datorn vann!');
        }
    } else if (userWeapon == 'påse') {
        if (computerWeapon == 'sten') {
            stats.wins++;
            showWinner('Du vann!');
        } else {
            stats.loses++;
            showWinner('Datorn vann!');
        }
    }
}
