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
const resumeButton = document.querySelector(`.pause_button`);
const gameRestartButton = document.querySelector(`.reset_button`);
const pauseButton = document.querySelector(`.pause_enable_button`);
const pauseMessageMain = document.querySelector(`.pause_message_main`);

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
        if (![gameOverMessage, gameRestartButton].includes(child)) {
            child.classList.remove(`blurry_container`);
        }
    }
    winnerOutput.textContent = ``;
    gameRestartButton.style.display = `none`;

    if (isWebsiteUsedOnMobile()) {
        pauseButton.style.display = `block`;
        pauseGameMessage.style.opacity = 0;
        pauseMessageMain.style.opacity = 0;
    }
    if (!isWebsiteUsedOnMobile()) {
        pauseButton.style.display = `none`;
    }

    // reset animation
    chooseRock.classList.remove(`popup_active`);
    choosePaper.classList.remove(`popup_active`);
    chooseScissor.classList.remove(`popup_active`);
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
    winningScore: 10,
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

// Extra Utility methods
const isWebsiteUsedOnMobile = function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
    // return true;
};

// GAME START
initGame();

// game methods
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

            // animation
            chooseRock.classList.add(`popup_active`);

            break;
        case choosePaper:
            playerChoiceImage = `${imgSrc1.join(`/`)}/player-1-${
                choices[2]
            }.png`;
            playerChose = 2;

            // animation
            choosePaper.classList.add(`popup_active`);
            break;
        case chooseScissor:
            playerChoiceImage = `${imgSrc1.join(`/`)}/player-1-${
                choices[0]
            }.png`;
            playerChose = 0;

            // animation
            chooseScissor.classList.add(`popup_active`);
            break;
        default:
            return;
    }

    // SET PLAYER CHOICE IMAGE
    player1Choice.classList.toggle(`hide`);
    setTimeout(() => {
        player1Choice.setAttribute(`src`, playerChoiceImage);
        player1Choice.classList.toggle(`hide`);
    }, 400);

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


    // animation
    setTimeout(() => {
        chooseRock.classList.remove(`popup_active`);
        choosePaper.classList.remove(`popup_active`);
        chooseScissor.classList.remove(`popup_active`);
    }, 1000);


    setTimeout(() => {
        winnerOutput.textContent = checkWinner(
            choices[playerChose],
            choices[randomChoice2]
        );
        
        winnerOutput.style.textDecoration = `underline`;
    }, 400);

   
});

// Events for reset and pause game.
document.body.addEventListener(`keydown`, function (e) {
    if (gameState.playing) {
        if (e.key.toLowerCase() === `p` && !isWebsiteUsedOnMobile()) {
            /* GAME PAUSED */
            togglePause();
        } else {
            return;
        }
    } else if (e.key.toLowerCase() === `r`) {
        /* GAME RESET */
        initGame();
    }
});

// game resume button
resumeButton.addEventListener(`click`, function (e) {
    if (!gameState.playing) return;
    togglePause();
});

const togglePause = function () {
    blurElementsExcept([pauseGameMessage, resumeButton]);
    const pauseMessageOpacity = Number(pauseGameMessage.style.opacity);

    pauseGameMessage.style.opacity = pauseMessageOpacity === 0 ? 100 : 0;

    gameState.paused = gameState.paused ? false : true;

    // show pause button
    resumeButton.style.opacity =
        isWebsiteUsedOnMobile() && Number(resumeButton.style.opacity) === 0
            ? 100
            : 0;

    let pauseMessageText = isWebsiteUsedOnMobile()
        ? `Game Paused!`
        : `Game Paused! Press P to Resume`;
    pauseGameMessage.textContent = pauseMessageText;
};

// blur effect, pause / win condition
const blurElementsExcept = function (element) {
    const bodyChildren = document.body.children;

    for (const child of bodyChildren) {
        if (!element.includes(child)) {
            child.classList.toggle(`blurry_container`);
        }
    }
};

// game over UI
const setGameOver = function () {
    let gameOverText = `Game Over! Winner : ${gameState.whoIsTheWinner()}.`;
    if (!isWebsiteUsedOnMobile()) {
        gameOverText += `, Press R to restart the game.`;
        blurElementsExcept([gameOverMessage]);
    } else {
        blurElementsExcept([gameOverMessage, gameRestartButton]);
        gameRestartButton.style.display = `block`;
        gameRestartButton.style.opacity =
            Number(gameRestartButton.style.opacity) === 0 ? 100 : 0;
    }

    gameOverMessage.style.display = `block`;
    gameOverMessage.textContent = gameOverText;
};

// pause button in phones
pauseButton.addEventListener(`click`, () => {
    if (gameState.paused || !gameState.playing) return;
    togglePause();
});

// game restart button
gameRestartButton.addEventListener(`click`, function (e) {
    if (gameState.playing) return;
    gameRestartButton.style.display = `block`;
    initGame();
});


console.log(`container : `, document.querySelector(`.choice_buttons`));
