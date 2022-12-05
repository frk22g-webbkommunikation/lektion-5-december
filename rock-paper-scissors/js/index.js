//Hämta användarens val

//Slumpa datorns val

//Avgör vinnare

//Visa vinnare

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, 
    updateDoc, doc, increment } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
const highscoreElem = document.querySelector('#highscore');

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

async function saveHighscore() {
    try {
        await addDoc(collection(db, 'highscore'), stats);
    } catch (error) {
        console.log(error);
    }
}

function showHighscore(highscoreList) {
    highscoreList.forEach((score) => {
        const elem = `
            <article>
                <h3>${score.data().username}</h3>
                <p>Vinster: ${score.data().wins}</p>
                <p>Förluster: ${score.data().loses}</p>
                <p>Oavgjort: ${score.data().draws}</p>
            </article>
        `;
        highscoreElem.insertAdjacentHTML('beforeend', elem);
    })
}

async function getHighscore() {
    try {
        const highscoreList = await getDocs(collection(db, 'highscore'));
        showHighscore(highscoreList);
    } catch (error) {
        console.log(error);
    }
}

async function checkIfUsernameExists() {
    try {
        const usernameQuery = query(collection(db, 'highscore'), where('username', '==', stats.username));
        const result = await getDocs(usernameQuery);
        let resultUsername = {};

        result.forEach((username) => {
            resultUsername = username;
        });

        return resultUsername;
    } catch (error) {
        console.log(error);
    }
}

async function updateHighscore(userID) {
    try {
        await updateDoc(doc(db, 'highscore', userID), {
            wins: increment(stats.wins), // Adderar vinster med det som finns i databasen
            loses: increment(stats.loses),
            draws: increment(stats.draws)
        })
    } catch (error) {
        console.log(error);
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
            const username = await checkIfUsernameExists();
            // console.log('Användare: ', username.data());
            // console.log('Id: ', username.id);
            const userId = username.id;
            
            if (userId) {
                // Uppdatera detta med ny score
                await updateHighscore(username.id);
            } else {
                // Spara highscore som en nytt dokument
                await saveHighscore();
            }
            
            await getHighscore();

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
