/* test v3 - tic tac toe minimax algorithm
    successful implementation of
    minimax algorithm
    store scores of game state in
    an OBJECT called 'scores' 
    storing both index of empty spot
    and respective score
    returns the best score -- maximum
    score for computer and minimum
    score for user -- for every game state
    
    returning the best score which is
    the best move as object with index
    of the best move on the game board
    
    additional:
    uses 'depth' for smart move
    eg. block the opponent winning move
    even there is no chance of winning
    
    SUCCESSFUL!!!
*/


var board = ['', 'X', '',
             '', '', 'X',
             'O', 'O', 'X'];

var user = 'X';
var comp = 'O';

var winCombi = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]];


var scoreList = minimax(board.slice(0,9), comp, 0);

console.log(JSON.stringify(scoreList));


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



function minimax(gameBoard, player, depth) {

   var empty = emptySpot(gameBoard);
   console.log("empty spot " + empty);
   
   if (hasWinner(gameBoard, comp)) {
      console.log("comp win return 10")
      return {score: 10 - depth}; 
   }
   else if (hasWinner(gameBoard, user)) {
      console.log("user win return -10")
      return {score: depth - 10}; 
   }
   else if (empty.length === 0) {
      console.log("draw return 0")
      return {score: 0}; 
   }
   
   var scores = [];
   depth++;
   
   for (var i = 0; i < empty.length; i++) {
      console.log("start looping " + empty[i] + " of " + empty);
      
      var score = {};
      console.log("putting " + player + " on " + empty[i]);
      
      score.index = empty[i];
      
      gameBoard[empty[i]] = player;
      
      console.log("game " + gameBoard);
      
      if (player === comp) {
         console.log("user turn");
         var result = minimax(gameBoard, user, depth);
         score.score = result.score;
      }
      else {
         console.log("comp turn");
         var result = minimax(gameBoard, comp, depth);
         score.score = result.score;
      }
      
      console.log("emptying field " + player);
      gameBoard[empty[i]] = '';
      
      console.log("appeding score " + JSON.stringify(score));
      scores.push(score);
   }
 
   console.log("scores generated " + JSON.stringify(scores));
   
   
   if (player === comp) {
       console.log("searching for max");
       var maxScore = Math.max.apply(null, scores.map(function(obj) {return obj.score;}));
       
       console.log("max score " + maxScore);
       return scores.find(function(obj) {return obj.score == maxScore;});
   }
   
   else {
      console.log("searching for min");
      var minScore = Math.min.apply(null, scores.map(function(obj) {return obj.score;}));
      
      console.log("min score " + minScore);
      return scores.find(function(obj) {return obj.score == minScore;});
   }
   
}