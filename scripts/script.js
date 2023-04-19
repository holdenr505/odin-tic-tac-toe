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

  const getBoard = () => _boardTiles;

  const resetBoard = () => {
    _boardTiles.fill("");
  };

  return { setBoardTile, getBoard, resetBoard };
})();

// GAME CONTROLLER

const gameController = (function () {
  let _playerOne = null;
  let _playerTwo = null;
  let _currentPlayer = _playerOne;
  let _roundCount = 1;

  const initPlayers = (nameOne, signOne, nameTwo, signTwo) => {
    _playerOne = Player(nameOne, signOne);
    _playerTwo = Player(nameTwo, signTwo);
  };

  const _checkWin = (board) => {
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

    const winner = winStates.filter(
      (state) =>
        state.every((index) => board[index] === "x") ||
        state.every((index) => board[index] === "o")
    )[0];

    return winner;
  };

  // playRound can call checkWin (helper function)
  const playRound = (board, index) => {
    board.setBoardTile(_currentPlayer.getSign(), index);

    // alternate between players and update round count
    _currentPlayer = _playerOne ? _playerTwo : _playerOne;
    _roundCount += 1;
  };

  return { initPlayers, playRound };
})();

// DISPLAY

const displayController = (function () {
  // functions to handle event listeners
  // will make calls to functions in other modules
  const _startButton = document.querySelector("#start");
  const _interfaceTiles = document.querySelectorAll(".tile");
  const _playerInfo = document.querySelectorAll("input");

  const _initListeners = () => {
    _interfaceTiles.forEach((tile) =>
      tile.addEventListener("click", () => {
        // ideally there's a way to check only after at least
        // 3 rounds
        // call playRound and also update DOM
      })
    );
  };

  // we'll have to handle this based on player turn
  _startButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    gameBoard.resetBoard();

    gameController.initPlayers(
      _playerInfo[0].value,
      _playerInfo[1].value,
      _playerInfo[2].value,
      _playerInfo[3].value
    );
    _initListeners();
  });

  return {};
})();
