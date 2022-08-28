import battleshipFactory from './factories/battleship';
import UI from './UI';

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
    UI.updateName(this.name.value);
    this.style.display = 'none';
    UI.showShipyard();
  };

  const addSwitchEvent = (gameboard) => {
    switchOrientation.onclick = function () {
      if (orientation === 'horizontal') orientation = 'vertical';
      else orientation = 'horizontal';

      gameboard.switchOrientation();
      document.querySelector('#orientation').textContent = orientation;
    };
  };

  const addCellEvent = (gameboard) => {
    const cells = document
      .querySelector('#player-gameboard')
      .querySelectorAll('.cell');

    cells.forEach((cell) => {
      cell.onmouseenter = function () {
        lastHover.forEach((cell) => {
          UI.updateCellColor(cell, 1);
        });
        if (currentShipType >= shipTypes.length) return;
        let index = Number(this.getAttribute('data-index'));
        let ok = true;
        currentHover = [];

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

        if (orientation === 'horizontal') {
          let row = Math.floor(currentHover[0] / 10);
          if (!currentHover.every((cell) => Math.floor(cell / 10) === row))
            ok = false;
        }

        if (!currentHover.every((cell) => gameboard.getCells()[cell] === -1))
          ok = false;

        if (currentHover.every((cell) => cell < 100) && ok) {
          currentHover.forEach((cell) => {
            UI.updateCellColor(cell, 0);
          });
          lastHover = [...currentHover];
        }
      };

      cell.onclick = () => {
        if (currentShipType < shipTypes.length) {
          let ship = battleshipFactory(
            shipTypes[currentShipType].length,
            currentHover[0],
            orientation
          );

          let msg = gameboard.addShip(ship);
          if (msg !== 'Invalid position.') {
            UI.updateShipyard(currentShipType);
            lastHover = [];
            currentShipType++;
          }
        }
      };
    });
  };

  return { addCellEvent, addSwitchEvent };
})();

export default DOMEvents;
