import { db, collection, addDoc, getDocs, query, 
    where, updateDoc, doc, increment } from './firebase-config.js';

const highscoreElem = document.querySelector('#highscore');

async function saveHighscore(stats) {
    try {
        await addDoc(collection(db, 'highscore'), stats);
    } catch (error) {
        console.log(error);
    }
}

async function getHighscore() {
    try {
        const highscoreList = await getDocs(collection(db, 'highscore'));
        showHighscore(highscoreList);
    } catch (error) {
        console.log(error);
    }
}

async function updateHighscore(userID, stats) {
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

async function checkIfUsernameExists(stats) {
    try {
        // Här bygger vi upp en fråga till vår databas, först bestämmer vi i vilken collection vi vill söka i collection(db, 'highscore')
        // Sen vad vi ska söka efter och detta fall efter ett specifikt användarnamn where('username', '==', stats.username);
        // Till sist utför vi frågan mot databasen await getDocs(usernameQuery);
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

async function manageHighscore(stats) {

    const username = await checkIfUsernameExists(stats);
    // console.log('Användare: ', username.data());
    // console.log('Id: ', username.id);
    const userId = username.id;
    
    if (userId) {
        // Uppdatera användaren med ny score
        await updateHighscore(username.id, stats);
    } else {
        // Spara highscore som en nytt dokument
        await saveHighscore(stats);
    }
    
    await getHighscore();
}

export { manageHighscore }