const UI = (() => {
  const shipTypes = document.querySelectorAll('.ship');
  let nextNumber = [0, 0, 1, 0, 0];
  let initialNumber = [1, 1, 2, 1];

  const updateName = (newName) => {
    document.querySelector('.name').textContent = newName;
  };

  const highlightCells = (cells, reverse) => {
    cells.forEach((cell) => {
      let cellElement = document.querySelector(`[data-index="${cell}"]`);

      if (!reverse) cellElement.classList.add('active');
      else cellElement.classList.remove('active');
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

  const showAfterGame = (winner) => {
    document.querySelector('#game-stats').style.display = 'none';
    document.querySelector('#winner').textContent = winner;
    document.querySelector('#after-game').style.display = 'block';
  };

  const showStartButton = () => {
    document.querySelector('#start-game').style.display = 'block';
  };

  const updateShipyard = (currentShip) => {
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
    shipTypes.forEach(
      (shipType, i) =>
        (shipType.querySelector('p').textContent = `${initialNumber[i]}x`)
    );
    shipTypes[0].classList.add('active-ship');
  };

  const renderGameboard = (cells, name) => {
    let container = document.createElement('div');
    container.className = 'gameboard';
    container.id = `${
      name === 'Computer' ? name.toLowerCase() : 'player'
    }-gameboard`;

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
    resetElements,
  };
})();

export default UI;
