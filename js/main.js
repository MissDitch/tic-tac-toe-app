function init() {
    listener("add", "id", "reset", reset);
    game = new Game();
    game.askUser();
}
var game;

function Board() {
  var self = this,
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
    scores = [0, 0];
    askUser = function(oneHuman) {
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
        self.createPlayers();
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
    nextTurn = function() {
        var int, el  = document.getElementById("turn"), timeOutID, timeOutID2;
        el.textContent = "";
          timeOutID = setTimeout(function() {
              if (self.board.playerOnePlays) {
                  self.oneHuman ? el.textContent = "Your turn!" : el.textContent = "Player 1's turn!";
                  enableClick();
                  self.playerOne.makeMove();
              } else {
                  if (self.oneHuman) {
                      el.textContent = "Computer's turn!";
                      disableClick();
                      self.playerTwo.makeMove("blind");
                  } else el.textContent = "Player 2's turn!";
                  self.playerTwo.makeMove();
                  // player clicks on board or AI makes next move
              }
              el.style.background =  "rgba(255, 165, 0, 0.9)";

        }, 800);
    },
    disableClick = function() { //disable clicking for player
        for (var i = 0; i < 9; i++) { listener("remove", "id", i, self.board.getPosition); }
    },
    enableClick = function() { //enable clicking for player
        for (var i = 0; i < 9; i++) { listener("add", "id", i, self.board.getPosition); }
    },
    showWinner = function(icon, pos1, pos2, pos3) {
        var winner, timeOutID;
        document.getElementById(pos1).style.color = "orange";
        document.getElementById(pos2).style.color = "orange";
        document.getElementById(pos3).style.color = "orange";
        if (self.playerOne.getIcon() === icon) {
          winner = self.playerOne;
        } else {
          winner = self.playerTwo;
        }
        document.getElementById("turn").textContent = winner.name + " wins!";
        timeOutID = setTimeout(function() {
          self.scores[winner.id]++;
          document.getElementById("score" + (winner.id + 1)).textContent = self.scores[winner.id];
          disableClick();
          document.getElementById(pos1).removeAttribute("style");
          document.getElementById(pos2).removeAttribute("style");
          document.getElementById(pos3).removeAttribute("style");
          // next game starts
          self.newGame();
        }, 2000);
    },
    newGame = function() {
        console.log("new game starts!");
        self.board = new Board();
        self.counter = 0;
        self.board.matrix.length = 0;
        // make random decision which player starts
        self.board.playerOnePlays = (Math.ceil(Math.random()*10) % 2) === 0;
        self.nextTurn();
    }
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.oneHuman = oneHuman;
    this.board = board;
    this.board.playerOnePlays = false;
    this.board.matrix = [];
    this.counter = counter;
    this.scores = scores;
    this.askUser = askUser;
    this.setPlayers = setPlayers;
    this.setIcons = setIcons;
    this.createPlayers = createPlayers;
    this.nextTurn = nextTurn;
    this.disableClick = disableClick;
    this.enableClick = enableClick;
    this.showWinner = showWinner;
    this.newGame = newGame;
}
 // end function Game()

function Player(id, name, icon) {
    makeMove = function() {
            console.log(this.name + " is playing now");
            // click on board
    },
    getIcon = function() {
      return this.icon;
    }

    this.id = id;
    this.name = name;
    this.icon = icon;
    this.getIcon = getIcon;
    this.makeMove = makeMove;
}

function AI(id, name, icon, level) {
  var self = this,
  pos,
  //game = {}, //the game the player is playing
  minimaxValue = function(state) { }, //the state to calculate its minimax value
  takeBlindMove = function() {
    var available = game.board.matrix.filter(function(el, index, arr) {
        return arr.indexOf(el !== undefined);
    });
    console.log(available);
    pos = Math.ceil(Math.random()* 9 - 1);
    if (game.board.matrix[pos] === undefined) {
      game.board.matrix[pos] = self.icon;
      document.getElementById(pos).textContent = self.icon;
      game.board.checkIfTerminated(self.icon);
      game.board.playerOnePlays = true;

      game.nextTurn();
    } else { takeBlindMove(); }

    //alert("blind move");
  }, //turn: either X or O
//  takeNoviceMove  = function(turn) { },
//  takeMasterMove = function(turn) { }

  makeMove = function(level) {
    switch(level) {
      //invoke the desired behavior based on the level chosen
      case "blind": takeBlindMove(); break;

      //case "novice": takeNoviceMove(turn); break;
    //  case "master": takeMasterMove(turn); break;
    }
  },
  getIcon = function() {
    return this.icon;
  }
  this.id = id;
  this.name = name;
  this.icon = icon;
  this.level = level;
  this.makeMove = makeMove;
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
