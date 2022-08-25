import battleshipFactory from '../factories/battleship';

describe('Battleship', () => {
  let battleshipH, battleshipV;
  beforeEach(() => {
    battleshipH = battleshipFactory(3, 7, 'horizontal');
    battleshipV = battleshipFactory(2, 4, 'vertical');
  });

  test('was created successfully', () => {
    expect(battleshipH.ship).toEqual([7, 8, 9]);
    expect(battleshipV.ship).toEqual([4, 14]);
  });

  test('has correct length', () => {
    expect(battleshipH.ship.length).toBe(3);
  });

  test('was hit successfully', () => {
    let shipAfterHit = battleshipV.hit(0);
    expect(shipAfterHit).toEqual(['hit', 14]);
  });

  test('was sunk', () => {
    battleshipV.hit(0);
    battleshipV.hit(1);
    expect(battleshipV.isSunk()).toBe(true);
  });
});
