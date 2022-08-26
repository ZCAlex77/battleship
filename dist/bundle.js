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



const DOMEvents = (() => {
  const changeName = document.querySelector('#change-name'),
        switchOrientation = document.querySelector('#switch-orientation');
  const shipTypes = ['xxxxx', 'xxxx', 'xxx', 'xxx', 'xx'];
  let currentShipType = 0;
  let orientation = 'horizontal';
  let currentHover = [];
  let lastHover = [];

  changeName.onsubmit = function (ev) {
    ev.preventDefault();
    _UI__WEBPACK_IMPORTED_MODULE_1__["default"].updateName(this.name.value);
    this.style.display = 'none';
    _UI__WEBPACK_IMPORTED_MODULE_1__["default"].showShipyard();
  };

  switchOrientation.onclick = function () {
    if (orientation === 'horizontal') orientation = 'vertical';else orientation = 'horizontal';
    document.querySelector('#orientation').textContent = orientation;
  };

  const addCellEvent = gameboard => {
    const cells = document.querySelector('#player-gameboard').querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.onmouseenter = function () {
        lastHover.forEach(cell => {
          _UI__WEBPACK_IMPORTED_MODULE_1__["default"].updateCellColor(cell, 1);
        });
        if (currentShipType >= shipTypes.length) return;
        let index = Number(this.getAttribute('data-index'));
        let ok = true;
        currentHover = [];

        switch (orientation) {
          case 'horizontal':
            for (let i = 0; i < shipTypes[currentShipType].length; i++) currentHover.push(index + i);

            break;

          case 'vertical':
            for (let i = 0; i < shipTypes[currentShipType].length; i++) currentHover.push(index + i * 10);

            break;
        }

        if (orientation === 'horizontal') {
          let row = Math.floor(currentHover[0] / 10);
          if (!currentHover.every(cell => Math.floor(cell / 10) === row)) ok = false;
        }

        if (!currentHover.every(cell => gameboard.getCells()[cell] === -1)) ok = false;

        if (currentHover.every(cell => cell < 100) && ok) {
          currentHover.forEach(cell => {
            _UI__WEBPACK_IMPORTED_MODULE_1__["default"].updateCellColor(cell, 0);
          });
          lastHover = [...currentHover];
        }
      };

      cell.onclick = () => {
        if (currentShipType < shipTypes.length) {
          let ship = (0,_factories_battleship__WEBPACK_IMPORTED_MODULE_0__["default"])(shipTypes[currentShipType].length, currentHover[0], orientation);
          gameboard.addShip(ship);
          lastHover = [];
          _UI__WEBPACK_IMPORTED_MODULE_1__["default"].updateShipyard(currentShipType);
          currentShipType++;
        }
      };
    });
  };

  return {
    addCellEvent
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

  const updateName = newName => {
    document.querySelector('.name').textContent = newName;
  };

  const updateCellColor = (cell, color) => {
    let colors = ['hsl(187, 40%, 10%)', 'hsl(187, 40%, 34%)'];
    document.querySelector(`[data-index="${cell}"]`).style.background = colors[color];
  };

  const showShipyard = () => {
    document.querySelector('#shipyard').style.display = 'block';
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

  const renderGameboard = (cells, name) => {
    let container = document.createElement('div');
    container.className = 'gameboard';
    container.id = `${name.toLowerCase()}-gameboard`;

    for (let i = 0; i < cells.length; i++) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      if (name === 'Player') cell.setAttribute('data-index', i);
      container.appendChild(cell);
    }

    let nameDisplay = document.createElement('h1');
    nameDisplay.className = 'name';
    nameDisplay.textContent = name;
    document.querySelector('#game').append(nameDisplay, container);
  };

  return {
    updateName,
    updateCellColor,
    renderGameboard,
    showShipyard,
    updateShipyard
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

  const switchOrientation = () => {
    if (orientation === 'horizontal') orientation = 'vertical';else orientation = 'horizontal';
    return orientation;
  };

  const addShip = ship => {
    for (let cell of ship.cells) {
      if (cell > cells.length) return 'Invalid position.';
      if (cells[cell] !== -1) return 'Invalid position.';
    }

    ships.push(ship);
    ship.cells.forEach(cell => cells[cell] = ships.length - 1);
    return ship.cells.map(cell => cells[cell]);
  };

  const receiveAttack = position => {
    if (cells[position] === 'hit') return 'Already hit.';
    let msg = 'Hit water.';

    if (cells[position] !== -1) {
      ships[cells[position]].hit(ships[cells[position]].cells.findIndex(cell => cell === position));
      msg = 'Hit ship.';
    }

    cells[position] = 'hit';
    return msg;
  };

  return {
    switchOrientation,
    getCells,
    addShip,
    receiveAttack
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
  let turn = true;

  const switchTurn = () => {
    turn = !turn;
    return turn;
  };

  return {
    name,
    switchTurn
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (playerFactory);

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
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "html {\n  font-family: \"Bebas Neue\", cursive;\n}\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  color: inherit;\n}\n\nbody {\n  background: hsl(187deg, 40%, 34%);\n}\n\n#game {\n  width: 100%;\n  height: 100vh;\n  display: grid;\n  grid-template-columns: 32px 1fr 16px 0.5fr 16px 1fr 32px;\n  grid-template-rows: 64px 1fr 32px;\n}\n\nheader {\n  display: flex;\n  align-items: center;\n  grid-area: 1/3/span 1/span 3;\n  background: hsl(187deg, 40%, 50%);\n  align-self: center;\n}\nheader h1 {\n  color: hsl(187deg, 40%, 10%);\n  font-size: 2rem;\n  text-align: center;\n  width: 100%;\n  letter-spacing: 2px;\n}\n\n#menu {\n  grid-area: 2/4/span 1/span 1;\n  background: hsl(187deg, 40%, 10%);\n  color: hsl(187deg, 40%, 50%);\n  padding: 16px;\n}\n#menu input[type=button],\n#menu button {\n  background: hsl(187deg, 40%, 50%);\n  color: hsl(187deg, 40%, 10%);\n  border: 0;\n  cursor: pointer;\n  border-radius: 999px;\n  font-size: 1.2rem;\n  padding: 5px 10px;\n  width: 100%;\n  text-align: center;\n  margin-bottom: 20px;\n}\n#menu form {\n  display: none;\n}\n#menu form label {\n  font-size: 1.4rem;\n  text-align: center;\n  display: block;\n  margin-bottom: 32px;\n}\n#menu form input {\n  border: 0;\n  font-size: 1.2rem;\n  padding: 4px;\n  margin-bottom: 16px;\n}\n#menu form input[type=text] {\n  background: #fff;\n  color: hsl(187deg, 40%, 10%);\n  width: 100%;\n  text-align: center;\n}\n\n#shipyard {\n  display: none;\n}\n#shipyard h2 {\n  font-weight: normal;\n  text-align: center;\n  margin-bottom: 32px;\n}\n#shipyard .active-ship {\n  border: 2px solid hsl(187deg, 40%, 50%);\n}\n#shipyard .ship {\n  padding: 2px 10px;\n  width: 100%;\n  height: 50px;\n  display: grid;\n  grid-template-columns: 4ch repeat(5, 1fr);\n  margin-bottom: 20px;\n  gap: 2px;\n}\n#shipyard .ship p {\n  place-self: center;\n  font-size: 1.5rem;\n}\n#shipyard .ship span {\n  aspect-ratio: 1/1;\n  background: hsl(187deg, 40%, 50%);\n  align-self: center;\n}\n\n.name {\n  grid-row: 1/span 1;\n  grid-column: 2/span 1;\n  align-self: center;\n  background: hsl(187deg, 40%, 10%);\n  color: hsl(187deg, 40%, 50%);\n  justify-self: stretch;\n  padding: 0 10px;\n}\n\n.name:last-of-type {\n  grid-column: 6/span 1;\n  text-align: right;\n}\n\n.gameboard {\n  display: grid;\n  grid-template: repeat(10, 1fr)/repeat(10, 1fr);\n  gap: 2px;\n  aspect-ratio: 1/1;\n  grid-row: 2/span 1;\n  align-self: center;\n}\n.gameboard .cell {\n  border: 1px solid hsl(187deg, 40%, 10%);\n  cursor: pointer;\n}\n\n#player-gameboard {\n  grid-column: 2/span 1;\n}\n\n#computer-gameboard {\n  grid-column: 6/span 1;\n}", "",{"version":3,"sources":["webpack://./src/style/index.scss"],"names":[],"mappings":"AAEA;EACE,kCAAA;AAAF;;AAGA;EACE,SAAA;EACA,UAAA;EACA,sBAAA;EACA,cAAA;AAAF;;AAOA;EACE,iCAJU;AAAZ;;AAOA;EACE,WAAA;EACA,aAAA;EACA,aAAA;EACA,wDAAA;EACA,iCAAA;AAJF;;AAOA;EACE,aAAA;EACA,mBAAA;EACA,4BAAA;EACA,iCAlBW;EAmBX,kBAAA;AAJF;AAME;EACE,4BAxBU;EAyBV,eAAA;EACA,kBAAA;EACA,WAAA;EACA,mBAAA;AAJJ;;AAQA;EACE,4BAAA;EACA,iCAlCY;EAmCZ,4BAjCW;EAkCX,aAAA;AALF;AAOE;;EAEE,iCAtCS;EAuCT,4BAzCU;EA0CV,SAAA;EACA,eAAA;EACA,oBAAA;EACA,iBAAA;EACA,iBAAA;EACA,WAAA;EACA,kBAAA;EACA,mBAAA;AALJ;AAQE;EACE,aAAA;AANJ;AAQI;EACE,iBAAA;EACA,kBAAA;EACA,cAAA;EACA,mBAAA;AANN;AAQI;EACE,SAAA;EACA,iBAAA;EACA,YAAA;EACA,mBAAA;AANN;AAQI;EACE,gBAAA;EACA,4BArEQ;EAsER,WAAA;EACA,kBAAA;AANN;;AAWA;EACE,aAAA;AARF;AAUE;EACE,mBAAA;EACA,kBAAA;EACA,mBAAA;AARJ;AAWE;EACE,uCAAA;AATJ;AAYE;EACE,iBAAA;EACA,WAAA;EACA,YAAA;EACA,aAAA;EACA,yCAAA;EACA,mBAAA;EACA,QAAA;AAVJ;AAYI;EACE,kBAAA;EACA,iBAAA;AAVN;AAaI;EACE,iBAAA;EACA,iCAvGO;EAwGP,kBAAA;AAXN;;AAgBA;EACE,kBAAA;EACA,qBAAA;EACA,kBAAA;EACA,iCAnHY;EAoHZ,4BAlHW;EAmHX,qBAAA;EACA,eAAA;AAbF;;AAgBA;EACE,qBAAA;EACA,iBAAA;AAbF;;AAgBA;EACE,aAAA;EACA,8CAAA;EACA,QAAA;EACA,iBAAA;EACA,kBAAA;EACA,kBAAA;AAbF;AAeE;EACE,uCAAA;EACA,eAAA;AAbJ;;AAiBA;EACE,qBAAA;AAdF;;AAiBA;EACE,qBAAA;AAdF","sourcesContent":["@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');\r\n\r\nhtml {\r\n  font-family: 'Bebas Neue', cursive;\r\n}\r\n\r\n* {\r\n  margin: 0;\r\n  padding: 0;\r\n  box-sizing: border-box;\r\n  color: inherit;\r\n}\r\n\r\n$darker-cyan: hsl(187, 40%, 10%);\r\n$dark-cyan: hsl(187, 40%, 34%);\r\n$light-cyan: hsl(187, 40%, 50%);\r\n\r\nbody {\r\n  background: $dark-cyan;\r\n}\r\n\r\n#game {\r\n  width: 100%;\r\n  height: 100vh;\r\n  display: grid;\r\n  grid-template-columns: 32px 1fr 16px 0.5fr 16px 1fr 32px;\r\n  grid-template-rows: 64px 1fr 32px;\r\n}\r\n\r\nheader {\r\n  display: flex;\r\n  align-items: center;\r\n  grid-area: 1 / 3 / span 1 / span 3;\r\n  background: $light-cyan;\r\n  align-self: center;\r\n\r\n  h1 {\r\n    color: $darker-cyan;\r\n    font-size: 2rem;\r\n    text-align: center;\r\n    width: 100%;\r\n    letter-spacing: 2px;\r\n  }\r\n}\r\n\r\n#menu {\r\n  grid-area: 2 / 4 / span 1 / span 1;\r\n  background: $darker-cyan;\r\n  color: $light-cyan;\r\n  padding: 16px;\r\n\r\n  input[type='button'],\r\n  button {\r\n    background: $light-cyan;\r\n    color: $darker-cyan;\r\n    border: 0;\r\n    cursor: pointer;\r\n    border-radius: 999px;\r\n    font-size: 1.2rem;\r\n    padding: 5px 10px;\r\n    width: 100%;\r\n    text-align: center;\r\n    margin-bottom: 20px;\r\n  }\r\n\r\n  form {\r\n    display: none;\r\n\r\n    label {\r\n      font-size: 1.4rem;\r\n      text-align: center;\r\n      display: block;\r\n      margin-bottom: 32px;\r\n    }\r\n    input {\r\n      border: 0;\r\n      font-size: 1.2rem;\r\n      padding: 4px;\r\n      margin-bottom: 16px;\r\n    }\r\n    input[type='text'] {\r\n      background: #fff;\r\n      color: $darker-cyan;\r\n      width: 100%;\r\n      text-align: center;\r\n    }\r\n  }\r\n}\r\n\r\n#shipyard {\r\n  display: none;\r\n\r\n  h2 {\r\n    font-weight: normal;\r\n    text-align: center;\r\n    margin-bottom: 32px;\r\n  }\r\n\r\n  .active-ship {\r\n    border: 2px solid $light-cyan;\r\n  }\r\n\r\n  .ship {\r\n    padding: 2px 10px;\r\n    width: 100%;\r\n    height: 50px;\r\n    display: grid;\r\n    grid-template-columns: 4ch repeat(5, 1fr);\r\n    margin-bottom: 20px;\r\n    gap: 2px;\r\n\r\n    p {\r\n      place-self: center;\r\n      font-size: 1.5rem;\r\n    }\r\n\r\n    span {\r\n      aspect-ratio: 1/1;\r\n      background: $light-cyan;\r\n      align-self: center;\r\n    }\r\n  }\r\n}\r\n\r\n.name {\r\n  grid-row: 1 / span 1;\r\n  grid-column: 2 / span 1;\r\n  align-self: center;\r\n  background: $darker-cyan;\r\n  color: $light-cyan;\r\n  justify-self: stretch;\r\n  padding: 0 10px;\r\n}\r\n\r\n.name:last-of-type {\r\n  grid-column: 6 / span 1;\r\n  text-align: right;\r\n}\r\n\r\n.gameboard {\r\n  display: grid;\r\n  grid-template: repeat(10, 1fr) / repeat(10, 1fr);\r\n  gap: 2px;\r\n  aspect-ratio: 1/1;\r\n  grid-row: 2 / span 1;\r\n  align-self: center;\r\n\r\n  .cell {\r\n    border: 1px solid $darker-cyan;\r\n    cursor: pointer;\r\n  }\r\n}\r\n\r\n#player-gameboard {\r\n  grid-column: 2 / span 1;\r\n}\r\n\r\n#computer-gameboard {\r\n  grid-column: 6 / span 1;\r\n}\r\n"],"sourceRoot":""}]);
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style/index.scss */ "./src/style/index.scss");
/* harmony import */ var _factories_player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./factories/player */ "./src/factories/player.js");
/* harmony import */ var _factories_gameboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./factories/gameboard */ "./src/factories/gameboard.js");
/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UI */ "./src/UI.js");
/* harmony import */ var _DOMEvents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DOMEvents */ "./src/DOMEvents.js");






const game = (() => {
  let players = [(0,_factories_player__WEBPACK_IMPORTED_MODULE_1__["default"])('Player'), (0,_factories_player__WEBPACK_IMPORTED_MODULE_1__["default"])('Computer')];
  let playerGameboard = (0,_factories_gameboard__WEBPACK_IMPORTED_MODULE_2__["default"])(),
      computerGameboard = (0,_factories_gameboard__WEBPACK_IMPORTED_MODULE_2__["default"])();
  _UI__WEBPACK_IMPORTED_MODULE_3__["default"].renderGameboard(playerGameboard.getCells(), players[0].name);
  _UI__WEBPACK_IMPORTED_MODULE_3__["default"].renderGameboard(computerGameboard.getCells(), players[1].name);
  _DOMEvents__WEBPACK_IMPORTED_MODULE_4__["default"].addCellEvent(playerGameboard);
  _UI__WEBPACK_IMPORTED_MODULE_3__["default"].showShipyard();
})();
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map