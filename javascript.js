`use strict`;

const setPlayerDetails = function () {
    document.body.style.filter = `blur(20px)`;

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const playerName = prompt(`Please Enter your name: `);
            document.querySelector(`.player-1-header`).textContent = playerName;

            document.body.style.filter = `none`;

            resolve(playerName);
        }, 15);
    });
};

const choices = [`scissor`, `rock`, `paper`];

// player name
let capturePlayerName;
setPlayerDetails()
    .then((playerName) => {
        capturePlayerName = playerName;
    })
    .catch((error) => {
        console.error(error);
    });

// SCORES
let playerScore = 0;
let computerScore = 0;

const playButton = document.querySelector(`.play--button`);
const player1Choice = document.querySelector(`.player--1-image`);
const player2Choice = document.querySelector(`.player--2-image`);
const winnerOutput = document.querySelector(`#output`);

const playerNameEle = document.querySelector(`.player-1-header`);
const computerNameEle = document.querySelector(`.player-2-header`);

// player choices
const chooseRock = document.querySelector(`.btn__rock`);
const choosePaper = document.querySelector(`.btn__paper`);
const chooseScissor = document.querySelector(`.btn__scissor`);
const choiceContainer = document.querySelector(`.choice__options`);

// image links
let imgSrc1 = player1Choice.getAttribute(`src`).split(`/`);
const mainSrcPlayer1 = imgSrc1[imgSrc1.length - 1];
imgSrc1.pop();
let imgSrc2 = player2Choice.getAttribute(`src`).split(`/`);
imgSrc2.pop();
const mainSrcPlayer2 = imgSrc2[imgSrc2.length - 1];

// utility method
const checkWinner = function (player1, player2) {
    player1 = player1.toLowerCase();
    player2 = player2.toLowerCase();

    let winner;

    if (player1 === `paper`) {
        winner =
            player2 === `scissor`
                ? `Computer Wins!`
                : player2 === `paper`
                ? `Draw`
                : `${capturePlayerName} Wins!`;
    }

    if (player1 === `scissor`) {
        winner =
            player2 === `rock`
                ? `Computer Wins!`
                : player2 === `scissor`
                ? `Draw`
                : `${capturePlayerName} Wins!`;
    }

    if (player1 === `rock`) {
        winner =
            player2 === `paper`
                ? `Computer Wins!`
                : player2 === `rock`
                ? `Draw`
                : `${capturePlayerName} Wins!`;
    }

    const winnerHeader = winner.split(` `)[0];
    if (winnerHeader === `Computer`) {
        ++computerScore;
    } else if (winnerHeader === `${capturePlayerName}`) {
        ++playerScore;
    }

    playerNameEle.textContent = capturePlayerName + ` [ ${playerScore} ]`;
    computerNameEle.textContent = `Computer [ ${computerScore} ]`;

    return winner;
};

// delegate choices to choice container
choiceContainer.addEventListener(`click`, function (e) {
    const choice = e.target.closest(".btn__choice");
    if (!choice) return;

    console.log(`button chosen : `, choice);

    let playerChose;
    switch (choice) {
        case chooseRock:
            player1Choice.setAttribute(
                `src`,
                `${imgSrc1.join(`/`)}/player-1-${choices[1]}.png`
            );
            playerChose = 1;
            break;
        case choosePaper:
            player1Choice.setAttribute(
                `src`,
                `${imgSrc1.join(`/`)}/player-1-${choices[2]}.png`
            );
            playerChose = 2;
            break;
        case chooseScissor:
            player1Choice.setAttribute(
                `src`,
                `${imgSrc1.join(`/`)}/player-1-${choices[0]}.png`
            );
            playerChose = 0;
            break;
        default:
            return;
    }

    // COMPUTER
    const randomChoice2 = Math.trunc(Math.random() * 3);
    player2Choice.setAttribute(
        `src`,
        `${imgSrc1.join(`/`)}/player-2-${choices[randomChoice2]}.png`
    );

    winnerOutput.textContent = checkWinner(
        choices[playerChose],
        choices[randomChoice2]
    );
    winnerOutput.style.textDecoration = `underline`;

    console.log(
        `Scores : \nplayer : ${playerScore}\nComputer : ${computerScore}`
    );
});
