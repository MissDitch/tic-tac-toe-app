////minimax function

var origBoard = [0,1 ,2,3,4 ,5, 6 ,7,8];
//var origBoard = ['O',1 ,'X','X',4 ,'X', 6 ,'O','O'];

// human
var huPlayer = 'O';

// ai
var aiPlayer = 'X';

// returns list of the indexes of empty spots on the board
function emptyIndexies(state){
  return  state.filter(s => s != "O" && s != "X");
}

// winning combinations using the state indexies
function winning(state, player){
 /* if (
 (state[0] == player && state[1] == player && state[2] == player) ||
 (state[3] == player && state[4] == player && state[5] == player) ||
 (state[6] == player && state[7] == player && state[8] == player) ||
 (state[0] == player && state[3] == player && state[6] == player) ||
 (state[1] == player && state[4] == player && state[7] == player) ||
 (state[2] == player && state[5] == player && state[8] == player) ||
 (state[0] == player && state[4] == player && state[8] == player) ||
 (state[2] == player && state[4] == player && state[6] == player)
 ) {
 return true;
 } else {
 return false;
 }  */
 var state = state,
 player = player;

function checkRows(state, player) {
   for (var i = 0; i <= 6; i = i + 3) {
     if (state[i] === player && state[i + 1] === state[i] && state[i + 2] === player) { return true; }
   }
 }
function checkColumns(state, player) {
   for (var i = 0; i <= 2; i++) {
     if (state[i] === player && state[i + 3] === state[i] && state[i + 6] === player) { return true; }
   }
 }
function checkDiagonals(state, player) {
   for (var i = 0, j = 4; i <= 2; i = i+2, j = j - 2) {
     if (state[i] === player && state[i + j] === state[i] && state[i + 2*j] === player) { return true; }
   }
 }
 if (checkRows(state, player) || checkColumns(state, player) || checkDiagonals(state, player)) { return true;}
 else { return false; }
}

// the main minimax function
function minimax(newBoard, player){

  //available spots
  var availSpots = emptyIndexies(newBoard);

// checks for the terminal states such as win, lose, and tie
 //and returning a value accordingly
 if (winning(newBoard, huPlayer)){
    return {score:-10};
 }
 else if (winning(newBoard, aiPlayer)){
   return {score:10};
 }
 else if (availSpots.length === 0){
   return {score:0};
 }

// an array to collect all the objects
  var moves = [];

  // loop through available spots
  for (var i = 0; i < availSpots.length; i++){
    //create an object for each and store the index of that spot
    var move = {};
  	move.index = newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player;

    /*collect the score resulted from calling minimax
      on the opponent of the current player*/
    if (player == aiPlayer){
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    }
    else{
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    // reset the spot to empty
    newBoard[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }

var bestMove;
  if(player === aiPlayer){
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{

// else loop over the moves and choose the move with the lowest score
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

// return the chosen move (object) from the moves array
  return moves[bestMove];
}
minimax(origBoard, aiPlayer);







function winningCombi(boardState, player) {
  function checkRows(boardState, player) {
    for (var i = 0; i <= 6; i = i + 3) {
      if (boardState[i] === player && boardState[i + 1] === boardState[i] && boardState[i + 2] === player) {
        return true;
      }
    }
  }
  function checkColumns(boardState, player) {
    for (var i = 0; i <= 2; i++) {
      if (boardState[i] === player && boardState[i + 3] === boardState[i] && boardState[i + 6] === player) {
        return true;
      }
    }
  }
  function checkDiagonals(boardState, player) {
    for (var i = 0, j = 4; i <= 2; i = i+2, j = j - 2) {
      if (boardState[i] === player && boardState[i + j] === boardState[i] && boardState[i + 2*j] === player) {
        return true;
      }
    }
  }
  if (checkRows(boardState, player) || checkColumns(boardState, player) || checkDiagonals(boardState, player)) { return true;}
  else { return false;}

}
function emptyIndexes(boardState) {
  return boardState.filter(function(el) {
    return (el !== "O" && el !== "X");
  });
}

var board = ['O','O' ,'O','X',4 ,'X', 6 ,'O','O'];
winningCombi(board, "O");
emptyIndexes(board);

//var board = ['O',1 ,'X','X',4 ,'X', 6 ,'O','O'];
//winningCombi(board, "O");



function winningCombi(state, player) {  
        var state = state,
        icon = player.icon,
        checkRows = function(state, icon) {
            for (var i = 0; i <= 6; i = i + 3) {
                if (state[i] === icon && state[i + 1] === state[i] && state[i + 2] === state[i]) { return true; }
            }
        },
        checkColumns = function(state, icon) {
            for (var i = 0; i <= 2; i++) {
                if (state[i] === icon && state[i + 3] === state[i] && state[i + 6] === state[i]) { return true; }
            }
        },
        checkDiagonals = function(state, icon) {
            for (var i = 0, j = 4; i <= 2; i = i+2, j = j - 2) {
                if (state[i] === icon && state[i + j] === state[i] && state[i + 2*j] === state[i]) { return true; }
            }
        };
        if (checkRows(state, icon) || checkColumns(state, icon) || checkDiagonals(state, icon)) { return true;}
        else { return false; }
    }

function minMax(newState, depth, player) { 
        var availableSpots = emptyIndexes(newState);
     //   console.log("available spots: ");
     //   console.log(availableSpots);
        
        /* Score is influenced by the number of moves (depth) that are needed to win
        the less moves, the better */
        if (player.name === "Player 1" && winningCombi(newState, player)) { return {score:(-10 + depth)}; }
        else if (player.name === "Computer"  && winningCombi(newState, player)) { return {score:(10 - depth)}; }
        else if (availableSpots.length === 0 ) { return {score:0}; }
        else {
        depth++;
        var moves = [];
        for (var i = 0; i < availableSpots.length; i++) {
            var move = {};
            move.index = availableSpots[i];
            // set the available spot to current player
            newState[availableSpots[i]] = player.icon; 
          //  console.log("depth and newState: ");
          //  console.log(depth );
           // console.log(newState);
           
            // collect the score resulting from calling minMax on the opponent of the current player
            if (player.name === "Computer") {
                var result = minMax(newState, depth, game.playerOne);
             //   console.log("result human: ")
               // console.log(result);
                move.score = result.score;
           //     console.log(move.score);
            } else {
                var result = minMax(newState, depth, game.playerTwo);
           //     console.log("result computer: ")
                //console.log(result);
                move.score = result.score;
             //    console.log(move.score);
            }
            // reset the spot to empty
            newState[availableSpots[i]] = move.index;
            //push the object to the array;
            moves.push(move);
        }
        // if it is the computer's turn loop over the moves and choose the move with the highest score
        var bestMove;
        if (player.name === "Computer") {
            var bestScore = -10000;
            console.log("computers turn: ")
            console.log(moves);
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
                }
            }
        } else {  // else loop over the moves and choose the move with the lowest score
            var bestScore = 10000;
             console.log("humans turn: ")
            console.log(moves);
            for (var i = 0; i < moves.length; i++) {         
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        // return the chosen move from the moves array;
        console.log ("best move: ");
        console.log (moves[bestMove]);
        return moves[bestMove];
        }
}

var board = ['O','X','O','X','X','O', 6 ,7,'X'];
//var player = {id: 1, name: "Computer", icon: "O"};
var player = {id: 0, name: "Player 1", icon: "X"};

var depth = 0;
minMax(board, depth, player);



computers turn: 
[Object]0: Objectindex: 7score: 0__proto__: Objectlength: 1__proto__: Array(0)
best move: 
Object {index: 7, score: 0}index: 7score: 0__proto__: Object
computers turn: 
[Object]0: Objectlength: 1__proto__: Array(0)
best move: 
Object {index: 6, score: -8}index: 6score: -8__proto__: Object
humans turn: 
(2) [Object, Object]0: Objectindex: 6score: 0__proto__: Object1: Objectindex: 7score: -8__proto__: Objectlength: 2__proto__: Array(0)
best move: 
Object {index: 7, score: -8}index: 7score: -8__proto__: Object

Object {index: 7, score: -8}



var board = ['O','X','O','X','X','O', 6 ,7,'X'];
var player = {id: 1, name: "Computer", icon: "O"};
//var player = {id: 0, name: "Player 1", icon: "X"};

var depth = 0;
minMax(board, depth, player);

humans turn: 
[Object]0: Objectindex: 7score: 0__proto__: Objectlength: 1__proto__: Array(0)
best move: 
Object {index: 7, score: 0}index: 7score: 0__proto__: Object
humans turn: 
[Object]0: Objectlength: 1__proto__: Array(0)
best move: 
Object {index: 6, score: 0}index: 6score: 0__proto__: Object
computers turn: 
(2) [Object, Object]0: Object1: Objectlength: 2__proto__: Array(0)
best move: 
Object {index: 6, score: 0}index: 6score: 0__proto__: Object

Object {index: 6, score: 0}index: 6score: 0__proto__: Object