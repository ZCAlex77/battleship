const playerFactory = (name) => {
  let turn = name === 'Computer' ? false : true;

  const switchTurn = () => {
    turn = !turn;
    return turn;
  };

  const getTurn = () => turn;

  return { name, switchTurn, getTurn };
};

export default playerFactory;
