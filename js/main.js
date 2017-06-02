function init() {
    listener("add", "id", "reset", reset);
    game = new Game();
    game.askUser();    
}
var game, playerOne, playerTwo;

function Game() {
    var self = this,
    playerChosen = false,
    oneHuman,
   // playerOne,
   // playerTwo,
    playerOnePlays,
    matrix = [],
    counter = 0;
    scores = [0, 0];
    winner = false;
    askUser = function() {
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
        if (self.counter > 9) { console.log("counter greater than 9") } //self.newGame(); }
            timeOutID = setTimeout(function() {        
                if (self.playerOnePlays) {
                    self.oneHuman ? el.textContent = "Your turn!" : el.textContent = "Player 1's turn!";
                    playerOne.makeMove();

                } else {
                    if (self.oneHuman) {
                        el.textContent = "Computer's turn!";
                    } else el.textContent = "Player 2's turn!";
                    playerTwo.makeMove();
                    // player clicks on board
                }
                el.style.background =  "rgba(175, 4, 208, 0.9)";
                for (var i = 0; i < 9; i++) {
                    listener("add", "id", i, getPosition);
                }
            }, 800);  
     //  } else {
      // 
      // }

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
            self.counter++;
            document.getElementById(int).textContent = icon;
            self.playerOnePlays ? self.playerOnePlays = false : self.playerOnePlays = true;       
        }
        //disable clicking for this player
        for (var i = 0; i < 9; i++) {  listener("remove", "id", i, getPosition); }
        self.checkPositions(icon);
       
    },
    checkPositions = function(icon) { 
        var arr, timeOutID;              
        if (matrix[0] === icon && matrix[1] === icon && matrix[2] === icon ) { showWinner(icon, 0,1,2);} 
        else if (matrix[3] === icon && matrix[4] === icon && matrix[5] === icon ) { showWinner(icon, 3,4,5);}
        else if (matrix[6] === icon && matrix[7] === icon && matrix[8] === icon ) { showWinner(icon, 6,7,8);}
        
        else if (matrix[0] === icon && matrix[3] === icon && matrix[6] === icon ) { showWinner(icon, 0,3,6);}
        else if (matrix[1] === icon && matrix[4] === icon && matrix[7] === icon ) { showWinner(icon, 1,4,7);}
        else if (matrix[2] === icon && matrix[5] === icon && matrix[8] === icon ) { showWinner(icon, 2,5,8);}
        
        else if (matrix[0] === icon && matrix[4] === icon && matrix[8] === icon ) {showWinner(icon, 0,4,8);}
        else if (matrix[2] === icon && matrix[4] === icon && matrix[6] === icon ) {showWinner(icon, 2,4,6);} 

        else {
            arr = matrix.filter(function(el, index, arr) {
                return el !== undefined;
            });
            if (arr.length === 9) {
                document.getElementById("turn").textContent = "It's a tie!";
                timeOutID = setTimeout(function() {                         
                    self.newGame();
                }, 2000);
            }
            else {
                self.nextTurn();
            }
        }        
    },
    showWinner = function(icon, pos1, pos2, pos3) {
        var timeOutID;
        document.getElementById(pos1).style.color = "orange";
        document.getElementById(pos2).style.color = "orange";
        document.getElementById(pos3).style.color = "orange";
        if (playerOne.getIcon() === icon) {
            document.getElementById("turn").textContent = "Player 1 wins!";
            self.scores[0]++;
            document.getElementById("score1").textContent = self.scores[0];
        } else {
            document.getElementById("turn").textContent = "Player 2 wins!";
            self.scores[1]++;
            document.getElementById("score2").textContent = self.scores[1];
        }
        for (var i = 0; i < 9; i++) {  listener("remove", "id", i, getPosition); } 
        //self.winner = true;  
        timeOutID = setTimeout(function() { 
            document.getElementById(pos1).removeAttribute("style");
            document.getElementById(pos2).removeAttribute("style");
            document.getElementById(pos3).removeAttribute("style");                
            // next game starts           
            self.newGame();
        }, 2000);
    },
    newGame = function() {
        console.log("new game starts!");
        for (var i = 0; i < 9; i++) {
            document.getElementById(i).textContent = "";
        }
        self.counter = 0;
        self.winner = false;
        self.matrix.length = 0;
        // make random decision which player starts
        self.playerOnePlays = (Math.ceil(Math.random()*10) % 2) === 0;
        self.nextTurn();

    }
    

    this.playerOnePlays = playerOnePlays;
    this.matrix = matrix;
    this.counter = counter;
    this.scores = scores;
    this.winner = winner;
    this.askUser = askUser;
    this.setPlayers = setPlayers;
    this.setIcons = setIcons;
    this.createPlayers = createPlayers;
    this.nextTurn = nextTurn;
    this.getPosition = getPosition;
    this.checkPositions = checkPositions;
    this.showWinner = showWinner;
    this.newGame = newGame;
}  
 // end function Game()

function Player(name, icon, isHuman) {
    var self = this,
    //isPlaying = false, 
    makeMove = function() {
        if(!self.isHuman) {
            // decide which move to make
        } else {
            console.log(self.name + " is playing now");
            // click on board
        }
    },
    getIcon = function() {
      return this.icon;
    }

    this.name = name;
    this.icon = icon;
    this.isHuman = isHuman;
    this.getIcon = getIcon; 
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
