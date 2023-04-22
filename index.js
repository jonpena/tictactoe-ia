import normalize from './src/css/normalize.css';
import style from './src/css/style.css';

const menuContainer = document.querySelector('#menu .menu-container');
const iconMenu = document.querySelector('#menu .menu-container .setting-btn');
const btnPlay = document.querySelector('#menu .menu-container .main-btn');

const mainMenu = document.querySelector('#menu .menu-secondary');
const btnMode1 = document.querySelector('#menu .menu-secondary .mode-1');
const btnMode2 = document.querySelector('#menu .menu-secondary .mode-2');

let playerTurn = true;
let artificial = true;
let firstTurn = true;

/* Matrix represented as a one-dimensional array*/
const board = Array(9).fill(0);

/* List of all winning combinations */
const win = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Random = (n) => Math.floor(Math.random() * n);

function Validation(value) {
  let empate = 0;

  for (let i = 0; i < 8; i++) {
    if (
      board[win[i][0]] == value &&
      board[win[i][1]] == value &&
      board[win[i][2]] == value
    )
      return value;
    if (
      board[win[i][0]] == -value &&
      board[win[i][1]] == -value &&
      board[win[i][2]] == -value
    )
      return -value;
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] != 0) empate++;
  }

  return empate == 9 ? 1 : 0;
}

function WhoWon(v) {
  let draw = 0;

  for (let i = 0; i < 8; i++) {
    if (board[win[i][0]] == v && board[win[i][1]] == v && board[win[i][2]] == v)
      return i;
    if (
      board[win[i][0]] == -v &&
      board[win[i][1]] == -v &&
      board[win[i][2]] == -v
    )
      return i;
  }

  for (let i = 0; i < 9 && board[i] != 0; i++) draw++;

  return draw == 9 ? 8 : -1;
}

function Max(value, depth) {
  let temp = Validation(value);

  if (temp != 0) return temp;

  let valueMaximum = Number.MIN_VALUE;

  for (let i = 0; i < board.length; i++) {
    if (board[i] == 0) {
      board[i] = value;
      let utilidad = Min(value, depth + 1);
      board[i] = 0;

      if (utilidad >= valueMaximum) valueMaximum = utilidad;
    }
  }
  return valueMaximum;
}

function Min(value, depth) {
  let temp = Validation(value);

  if (temp != 0) return temp;

  let valueMinimum = Number.MAX_VALUE;

  for (let i = 0; i < board.length; i++) {
    if (board[i] == 0) {
      board[i] = -value;
      let utilidad = Max(value, depth + 1);
      board[i] = 0;

      if (utilidad <= valueMinimum) valueMinimum = utilidad;
    }
  }
  return valueMinimum;
}

function MiniMax(value, depth) {
  let bestPlay = 0;
  let bestValue = Number.MAX_VALUE;

  for (let i = 0; i < board.length; i++) {
    if (board[i] == 0) {
      board[i] = -value;
      let utilidad = Max(value, depth);
      board[i] = 0;

      if (utilidad < bestValue) {
        bestPlay = i;
        bestValue = utilidad;
      }
    }
  }
  return bestPlay;
}

function controlHoverAnimation(playerTurn) {
  let container = document.querySelector('.container');

  for (let i = 0; i < 9; i++) {
    let temp = container.children[i].children[4];

    if (temp.classList.contains('xhover')) {
      temp.classList.remove('xhover');
    } else if (temp.classList.contains('ohover')) {
      temp.classList.remove('ohover');
    }
  }

  for (let i = 0; i < 9; i++) {
    if (playerTurn && board[i] == 0) {
      container.children[i].children[4].classList.toggle('xhover');
    } else if (board[i] == 0) {
      container.children[i].children[4].classList.toggle('ohover');
    }
  }
}

function restartGame() {
  playerTurn = true;

  let container = document.querySelector('.container');

  for (var i = 0; i < board.length; i++) {
    if (board[i] != 0) {
      let temp = container.children[i].children[4];

      board[i] = 0;
      container.children[i].style.removeProperty('--t');
      temp.style.removeProperty('--t2');

      if (temp.classList.contains('xdraw')) {
        temp.classList.remove('xdraw');
      } else {
        temp.classList.remove('odraw');
      }
    }
  }
}

function controlWinnerAnimation() {
  const winnerText = document.querySelector(
    '#menu .menu-container .winner-text'
  );

  if (Validation(2) != 0) {
    switch (Validation(2)) {
      case 2:
        winnerText.innerHTML = artificial ? 'PLAYER WON' : 'PLAYER 1 WON';
        break;
      case -2:
        winnerText.innerHTML = artificial ? 'BOT WON' : 'PLAYER 2 WON';
        break;
      case 1:
        winnerText.innerHTML = 'IT´S A TIE';
        break;
    }

    menuContainer.classList.toggle('menu-animate');
    menuContainer.style.transition = 'opacity 1s 1.5s ease';
  }

  let value = WhoWon(2);

  if (value != -1) {
    container = document.querySelector('.container');

    for (let i = 0; i < 3; i++) {
      let temp = container.children[win[value][i]].children[4];

      temp.style.setProperty('--t2', '2');
    }
  }
}

window.addEventListener('click', (event) => {
  if (Validation(2) == 0) {
    let temp = event.target;

    let str = temp.parentElement.classList[0];

    let n = parseInt(str[str.length - 1]) - 1;

    if (temp.classList.contains('front') && board[n] == 0) {
      if (playerTurn) {
        temp.classList.toggle('xdraw');
        temp.parentElement.style.setProperty('--t', '1');
        board[n] = 2;
      } else if (!playerTurn) {
        temp = temp.parentElement;
        temp.children[4].classList.toggle('odraw');
        temp.style.setProperty('--t', '1');

        let str = temp.classList[0];
        let n = parseInt(str[str.length - 1]) - 1;
        board[n] = -2;
      }

      if (artificial == false) playerTurn = !playerTurn;

      if (artificial == true) {
        // Intelligence Artificial
        let temp = n;

        switch (firstTurn) {
          case true:
            do {
              n = Random(8);
            } while (n == temp);
            break;

          case false:
            n = MiniMax(2, 0);
            break;
        }

        firstTurn = false;

        if (Validation(2) != 2 && board[n] == 0) {
          board[n] = -2;
          temp = document.querySelectorAll('.cube .front');
          temp[n].classList.toggle('odraw');
          temp[n].parentElement.style.setProperty('--t', '1');
        }
      }

      controlHoverAnimation(playerTurn);

      controlWinnerAnimation();
    }
  }
});

btnPlay.addEventListener('click', () => {
  firstTurn = true;
  restartGame();
  controlHoverAnimation(playerTurn);
  menuContainer.classList.toggle('menu-animate');
  menuContainer.style.transition = 'opacity 800ms ease, z-index 800ms ease';
});

iconMenu.addEventListener('click', () => {
  mainMenu.classList.toggle('menu-toggle');
  iconMenu.classList.toggle('menu-toggle');
});

btnMode1.addEventListener('click', () => {
  artificial = true;
  btnMode1.style.backgroundColor = '#283148';
  btnMode2.style.backgroundColor = 'transparent';
});

btnMode2.addEventListener('click', () => {
  artificial = false;
  btnMode2.style.backgroundColor = '#283148';
  btnMode1.style.backgroundColor = 'transparent';
});
