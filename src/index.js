import './style/index.scss';

import playerFactory from './factories/player';
import gameboardFactory from './factories/gameboard';

import UI from './UI';

const game = (() => {
  let players = [playerFactory('Player'), playerFactory('Computer')];
  let playerGameboard = gameboardFactory(),
    computerGameboard = gameboardFactory();

  UI.renderGameboard(playerGameboard.getCells(), players[0].name);
  UI.renderGameboard(computerGameboard.getCells(), players[1].name);
})();
