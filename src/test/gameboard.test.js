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

  test('switch orientation', () => {
    expect(gameboard.switchOrientation()).toBe('vertical');
    expect(gameboard.switchOrientation()).toBe('horizontal');
  });

  test('successfully adds ship', () => {
    expect(gameboard.addShip(dummyShip)).toEqual([0, 0, 0]);
  });

  test("doesn't add ship if not enough cells", () => {
    dummyShip.cells = [98, 99, 100];
    expect(gameboard.addShip(dummyShip)).toBe('Invalid position.');
  });

  test('receives attack on ship', () => {
    gameboard.addShip(dummyShip);
    expect(gameboard.receiveAttack(56)).toBe('Hit ship.');
    expect(dummyShip.hit.mock.results[0].value).toEqual([55, 'hit', 57]);
  });

  test('receives attack in water', () => {
    expect(gameboard.receiveAttack(0)).toBe('Hit water.');
  });

  test('refuses attack if already hit', () => {
    gameboard.addShip(dummyShip);
    gameboard.receiveAttack(55);
    expect(gameboard.receiveAttack(55)).toBe('Already hit.');
    expect(dummyShip.hit.mock.calls.length).toBe(1);
  });
});
