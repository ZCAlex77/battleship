const battleshipFactory = (length, position, orientation) => {
  const ship = [];

  const buildShip = (() => {
    let nextPosDistance = orientation === 'horizontal' ? 1 : 10;
    for (let i = 0; i < length; i++) ship.push(position + i * nextPosDistance);
  })();

  const hit = (position) => {
    if (ship[position] !== 'hit') ship[position] = 'hit';
    return ship;
  };
  const isSunk = () => ship.every((pos) => pos === 'hit');

  return { ship, hit, isSunk };
};

export default battleshipFactory;
