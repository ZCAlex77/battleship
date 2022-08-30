const playerFactory = (name) => {
  let turn = name === 'Computer' ? false : true;

  const switchTurn = () => {
    turn = !turn;
    return turn;
  };

  const setName = (newName) => (name = newName);

  const getName = () => name;
  const getTurn = () => turn;

  return { getName, setName, switchTurn, getTurn };
};

export default playerFactory;
