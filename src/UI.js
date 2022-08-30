const UI = (() => {
  const shipTypes = document.querySelectorAll('.ship');
  let nextNumber = [0, 0, 1, 0, 0];

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
    document.querySelector('#shipyard').style.display = 'block';
  };

  const showGameStats = () => {
    document.querySelector('#shipyard').style.display = 'none';
    document.querySelector('#game-stats').style.display = 'block';
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

  const updateTurn = (name) => {
    document.querySelector('#attacker').textContent = name;
  };

  const renderGameboard = (cells, name) => {
    let container = document.createElement('div');
    container.className = 'gameboard';
    container.id = `${name.toLowerCase()}-gameboard`;

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
    showStartButton,
    updateShipyard,
    updateTurn,
    updateCellAfterAttack,
  };
})();

export default UI;
