const playerFactory = (name) => {
  let turn = true;

  const switchTurn = () => {
    turn = !turn;
    return turn;
  };

  return { name, switchTurn };
};

export default playerFactory;
