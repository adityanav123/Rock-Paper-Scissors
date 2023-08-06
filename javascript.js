`use strict`;

// HTML Elements
const playButton = document.querySelector(`.play--button`);
const player1Choice = document.querySelector(`.player--1-image`);
const player2Choice = document.querySelector(`.player--2-image`);
const winnerOutput = document.querySelector(`#output`);

const playerNameEle = document.querySelector(`.player-1-header`);
const computerNameEle = document.querySelector(`.player-2-header`);

const gameOverMessage = document.querySelector(`.game__over__message`);
const pauseGameMessage = document.querySelector(`.pause__message`);

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

const initGame = function () {
    setPlayerName();
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.playing = true;
    gameState.winner = ``;
    gameOverMessage.style.display = `none`;
    computerNameEle.textContent = `Computer`;

    const bodyChildren = document.body.children;
    for (const child of bodyChildren) {
        if (child !== gameOverMessage) {
            child.classList.remove(`blurry_container`);
        }
    }
    winnerOutput.textContent = ``;
};

const setPlayerName = function () {
    fetchPlayerName()
        .then((playerName) => {
            gameState.playerName = playerName;
        })
        .catch((error) => {
            console.error(error);
        });
};

const fetchPlayerName = function () {
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

// Game State
const gameState = {
    playing: true,
    playerScore: 0,
    computerScore: 0,
    winningScore: 20,
    winner: ``,
    playerName: ``,
    paused: false,

    increasePlayerScore() {
        this.playerScore++;
    },

    increaseComputerScore() {
        this.computerScore++;
    },

    whoIsTheWinner() {
        this.winner =
            this.playerScore == this.winningScore
                ? this.playerName
                : `Computer`;
        return this.winner;
    },
};

// GAME START
initGame();

// utility functions
const checkGameOver = function () {
    gameState.playing = !(
        gameState.playerScore >= gameState.winningScore ||
        gameState.computerScore >= gameState.winningScore
    );
};

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
                : `${gameState.playerName} Wins!`;
    }

    if (player1 === `scissor`) {
        winner =
            player2 === `rock`
                ? `Computer Wins!`
                : player2 === `scissor`
                ? `Draw`
                : `${gameState.playerName} Wins!`;
    }

    if (player1 === `rock`) {
        winner =
            player2 === `paper`
                ? `Computer Wins!`
                : player2 === `rock`
                ? `Draw`
                : `${gameState.playerName} Wins!`;
    }

    if (winner === `Computer Wins!`) {
        gameState.increaseComputerScore();
    } else if (winner === `${gameState.playerName} Wins!`) {
        gameState.increasePlayerScore();
    }

    playerNameEle.textContent =
        gameState.playerName +
        ` [ ${gameState.playerScore} / ${gameState.winningScore}]`;
    computerNameEle.textContent = `Computer [ ${gameState.computerScore} / ${gameState.winningScore}]`;

    // check game over condition
    checkGameOver();

    if (!gameState.playing) {
        setGameOver();
    }

    return winner;
};

// delegate choices to choice container
choiceContainer.addEventListener(`click`, function (e) {
    // can't play when game end / paused
    if (!gameState.playing || gameState.paused) return;

    const choice = e.target.closest(".btn__choice");
    if (!choice) return;

    let playerChose;
    let playerChoiceImage = ``;
    switch (choice) {
        case chooseRock:
            playerChoiceImage = `${imgSrc1.join(`/`)}/player-1-${
                choices[1]
            }.png`;
            playerChose = 1;
            break;
        case choosePaper:
            playerChoiceImage = `${imgSrc1.join(`/`)}/player-1-${
                choices[2]
            }.png`;
            playerChose = 2;
            break;
        case chooseScissor:
            playerChoiceImage = `${imgSrc1.join(`/`)}/player-1-${
                choices[0]
            }.png`;
            playerChose = 0;
            break;
        default:
            return;
    }

    // SET PLAYER CHOICE IMAGE
    player1Choice.classList.toggle(`hide`);
    setTimeout(() => {
        player1Choice.setAttribute(`src`, playerChoiceImage);
        player1Choice.classList.toggle(`hide`);
    }, 500);

    // COMPUTER
    const randomChoice2 = Math.trunc(Math.random() * 3);

    player2Choice.classList.toggle(`hide`);
    setTimeout(() => {
        player2Choice.setAttribute(
            `src`,
            `${imgSrc1.join(`/`)}/player-2-${choices[randomChoice2]}.png`
        );
        player2Choice.classList.toggle(`hide`);
    }, 400);

    winnerOutput.textContent = checkWinner(
        choices[playerChose],
        choices[randomChoice2]
    );
    winnerOutput.style.textDecoration = `underline`;
});

// Events for reset and pause game.
document.body.addEventListener(`keydown`, function (e) {
    if (gameState.playing) {
        if (e.key.toLowerCase() === `p`) {
            /* GAME PAUSED */
            blurElementsExcept(pauseGameMessage);

            const pauseMessageOpacity = Number(pauseGameMessage.style.opacity);

            pauseGameMessage.style.opacity =
                pauseMessageOpacity === 0 ? 100 : 0;

            gameState.paused = gameState.paused ? false : true;
        } else {
            return;
        }
    } else if (e.key.toLowerCase() === `r`) {
        /* GAME RESET */
        initGame();
    }
});

// blur effect, pause / win condition
const blurElementsExcept = function (element) {
    const bodyChildren = document.body.children;

    for (const child of bodyChildren) {
        if (child !== element) {
            child.classList.toggle(`blurry_container`);
        }
    }
};

// game over UI
const setGameOver = function () {
    gameOverMessage.style.display = `block`;
    gameOverMessage.textContent = `Game Over! Winner : ${gameState.whoIsTheWinner()}, Press 'r' or 'R' to restart the game.`;

    blurElementsExcept(gameOverMessage);
};
