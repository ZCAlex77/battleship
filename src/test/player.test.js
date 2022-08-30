import playerFactory from '../factories/player';

describe('Player', () => {
  let player = playerFactory('John Doe');

  test('Successfully created', () => {
    expect(player.getName()).toBe('John Doe');
  });

  test('Successfully changed name', () => {
    player.setName('Doe John');
    expect(player.getName()).toBe('Doe John');
  });

  test('Switches turn', () => {
    expect(player.switchTurn()).toBe(false);
    expect(player.switchTurn()).toBe(true);
  });
});
