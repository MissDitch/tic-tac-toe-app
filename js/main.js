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
        if (matrix[i] === icon && matrix[i + 1] === matrix[i] && matrix[i + 2] === icon) {
          game.showWinner(icon, i, i+1, i+2);
          return;
        }
      }
      // check columns
      for (var i = 0; i <= 2; i++) {
        if (matrix[i] === icon && matrix[i + 3] === matrix[i] && matrix[i + 6] === icon) {
          game.showWinner(icon, i, i+3, i+6);
          return;
        }
      }
      //check diagonals
      for (var i = 0, j = 4; i <= 2; i = i+2, j = j - 2) {
        if (matrix[i] === icon && matrix[i + j] === matrix[i] && matrix[i + 2*j] === icon) {
          game.showWinner(icon, i, i+j, i+2*j);
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
    },
    emptyIndexes = function(state) {
      return state.filter(function(el) {
        return (el === parseInt(el, 10));
      });
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
                        self.playerTwo.makeAIMove("blind");
                       } else { self.playerTwo.makeAIMove("smart"); }
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
  humanPlayer,
  aiPlayer,
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
  takeSmartMove = function() {
      var humanPlayer = game.playerOne.getIcon(),
      aiPlayer = self.icon,

      emptyIndexes = function(state) {
          return state.filter(function(el) {
              return (el === parseInt(el, 10));
          });
      },
      winningCombi = function(state, player) {  
          var state = state,
          player = player,
          checkRows = function(state, player) {
              for (var i = 0; i <= 6; i = i + 3) {
                  if (state[i] === player && state[i + 1] === state[i] && state[i + 2] === player) { return true; }
              }
          },
          checkColumns = function(state, player) {
              for (var i = 0; i <= 2; i++) {
                  if (state[i] === player && state[i + 3] === state[i] && state[i + 6] === player) { return true; }
              }
          },
          checkDiagonals = function(state, player) {
              for (var i = 0, j = 4; i <= 2; i = i+2, j = j - 2) {
                  if (state[i] === player && state[i + j] === state[i] && state[i + 2*j] === player) { return true; }
              }
          };
          if (checkRows(state, player) || checkColumns(state, player) || checkDiagonals(state, player)) { return true;}
          else { return false; }
      },

      minMax = function(newState, player) {
          var availableSpots = emptyIndexes(newState);
          if (winningCombi(newState, humanPlayer)) { return {score:-10}; }
          else if (winningCombi(newState, aiPlayer)) { return {score:10}; }
          else if (availableSpots.length === 0 ) { return {score:0}; }
      
          var moves = [];
          for (var i = 0; i < availableSpots.length; i++) {
              var move = {};
              move.index = newState[availableSpots[i]];
              // set the available spot to current player
              newState[availableSpots[i]] = player; 
              // collect the score resulting from calling minMax on the opponent of the current player
              if (player === aiPlayer) {
                  var result = minMax(newState, humanPlayer);
                  move.score = result.score;
              } else {
                  var result = minMax(newState, aiPlayer);
                  move.score = result.score;
              }
              // reset the spot to empty
              newState[availableSpots[i]] = move.index;
              //push the object to the array;
              moves.push(move);
          }
          // if it is the computer's turn loop over the moves and choose the move with the highest score
          var bestMove;
          if (player === aiPlayer) {
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
      };

      var state = game.board.getMatrix();
      var bestMove = minMax(state, aiPlayer).index;
      game.board.setMatrix(bestMove, self.icon);
      document.getElementById(bestMove).textContent = self.icon;
      game.board.checkIfTerminated(self.icon);
      game.board.playerOnePlays = true;
      game.nextTurn();
  };

  this.id = id;
  this.name = name;
  this.icon = icon;
  this.board = game.board;
  this.makeAIMove = function(level) {
    switch(level) {
      case "blind": takeBlindMove(); break;
      case "smart": takeSmartMove(); break;
    }
  };
  this.getIcon = function() {
    return this.icon;
  };
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
