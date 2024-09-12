
document.addEventListener("DOMContentLoaded", () => {

    const stopGame = document.querySelector('.stop-game')
    const buttons = document.querySelectorAll('.button')
    const info = document.querySelector('.info')
    let gameRunning = false;

    //Alone gameplay
    const alonePlaying = document.querySelector('.alone');

    alonePlaying.addEventListener("click", () => {
        gameRunning = true;
        buttons.forEach((i) => i.style.display = "none")
        info.style.display = "none";
        stopGame.style.display = "block";
        const alone = () => {
            const cell = document.querySelectorAll('.cell');
            let board = Array(9).fill(null); 
            const dialog = document.querySelector('.who-is-win'); 
            let tic = false;
            
            function addTicOrTac() {
                cell.forEach((i, index) => {
                    i.addEventListener('click', () => {
                        if (!i.classList.contains('O') && !i.classList.contains('X')) { 
                            if (tic === false) {
                                i.classList.add('O');
                                board[index] = 'O'; 
                            } else {
                                i.classList.add('X');
                                board[index] = 'X'; 
                            }
                            tic = !tic;
                            
                            const winner = checkWinner(board); 
                            if (winner) {
                                setTimeout(() => {
                                    dialog.innerHTML = winner === 'Draw' 
                                    ? "It's a draw! <br /> Tap anywhere on your screen to restart the game :)" 
                                    : `Player ${winner} wins! Congratulation! <br /> Tap anywhere on your screen to restart the game :)`;
                                    dialog.showModal(); 
                                }, 100); 
                                gameRunning = false;
                            }
                        }
                    });
                });
            }
            
            function checkWinner(board) {
                const winningCombinations = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтальные
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикальные
                    [0, 4, 8], [2, 4, 6]            // диагональные
                ];
                
                for (let combination of winningCombinations) {
                    const [a, b, c] = combination;
                    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                        return board[a]; 
                    }
                }
                
                if (board.every(cell => cell)) {
                    return 'Draw'; 
                }
                
                return null; 
            }
        
            dialog.addEventListener('click', () => {
                dialog.close();
                resetGame(); 
            });
            
            function resetGame() {
                tic = false;
                board = Array(9).fill(null); 
                cell.forEach((i) => {
                    i.classList.remove('O', 'X'); 
                });
                gameRunning = true;
            }

            stopGame.addEventListener('click', () => {
                buttons.forEach((i) => i.style.display = "block")
                info.style.display = "block";
                stopGame.style.display = "none";
                resetGame();
                gameRunning = false;
            })
            
            addTicOrTac();
            
        }
        alone();
    });

    //With the Bot gameplay
    const withBotPlaying = document.querySelector('.with-bot');

    withBotPlaying.addEventListener("click", () => {
        const withBot = () => {
            const cell = document.querySelectorAll('.cell');
            let board = Array(9).fill(null);
            const dialog = document.querySelector('.who-is-win');
            let playerTurn = true;
        
            function addTicOrTac() {
                cell.forEach((i, index) => {
                    i.addEventListener('click', () => {
                        if (!i.classList.contains('O') && !i.classList.contains('X') && playerTurn) {
                            i.classList.add('O');
                            board[index] = 'O';
                            playerTurn = false;
                            
                            const winner = checkWinner(board);
                            if (winner) {
                                showDialog(winner);
                            } else {
                                botMove(); 
                            }
                        }
                    });
                });
            }
        
            function botMove() {
                setTimeout(() => {
                    let availableMoves = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
                    let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                    
                    if (move !== undefined) {
                        cell[move].classList.add('X');
                        board[move] = 'X';
                        playerTurn = true;
                        
                        const winner = checkWinner(board);
                        if (winner) {
                            showDialog(winner);
                        }
                    }
                }, 500); 
            }
        
            function checkWinner(board) {
                const winningCombinations = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтальные
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикальные
                    [0, 4, 8], [2, 4, 6]            // диагональные
                ];
        
                for (let combination of winningCombinations) {
                    const [a, b, c] = combination;
                    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                        return board[a];
                    }
                }
        
                if (board.every(cell => cell)) {
                    return 'Draw';
                }
        
                return null;
            }
        
            function showDialog(winner) {
                setTimeout(() => {
                    dialog.innerHTML = winner === 'Draw' 
                    ? "It's a draw! <br /> Tap anywhere on your screen to restart the game :)" 
                    : `Player ${winner} wins! Congratulation! <br /> Tap anywhere on your screen to restart the game :)`;
                    dialog.showModal();
                }, 100);
            }
        
            dialog.addEventListener('click', () => {
                dialog.close();
                resetGame();
            });
        
            function resetGame() {
                playerTurn = true; 
                board = Array(9).fill(null);
                cell.forEach((i) => {
                    i.classList.remove('O', 'X');
                });
            }
        
            addTicOrTac();
        }
        withBot();
    })
});