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

const gameController = function () {
  // two player objects

  //function to handle rounds and player turn

  //function to check for win

  return {};
};

const displayController = (function () {
  // functions to handle event listeners
  // will make calls to functions in other modules

  return {};
})();
