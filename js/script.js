const game = {
  user: '',
  computer: '',
  currentPlayer: '',
  board: []
};

const winCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const stat  = document.getElementById('status');
const info  = document.getElementById('myAlert');
const modal = document.getElementById('myModal');

if (document.readyState === 'complete' || document.readyState !== 'loading') {
  startGame();
} else {
  document.addEventListener('DOMContentLoaded', startGame);
}

function startGame() {
  for (let i = 0; i < 9; i++) {
    game.board[i] = '';
  }
}

function setGame(id) {
  if (id === 'x') {
    game.user = 'X';
    game.computer = 'O';
    game.currentPlayer = 'user';
    modal.style.display = 'none';
  } else {
    game.user = 'O';
    game.computer = 'X';
    game.currentPlayer = 'computer';
    modal.style.display = 'none';
    setTimeout(firstMove, 50);
  }
}

function firstMove() {
  const randomSpot = Math.floor(Math.random() * 9);
  insertMove(randomSpot);
}

function insertMove(id) {
  let gameField = document.getElementById('field-' + id);

  if (game.board[id] === '') {

    if (game.currentPlayer === 'user') {
      gameField.innerHTML = game.user;
      gameField.removeAttribute('onClick');
      game.board[id] = game.user;
      game.currentPlayer = 'computer';
    } else {
      gameField.innerHTML = game.computer;
      gameField.removeAttribute('onClick');
      game.board[id] = game.computer;
      game.currentPlayer = 'user';
    }

    if (game.currentPlayer === 'computer') {
      let bestMove = minimax(game.board, game.computer, 0);

      setTimeout(function () {
        insertMove(bestMove.index);
      }, 600);
    }
    checkForWinner(game.currentPlayer);
    checkForDraw();
  }
}


function checkForWinner(player) {

  player === 'user' ? player = 'computer' : player = 'user';
  const winningArr = hasWinner(game.board, game[player], true);

  if (winningArr !== true && winningArr !== false) {
    for (let i = 0; i < winningArr.length; i++) {
      let winningField = document.getElementById(`field-${winningArr[i]}`);
      winningField.classList.add('winner');
    }

    stat.innerHTML = player === 'user' ? 'شما برنده شدید!' : 'شما بازنده شدید!';
    info.style.display = 'block';
    gameOver();
  }

}

function gameOver() {
  const remainFields = checkEmptyFields(game.board);

  if (remainFields !== 0) {
    for (let i = 0; i < remainFields.length; i++) {
      const emptyField = document.getElementById(`field-${remainFields[i]}`);
      emptyField.removeAttribute('onClick');
    }
  }

  startGame(); // reset the game.board
}

function checkForDraw() {
  if (game.board.indexOf('') === -1) {
    stat.innerHTML = 'مساوی';
    info.style.display = 'block';
    startGame();
  }
}

function resetGame() {
  game.user = '';
  game.computer = '';
  game.currentPlayer = '';
  info.style.display = 'none';

  // remove all characters on the game field
  // and put back the attribute onClick
  for (let i = 0; i < 9; i++) {
    const attr = `insertMove(${i})`;
    const gameField = document.getElementById(`field-${i}`);
    gameField.innerHTML = '';
    gameField.setAttribute('onClick', attr);
    gameField.classList.remove('winner');
  }

  modal.style.display = 'flex';
}

function hasWinner(gameBoard, player, winner = false) {
  for (let i = 0; i < winCombination.length; i++) {
    if (gameBoard[winCombination[i][0]] === player &&
        gameBoard[winCombination[i][1]] === player &&
        gameBoard[winCombination[i][2]] === player) {
      if (winner) {
        return [winCombination[i][0],
                winCombination[i][1],
                winCombination[i][2]
        ];
      }
      return true;
    }
  }
  return false;
}

function checkEmptyFields(gameBoard) {
  const emptyFields = [];
  for (let i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === '') {
      emptyFields.push(i);
    }
  }
  return emptyFields;
}

function minimax(gameBoard, player, depth) {

  let emptyFields = checkEmptyFields(gameBoard);

  if (hasWinner(gameBoard, game.computer)) {
    return {
      score: 10 - depth
    };
  } else if (hasWinner(gameBoard, game.user)) {
    return {
      score: depth - 10
    };
  } else if (emptyFields.length === 0) {
    return {
      score: 0
    };
  }

  let scoreList = [];
  depth++;

  for (let i = 0; i < emptyFields.length; i++) {

    let objScore = {};

    objScore.index = emptyFields[i];
    gameBoard[emptyFields[i]] = player;

    if (player === game.computer) {
      let result = minimax(gameBoard, game.user, depth);
      objScore.score = result.score;
    } else {
      let result = minimax(gameBoard, game.computer, depth);
      objScore.score = result.score;
    }

    gameBoard[emptyFields[i]] = '';

    scoreList.push(objScore);
  }

  if (player === game.computer) {
    let maxScore = Math.max.apply(null, scoreList.map(function (obj) {
      return obj.score;
    }));

    return scoreList.find(function (obj) {
      return obj.score == maxScore;
    });
  } else {
    let minScore = Math.min.apply(null, scoreList.map(function (obj) {
      return obj.score;
    }));

    return scoreList.find(function (obj) {
      return obj.score == minScore;
    });
  }
}