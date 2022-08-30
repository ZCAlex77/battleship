import './style/index.scss';

import playerFactory from './factories/player';
import battleshipFactory from './factories/battleship';
import gameboardFactory from './factories/gameboard';

import UI from './UI';
import DOMEvents from './DOMEvents';

const game = (() => {
  // initialize players and gameboards
  let players = [playerFactory('Player'), playerFactory('Computer')];
  let gameboards = [gameboardFactory(), gameboardFactory()];

  DOMEvents.addSwitchEvent();

  let running = false;
  const isGameRunning = () => running;

  const getGameboard = (index) => gameboards[index];

  const startGame = () => {
    running = true;
    addOpponentShips();
  };

  const generateRandomAttack = (cells) => {
    let unhitPositions = cells
      .map((cell, index) => index)
      .filter((cell) => cells[cell] !== 'hit');
    return unhitPositions[Math.floor(Math.random() * unhitPositions.length)];
  };

  const addOpponentShips = () => {
    const shipTypes = ['xxxxx', 'xxxx', 'xxx', 'xxx', 'xx'];

    shipTypes.forEach((shipType) => {
      let orientation = ['horizontal', 'vertical'][
        Math.floor(Math.random() * 2)
      ];
      gameboards[1].setOrientation(orientation);

      let positions = Array(100)
        .fill(0)
        .map((pos, i) => i);
      // shuffle positions
      for (let i = 0; i < positions.length; i++) {
        let randomPos = Math.floor(Math.random() * positions.length);
        [positions[i], positions[randomPos]] = [
          positions[randomPos],
          positions[i],
        ];
      }

      for (const pos of positions) {
        let ship = battleshipFactory(shipType.length, pos, orientation);
        let msg = gameboards[1].addShip(ship);
        if (msg !== 'invalid position') {
          break;
        }
      }
    });
  };

  const playRound = (attacker, attackedCell) => {
    // check if the game is running and if it's this player's turn
    if (!isGameRunning() || !players[attacker].getTurn()) return;

    let attackedGameboard = attacker === 0 ? gameboards[1] : gameboards[0];
    let cellIndex = Number(attackedCell.getAttribute('data-index'));
    let shipIndex = attackedGameboard.getCells()[cellIndex];
    // attempt attack
    let msg = attackedGameboard.receiveAttack(cellIndex);

    // check if the position was already hit
    if (msg === 'already hit') return;

    UI.updateCellAfterAttack(attackedCell, msg);
    UI.updateBattleLog(game.players[attacker].getName(), 'hit', msg);

    // check for sunk ships
    if (
      msg === 'hits a ship' &&
      attackedGameboard.getShips()[shipIndex].isSunk()
    )
      UI.updateBattleLog(game.players[attacker].getName(), 'sunk');

    // check for win
    if (msg === 'hits a ship')
      if (attackedGameboard.getShips().every((ship) => ship.isSunk())) {
        running = false;
        UI.showAfterGame(players[attacker].getName());
        return;
      }

    players[attacker].switchTurn();
    players[1 - attacker].switchTurn();

    // let computer attack
    UI.updateBattleLog(game.players[1 - attacker].getName(), 'turn');
    if (attacker === 1) return;
    setTimeout(() => {
      let index = generateRandomAttack(gameboards[0].getCells());
      let cellElement = document
        .querySelector('#player-gameboard')
        .querySelector(`[data-index="${index}"]`);
      playRound(1, cellElement);
    }, 1000);
  };

  const restart = () => {
    gameboards[0] = gameboardFactory();
    gameboards[1] = gameboardFactory();
    UI.resetElements();
    setup();
    UI.showShipyard();
    DOMEvents.addCellEvent();
  };

  const setup = () => {
    UI.renderGameboard(gameboards[0].getCells(), players[0].getName());
    UI.renderGameboard(gameboards[1].getCells(), players[1].getName());
    UI.updateBattleLog(players[0].getName(), 'turn');
  };

  setup();

  return {
    players,
    getGameboard,
    startGame,
    restart,
    playRound,
  };
})();

export default game;
