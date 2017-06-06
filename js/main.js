function init() {
    listener("add", "id", "reset", reset);
    game = new Game();
    game.askUser();
}
var game;

function Board() {
  var self = this,
  finished = false,
  getPosition = function(e) {  // click handler for board
      var int, icon, cell = e.target;
      int = cell.id;
      if (self.playerOnePlays ) {
          icon = game.playerOne.getIcon();
      }
      else if (!self.playerOnePlays && !game.oneHuman) {
          icon =  game.playerTwo.getIcon();
      }

      if (self.matrix[int] !== undefined) { return; }
      else {
          self.matrix[int] = icon;
          self.counter++;
          document.getElementById(int).textContent = icon;
          //self.playerOnePlays ? self.playerOnePlays = false : self.playerOnePlays = true;
          self.playerOnePlays = self.playerOnePlays === true ? false : true;
      }
      self.checkIfTerminated(icon);

  },
  checkIfTerminated = function(icon) {
      var timeOutID;
      //check rows
      for (var i = 0; i <= 6; i = i + 3) {
        if (self.matrix[i] === icon && self.matrix[i + 1] === self.matrix[i] && self.matrix[i + 2] === icon) {
          game.showWinner(icon, i, i+1, i+2);
          return;
        }
      }
      // check columns
      for (var i = 0; i <= 2; i++) {
        if (self.matrix[i] === icon && self.matrix[i + 3] === self.matrix[i] && self.matrix[i + 6] === icon) {
          game.showWinner(icon, i, i+3, i+6);
          return;
        }
      }
      //check diagonals
      for (var i = 0, j = 4; i <= 2; i = i+2, j = j - 2) {
        if (self.matrix[i] === icon && self.matrix[i + j] === self.matrix[i] && self.matrix[i + 2*j] === icon) {
          game.showWinner(icon, i, i+j, i+2*j);
          return;
        }
      }

      filled = self.matrix.filter(function(el, index, arr) {
          return el !== undefined;
      });
      if (filled.length === 9) {
          document.getElementById("turn").textContent = "It's a tie!";
          timeOutID = setTimeout(function() {
              game.newGame();
          }, 2000);
      }
      else {
        game.nextTurn();
      }
  }
  for (var i = 0; i < 9; i++) {
      document.getElementById(i).textContent = "";
  }

  this.matrix = [];
  this.playerOnePlays = false;
  this.getPosition = getPosition;
  this.checkIfTerminated = checkIfTerminated;
}

function Game() {
    var self = this,
    board = new Board(),
    playerChosen = false,
    oneHuman,
    playerOne,
    playerTwo,
    counter = 0,
    scores = [0, 0],

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
        var name1, name2, icon1, icon2, level;
        name1 = "Player 1";
        icon1 = document.getElementById("icon1").textContent;
        icon2 = document.getElementById("icon2").textContent;
        level = "blind";
        self.playerOne = new Player(0, name1, icon1);
        if (self.oneHuman) {
            name2 = "Computer";
            self.playerTwo = new AI(1, name2, icon2, level);
        } else {
            name2 = "Player 2";
            self.playerTwo = new Player(1, name2, icon2);
        }
        // make random decision which player starts
        self.board.playerOnePlays = (Math.ceil(Math.random()*10) % 2) === 0;
        self.nextTurn();
    },
    disableClick = function() { //disable clicking for player
        for (var i = 0; i < 9; i++) { listener("remove", "id", i, self.board.getPosition); }
    },
    enableClick = function() { //enable clicking for player
        for (var i = 0; i < 9; i++) { listener("add", "id", i, self.board.getPosition); }
    }

    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.oneHuman = oneHuman;
    this.board = board;
    this.board.playerOnePlays = false;
    this.board.matrix = [];
    this.counter = counter;
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
            if (oneHuman) {
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
                  self.playerOne.makeMove();
              } else {
                  if (self.oneHuman) {
                      el.textContent = "Computer's turn!";
                      disableClick();
                      self.playerTwo.makeAIMove("blind");
                  } else { el.textContent = "Player 2's turn!";
                  self.playerTwo.makeMove();
                }
              }
              el.style.background =  "rgba(255, 165, 0, 0.9)";

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
        console.log("new game starts!");
        self.board = new Board();
        document.getElementById("turn").textContent = "";
        for (var i = 0; i < 9; i++) {
          var el = document.getElementById(i);
          if (el.hasAttribute("style")) { el.removeAttribute("style"); }
        }
        self.counter = 0;
        self.board.matrix.length = 0;
        // make random decision which player starts
        self.board.playerOnePlays = (Math.ceil(Math.random()*10) % 2) === 0;
        enableClick();
        self.nextTurn();
    };
}
 // end function Game()

function Player(id, name, icon) {
    this.id = id;
    this.name = name;
    this.icon = icon;

    this.makeMove = function() {
        console.log(this.name + " is playing now");
        // click on board
    };
    this.getIcon = function() {
      return this.icon;
    };
}

function AI(id, name, icon, level) {
  var self = this,
  pos,
  //game = {}, //the game the player is playing
  //minimaxValue = function(board) { }, //the state to calculate its minimax value
  takeBlindMove = function() {
    var available = game.board.matrix.filter(function(el, index, arr) {
        return arr.indexOf(el !== undefined);
    });
    console.log(available);
    setTimeout(function() {
      pos = Math.ceil(Math.random()* 9 - 1);
      if (game.board.matrix[pos] === undefined) {
        game.board.matrix[pos] = self.icon;
        document.getElementById(pos).textContent = self.icon;
        game.board.checkIfTerminated(self.icon);
        game.board.playerOnePlays = true;

        game.nextTurn();
      } else { takeBlindMove(); }
    }, 1000);

  }
//  takeNoviceMove  = function(turn) { },
//  takeMasterMove = function(turn) { }
  this.id = id;
  this.name = name;
  this.icon = icon;
  this.level = level;
  this.board = game.board;

  this.makeAIMove = function(level) {
    console.log(this.name + " is playing now");
    switch(level) {
      //invoke the desired behavior based on the level chosen
      case "blind": takeBlindMove(); break;

      //case "novice": takeNoviceMove(turn); break;
    //  case "master": takeMasterMove(turn); break;
    }
  },
  this.getIcon = function() {
    return this.icon;
  };
}

function showOnDevice(message, selector) {
    var el = document.getElementById(selector);
    el.textContent = message;
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
    document.getElementById("turn").textContent = "Tic-tac-toe";
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
