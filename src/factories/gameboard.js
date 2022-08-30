const gameboardFactory = () => {
  const cells = Array(100).fill(-1);
  const ships = [];
  let orientation = 'horizontal';

  const getCells = () => cells;
  const setOrientation = (newOrientation) => {
    orientation = newOrientation;
    return orientation;
  };

  const canPlaceShip = (shipCells) => {
    let row = Math.floor(shipCells[0] / 10);

    for (const cell of shipCells) {
      if (cell > cells.length) return false;
      if (cells[cell] !== -1) return false;
      if (orientation === 'horizontal' && Math.floor(cell / 10) !== row)
        return false;
    }

    return true;
  };

  const addShip = (ship) => {
    if (!canPlaceShip(ship.cells)) return 'invalid position';

    ships.push(ship);
    ship.cells.forEach((cell) => (cells[cell] = ships.length - 1));

    return ship.cells.map((cell) => cells[cell]);
  };

  const receiveAttack = (position) => {
    if (cells[position] === 'hit') return 'already hit';

    let msg = 'misses';
    if (cells[position] !== -1) {
      ships[cells[position]].hit(
        ships[cells[position]].cells.findIndex((cell) => cell === position)
      );
      msg = 'hits a ship';
    }

    cells[position] = 'hit';
    return msg;
  };

  return { setOrientation, getCells, addShip, receiveAttack, canPlaceShip };
};

export default gameboardFactory;
