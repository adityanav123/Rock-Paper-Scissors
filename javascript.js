`use strict`;

const choices = [`scissor`, `rock`, `paper`];

const playButton = document.querySelector(`.play--button`);
const player1Choice = document.querySelector(`.player--1-image`);
const player2Choice = document.querySelector(`.player--2-image`);

const winnerOutput = document.querySelector(`#output`);
// console.log(winnerOutput);

// console.log(player1Choice.getAttribute(`src`).split(`/`));

let imgSrc1 = player1Choice.getAttribute(`src`).split(`/`);
const mainSrcPlayer1 = imgSrc1[imgSrc1.length - 1];
imgSrc1.pop();
// console.log(mainSrcPlayer1);

let imgSrc2 = player2Choice.getAttribute(`src`).split(`/`);
imgSrc2.pop();
const mainSrcPlayer2 = imgSrc2[imgSrc2.length - 1];
// console.log(mainSrcPlayer2);

const checkWinner = function (player1, player2) {
    player1 = player1.toLowerCase();
    player2 = player2.toLowerCase();

    if (player1 === `paper`) {
        return player2 === `scissor`
            ? `player-2`
            : player2 === `paper`
            ? `Draw`
            : `player-1`;
    }

    if (player1 === `scissor`) {
        return player2 === `rock`
            ? `player-2`
            : player2 === `scissor`
            ? `Draw`
            : `player-1`;
    }

    if (player1 === `rock`) {
        return player2 === `paper`
            ? `player-2`
            : player2 === `rock`
            ? `Draw`
            : `player-1`;
    }
};

playButton.addEventListener(`click`, function (e) {
    const randomChoice1 = Math.trunc(Math.random() * 3);
    const randomChoice2 = Math.trunc(Math.random() * 3);

    // console.log(`player1 : `, choices[randomChoice1]);
    // console.log(`player2 : `, choices[randomChoice2]);

    player1Choice.setAttribute(
        `src`,
        `${imgSrc1.join(`/`)}/player-1-${choices[randomChoice1]}.png`
    );

    player2Choice.setAttribute(
        `src`,
        `${imgSrc1.join(`/`)}/player-2-${choices[randomChoice2]}.png`
    );

    // console.log(`${imgSrc1.join(`/`)}/player-1-${choices[randomChoice1]}.png`);

    winnerOutput.textContent = checkWinner(
        choices[randomChoice1],
        choices[randomChoice2]
    );
    winnerOutput.style.textDecoration = `underline`;
});
