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

  const addShip = (ship) => {
    for (let cell of ship.cells) {
      if (cell > cells.length) return 'Invalid position.';
      if (cells[cell] !== -1) return 'Invalid position.';
    }

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

  return { switchOrientation, getCells, addShip, receiveAttack };
};

export default gameboardFactory;
