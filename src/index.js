import './style/index.scss';

import playerFactory from './factories/player';
import battleshipFactory from './factories/battleship';
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
      computerGameboard.setOrientation(orientation);

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
        let msg = computerGameboard.addShip(ship);
        if (msg !== 'invalid position') {
          break;
        }
      }
    });
  };

  const playRound = (attacker, attackedCell) => {
    // check if the game is running and if it's this player's turn
    if (!isGameRunning() || !players[attacker].getTurn()) return;

    let attackedGameboard =
      attacker === 0 ? computerGameboard : playerGameboard;
    let cellIndex = Number(attackedCell.getAttribute('data-index'));
    let shipIndex = attackedGameboard.getCells()[cellIndex];
    // attempt attack
    let msg = attackedGameboard.receiveAttack(cellIndex);

    // check if the position was already hit
    if (msg === 'already hit') return;

    UI.updateCellAfterAttack(attackedCell, msg);
    UI.updateBattleLog(game.players[attacker].name, 'hit', msg);

    // check for sunk ships
    if (
      msg === 'hits a ship' &&
      attackedGameboard.getShips()[shipIndex].isSunk()
    )
      UI.updateBattleLog(game.players[attacker].name, 'sunk');

    players[attacker].switchTurn();
    players[1 - attacker].switchTurn();

    // let computer attack
    UI.updateBattleLog(game.players[1 - attacker].name, 'turn');
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
    UI.updateBattleLog(players[0].name, 'turn');
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
