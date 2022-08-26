import playerFactory from '../factories/player';

describe('Player', () => {
  let player = playerFactory('John Doe');

  test('Successfully created', () => {
    expect(player.name).toBe('John Doe');
  });

  test('Switches turn', () => {
    expect(player.switchTurn()).toBe(false);
    expect(player.switchTurn()).toBe(true);
  });
});
