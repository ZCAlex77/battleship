const gameboardFactory = () => {
  const cells = Array(100).fill(-1);
  const ships = [];
  let orientation = 'horizontal';

  const getCells = () => cells;
  const switchOrientation = () => {
    if (orientation === 'horizontal') orientation = 'vertical';
    else orientation = 'horizontal';

    return orientation;
  };

  const canPlaceShip = (shipCells) => {
    let row = Math.floor(shipCells[0] / 10);

    for (const cell of shipCells) {
      if (cell > cells.length) return false;
      if (cells[cell] !== -1) return false;
      if (Math.floor(cell / 10) !== row) return false;
    }

    return true;
  };

  const addShip = (ship) => {
    if (!canPlaceShip(ship.cells)) return 'Invalid position.';

    ships.push(ship);
    ship.cells.forEach((cell) => (cells[cell] = ships.length - 1));

    return ship.cells.map((cell) => cells[cell]);
  };

  const receiveAttack = (position) => {
    if (cells[position] === 'hit') return 'Already hit.';

    let msg = 'Hit water.';
    if (cells[position] !== -1) {
      ships[cells[position]].hit(
        ships[cells[position]].cells.findIndex((cell) => cell === position)
      );
      msg = 'Hit ship.';
    }

    cells[position] = 'hit';
    return msg;
  };

  return { switchOrientation, getCells, addShip, receiveAttack, canPlaceShip };
};

export default gameboardFactory;
