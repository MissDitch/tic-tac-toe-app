function init() {    
    playersChosen = false;
    askUser(playersChosen);
    addListener("id", "reset", clearAll);    
    for (var i = 1; i < 10; i++) {
        addListener("id", i, getPosition);
    }
}

var playersChosen, oneHuman, playerOne, playerTwo, whoIsPlaying, playerOnePlays, positions = []; 

function askUser(playersChosen, oneHuman) {
    var el = document.querySelectorAll(".device__message");
    el[0].style.display = "block";
    el[0].setAttribute("class", "device__message active");
    if (!playersChosen) {
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
}

function showOnDevice(message, selector) {
    el = document.getElementById(selector);
    el.textContent = message; 
}

function setPlayers(e) {
    var el = e.target;
    showOnDevice("Player 1", "player1");
    if (el.textContent === "Another human") {
        showOnDevice("Player 2", "player2");
        oneHuman = false;
    }
    else {
        showOnDevice("Computer", "player2");
        oneHuman = true;
    }
    playersChosen = true;
    askUser(playersChosen, oneHuman);   
}

function setIcons(e) {
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
}

function createPlayers() {
    var name1, name2, icon1, icon2, isHuman;    
    name1 = "Player 1";
    icon1 = document.getElementById("icon1").textContent;
    icon2 = document.getElementById("icon2").textContent;

    if (oneHuman) { 
        name2 = "Computer";
        isHuman = false;
       
    } else { 
        name2 = "Player 2"; 
        isHuman = true;
    }        

    playerOne = new Player(name1, icon1, true);
    playerTwo = new Player(name2, icon2, isHuman);
    // make random decision which player starts
    playerOnePlays = (Math.ceil(Math.random()*10) % 2) === 0;
    
    play();       
}


function play() {    
    var int, el  = document.getElementById("turn");
    if (playerOnePlays) { 
        whoIsPlaying = playerOne;     
        oneHuman ? el.textContent = "Your turn!" : el.textContent = "Player 1's turn!";        
    } else {
        whoIsPlaying = playerTwo;       
        if (oneHuman) {
            el.textContent = "Computer's turn!"; 
             // if it's computer's turn, nothing is clicked, so generate int for the position, then check if position is taken. if it is, repeat. else:
            int = 1;
            whoIsPlaying.addMove(int);            
        } else el.textContent = "Player 2's turn!"; 
        // player clicks on board, getPosition is called
    } 
}

function Player(name, icon, isHuman) {
    this.name = name;
    this.icon = icon;
    this.isHuman = isHuman;
    this.positions = [];
    this.addMove = addMove;
}

function addMove(int) {
    this.positions.push(this.icon + int);  // f.e. X5, O1
    //show icon on board 
    document.getElementById(int).textContent = this.icon;
    //toggle turns
    playerOnePlays ? playerOnePlays = false : playerOnePlays = true;
    play();
}

function getPosition(e) {  // click handler for board
    var int, cell = e.target;
    if (!oneHuman || whoIsPlaying === playerOne ) { // 
        int = cell.id;
        playerOnePlays ? playerOne.addMove(int) : playerTwo.addMove(int);
    }    
}


function Board() {
    this.moves = 0;
    this.positions = [];

}



function addListener(prop, selector, func) {
    if (prop === "class") {
        var sels = document.querySelectorAll(selector);
        for (var i = 0; i < sels.length; i++) {
            sels[i].addEventListener("click", func);
        }
    }
    if (prop === "id") {
        el = document.getElementById(selector);
        el.addEventListener("click", func);
    }    
}

function clearAll(e) {
    var el;
    document.getElementById("turn").textContent = "Tic-tac-toe";
    document.getElementById("score1").textContent = "0";
    document.getElementById("score2").textContent = "0";
    for (var i = 1; i < 10; i++) {
        document.getElementById(i).textContent = "";
    }
    playersChosen = false;
    askUser(playersChosen);
    playerOne = null;
    playerTwo = null;
}

init();
