import gameboardFactory from '../factories/gameboard';

describe('Gameboard', () => {
  let gameboard;
  let dummyShip;

  beforeEach(() => {
    gameboard = gameboardFactory();
    dummyShip = new (function () {
      this.cells = [55, 56, 57];
      this.hit = jest.fn((position) => {
        this.cells[position] = 'hit';
        return this.cells;
      });
    })();
  });

  test('successfully created', () => {
    expect(gameboard.getCells().length).toBe(100);
    expect(gameboard.getCells().every((cell) => cell === -1)).toBe(true);
  });

  test('sets orientation', () => {
    expect(gameboard.setOrientation('vertical')).toBe('vertical');
    expect(gameboard.setOrientation('horizontal')).toBe('horizontal');
  });

  test('successfully adds ship', () => {
    expect(gameboard.addShip(dummyShip)).toEqual([0, 0, 0]);
  });

  test('checks if the ship can be placed correctly', () => {
    dummyShip.cells = [29, 30, 31];
    expect(gameboard.canPlaceShip(dummyShip.cells)).toBe(false);
    dummyShip.cells = [24, 25, 26];
    expect(gameboard.canPlaceShip(dummyShip.cells)).toBe(true);
  });

  test('receives attack on ship', () => {
    gameboard.addShip(dummyShip);
    expect(gameboard.receiveAttack(56)).toBe('hits a ship');
    expect(dummyShip.hit.mock.results[0].value).toEqual([55, 'hit', 57]);
  });

  test('receives attack in water', () => {
    expect(gameboard.receiveAttack(0)).toBe('misses');
  });

  test('refuses attack if already hit', () => {
    gameboard.addShip(dummyShip);
    gameboard.receiveAttack(55);
    expect(gameboard.receiveAttack(55)).toBe('already hit');
    expect(dummyShip.hit.mock.calls.length).toBe(1);
  });
});
