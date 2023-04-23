// PLAYER

const Player = (name, sign) => {
  const getName = () => name;
  const getSign = () => sign;

  return { getName, getSign };
};

// GAMEBOARD

const gameBoard = (function () {
  const _boardTiles = Array(9).fill("");

  const setBoardTile = (sign, index) => {
    _boardTiles[index] = sign;
  };

  const getBoardTile = (index) => _boardTiles[index];

  const getBoard = () => _boardTiles;

  const resetBoard = () => {
    _boardTiles.fill("");
  };

  return { setBoardTile, getBoardTile, getBoard, resetBoard };
})();

// GAME CONTROLLER

const gameController = (function () {
  let _playerOne = null;
  let _playerTwo = null;
  let _currentPlayer = null;
  let _roundCount = 1;
  let _winningPlayer = null;
  let _gameOver = true;

  const getCurrentPlayer = () => _currentPlayer;
  const getWinningPlayer = () => _winningPlayer;
  const getGameOver = () => _gameOver;

  const _checkWin = (boardArray) => {
    const winStates = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const winningSign = winStates.filter(
      (state) =>
        state.every((index) => boardArray[index] === "x") ||
        state.every((index) => boardArray[index] === "o")
    );

    return winningSign.length > 0 ? boardArray[winningSign[0][0]] : "";
  };

  const initPlayers = (nameOne, nameTwo) => {
    _playerOne = Player(nameOne, "x");
    _playerTwo = Player(nameTwo, "o");

    _currentPlayer = _playerOne;
    _gameOver = false;
    _winningPlayer = null;
  };

  const playRound = (board, index) => {
    // don't allow player to select already used tiles
    if (board.getBoardTile(index)) {
      return;
    }

    board.setBoardTile(_currentPlayer.getSign(), index);

    // alternate between players
    _currentPlayer = _currentPlayer === _playerOne ? _playerTwo : _playerOne;

    if (_roundCount >= 5) {
      _winningPlayer = _checkWin(board.getBoard());

      if (_winningPlayer) {
        board.resetBoard();
        _winningPlayer =
          _playerOne.getSign() === _winningPlayer ? _playerOne : _playerTwo;
        _gameOver = true;
        _roundCount = 1;
        return;
      }
      if (_roundCount === 9) {
        board.resetBoard();
        _winningPlayer = "Tie";
        _gameOver = true;
        _roundCount = 1;
        return;
      }
    }

    _roundCount += 1;
  };

  return {
    initPlayers,
    playRound,
    getCurrentPlayer,
    getWinningPlayer,
    getGameOver,
  };
})();

// DISPLAY

const displayController = (function () {
  const _startButton = document.querySelector("#start");
  const _statusText = document.querySelector("#status-text");
  const _interfaceTiles = document.querySelectorAll(".tile");
  const _playerInfo = document.querySelectorAll("input");

  const emptyTiles = () => {
    for (let i = 0; i < _interfaceTiles.length; i += 1) {
      _interfaceTiles[i].textContent = "";
    }
  };

  const setTile = (index, sign) => {
    _interfaceTiles[index].textContent = sign;
  };

  // add event listeners to each tile

  for (let i = 0; i < _interfaceTiles.length; i += 1) {
    _interfaceTiles[i].addEventListener("click", (event) => {
      event.stopPropagation();

      if (!_interfaceTiles[i].textContent && !gameController.getGameOver()) {
        setTile(i, gameController.getCurrentPlayer().getSign());
        gameController.playRound(gameBoard, i);

        if (
          gameController.getGameOver() &&
          gameController.getWinningPlayer() !== "Tie"
        ) {
          _statusText.textContent = `${gameController
            .getWinningPlayer()
            .getName()} wins!`;
        } else if (gameController.getWinningPlayer() === "Tie") {
          _statusText.textContent = "It's a tie!";
        } else {
          _statusText.textContent = `${gameController
            .getCurrentPlayer()
            .getName()}'s turn`;
        }
      }
    });
  }

  _startButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    emptyTiles();
    gameBoard.resetBoard();
    gameController.initPlayers(_playerInfo[0].value, _playerInfo[1].value);
    _statusText.textContent = `${gameController
      .getCurrentPlayer()
      .getName()}'s turn`;
  });

  return {};
})();
