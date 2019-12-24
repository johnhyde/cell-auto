var ruleSets = {
  'unnamed1': {
    minValue: -3,
    maxValue: 3,
    hex: false,
    step: unnamed1Step,
  },
  'Conway\'s Game of Life': {
    minValue: 0,
    maxValue: 1,
    hex: false,
    step: conwayStep,
  },
  'Hex Game of Life': {
    minValue: 0,
    maxValue: 1,
    hex: false,
    step: hexConwayStep,
  },
};

function unnamed1Step(board) {
  let tempBoard = {};
  for (let x in board) {
    tempBoard[x] = {};
    for (let y in board[x]) {
      // if (board[x][y]) tempBoard[x][y] = board[x][y] - board[x][y]/Math.abs(board[x][y]);
      if (board[x][y]) tempBoard[x][y] = board[x][y];
    }
  }
  for (let x in board) {
    x = Number(x);
    for (let y in board[x]) {
      y = Number(y);
      // console.log(board[x][y]);
      if (board[x][y]) {
        let unit = tempBoard[x][y] > 0 ? 1 : -1;
        // incrementBoardValue(tempBoard, [x, y], board[x][y]);

        // tempBoard[x + 1][y    ] += board[x][y]/*/Math.abs(board[x][y])*/;
        // tempBoard[x - 1][y    ] += board[x][y]/*/Math.abs(board[x][y])*/;
        // tempBoard[x    ][y + 1] += board[x][y]/*/Math.abs(board[x][y])*/;
        // tempBoard[x    ][y - 1] += board[x][y]/*/Math.abs(board[x][y])*/;
        if (unit < 0 || Math.abs(board[x][y]) < 3) {
          incrementBoardValue(tempBoard, [x + 1, y    ], board[x][y] /*- board[x][y]/Math.abs(board[x][y])*/);
          incrementBoardValue(tempBoard, [x - 1, y    ], board[x][y] /*- board[x][y]/Math.abs(board[x][y])*/);
        }
        if (unit > 0 || Math.abs(board[x][y]) < 3) {
          incrementBoardValue(tempBoard, [x    , y + 1], board[x][y] /*- board[x][y]/Math.abs(board[x][y])*/);
          incrementBoardValue(tempBoard, [x    , y - 1], board[x][y] /*- board[x][y]/Math.abs(board[x][y])*/);
        }
        // incrementBoardValue(tempBoard, [x + 1, y    ], board[x][y]/*/Math.abs(board[x][y])*/);
        // incrementBoardValue(tempBoard, [x - 1, y    ], board[x][y]/*/Math.abs(board[x][y])*/);
        // incrementBoardValue(tempBoard, [x    , y + 1], board[x][y]/*/Math.abs(board[x][y])*/);
        // incrementBoardValue(tempBoard, [x    , y - 1], board[x][y]/*/Math.abs(board[x][y])*/);
      }
    }
  }

  let nextBoard = {};
  let tempBoard2 = {}; 
  for (let x in tempBoard) {
    x = Number(x);
    for (let y in tempBoard[x]) {
      y = Number(y);
      if (tempBoard[x][y]) {
        // console.log(tempBoard[x][y]);
        let unit = tempBoard[x][y] > 0 ? 1 : -1;
        if (Math.abs(tempBoard[x][y]) <=4) {
          incrementBoardValue(nextBoard, [x, y], tempBoard[x][y])
          decreaseAbsoluteBoardValue(nextBoard, [x, y], 1);
        } else {
          // //explosion!
          // if (unit < 0) {
            incrementBoardValue(tempBoard2, [x + 1, y    ], unit);
            incrementBoardValue(tempBoard2, [x - 1, y    ], unit);
          // } else {
            incrementBoardValue(tempBoard2, [x    , y + 1], unit);
            incrementBoardValue(tempBoard2, [x    , y - 1], unit);
          // }
          
          // if (unit < 0) {
          // decreaseAbsoluteBoardValue(nextBoard, [x + 1, y    ], 1);
          // decreaseAbsoluteBoardValue(nextBoard, [x - 1, y    ], 1);
          // decreaseAbsoluteBoardValue(nextBoard, [x    , y + 1], 1);
          // decreaseAbsoluteBoardValue(nextBoard, [x    , y - 1], 1);
          // } else {
          // decreaseAbsoluteBoardValue(nextBoard, [x + 1, y + 1], 1);
          // decreaseAbsoluteBoardValue(nextBoard, [x + 1, y - 1], 1);
          // decreaseAbsoluteBoardValue(nextBoard, [x - 1, y + 1], 1);
          // decreaseAbsoluteBoardValue(nextBoard, [x - 1, y - 1], 1);
          // }
        }
      }
    }
  }
  
  for (let x in tempBoard2) {
    x = Number(x);
    for (let y in tempBoard2[x]) {
      y = Number(y);
      if (tempBoard2[x][y]) {
        let unit = tempBoard2[x][y]/Math.abs(tempBoard2[x][y]);
        setBoardValue(nextBoard, [x, y], unit*(Math.max(0, Math.abs(getBoardValue(nextBoard, [x, y])) - 1)));
        //explosion!
        // if (unit < 0) {
          // multiplyBoardValue(nextBoard, [x + 1, y    ], -1);
          // multiplyBoardValue(nextBoard, [x - 1, y    ], -1);
          // multiplyBoardValue(nextBoard, [x    , y + 1], -1);
          // multiplyBoardValue(nextBoard, [x    , y - 1], -1);
        // // } else {
          // multiplyBoardValue(nextBoard, [x + 1, y + 1], -1);
          // multiplyBoardValue(nextBoard, [x + 1, y - 1], -1);
          // multiplyBoardValue(nextBoard, [x - 1, y + 1], -1);
          // multiplyBoardValue(nextBoard, [x - 1, y - 1], -1);
        // }
        // // if (unit < 0) {
        //   decreaseAbsoluteBoardValue(nextBoard, [x + 1, y    ], 1);
          // decreaseAbsoluteBoardValue(nextBoard, [x - 1, y    ], 1);
        //   decreaseAbsoluteBoardValue(nextBoard, [x    , y + 1], 1);
        //   decreaseAbsoluteBoardValue(nextBoard, [x    , y - 1], 1);
        // // } else {
        //   decreaseAbsoluteBoardValue(nextBoard, [x + 1, y + 1], 1);
        //   decreaseAbsoluteBoardValue(nextBoard, [x + 1, y - 1], 1);
        //   decreaseAbsoluteBoardValue(nextBoard, [x - 1, y + 1], 1);
        //   decreaseAbsoluteBoardValue(nextBoard, [x - 1, y - 1], 1);
        // // }
      }
    }
  }
  return nextBoard;
}

function conwayStep(board) {
  let neighborCountBoard = {};
  let newBoard = {};
  for (let x in board) {
    x = Number(x);
    for (let y in board[x]) {
      y = Number(y);
      // console.log(board[x][y]);
      if (board[x][y] === 1) {
        incrementBoardValue(neighborCountBoard, [x + 1, y    ], 1);
        incrementBoardValue(neighborCountBoard, [x + 1, y - 1], 1);
        incrementBoardValue(neighborCountBoard, [x    , y - 1], 1);
        incrementBoardValue(neighborCountBoard, [x - 1, y - 1], 1);
        incrementBoardValue(neighborCountBoard, [x - 1, y    ], 1);
        incrementBoardValue(neighborCountBoard, [x - 1, y + 1], 1);
        incrementBoardValue(neighborCountBoard, [x    , y + 1], 1);
        incrementBoardValue(neighborCountBoard, [x + 1, y + 1], 1);
      }
    }
  }
  for (let x in neighborCountBoard) {
    for (let y in neighborCountBoard[x]) {
      if (neighborCountBoard[x][y] === 3 || (neighborCountBoard[x][y] === 2 && getBoardValue(board, [x, y]) === 1)) {
        setBoardValue(newBoard, [x, y], 1);
      }
    }
  }
  return newBoard;
}

function hexConwayStep(board) {
  let neighborCountBoard = {};
  let newBoard = {};
  for (let x in board) {
    x = Number(x);
    for (let y in board[x]) {
      y = Number(y);
      // console.log(board[x][y]);
      if (board[x][y] === 1) {
        incrementBoardValue(neighborCountBoard, [x + 1, y    ], 1.5);
        incrementBoardValue(neighborCountBoard, [x + 1, y - 1], 1);
        incrementBoardValue(neighborCountBoard, [x    , y - 1], 1.5);
        incrementBoardValue(neighborCountBoard, [x - 1, y    ], 1);
        incrementBoardValue(neighborCountBoard, [x - 1, y + 1], 1.5);
        incrementBoardValue(neighborCountBoard, [x    , y + 1], 1);
      }
    }
  }
  for (let x in neighborCountBoard) {
    for (let y in neighborCountBoard[x]) {
      // let neighborValue = Math.ceil(neighborCountBoard[x][y]);
      let neighborValue = neighborCountBoard[x][y];
      // if (neighborValue === 3 || (neighborValue === 2 && getBoardValue(board, [x, y]) === 1)) {
      // if (neighborValue === 3 || (neighborValue === 2.5 && getBoardValue(board, [x, y]) === 1)) {
      if (neighborValue < 3.5 && neighborValue > 2 ||  (neighborValue === 2 && getBoardValue(board, [x, y]) === 1)) {
        setBoardValue(newBoard, [x, y], 1);
      }
    }
  }
  return newBoard;
}