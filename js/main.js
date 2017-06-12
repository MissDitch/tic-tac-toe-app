function init() {
    listener("add", "id", "reset", reset);
    game = new Game();
    game.askUser();
}
var game;

function Board() {
  var self = this,
  matrix = [0,1,2,3,4,5,6,7,8],
  getPosition = function(e) { 
      var cell = e.target,
      int = cell.id,
      icon,
      matrix = self.getMatrix();

      if (self.playerOnePlays ) { icon = game.playerOne.getIcon(); }
      else { icon =  game.playerTwo.getIcon(); }

     if (matrix[int] === "X" || matrix[int] === "O") { return; }
      else {
          matrix[int] = icon;
          document.getElementById(int).textContent = icon;
          self.playerOnePlays = self.playerOnePlays === true ? false : true;
      }
      self.checkIfTerminated(icon);
  },
  checkIfTerminated = function(icon) {
      var timeOutID,
      matrix = self.getMatrix();
      //check rows
      for (var i = 0; i <= 6; i = i + 3) {
        if (matrix[i] === icon && matrix[i + 1] === matrix[i] && matrix[i + 2] === matrix[i]) {
          game.showWinner(icon, i, i+1, i+2);
          //console.log("row: " + i + ", " + (i+1) + ", "+ (i+2));
          return;
        }
      }
      // check columns
      for (var i = 0; i <= 2; i++) {
        if (matrix[i] === icon && matrix[i + 3] === matrix[i] && matrix[i + 6] === matrix[i]) {
          game.showWinner(icon, i, i+3, i+6);
          //console.log("column: " + i + ", " + (i+3) + ", "+ (i+6));
          return;
        }
      }
      //check diagonals
      for (var i = 0, j = 4; i <= 2; i = i+2, j = j - 2) {
        if (matrix[i] === icon && matrix[i + j] === matrix[i] && matrix[i + 2*j] === matrix[i]) {
          game.showWinner(icon, i, i+j, i+2*j);
          //console.log("diagonal: " + i + ", " + (i+j) + ", "+ (i+2*j));
          return;
        }
      }

       var empty = matrix.filter(function(el, index, arr) {
          return (el === parseInt(el, 10));
      });
      if (empty.length === 0) {
          this.finished = true;
          document.getElementById("turn").textContent = "It's a tie!";
          timeOutID = setTimeout(function() {
              game.newGame();
          }, 2000);
      }
      else {
        game.nextTurn();
      }
  };

  for (var i = 0; i < 9; i++) {
      document.getElementById(i).textContent = "";
  }

  this.playerOnePlays = false;
  this.finished = false;
  this.getPosition = getPosition;
  this.checkIfTerminated = checkIfTerminated;
  this.getMatrix = function() {
    return matrix;
  }
  this.setMatrix = function(index, icon) {
    matrix[index] = icon;
  }
}

function Game() {
    var self = this,
    board = new Board(),
    playerChosen = false,
    oneHuman,
    playerOne,
    playerTwo,
    scores = [0, 0],
    showOnDevice = function(message, selector) {
        var el = document.getElementById(selector);
        el.textContent = message;
    },
    setPlayers = function(e) {
        var el = e.target;
        showOnDevice("Player 1", "player1");
        if (el.textContent === "Another human") {
            showOnDevice("Player 2", "player2");
            self.oneHuman = false;
        }
        else {
            showOnDevice("Computer", "player2");
            self.oneHuman = true;
        }
        self.playersChosen = true;
        self.askUser(oneHuman);
    },
    setIcons = function(e) {
        var el = e.target, content;
        content = el.textContent;
        showOnDevice(content, "icon1");
        if (content === "X") {
            showOnDevice("O", "icon2");
        } else { showOnDevice("X", "icon2"); }

        el = document.querySelectorAll(".device__message")[0];
        el.style.display = "none";
        el.setAttribute("class", "device__message");
        el.innerHTML = "";
        createPlayers();
    },
    createPlayers = function() {
        var name1,
        name1 = "Player 1",
        icon1 = document.getElementById("icon1").textContent,
        icon2 = document.getElementById("icon2").textContent;

        self.playerOne = new Player(0, name1, icon1);

        if (self.oneHuman) {
            name2 = "Computer";
            self.playerTwo = new AI(1, name2, icon2);
        } else {
            name2 = "Player 2";
            self.playerTwo = new Player(1, name2, icon2);
        }
        // make random decision which player starts
        self.board.playerOnePlays = (Math.ceil(Math.random()*10) % 2) === 0;
        self.nextTurn();
    },
    //disable clicking when it's computer's turn
    disableClick = function() { 
        for (var i = 0; i < 9; i++) { listener("remove", "id", i, self.board.getPosition); }
    },
    enableClick = function() {
        for (var i = 0; i < 9; i++) { listener("add", "id", i, self.board.getPosition); }
    };
   

    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.oneHuman = oneHuman;
    this.board = board;
    this.board.playerOnePlays = false;
    this.scores = scores;
    this.askUser = function(oneHuman) {
        var el = document.querySelectorAll(".device__message");
        el[0].style.display = "block";
        el[0].setAttribute("class", "device__message active");
        if (!self.playersChosen) {
            el[0].innerHTML = '<h3>Choose your opponent</h3><div id="playerChoice"><div id="oppHuman" class="button">Another human</div><div id="oppComputer" class="button">Computer</div> </div>';
            listener("add", "id", "oppHuman", setPlayers);
            listener("add", "id", "oppComputer", setPlayers);
        }
        else {
            if (self.oneHuman) {
                el[0].innerHTML = '<h3>Do you want X or O?</h3>';
            } else {
                el[0].innerHTML = '<h3>Player 1: <br>Do you want X or O?</h3>';
            }
            el[0].innerHTML += '<div id="iconChoice"><div id="x" class="button">X</div><div id="o" class="button">O</div> </div>';
            listener("add", "id", "x", setIcons);
            listener("add", "id", "o", setIcons);
        }
    };
    this.nextTurn = function() {
      if (!self.board.finished) {
        var int, el  = document.getElementById("turn");
        el.textContent = "";
          setTimeout(function() {
            if (self.board.playerOnePlays) {
                self.oneHuman ? el.textContent = "Your turn!" : el.textContent = "Player 1's turn!";
                enableClick();
            } else {
                if (self.oneHuman) {
                     
                    el.textContent = "Computer's turn!";
                    disableClick();
                    var state = game.board.getMatrix();
                    if (emptyIndexes(state).length === 9) {
                        self.playerTwo.makeAIMove("firstMove");
                        
                    } else if (emptyIndexes(state).length === 8) {                       
                        self.playerTwo.makeAIMove("secondMove");                       
                    } else if (emptyIndexes(state).length < 8) { 
                        self.playerTwo.makeAIMove("nextMove"); }
                } else {
                    el.textContent = "Player 2's turn!";
                    enableClick();
                }
              }
              el.style.color =  "rgba(255, 165, 0, 0.9)";
        }, 800);
      } else return;
    };
    this.showWinner = function(icon, pos1, pos2, pos3) {
        var winner;
        document.getElementById(pos1).style.color = "orange";
        document.getElementById(pos2).style.color = "orange";
        document.getElementById(pos3).style.color = "orange";

        if (self.playerOne.getIcon() === icon) {
          winner = self.playerOne;
        } else {
          winner = self.playerTwo;
        }
        document.getElementById("turn").textContent = winner.name + " wins!";
        self.scores[winner.id]++;
        document.getElementById("score" + (winner.id + 1)).textContent = self.scores[winner.id];
        disableClick();
        self.board.finished = true;
        setTimeout(function() {
          self.newGame();
        }, 2000);
    };
    this.newGame = function() {
        self.board = new Board();
        document.getElementById("turn").textContent = "";
        for (var i = 0; i < 9; i++) {
          var el = document.getElementById(i);
          if (el.hasAttribute("style")) { el.removeAttribute("style"); }
        }
        // make random decision which player starts
        self.board.playerOnePlays = (Math.ceil(Math.random()*10) % 2) === 0;
        enableClick();
        self.nextTurn();
    };
}

function Player(id, name, icon) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.getIcon = function() {
      return this.icon;
    };
}

function AI(id, name, icon) {
    var self = this,
    pos,
    originalState, 
    
    winningCombi = function(state, player) {  
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
    },
    minMax = function(newState, depth, player) { 
        var availableSpots = emptyIndexes(newState);  
        
        /* Score is influenced by the number of moves (depth) that are needed to win
        the less moves, the better */
        if (player.name === "Player 1" && winningCombi(newState, player)) { return {score:(-10 + depth)}; }
        else if (player.name === "Computer"  && winningCombi(newState, player)) { return {score:(10 - depth)}; }
        else if (availableSpots.length === 0 ) { return {score:0}; }
    //    else {
        depth++;
        var moves = [];
        for (var i = 0; i < availableSpots.length; i++) {
            var move = {};
            move.index = availableSpots[i];
            // set the available spot to current player
            newState[availableSpots[i]] = player.icon; 
         
            // collect the score resulting from calling minMax on the opponent of the current player
            if (player.name === "Computer") {
                var result = minMax(newState, depth, game.playerOne);
                move.score = result.score;
            } else {
                var result = minMax(newState, depth, game.playerTwo);
                move.score = result.score;
            }
            // reset the spot to empty
            newState[availableSpots[i]] = move.index;
            //push the object to the array;
            var date = new Date();
        //    console.log( player.name + "(with " + availableSpots.length + "available spots), move pushed to moves array at depth: " + depth + " and time: "+ date.getMilliseconds() );
            moves.push(move);
       //     console.log(moves);
        }
        // if it is the computer's turn loop over the moves and choose the move with the highest score
        var bestMove;
        if (player.name === "Computer") {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
                }
            }
        } else {  // else loop over the moves and choose the move with the lowest score
            var bestScore = 10000;    
            for (var i = 0; i < moves.length; i++) {         
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        // return the chosen move from the moves array;  
        return moves[bestMove];
       // }
    },
    takeBlindMove = function() {
        setTimeout(function() {
            pos = Math.ceil(Math.random()* 9 - 1);
            var matrix = game.board.getMatrix();
            if (matrix[pos] === parseInt(matrix[pos], 10)) {
                matrix[pos] = self.icon;
                document.getElementById(pos).textContent = self.icon;
                game.board.checkIfTerminated(self.icon);
                game.board.playerOnePlays = true;
                game.nextTurn();
            } else { takeBlindMove(); }
        }, 400);
    },
  
    takeFirstMove = function() {
        var matrix = game.board.getMatrix();
        matrix[4] = self.icon;
        document.getElementById(4).textContent = self.icon;
        game.board.playerOnePlays = true;
        game.nextTurn();        
    }, 
    takeSecondMove = function() {
        var matrix = game.board.getMatrix();
        if (matrix[4] === parseInt(matrix[4], 10)) { 
            matrix[4] = self.icon;
            document.getElementById(4).textContent = self.icon;
        } else if (matrix[4] === game.playerOne.getIcon()) { // humanplayer has taken center, choose one of the corner squares
            var corners = [0, 2, 6, 8];
            var index = Math.floor(Math.random() * 4);
            var pos = corners[index];
            matrix[pos] = self.icon;
            document.getElementById(pos).textContent = self.icon;
        }
        game.board.checkIfTerminated(self.icon);
        game.board.playerOnePlays = true;
        game.nextTurn(); 
    }, 
    takeNextMove = function() {
        var aiPlayer = game.playerTwo;
        var humanPlayer = game.playerOne;
        var origState = game.board.getMatrix();   
        var depth = 0;

        var bestMove = minMax(origState, depth, humanPlayer).index;

        game.board.setMatrix(bestMove, self.icon);
        document.getElementById(bestMove).textContent = self.icon;
        game.board.checkIfTerminated(self.icon);
        game.board.playerOnePlays = true;
        game.nextTurn();
    }

    this.id = id;
    this.name = name;
    this.icon = icon;
    this.board = game.board;
    this.makeAIMove = function(level) {
        switch(level) {
        case "blind": takeBlindMove(); break;
        case "firstMove": takeFirstMove(); break;
        case "secondMove": takeSecondMove(); break;
        case "nextMove": takeNextMove(); break;
        }
    };
    this.getIcon = function() {
        return this.icon;
    };
}

function emptyIndexes(state) {
    return state.filter(function(el) {
        return (el === parseInt(el, 10));
    });
}

function listener(addOrRemove, prop, selector, func) {
    var op = addOrRemove;
    if (prop === "class") {
        var sels = document.querySelectorAll(selector);
        for (var i = 0; i < sels.length; i++) {
            if (op === "add") { sels[i].addEventListener("click", func); }
            else if (op === "remove") { sels[i].removeEventListener("click", func); }
        }
    }
    if (prop === "id") {
        var el = document.getElementById(selector);
        if (op === "add") {  el.addEventListener("click", func); }
        else if (op === "remove") { el.removeEventListener("click", func); }
    }
}

function reset() {
    var el = document.getElementById("turn");
    el.textContent = "Tic-tac-toe";
    el.style.color = "#ffffff";
    document.getElementById("score1").textContent = "0";
    document.getElementById("score2").textContent = "0";
    for (var i = 0; i < 9; i++) {
        document.getElementById(i).textContent = "";
    }
    for (var i = 0; i < 9; i++) {
        document.getElementById(i).style.color = "ffffff";
    }
    game = null;
    playerOne = null;
    playerTwo = null;
    init();
}

init();
