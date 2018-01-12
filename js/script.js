var game = {
  user: '',
  computer: '',
  currentPlayer: '',
  board: []
}

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

// if DOM is ready start the game
if (document.readyState === 'complete' || document.readyState !== 'loading') {
  startGame();
} else {
  document.addEventListener('DOMContentLoaded', startGame);
}

// initialized game board arrays
function startGame() {
  for (var i = 0; i < 9; i++) {
    game.board[i] = '';
  }
}

// set the game
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
    setTimeout(firstMove, 600);
  }
}

// first move of the computer
// if it sets to X, it chooses
// random spot on the board
function firstMove() {
  var randomSpot = Math.floor(Math.random() * 9);
  insertMove(randomSpot);
}

// insert the player character
// to the game board
function insertMove(id) {
  var gameField = document.getElementById('field-' + id);

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
      var bestMove = minimax(game.board, game.computer, 0);

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

  var winningArr = hasWinner(game.board, game[player], true);

  if (winningArr !== true && winningArr !== false) {
    for (var i = 0; i < winningArr.length; i++) {
      var winningField = document.getElementById('field-' + winningArr[i]);
      winningField.classList.add('winner');
    }

    // i'm confident with my AI algorithm
    // it's either draw or you will lose :P
    stat.innerHTML = player === 'user' ? 'You Win!' : 'You Lose';
    info.style.display = 'block';
    gameOver();
  }

}

// game is over remove the onClick attribute
// of remaining empty field and reset the
// game board object to prevent Draw
function gameOver() {
  var remainFields = checkEmptyFields(game.board);

  if (remainFields !== 0) {
    for (var i = 0; i < remainFields.length; i++) {
      var emptyField = document.getElementById('field-' + remainFields[i]);
      emptyField.removeAttribute('onClick');
    }
  }

  startGame(); // reset the game.board
}

// check if there is no empty field in the
// game board and no winners it means draw
function checkForDraw() {
  if (game.board.indexOf('') === -1) {
    stat.innerHTML = 'Draw';
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
  for (var i = 0; i < 9; i++) {
    var attr = 'insertMove(' + i + ')';
    var gameField = document.getElementById('field-' + i);
    gameField.innerHTML = '';
    gameField.setAttribute('onClick', attr);
    gameField.classList.remove('winner');
  }

  modal.style.display = 'block';
}

// check for winner based
// in the winning combination array
function hasWinner(gameBoard, player, winner = false) {
  for (var i = 0; i < winCombination.length; i++) {
    if (gameBoard[winCombination[i][0]] === player && gameBoard[winCombination[i][1]] === player && gameBoard[winCombination[i][2]] === player) {
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

// look for empty spot on the game board and
// return an array of index of empty spot
function checkEmptyFields(gameBoard) {
  var emptyFields = [];
  for (var i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === '') {
      emptyFields.push(i);
    }
  }
  return emptyFields;
}

// AI - unbeatable
// decision making of computer player
// using minimax algorithm
function minimax(gameBoard, player, depth) {

  var emptyFields = checkEmptyFields(gameBoard);

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

  // array of scores object of every game state
  var scoreList = [];
  depth++;

  for (var i = 0; i < emptyFields.length; i++) {

    var objScore = {};

    objScore.index = emptyFields[i];
    gameBoard[emptyFields[i]] = player;

    if (player === game.computer) {
      var result = minimax(gameBoard, game.user, depth);
      objScore.score = result.score;
    } else {
      var result = minimax(gameBoard, game.computer, depth);
      objScore.score = result.score;
    }

    // reset the empty field
    gameBoard[emptyFields[i]] = '';

    scoreList.push(objScore);
  }

  // look for maximum and minimum score
  // return an object with the index and score
  // of the best move
  if (player === game.computer) {
    var maxScore = Math.max.apply(null, scoreList.map(function (obj) {
      return obj.score;
    }));

    return scoreList.find(function (obj) {
      return obj.score == maxScore;
    });
  } else {
    var minScore = Math.min.apply(null, scoreList.map(function (obj) {
      return obj.score;
    }));

    return scoreList.find(function (obj) {
      return obj.score == minScore;
    });
  }
}