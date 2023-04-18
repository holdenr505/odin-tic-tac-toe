const Player = (name, sign) => {
  const getName = () => name;
  const getSign = () => sign;

  return { getName, getSign };
};

const gameBoard = (function () {
  const _boardTiles = new Array(9);

  const setBoardTile = (sign, index) => {
    _boardTiles[index] = sign;
  };

  const getBoardTile = (index) => _boardTiles[index];

  return { setBoardTile, getBoardTile };
})();

const gameController = (function () {
  return {};
})();

const displayController = (function () {
  // functions to handle event listeners
  // will make calls to functions in other modules
  const _startButton = document.querySelector("#start");
  const _interfaceTiles = document.querySelectorAll(".tile");
  const _playerInfo = document.querySelectorAll("input");

  //we'll have to handle this based on player turn
  _startButton.addEventListener("click", () => {
    gameController.initPlayers(
      _playerInfo[0],
      _playerInfo[1],
      _playerInfo[2],
      _playerInfo[3]
    );
    _initListeners();
  });

  const _initListeners = () => {
    _interfaceTiles.forEach((tile) =>
      tile.addEventListener("click", () => {
        // do something
      })
    );
  };

  return {};
})();
