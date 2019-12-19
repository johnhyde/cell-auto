var predefinedBoards = {
  "(clear)": [],
};

function addLotsOfStars(name) {
  let board = [];
  setBoardValue(board, [0, 0], 2);
  setBoardValue(board, [-1, 0], 2);
  setBoardValue(board, [1, 0], 2);
  setBoardValue(board, [0, -1], 2);
  setBoardValue(board, [0, 1], 2);
  predefinedBoards[name] = board;
}

addLotsOfStars('Lots of Stars');