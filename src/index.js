import './style/index.scss';

import playerFactory from './factories/player';
import gameboardFactory from './factories/gameboard';

import UI from './UI';
import DOMEvents from './DOMEvents';

const game = (() => {
  // initialize players and gameboards
  let players = [playerFactory('Player'), playerFactory('Computer')];
  let playerGameboard = gameboardFactory(),
    computerGameboard = gameboardFactory();

  let running = false;
  const isGameRunning = () => running;

  const startGame = () => {
    running = true;
  };

  const generateRandomAttack = (cells) => {
    let unhitPositions = cells
      .map((cell, index) => index)
      .filter((cell) => cells[cell] !== 'hit');
    return unhitPositions[Math.floor(Math.random() * unhitPositions.length)];
  };

  const playRound = (attacker, attackedCell) => {
    // check if the game is running and if it's this player's turn
    if (!isGameRunning() || !players[attacker].getTurn()) return;

    let attackedGameboard =
      attacker === 0 ? computerGameboard : playerGameboard;

    // attempt attack
    let msg = attackedGameboard.receiveAttack(
      Number(attackedCell.getAttribute('data-index'))
    );

    // check if the position was already hit
    if (msg === 'Already hit.') return;
    UI.updateCellAfterAttack(attackedCell, msg);
    UI.updateTurn(game.players[1 - attacker].name);
    players[attacker].switchTurn();
    players[1 - attacker].switchTurn();

    // let computer attack
    if (attacker === 1) return;
    setTimeout(() => {
      let index = generateRandomAttack(playerGameboard.getCells());
      let cellElement = document
        .querySelector('#player-gameboard')
        .querySelector(`[data-index="${index}"]`);
      playRound(1, cellElement);
    }, 1000);
  };

  const setup = (() => {
    UI.renderGameboard(playerGameboard.getCells(), players[0].name);
    UI.renderGameboard(computerGameboard.getCells(), players[1].name);
    UI.updateTurn(players[0].name);
    DOMEvents.addCellEvent();
    DOMEvents.addSwitchEvent();

    UI.showShipyard();
  })();

  return {
    players,
    playerGameboard,
    computerGameboard,
    startGame,
    playRound,
  };
})();

export default game;
