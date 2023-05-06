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

  const getEmptyTiles = () => {
    const emptyTiles = [];

    for (let i = 0; i < _boardTiles.length; i += 1) {
      if (_boardTiles[i] === "") {
        emptyTiles.push(i);
      }
    }

    return emptyTiles;
  };

  const getBoard = () => _boardTiles;

  const resetBoard = () => {
    _boardTiles.fill("");
  };

  return { setBoardTile, getBoardTile, getBoard, resetBoard, getEmptyTiles };
})();

// GAME CONTROLLER

const gameController = (function () {
  let _playerOne;
  let _playerTwo;
  let _currentPlayer;
  let _roundCount = 1;
  let _winningPlayer;
  let _gameOver = true;

  const getPlayerOne = () => _playerOne;
  const getPlayerTwo = () => _playerTwo;
  const getCurrentPlayer = () => _currentPlayer;
  const getWinningPlayer = () => _winningPlayer;
  const getGameOver = () => _gameOver;
  const getRoundCount = () => _roundCount;

  const checkWin = (boardArray) => {
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

    // check if every spot on the board is filled
    // and if no winning sign was returned then
    // game results in a tie
    if (winningSign.length === 0 && boardArray.every((index) => index)) {
      return "Tie";
    }

    return winningSign.length > 0 ? boardArray[winningSign[0][0]] : "";
  };

  const initGame = (nameOne, nameTwo) => {
    _playerOne = Player(nameOne, "x");
    _playerTwo = Player(nameTwo, "o");

    _currentPlayer = _playerOne;
    _gameOver = false;
    _roundCount = 1;
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
      _winningPlayer = checkWin(board.getBoard());

      if (_winningPlayer) {
        board.resetBoard();
        _gameOver = true;
        if (_winningPlayer !== "Tie") {
          _winningPlayer =
            _playerOne.getSign() === _winningPlayer ? _playerOne : _playerTwo;
        }
        return;
      }
    }

    _roundCount += 1;
  };

  return {
    initGame,
    playRound,
    getCurrentPlayer,
    getWinningPlayer,
    getGameOver,
    checkWin,
    getRoundCount,
    getPlayerOne,
    getPlayerTwo,
  };
})();

// AI

// for min and max each position on the board
// will be assigned a score passed up from the
// function call that reaches a terminal position
// then choose the position associated with the best
// score for min or max

const artificialIntelligence = (function () {
  const _getTerminalValue = (sign) => {
    let value;
    if (sign === "Tie") {
      value = 0;
    } else if (sign === "x") {
      value = 1;
    } else if (sign === "o") {
      value = -1;
    }

    return value;
  };

  const minimax = (board, player) => {
    const terminalState = gameController.checkWin(board.getBoard());

    if (terminalState) {
      return { score: _getTerminalValue(terminalState) };
    }

    const freeSpaces = board.getEmptyTiles();
    let bestScore;
    let bestIndex;

    if (player.getSign() === "x") {
      bestScore = -2;
      for (let i = 0; i < freeSpaces.length; i += 1) {
        board.setBoardTile(player.getSign(), freeSpaces[i]);
        const result = minimax(board, gameController.getPlayerTwo()).score;

        if (result > bestScore) {
          bestScore = result;
          bestIndex = freeSpaces[i];
        }

        board.setBoardTile("", freeSpaces[i]);
      }
    } else {
      bestScore = 2;
      for (let i = 0; i < freeSpaces.length; i += 1) {
        board.setBoardTile(player.getSign(), freeSpaces[i]);
        const result = minimax(board, gameController.getPlayerOne()).score;

        if (result < bestScore) {
          bestScore = result;
          bestIndex = freeSpaces[i];
        }

        board.setBoardTile("", freeSpaces[i]);
      }
    }

    return { score: bestScore, index: bestIndex };
  };

  return { minimax };
})();

// DISPLAY

const displayController = (function () {
  const _startButton = document.querySelector("#start");
  const _statusText = document.querySelector("#status-text");
  const _interfaceTiles = document.querySelectorAll(".tile");
  const _playerInfo = document.querySelectorAll("input[type='text'");

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

    if (_playerInfo[0].value === "" || _playerInfo[1].value === "") {
      _statusText.textContent = "Please enter a name";
      return;
    }

    if (_playerInfo[0].value === _playerInfo[1].value) {
      _statusText.textContent = "No duplicate names allowed";
      return;
    }

    emptyTiles();
    gameBoard.resetBoard();
    gameController.initGame(_playerInfo[0].value, _playerInfo[1].value);
    _statusText.textContent = `${gameController
      .getCurrentPlayer()
      .getName()}'s turn`;
  });

  return {};
})();
