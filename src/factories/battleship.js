const battleshipFactory = (length, position, orientation) => {
  const cells = [];

  const buildShip = (() => {
    let nextPosDistance = orientation === 'horizontal' ? 1 : 10;
    for (let i = 0; i < length; i++) cells.push(position + i * nextPosDistance);
  })();

  const hit = (position) => {
    if (cells[position] !== 'hit') cells[position] = 'hit';
    return cells;
  };
  const isSunk = () => cells.every((pos) => pos === 'hit');

  return { cells, hit, isSunk };
};

export default battleshipFactory;
