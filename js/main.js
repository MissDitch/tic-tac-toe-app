function init() {
    addListener("id", "reset", reset);
    game = new Game();
    game.askUser();    
}
var game, playerOne, playerTwo;

function Game() {
  var self = this,
  playerChosen = false,
  oneHuman,
  playerOne,
  playerTwo,
  playerOnePlays,
  matrix = [],
  askUser = function() {
    var el = document.querySelectorAll(".device__message");
    el[0].style.display = "block";
    el[0].setAttribute("class", "device__message active");
    if (!self.playersChosen) {
        el[0].innerHTML = '<h3>Choose your opponent</h3><div id="playerChoice"><div id="oppHuman" class="button">Another human</div><div id="oppComputer" class="button">Computer</div> </div>';
        addListener("id", "oppHuman", setPlayers);
        addListener("id", "oppComputer", setPlayers);
    }
    else {
        if (oneHuman) {
             el[0].innerHTML = '<h3>Do you want X or O?</h3>';
        } else {
            el[0].innerHTML = '<h3>Player 1: <br>Do you want X or O?</h3>';
        }
        el[0].innerHTML += '<div id="iconChoice"><div id="x" class="button">X</div><div id="o" class="button">O</div> </div>';
        addListener("id", "x", setIcons);
        addListener("id", "o", setIcons);
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
    var name1, name2, icon1, icon2, isHuman;
    name1 = "Player 1";
    icon1 = document.getElementById("icon1").textContent;
    icon2 = document.getElementById("icon2").textContent;

    if (self.oneHuman) {
        name2 = "Computer";
        isHuman = false;
    } else {
        name2 = "Player 2";
        isHuman = true;
    }
    playerOne = new Player(name1, icon1, true);
    playerTwo = new Player(name2, icon2, isHuman);
    // make random decision which player starts
    self.playerOnePlays = (Math.ceil(Math.random()*10) % 2) === 0;
    self.nextTurn();
  },
  nextTurn = function() {
    var int, el  = document.getElementById("turn"), timeOutID, timeOutID2;
    el.textContent = "";
   
    timeOutID = setTimeout(function() {        
        if (self.playerOnePlays) {
            self.oneHuman ? el.textContent = "Your turn!" : el.textContent = "Player 1's turn!";
        } else {
            if (self.oneHuman) {
                el.textContent = "Computer's turn!";
            } else el.textContent = "Player 2's turn!";
            // player clicks on board
        }
        el.style.background =  "rgba(175, 4, 208, 0.9)";
    }, 800);    
  },
  getPosition = function(e) {  // click handler for board
      var int, icon, cell = e.target;
      int = cell.id;
      if (self.playerOnePlays ) {
        icon = playerOne.getIcon();
      }
      else if (!self.playerOnePlays && !self.oneHuman) {
          icon =  playerTwo.getIcon();
      }
      if (self.matrix[int] !== undefined) { return; }
      else {
        self.matrix[int] = icon;
        document.getElementById(int).textContent = icon;
        //disable clicking for this player
        self.playerOnePlays ? self.playerOnePlays = false : self.playerOnePlays = true;       
      }
      self.nextTurn();
  };

  for (var i = 0; i < 9; i++) {
      addListener("id", i, getPosition);
  }
  this.playerOnePlays = playerOnePlays;
  this.matrix = matrix;
  this.askUser = askUser;
  this.setPlayers = setPlayers;
  this.setIcons = setIcons;
  this.createPlayers = createPlayers;
  this.nextTurn = nextTurn;
  this.getPosition = getPosition;
}  
 // end function Game()

function Player(name, icon, isHuman) {
    this.name = name;
    this.icon = icon;
    this.isHuman = isHuman;
    this.isPlaying = false;
    this.getIcon = function() {
      return this.icon;
    }
} 

function showOnDevice(message, selector) {
    var el = document.getElementById(selector);
    el.textContent = message;
}

function addListener(prop, selector, func) {
    if (prop === "class") {
        var sels = document.querySelectorAll(selector);
        for (var i = 0; i < sels.length; i++) {
            sels[i].addEventListener("click", func);
        }
    }
    if (prop === "id") {
        var el = document.getElementById(selector);
        el.addEventListener("click", func);
    }
}

function reset() {
    document.getElementById("turn").textContent = "Tic-tac-toe";
    document.getElementById("score1").textContent = "0";
    document.getElementById("score2").textContent = "0";
    for (var i = 0; i < 9; i++) {
        document.getElementById(i).textContent = "";
    }
    game = null;
    playerOne = null;
    playerTwo = null;
    init();
}

init();
