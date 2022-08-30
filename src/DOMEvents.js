import battleshipFactory from './factories/battleship';
import UI from './UI';
import game from './index';

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
    UI.updateName(this.name.value);
    game.players[0].setName(this.name.value);
    this.style.display = 'none';
    UI.showShipyard();
    addCellEvent();
  };

  startGame.onclick = function () {
    game.startGame();
    UI.showGameStats();
    addOpponentCellEvent();
  };

  restartGame.onclick = function () {
    currentHover = [];
    lastHover = [];
    currentShipType = 0;
    orientation = 'horizontal';
    game.restart();
  };

  const addSwitchEvent = () => {
    switchOrientation.onclick = function () {
      if (orientation === 'horizontal') orientation = 'vertical';
      else orientation = 'horizontal';

      game.getGameboard(0).setOrientation(orientation);
      document.querySelector('#orientation').textContent = orientation;
    };
  };

  const addCellEvent = () => {
    const cells = document
      .querySelector('#player-gameboard')
      .querySelectorAll('.cell');

    cells.forEach((cell) => {
      cell.onmouseenter = function () {
        if (currentShipType >= shipTypes.length) return;
        let index = Number(this.getAttribute('data-index'));
        let ok = true;

        // create a ship from the inital position and orientation
        switch (orientation) {
          case 'horizontal':
            for (let i = 0; i < shipTypes[currentShipType].length; i++)
              currentHover.push(index + i);
            break;
          case 'vertical':
            for (let i = 0; i < shipTypes[currentShipType].length; i++)
              currentHover.push(index + i * 10);
            break;
        }

        // check to see if the ship wraps on the following row
        if (orientation === 'horizontal') {
          let row = Math.floor(currentHover[0] / 10);
          if (
            !currentHover.every((position) => Math.floor(position / 10) === row)
          )
            ok = false;
        }

        // check to see if the cells are empty
        if (
          !currentHover.every(
            (position) => game.getGameboard(0).getCells()[position] === -1
          )
        )
          ok = false;

        if (currentHover.every((position) => position < 100) && ok) {
          UI.highlightCells(currentHover, 0);
          lastHover = [...currentHover];
        }
      };

      cell.onmouseleave = () => {
        currentHover = [];
        if (
          lastHover.every((position) => {
            game.getGameboard(0).getCells()[position] === -1;
          })
        )
          return;
        UI.highlightCells(lastHover, 1);
      };

      cell.onclick = () => {
        if (currentShipType < shipTypes.length) {
          let shipLength = shipTypes[currentShipType].length;

          let ship = battleshipFactory(
            shipLength,
            currentHover[0],
            orientation
          );

          let msg = game.getGameboard(0).addShip(ship);
          if (msg !== 'invalid position') {
            UI.updateShipyard(currentShipType);
            lastHover = [];
            currentShipType++;
          }
        }
        if (currentShipType === shipTypes.length) {
          UI.showStartButton();
        }
      };
    });
  };

  const addOpponentCellEvent = () => {
    const cells = document
      .querySelector('#computer-gameboard')
      .querySelectorAll('.cell');

    cells.forEach((cell) => {
      cell.onclick = function () {
        let attackedCell = this;
        game.playRound(0, attackedCell);
      };
    });
  };

  return { addCellEvent, addSwitchEvent };
})();

export default DOMEvents;
