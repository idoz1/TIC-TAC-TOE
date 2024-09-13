document.addEventListener("DOMContentLoaded", () => {
    const stopGame = document.querySelector('.stop-game');
    const buttons = document.querySelectorAll('.button');
    const info = document.querySelector('.info');
    const withBotPlaying = document.querySelector('.with-bot');
    const alonePlaying = document.querySelector('.alone');
    const cell = document.querySelectorAll('.cell');
    const dialog = document.querySelector('.who-is-win');

    let gameStatus = false;  // Игра начата или нет
    let gameRunning = false; // Процесс игры активен или нет
    let board = Array(9).fill(null);
    let tic = false;  // Используется в одиночном режиме для переключения между O и X
    let playerTurn = true; // Используется в режиме с ботом
    let typeOfGame = 'none';

    // Сброс игрового поля
    function resetGame() {
        tic = false;
        playerTurn = true;
        board = Array(9).fill(null);
        cell.forEach((i) => {
            i.classList.remove('O', 'X');
        });
        gameRunning = true;
    }

    // Возвращение интерфейса к исходному состоянию
    function resetUI() {
        buttons.forEach((i) => i.style.display = "block");
        info.style.display = "block";
        stopGame.style.display = "none";
        gameStatus = false;
        gameRunning = false;
        console.log(typeOfGame);
    }

    // Одиночный режим игры
    alonePlaying.addEventListener("click", () => {
        typeOfGame = 'alone';
        console.log(typeOfGame);
        if (!gameStatus) {  // Запускаем игру только если она не запущена
            gameStatus = true;
            gameRunning = true;
            buttons.forEach((i) => i.style.display = "none");
            info.style.display = "none";
            stopGame.style.display = "block";
            

            if (typeOfGame === 'alone'){
                addTicOrTac();
            }
        
        }
    });

    // Режим игры с ботом
    withBotPlaying.addEventListener("click", () => {
        typeOfGame = 'with-bot';
        console.log(typeOfGame);
        if (typeOfGame === 'with-bot'){
            if (!gameStatus) { 
                gameStatus = true;
                gameRunning = true;
                buttons.forEach((i) => i.style.display = "none");
                info.style.display = "none";
                stopGame.style.display = "block";
    
                const withBot = () => {
                    addTicOrTacWithBot();
                };
    
                withBot();
            }
        }
    });

    // Логика для режима "Alone"
    const aloneMove = () => {
        const i = event.target
        if (gameRunning && !i.classList.contains('O') && !i.classList.contains('X')) {
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
                showDialog(winner);
                gameRunning = false;
            }
        }
    }
    function addTicOrTac() {
        cell.forEach((i, index) => {
            i.addEventListener('click', aloneMove);
        });
    }

    // Логика для игры с ботом
    const moveWithBot = () => {
        const i = event.target
        if (gameRunning && !i.classList.contains('O') && !i.classList.contains('X') && playerTurn) {
            i.classList.add('O');
            board[index] = 'O';
            playerTurn = false;

            const winner = checkWinner(board);
            if (winner) {
                showDialog(winner);
                gameRunning = false;
            } else {
                botMove();
            }
        }
    }

    function addTicOrTacWithBot() {
        cell.forEach((i, index) => {
            i.addEventListener('click', moveWithBot);
        });
    }

    // Движение бота
    function botMove() {
        setTimeout(() => {
            if (!gameRunning) return;

            const bestMove = findBestMove(board);
            if (bestMove !== undefined) {
                cell[bestMove].classList.add('X');
                board[bestMove] = 'X';
                playerTurn = true;

                const winner = checkWinner(board);
                if (winner) {
                    showDialog(winner);
                    gameRunning = false;
                }
            }
        }, 500);
    }

    // Поиск лучшего хода для бота
    function findBestMove(board) {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';  
                let score = minimax(board, 0, false);  
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    // Алгоритм Минимакс
    function minimax(board, depth, isMaximizing) {
        const winner = checkWinner(board);
        if (winner === 'X') return 10 - depth;
        if (winner === 'O') return depth - 10;
        if (winner === 'Draw') return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, false);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, true);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    // Проверка победителя
    function checkWinner(board) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
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

    // Показ диалога с результатами игры
    function showDialog(winner) {
        setTimeout(() => {
            dialog.innerHTML = winner === 'Draw' 
                ? "It's a draw! <br /> Tap anywhere on your screen to restart the game :)"
                : `Player ${winner} wins! Congratulations! <br /> Tap anywhere on your screen to restart the game :)`;
            dialog.showModal();
        }, 100);
    }

    // Нажатие кнопки "Stop Game"
    stopGame.addEventListener('click', () => {
        cell.forEach((i) => {
            i.removeEventListener('click', aloneMove),
            i.removeEventListener('click', moveWithBot)
        })
        gameStatus = false;
        gameRunning = false;
        typeOfGame = 'none';
        resetGame();
        resetUI();
    });

    // Перезапуск игры после завершения
    dialog.addEventListener('click', () => {
        dialog.close();
        resetGame();
    });
});
