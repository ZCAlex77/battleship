/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/DOMEvents.js":
/*!**************************!*\
  !*** ./src/DOMEvents.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _factories_battleship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./factories/battleship */ "./src/factories/battleship.js");
/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UI */ "./src/UI.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index */ "./src/index.js");




const DOMEvents = (() => {
  const changeName = document.querySelector('#change-name'),
        switchOrientation = document.querySelector('#switch-orientation'),
        startGame = document.querySelector('#start-game'),
        restartGame = document.querySelector('#restart-game');
  const shipTypes = ['xxxxx', 'xxxx', 'xxx', 'xxx', 'xx'];
  let currentShipType = 0;
  let orientation = 'horizontal';
  let currentHover = [];
  let lastHover = [];

  changeName.onsubmit = function (ev) {
    ev.preventDefault();
    _UI__WEBPACK_IMPORTED_MODULE_1__["default"].updateName(this.name.value);
    _index__WEBPACK_IMPORTED_MODULE_2__["default"].players[0].setName(this.name.value);
    this.style.display = 'none';
    _UI__WEBPACK_IMPORTED_MODULE_1__["default"].showShipyard();
    addCellEvent();
  };

  startGame.onclick = function () {
    _index__WEBPACK_IMPORTED_MODULE_2__["default"].startGame();
    _UI__WEBPACK_IMPORTED_MODULE_1__["default"].showGameStats();
    addOpponentCellEvent();
  };

  restartGame.onclick = function () {
    currentHover = [];
    lastHover = [];
    currentShipType = 0;
    orientation = 'horizontal';
    _index__WEBPACK_IMPORTED_MODULE_2__["default"].restart();
  };

  const addSwitchEvent = () => {
    switchOrientation.onclick = function () {
      if (orientation === 'horizontal') orientation = 'vertical';else orientation = 'horizontal';
      _index__WEBPACK_IMPORTED_MODULE_2__["default"].getGameboard(0).setOrientation(orientation);
      document.querySelector('#orientation').textContent = orientation;
    };
  };

  const addCellEvent = () => {
    const cells = document.querySelector('#player-gameboard').querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.onmouseenter = function () {
        if (currentShipType >= shipTypes.length) return;
        let index = Number(this.getAttribute('data-index'));
        let ok = true; // create a ship from the inital position and orientation

        switch (orientation) {
          case 'horizontal':
            for (let i = 0; i < shipTypes[currentShipType].length; i++) currentHover.push(index + i);

            break;

          case 'vertical':
            for (let i = 0; i < shipTypes[currentShipType].length; i++) currentHover.push(index + i * 10);

            break;
        } // check to see if the ship wraps on the following row


        if (orientation === 'horizontal') {
          let row = Math.floor(currentHover[0] / 10);
          if (!currentHover.every(position => Math.floor(position / 10) === row)) ok = false;
        } // check to see if the cells are empty


        if (!currentHover.every(position => _index__WEBPACK_IMPORTED_MODULE_2__["default"].getGameboard(0).getCells()[position] === -1)) ok = false;

        if (currentHover.every(position => position < 100) && ok) {
          _UI__WEBPACK_IMPORTED_MODULE_1__["default"].highlightCells(currentHover, 0);
          lastHover = [...currentHover];
        }
      };

      cell.onmouseleave = () => {
        currentHover = [];
        if (lastHover.every(position => {
          _index__WEBPACK_IMPORTED_MODULE_2__["default"].getGameboard(0).getCells()[position] === -1;
        })) return;
        _UI__WEBPACK_IMPORTED_MODULE_1__["default"].highlightCells(lastHover, 1);
      };

      cell.onclick = () => {
        if (currentShipType < shipTypes.length) {
          let shipLength = shipTypes[currentShipType].length;
          let ship = (0,_factories_battleship__WEBPACK_IMPORTED_MODULE_0__["default"])(shipLength, currentHover[0], orientation);
          let msg = _index__WEBPACK_IMPORTED_MODULE_2__["default"].getGameboard(0).addShip(ship);

          if (msg !== 'invalid position') {
            _UI__WEBPACK_IMPORTED_MODULE_1__["default"].updateShipyard(currentShipType);
            lastHover = [];
            currentShipType++;
          }
        }

        if (currentShipType === shipTypes.length) {
          _UI__WEBPACK_IMPORTED_MODULE_1__["default"].showStartButton();
        }
      };
    });
  };

  const addOpponentCellEvent = () => {
    const cells = document.querySelector('#computer-gameboard').querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.onclick = function () {
        let attackedCell = this;
        _index__WEBPACK_IMPORTED_MODULE_2__["default"].playRound(0, attackedCell);
      };
    });
  };

  return {
    addCellEvent,
    addSwitchEvent
  };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DOMEvents);

/***/ }),

/***/ "./src/UI.js":
/*!*******************!*\
  !*** ./src/UI.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const UI = (() => {
  const shipTypes = document.querySelectorAll('.ship');
  let nextNumber = [0, 0, 1, 0, 0];
  let initialNumber = [1, 1, 2, 1];

  const updateName = newName => {
    document.querySelector('.name').textContent = newName;
  };

  const highlightCells = (cells, reverse) => {
    cells.forEach(cell => {
      let cellElement = document.querySelector(`[data-index="${cell}"]`);
      if (!reverse) cellElement.classList.add('active');else cellElement.classList.remove('active');
    });
  };

  const updateCellAfterAttack = (cell, outcome) => {
    let marker = outcome === 'misses' ? 'miss' : 'hit';
    cell.classList.add(marker);
  };

  const showShipyard = () => {
    document.querySelector('#change-name').style.display = 'none';
    document.querySelector('#after-game').style.display = 'none';
    document.querySelector('#shipyard').style.display = 'block';
  };

  const showGameStats = () => {
    document.querySelector('#shipyard').style.display = 'none';
    document.querySelector('#game-stats').style.display = 'grid';
  };

  const showAfterGame = winner => {
    document.querySelector('#game-stats').style.display = 'none';
    document.querySelector('#winner').textContent = winner;
    document.querySelector('#after-game').style.display = 'block';
  };

  const showStartButton = () => {
    document.querySelector('#start-game').style.display = 'block';
  };

  const updateShipyard = currentShip => {
    let numberOfShips = nextNumber[currentShip];
    if (currentShip > 2) currentShip -= 1;

    if (numberOfShips === 0) {
      shipTypes[currentShip].classList.remove('active-ship');
      shipTypes[currentShip + 1]?.classList.add('active-ship');
    }

    shipTypes[currentShip].querySelector('p').textContent = `${numberOfShips}x`;
  };

  const updateBattleLog = (player, whatToUpdate, value = '') => {
    let log = '';

    switch (whatToUpdate) {
      case 'turn':
        log = `${player} is attacking!`;
        break;

      case 'hit':
        log = `The projectile ${value}.`;
        break;

      case 'sunk':
        log = `${player} has sunk a ship.`;
        break;
    }

    let p = document.createElement('p');
    p.textContent = log;
    if (player === 'Computer') p.classList.add('right-align');
    document.querySelector('#battle-log').prepend(p);
  };

  const resetElements = () => {
    document.querySelector('#start-game').style.display = 'none';
    document.querySelector('#battle-log').innerHTML = '';
    document.querySelector('#player-gameboard').remove();
    document.querySelector('#computer-gameboard').remove();
    shipTypes.forEach((shipType, i) => shipType.querySelector('p').textContent = `${initialNumber[i]}x`);
    shipTypes[0].classList.add('active-ship');
  };

  const renderGameboard = (cells, name) => {
    let container = document.createElement('div');
    container.className = 'gameboard';
    container.id = `${name === 'Computer' ? name.toLowerCase() : 'player'}-gameboard`;

    for (let i = 0; i < cells.length; i++) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('data-index', i);
      container.appendChild(cell);
    }

    let nameDisplay = document.createElement('h1');
    nameDisplay.className = 'name';
    nameDisplay.textContent = name;
    document.querySelector('#game').append(nameDisplay, container);
  };

  return {
    updateName,
    highlightCells,
    renderGameboard,
    showShipyard,
    showGameStats,
    showAfterGame,
    showStartButton,
    updateShipyard,
    updateBattleLog,
    updateCellAfterAttack,
    resetElements
  };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UI);

/***/ }),

/***/ "./src/factories/battleship.js":
/*!*************************************!*\
  !*** ./src/factories/battleship.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const battleshipFactory = (length, position, orientation) => {
  const cells = [];

  const buildShip = (() => {
    let nextPosDistance = orientation === 'horizontal' ? 1 : 10;

    for (let i = 0; i < length; i++) cells.push(position + i * nextPosDistance);
  })();

  const hit = position => {
    if (cells[position] !== 'hit') cells[position] = 'hit';
    return cells;
  };

  const isSunk = () => cells.every(pos => pos === 'hit');

  return {
    cells,
    hit,
    isSunk
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (battleshipFactory);

/***/ }),

/***/ "./src/factories/gameboard.js":
/*!************************************!*\
  !*** ./src/factories/gameboard.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const gameboardFactory = () => {
  const cells = Array(100).fill(-1);
  const ships = [];
  let orientation = 'horizontal';

  const getCells = () => cells;

  const getShips = () => ships;

  const setOrientation = newOrientation => {
    orientation = newOrientation;
    return orientation;
  };

  const canPlaceShip = shipCells => {
    let row = Math.floor(shipCells[0] / 10);

    for (const cell of shipCells) {
      if (cell > cells.length) return false;
      if (cells[cell] !== -1) return false;
      if (orientation === 'horizontal' && Math.floor(cell / 10) !== row) return false;
    }

    return true;
  };

  const addShip = ship => {
    if (!canPlaceShip(ship.cells)) return 'invalid position';
    ships.push(ship);
    ship.cells.forEach(cell => cells[cell] = ships.length - 1);
    return ship.cells.map(cell => cells[cell]);
  };

  const receiveAttack = position => {
    if (cells[position] === 'hit') return 'already hit';
    let msg = 'misses';

    if (cells[position] !== -1) {
      ships[cells[position]].hit(ships[cells[position]].cells.findIndex(cell => cell === position));
      msg = 'hits a ship';
    }

    cells[position] = 'hit';
    return msg;
  };

  return {
    setOrientation,
    getCells,
    getShips,
    addShip,
    receiveAttack,
    canPlaceShip
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameboardFactory);

/***/ }),

/***/ "./src/factories/player.js":
/*!*********************************!*\
  !*** ./src/factories/player.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const playerFactory = name => {
  let turn = name === 'Computer' ? false : true;

  const switchTurn = () => {
    turn = !turn;
    return turn;
  };

  const setName = newName => name = newName;

  const getName = () => name;

  const getTurn = () => turn;

  return {
    getName,
    setName,
    switchTurn,
    getTurn
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (playerFactory);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style/index.scss */ "./src/style/index.scss");
/* harmony import */ var _factories_player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./factories/player */ "./src/factories/player.js");
/* harmony import */ var _factories_battleship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./factories/battleship */ "./src/factories/battleship.js");
/* harmony import */ var _factories_gameboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./factories/gameboard */ "./src/factories/gameboard.js");
/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./UI */ "./src/UI.js");
/* harmony import */ var _DOMEvents__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DOMEvents */ "./src/DOMEvents.js");







const game = (() => {
  // initialize players and gameboards
  let players = [(0,_factories_player__WEBPACK_IMPORTED_MODULE_1__["default"])('Player'), (0,_factories_player__WEBPACK_IMPORTED_MODULE_1__["default"])('Computer')];
  let gameboards = [(0,_factories_gameboard__WEBPACK_IMPORTED_MODULE_3__["default"])(), (0,_factories_gameboard__WEBPACK_IMPORTED_MODULE_3__["default"])()];
  _DOMEvents__WEBPACK_IMPORTED_MODULE_5__["default"].addSwitchEvent();
  let running = false;

  const isGameRunning = () => running;

  const getGameboard = index => gameboards[index];

  const startGame = () => {
    running = true;
    addOpponentShips();
  };

  const generateRandomAttack = cells => {
    let unhitPositions = cells.map((cell, index) => index).filter(cell => cells[cell] !== 'hit');
    return unhitPositions[Math.floor(Math.random() * unhitPositions.length)];
  };

  const addOpponentShips = () => {
    const shipTypes = ['xxxxx', 'xxxx', 'xxx', 'xxx', 'xx'];
    shipTypes.forEach(shipType => {
      let orientation = ['horizontal', 'vertical'][Math.floor(Math.random() * 2)];
      gameboards[1].setOrientation(orientation);
      let positions = Array(100).fill(0).map((pos, i) => i); // shuffle positions

      for (let i = 0; i < positions.length; i++) {
        let randomPos = Math.floor(Math.random() * positions.length);
        [positions[i], positions[randomPos]] = [positions[randomPos], positions[i]];
      }

      for (const pos of positions) {
        let ship = (0,_factories_battleship__WEBPACK_IMPORTED_MODULE_2__["default"])(shipType.length, pos, orientation);
        let msg = gameboards[1].addShip(ship);

        if (msg !== 'invalid position') {
          break;
        }
      }
    });
  };

  const playRound = (attacker, attackedCell) => {
    // check if the game is running and if it's this player's turn
    if (!isGameRunning() || !players[attacker].getTurn()) return;
    let attackedGameboard = attacker === 0 ? gameboards[1] : gameboards[0];
    let cellIndex = Number(attackedCell.getAttribute('data-index'));
    let shipIndex = attackedGameboard.getCells()[cellIndex]; // attempt attack

    let msg = attackedGameboard.receiveAttack(cellIndex); // check if the position was already hit

    if (msg === 'already hit') return;
    _UI__WEBPACK_IMPORTED_MODULE_4__["default"].updateCellAfterAttack(attackedCell, msg);
    _UI__WEBPACK_IMPORTED_MODULE_4__["default"].updateBattleLog(game.players[attacker].getName(), 'hit', msg); // check for sunk ships

    if (msg === 'hits a ship' && attackedGameboard.getShips()[shipIndex].isSunk()) _UI__WEBPACK_IMPORTED_MODULE_4__["default"].updateBattleLog(game.players[attacker].getName(), 'sunk'); // check for win

    if (msg === 'hits a ship') if (attackedGameboard.getShips().every(ship => ship.isSunk())) {
      running = false;
      _UI__WEBPACK_IMPORTED_MODULE_4__["default"].showAfterGame(players[attacker].getName());
      return;
    }
    players[attacker].switchTurn();
    players[1 - attacker].switchTurn(); // let computer attack

    _UI__WEBPACK_IMPORTED_MODULE_4__["default"].updateBattleLog(game.players[1 - attacker].getName(), 'turn');
    if (attacker === 1) return;
    setTimeout(() => {
      let index = generateRandomAttack(gameboards[0].getCells());
      let cellElement = document.querySelector('#player-gameboard').querySelector(`[data-index="${index}"]`);
      playRound(1, cellElement);
    }, 1000);
  };

  const restart = () => {
    gameboards[0] = (0,_factories_gameboard__WEBPACK_IMPORTED_MODULE_3__["default"])();
    gameboards[1] = (0,_factories_gameboard__WEBPACK_IMPORTED_MODULE_3__["default"])();
    _UI__WEBPACK_IMPORTED_MODULE_4__["default"].resetElements();
    setup();
    _UI__WEBPACK_IMPORTED_MODULE_4__["default"].showShipyard();
    _DOMEvents__WEBPACK_IMPORTED_MODULE_5__["default"].addCellEvent();
  };

  const setup = () => {
    _UI__WEBPACK_IMPORTED_MODULE_4__["default"].renderGameboard(gameboards[0].getCells(), players[0].getName());
    _UI__WEBPACK_IMPORTED_MODULE_4__["default"].renderGameboard(gameboards[1].getCells(), players[1].getName());
    _UI__WEBPACK_IMPORTED_MODULE_4__["default"].updateBattleLog(players[0].getName(), 'turn');
  };

  setup();
  return {
    players,
    getGameboard,
    startGame,
    restart,
    playRound
  };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/style/index.scss":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/style/index.scss ***!
  \***********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/hit.svg */ "./src/assets/hit.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/miss.svg */ "./src/assets/miss.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap);"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "html {\n  font-family: \"Bebas Neue\", cursive;\n}\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  color: inherit;\n  font-family: inherit;\n}\n\nbody {\n  background: hsl(187deg, 40%, 34%);\n}\n\n#game {\n  width: 100%;\n  height: 100vh;\n  display: grid;\n  grid-template-columns: 32px 1fr 16px 0.5fr 16px 1fr 32px;\n  grid-template-rows: 64px 1fr 32px;\n}\n\nheader {\n  display: flex;\n  align-items: center;\n  grid-area: 1/3/span 1/span 3;\n  background: hsl(187deg, 40%, 50%);\n  align-self: center;\n}\nheader h1 {\n  color: hsl(187deg, 40%, 10%);\n  font-size: 2rem;\n  text-align: center;\n  width: 100%;\n  letter-spacing: 2px;\n}\n\n#menu {\n  grid-area: 2/4/span 1/span 1;\n  background: hsl(187deg, 40%, 10%);\n  color: hsl(187deg, 40%, 50%);\n  padding: 16px;\n}\n#menu h2,\n#menu h3 {\n  font-weight: normal;\n}\n#menu h2 {\n  text-align: center;\n  margin-bottom: 32px;\n}\n#menu input[type=submit],\n#menu button {\n  background: hsl(187deg, 40%, 50%);\n  color: hsl(187deg, 40%, 10%);\n  border: 0;\n  cursor: pointer;\n  border-radius: 999px;\n  font-size: 1.2rem;\n  padding: 5px 10px;\n  width: 100%;\n  text-align: center;\n  margin-bottom: 20px;\n}\n\n#change-name label {\n  font-size: 1.4rem;\n  text-align: center;\n  display: block;\n  margin-bottom: 32px;\n}\n#change-name input {\n  border: 0;\n  font-size: 1.2rem;\n  padding: 4px;\n  margin-bottom: 16px;\n}\n#change-name input[type=text] {\n  background: #fff;\n  color: hsl(187deg, 40%, 10%);\n  width: 100%;\n  text-align: center;\n}\n\n#shipyard {\n  display: none;\n}\n#shipyard .active-ship {\n  border: 2px solid hsl(187deg, 40%, 50%);\n}\n#shipyard .ship {\n  padding: 2px 10px;\n  width: 100%;\n  height: 50px;\n  display: grid;\n  grid-template-columns: 4ch repeat(5, 1fr);\n  margin-bottom: 20px;\n  gap: 2px;\n}\n#shipyard .ship p {\n  place-self: center;\n  font-size: 1.5rem;\n}\n#shipyard .ship span {\n  aspect-ratio: 1/1;\n  background: hsl(187deg, 40%, 50%);\n  align-self: center;\n}\n\n.name {\n  grid-row: 1/span 1;\n  grid-column: 2/span 1;\n  align-self: center;\n  background: hsl(187deg, 40%, 10%);\n  color: hsl(187deg, 40%, 50%);\n  justify-self: stretch;\n  padding: 0 10px;\n}\n\n.name:last-of-type {\n  grid-column: 6/span 1;\n  text-align: right;\n}\n\n.gameboard {\n  display: grid;\n  grid-template: repeat(10, 1fr)/repeat(10, 1fr);\n  gap: 2px;\n  aspect-ratio: 1/1;\n  grid-row: 2/span 1;\n  align-self: center;\n}\n.gameboard .cell {\n  border: 1px solid hsl(187deg, 40%, 10%);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-size: 20%;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.gameboard .cell p {\n  font-size: 2rem;\n  color: #f00;\n}\n.gameboard .hit,\n.gameboard .miss {\n  animation: grow 0.2s linear forwards;\n}\n.gameboard .hit {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n}\n.gameboard .miss {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n}\n.gameboard .active {\n  background-color: hsl(187deg, 40%, 10%);\n}\n\n#player-gameboard {\n  grid-column: 2/span 1;\n}\n\n#computer-gameboard {\n  grid-column: 6/span 1;\n}\n#computer-gameboard .cell:hover {\n  border: 1px solid lime;\n}\n\n#start-game {\n  display: none;\n}\n\n#game-stats {\n  display: none;\n  grid-template-rows: 10% 90%;\n  height: 100%;\n  position: relative;\n}\n\n#battle-log {\n  position: absolute;\n  overflow-y: hidden;\n  border-bottom: 1px solid hsl(187deg, 40%, 50%);\n  border-top: 1px solid hsl(187deg, 40%, 50%);\n  padding-top: 2px;\n  top: 10%;\n  bottom: 10%;\n  left: 0;\n  right: 0;\n}\n#battle-log .right-align {\n  text-align: right;\n}\n\n#after-game {\n  display: none;\n}\n\n@keyframes grow {\n  from {\n    background-size: 20%;\n  }\n  to {\n    background-size: 100%;\n  }\n}", "",{"version":3,"sources":["webpack://./src/style/index.scss"],"names":[],"mappings":"AAEA;EACE,kCAAA;AAAF;;AAGA;EACE,SAAA;EACA,UAAA;EACA,sBAAA;EACA,cAAA;EACA,oBAAA;AAAF;;AAOA;EACE,iCAJU;AAAZ;;AAOA;EACE,WAAA;EACA,aAAA;EACA,aAAA;EACA,wDAAA;EACA,iCAAA;AAJF;;AAOA;EACE,aAAA;EACA,mBAAA;EACA,4BAAA;EACA,iCAlBW;EAmBX,kBAAA;AAJF;AAME;EACE,4BAxBU;EAyBV,eAAA;EACA,kBAAA;EACA,WAAA;EACA,mBAAA;AAJJ;;AAQA;EACE,4BAAA;EACA,iCAlCY;EAmCZ,4BAjCW;EAkCX,aAAA;AALF;AAOE;;EAEE,mBAAA;AALJ;AAQE;EACE,kBAAA;EACA,mBAAA;AANJ;AASE;;EAEE,iCAhDS;EAiDT,4BAnDU;EAoDV,SAAA;EACA,eAAA;EACA,oBAAA;EACA,iBAAA;EACA,iBAAA;EACA,WAAA;EACA,kBAAA;EACA,mBAAA;AAPJ;;AAYE;EACE,iBAAA;EACA,kBAAA;EACA,cAAA;EACA,mBAAA;AATJ;AAWE;EACE,SAAA;EACA,iBAAA;EACA,YAAA;EACA,mBAAA;AATJ;AAWE;EACE,gBAAA;EACA,4BA9EU;EA+EV,WAAA;EACA,kBAAA;AATJ;;AAaA;EACE,aAAA;AAVF;AAYE;EACE,uCAAA;AAVJ;AAaE;EACE,iBAAA;EACA,WAAA;EACA,YAAA;EACA,aAAA;EACA,yCAAA;EACA,mBAAA;EACA,QAAA;AAXJ;AAaI;EACE,kBAAA;EACA,iBAAA;AAXN;AAcI;EACE,iBAAA;EACA,iCAzGO;EA0GP,kBAAA;AAZN;;AAiBA;EACE,kBAAA;EACA,qBAAA;EACA,kBAAA;EACA,iCArHY;EAsHZ,4BApHW;EAqHX,qBAAA;EACA,eAAA;AAdF;;AAiBA;EACE,qBAAA;EACA,iBAAA;AAdF;;AAiBA;EACE,aAAA;EACA,8CAAA;EACA,QAAA;EACA,iBAAA;EACA,kBAAA;EACA,kBAAA;AAdF;AAgBE;EACE,uCAAA;EACA,eAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,oBAAA;EACA,2BAAA;EACA,4BAAA;AAdJ;AAgBI;EACE,eAAA;EACA,WAAA;AAdN;AAkBE;;EAEE,oCAAA;AAhBJ;AAmBE;EACE,yDAAA;AAjBJ;AAoBE;EACE,yDAAA;AAlBJ;AAqBE;EACE,uCAtKU;AAmJd;;AAuBA;EACE,qBAAA;AApBF;;AAuBA;EACE,qBAAA;AApBF;AAuBI;EACE,sBAAA;AArBN;;AA0BA;EACE,aAAA;AAvBF;;AA0BA;EACE,aAAA;EACA,2BAAA;EACA,YAAA;EACA,kBAAA;AAvBF;;AA0BA;EACE,kBAAA;EACA,kBAAA;EACA,8CAAA;EACA,2CAAA;EACA,gBAAA;EACA,QAAA;EACA,WAAA;EACA,OAAA;EACA,QAAA;AAvBF;AAyBE;EACE,iBAAA;AAvBJ;;AA2BA;EACE,aAAA;AAxBF;;AA2BA;EACE;IACE,oBAAA;EAxBF;EA0BA;IACE,qBAAA;EAxBF;AACF","sourcesContent":["@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');\r\n\r\nhtml {\r\n  font-family: 'Bebas Neue', cursive;\r\n}\r\n\r\n* {\r\n  margin: 0;\r\n  padding: 0;\r\n  box-sizing: border-box;\r\n  color: inherit;\r\n  font-family: inherit;\r\n}\r\n\r\n$darker-cyan: hsl(187, 40%, 10%);\r\n$dark-cyan: hsl(187, 40%, 34%);\r\n$light-cyan: hsl(187, 40%, 50%);\r\n\r\nbody {\r\n  background: $dark-cyan;\r\n}\r\n\r\n#game {\r\n  width: 100%;\r\n  height: 100vh;\r\n  display: grid;\r\n  grid-template-columns: 32px 1fr 16px 0.5fr 16px 1fr 32px;\r\n  grid-template-rows: 64px 1fr 32px;\r\n}\r\n\r\nheader {\r\n  display: flex;\r\n  align-items: center;\r\n  grid-area: 1 / 3 / span 1 / span 3;\r\n  background: $light-cyan;\r\n  align-self: center;\r\n\r\n  h1 {\r\n    color: $darker-cyan;\r\n    font-size: 2rem;\r\n    text-align: center;\r\n    width: 100%;\r\n    letter-spacing: 2px;\r\n  }\r\n}\r\n\r\n#menu {\r\n  grid-area: 2 / 4 / span 1 / span 1;\r\n  background: $darker-cyan;\r\n  color: $light-cyan;\r\n  padding: 16px;\r\n\r\n  h2,\r\n  h3 {\r\n    font-weight: normal;\r\n  }\r\n\r\n  h2 {\r\n    text-align: center;\r\n    margin-bottom: 32px;\r\n  }\r\n\r\n  input[type='submit'],\r\n  button {\r\n    background: $light-cyan;\r\n    color: $darker-cyan;\r\n    border: 0;\r\n    cursor: pointer;\r\n    border-radius: 999px;\r\n    font-size: 1.2rem;\r\n    padding: 5px 10px;\r\n    width: 100%;\r\n    text-align: center;\r\n    margin-bottom: 20px;\r\n  }\r\n}\r\n\r\n#change-name {\r\n  label {\r\n    font-size: 1.4rem;\r\n    text-align: center;\r\n    display: block;\r\n    margin-bottom: 32px;\r\n  }\r\n  input {\r\n    border: 0;\r\n    font-size: 1.2rem;\r\n    padding: 4px;\r\n    margin-bottom: 16px;\r\n  }\r\n  input[type='text'] {\r\n    background: #fff;\r\n    color: $darker-cyan;\r\n    width: 100%;\r\n    text-align: center;\r\n  }\r\n}\r\n\r\n#shipyard {\r\n  display: none;\r\n\r\n  .active-ship {\r\n    border: 2px solid $light-cyan;\r\n  }\r\n\r\n  .ship {\r\n    padding: 2px 10px;\r\n    width: 100%;\r\n    height: 50px;\r\n    display: grid;\r\n    grid-template-columns: 4ch repeat(5, 1fr);\r\n    margin-bottom: 20px;\r\n    gap: 2px;\r\n\r\n    p {\r\n      place-self: center;\r\n      font-size: 1.5rem;\r\n    }\r\n\r\n    span {\r\n      aspect-ratio: 1/1;\r\n      background: $light-cyan;\r\n      align-self: center;\r\n    }\r\n  }\r\n}\r\n\r\n.name {\r\n  grid-row: 1 / span 1;\r\n  grid-column: 2 / span 1;\r\n  align-self: center;\r\n  background: $darker-cyan;\r\n  color: $light-cyan;\r\n  justify-self: stretch;\r\n  padding: 0 10px;\r\n}\r\n\r\n.name:last-of-type {\r\n  grid-column: 6 / span 1;\r\n  text-align: right;\r\n}\r\n\r\n.gameboard {\r\n  display: grid;\r\n  grid-template: repeat(10, 1fr) / repeat(10, 1fr);\r\n  gap: 2px;\r\n  aspect-ratio: 1/1;\r\n  grid-row: 2 / span 1;\r\n  align-self: center;\r\n\r\n  .cell {\r\n    border: 1px solid $darker-cyan;\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    background-size: 20%;\r\n    background-position: center;\r\n    background-repeat: no-repeat;\r\n\r\n    p {\r\n      font-size: 2rem;\r\n      color: #f00;\r\n    }\r\n  }\r\n\r\n  .hit,\r\n  .miss {\r\n    animation: grow 0.2s linear forwards;\r\n  }\r\n\r\n  .hit {\r\n    background-image: url('../assets/hit.svg');\r\n  }\r\n\r\n  .miss {\r\n    background-image: url('../assets/miss.svg');\r\n  }\r\n\r\n  .active {\r\n    background-color: $darker-cyan;\r\n  }\r\n}\r\n\r\n#player-gameboard {\r\n  grid-column: 2 / span 1;\r\n}\r\n\r\n#computer-gameboard {\r\n  grid-column: 6 / span 1;\r\n\r\n  .cell {\r\n    &:hover {\r\n      border: 1px solid lime;\r\n    }\r\n  }\r\n}\r\n\r\n#start-game {\r\n  display: none;\r\n}\r\n\r\n#game-stats {\r\n  display: none;\r\n  grid-template-rows: 10% 90%;\r\n  height: 100%;\r\n  position: relative;\r\n}\r\n\r\n#battle-log {\r\n  position: absolute;\r\n  overflow-y: hidden;\r\n  border-bottom: 1px solid $light-cyan;\r\n  border-top: 1px solid $light-cyan;\r\n  padding-top: 2px;\r\n  top: 10%;\r\n  bottom: 10%;\r\n  left: 0;\r\n  right: 0;\r\n\r\n  .right-align {\r\n    text-align: right;\r\n  }\r\n}\r\n\r\n#after-game {\r\n  display: none;\r\n}\r\n\r\n@keyframes grow {\r\n  from {\r\n    background-size: 20%;\r\n  }\r\n  to {\r\n    background-size: 100%;\r\n  }\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/style/index.scss":
/*!******************************!*\
  !*** ./src/style/index.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./index.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/style/index.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/assets/hit.svg":
/*!****************************!*\
  !*** ./src/assets/hit.svg ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "fb6551b8291dfcd6c42c.svg";

/***/ }),

/***/ "./src/assets/miss.svg":
/*!*****************************!*\
  !*** ./src/assets/miss.svg ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "347d0d5f51ef72dd4c0e.svg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map