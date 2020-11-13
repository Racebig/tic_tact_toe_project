
//Player factory function - storing players in objects
const playerFactory = (name, mark, wins, turn) => {
    const returnMark = () => {
        return mark;
    }
    return {
        name,
        mark,
        wins,
        turn,
        returnMark
    }
}

//Gameboard module
const gameBoard = (() => {
        //DOM
        const gameBoardSquares = document.querySelectorAll(".gameboard-square");
        //Board array
        let board = ["", "", "", "", "", "", "", "", ""];
        //Board functions
        const displayBoard = () => {
            for(let i = 0; i < board.length; i++){
                gameBoardSquares[i].textContent = board[i];
            };
        };
        //Adding a mark (gets symbol and traces with square has been clicked)
        const addMark = (e) => {
            //gets the players
            let player = game.getCurrentPlayer();
            let mark = player.mark;
            //gets the square that is clicked
            let index = e.target.getAttribute("data-count");
            if(board[index] === ""){
                //changes board array to mark
                board[index] = player.mark;
                //update board
                displayBoard();
                //switches turn
                game.switchTurn();
                //check for wins;
                game.checkWins(board, mark);
            }
        };
        //adds the square eventlistener when cliccked
        const squareEventListener = () => {
            gameBoardSquares.forEach(square => square.addEventListener("click", addMark));
        };
        const removeSquareEventListener = () => {
            gameBoardSquares.forEach(square => square.removeEventListener("click", addMark));
        }
        //Reset board
        const resetBoard = () => {
            displayController.updateScore();
            board = ["", "", "", "", "", "", "", "", ""];
            displayBoard();
            squareEventListener();
            displayController.hideButtons();
        }
        return {
            displayBoard,
            squareEventListener,
            addMark,
            resetBoard,
            removeSquareEventListener
        };
})();


//Game module - controls the flow of the game 
const game = (() => {
    //creates the players after getting input from form
    const createPlayers = (p1Name, p2Name) => {
        player1 = playerFactory(p1Name, "X", 0, true);
        player2 = playerFactory(p2Name, "O", 0, false);
        displayController.updateScore();
    }
    const getCurrentPlayer = () => {
        if(player1.turn === true){
            return player1;
        }
        else{
            return player2;
        }
    }
    //switches turn
    const switchTurn = () => {
        if(player1.turn === true){
            player1.turn = false;
            player2.turn = true;
        }
        else{
            player1.turn = true;
            player2.turn = false;
        }
    }
    const checkWins = (board, mark) => {
        if(board[0] === mark && board[1] === mark && board[2] === mark || board[3] === mark && board[4] === mark && board[5] === mark || board[6] === mark && board[7] === mark && board[8] === mark){
            if(mark === "X"){
                player1.wins += 1;
                displayController.displayWin(player1);
            }
            else{
                player2.wins += 1;
                displayController.displayWin(player2);
            }
        }
        else if(board[0] === mark && board[3] === mark && board[6] === mark || board[1] === mark && board[4] === mark && board[7] === mark || board[2] === mark && board[5] === mark && board[8] === mark){
            if(mark === "X"){
                player1.wins += 1;
                displayController.displayWin(player1);
            }
            else{
                player2.wins += 1;
                displayController.displayWin(player2);
            }
        }
        else if(board[0] === mark && board[4] === mark && board[8] === mark || board[2] === mark && board[4] === mark && board[6] === mark){
            if(mark === "X"){
                player1.wins += 1;
                displayController.displayWin(player1);
            }
            else{
                player2.wins += 1;
                displayController.displayWin(player2);
            }
        }
        else{
            checkDraw(board);
        }
    }
    const checkDraw = (board) => {
        if(board.includes("")){
            //pass
        }
        else{
            displayController.displayDraw();
        }
    }
    return {
        createPlayers,
        switchTurn,
        checkWins,
        getCurrentPlayer,
        checkDraw
    }
})();

const displayController = (() => {
        //DOM
        let formDiv = document.getElementById("player-form-wrapper");
        let buttonsDiv = document.getElementById("button-wrapper");
        //Function for collecting player input data
        const getPlayerData = () => {
            let p1Name = document.getElementById("player-1-name").value;
            let p2Name = document.getElementById("player-2-name").value;
            if(p1Name && p2Name){
                formDiv.innerHTML = "";
                formDiv.style.cssText = "";
                formDiv.style.cssText = "width: 300px; auto; display: grid; grid-template-columns: 150px 150px; margin: 100px auto 0px auto; text-align: center; box-shadow: 2px 5px 8px rgba(0,0,0,.2); background-color: rgba(0,0,0, 0.2); border-radius: 5px; color: white; font-size: 20px;";

                gameBoard.squareEventListener();
                game.createPlayers(p1Name, p2Name);
            }
            else{
                alert("Fill in all the fields");
            }
        };
        //updates score
        const updateScore = () => {
            formDiv.innerHTML = `<p style="color: white;">${player1.name} : ${player1.wins}<br>${player1.mark}</p><p style="color: white" margin-top: 5px;>${player2.name} : ${player2.wins}<br>${player2.mark}</p>`;
        };
        const displayWin = (player) => {
            gameBoard.removeSquareEventListener();
            updateScore();
            formDiv.innerHTML += `<p style="grid-column: 1/3">${player.name} wins!</p>`;
            displayButtons();
        }
        const displayDraw = () => {
            gameBoard.removeSquareEventListener();
            formDiv.innerHTML += `<p style="grid-column: 1/3">Its a draw!</p>`;
            displayButtons();
        }
        const displayForm = () => {
            gameBoard.resetBoard();
            formDiv.style = "";
            formDiv.innerHTML = "<h3>Player 1</h3><form id='player-1-form'><input id='player-1-name' type='text' placeholder='Enter name'></form><h3>Player 2</h3><form id='player-2-form'><input id='player-2-name' type='text' placeholder='Enter name'><button id='player-submit-button' type='button' onclick='displayController.getPlayerData()'>Submit</button></form>";
        }
        const displayButtons = () => buttonsDiv.style.display = "";
        const hideButtons = () => buttonsDiv.style.display = "none"; 
        
        return {
            getPlayerData,
            updateScore,
            displayWin,
            displayButtons,
            hideButtons,
            displayDraw,
            displayForm
        };
})();

