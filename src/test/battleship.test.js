import battleshipFactory from '../factories/battleship';

describe('Battleship', () => {
  let battleship;
  beforeEach(() => {
    battleship = battleshipFactory(3);
  });
  test('has correct length', () => {
    expect(battleship.length).toBe(3);
  });
});
