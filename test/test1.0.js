/* test v1.0 - tic tac toe minimax algorithm
    successful implementation of
    minimax algorithm
    store scores of game state in
    an ARRAY called 'scores' and
    returns the best score -- maximum
    score for computer and minimum
    score for user -- for every game state
    
    What's next:
    identifying the index of the best
    score on the game board
*/


var board = ['O', '', 'X',
             'X', '', '',
             'X', 'O', 'O'];

var user = 'O';
var comp = 'X';

var winCombi = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]];


var scoreList = minimax(board.slice(0,9), comp);

console.log(scoreList);


function hasWinner(gameBoard, player) {
   for (var i = 0; i < winCombi.length; i++) {
      if (gameBoard[winCombi[i][0]] === player && gameBoard[winCombi[i][1]] === player && gameBoard[winCombi[i][2]] === player) {
         return true; 
      }
   }
   return false;
}


function emptySpot(gameBoard) {
   var empty = [];
   for (var i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === '') {
         empty.push(i);
      }
   }
   return empty;
}



function minimax(gameBoard, player) {

   var empty = emptySpot(gameBoard);
   console.log("empty spot " + empty);
   
   if (hasWinner(gameBoard, comp)) {
      console.log("comp win return 10")
      return 10; 
   }
   else if (hasWinner(gameBoard, user)) {
      console.log("user win return -10")
      return -10; 
   }
   else if (empty.length === 0) {
      console.log("draw return 0")
      return 0; 
   }
   
   var scores = [];
   
   for (var i = 0; i < empty.length; i++) {
      console.log("start looping " + empty[i] + " of " + empty);
      
      var score;
      console.log("putting " + player + " on " + empty[i]);
      gameBoard[empty[i]] = player;
      
      console.log("game " + gameBoard);
      
      if (player === comp) {
         console.log("user turn");
         score = minimax(gameBoard, user);
      }
      else {
         console.log("comp turn");
         score = minimax(gameBoard, comp);
      }
      
      console.log("emptying field " + player);
      gameBoard[empty[i]] = '';
      
      console.log("appeding score " + score);
      scores.push(score);
   }
 
   console.log("scores generated " + scores);
   
   
   if (player === comp) {
       console.log("searching for max");
       var maxScore = Math.max.apply(null, scores);
       console.log("max score " + maxScore);
       return maxScore;
   }
   else {
      console.log("searching for min");
      var minScore = Math.min.apply(null, scores);
      console.log("min score " + minScore);
      return minScore;
   }
   
}