function getBoardValue(board, [x, y]) {
  if (!board[x] || !board[x][y]) {
    return 0;
  } else {
    return board[x][y];
  }
}

function setBoardValue(board, [x, y], value) {
  if (!board[x]) {
    board[x] = {};
  }
  board[x][y] = value;
}

function incrementBoardValue(board, [x, y], value) {
  if (!board[x]) {
    board[x] = {};
    board[x][y] = value;
  } else if (!board[x][y]) {
    board[x][y] = value;
  } else {
    board[x][y] += value;
  }
  return board[x][y];
}

function decreaseAbsoluteBoardValue(board, [x, y], value) {
  if (board[x] && board[x][y]) {
    // console.log(board[x][y]);
    board[x][y] -= value*(board[x][y])/Math.abs(board[x][y]);
    // console.log(board[x][y]);

  }
  return board[x][y];
}

function multiplyBoardValue(board, [x, y], value) {
  if (board[x] && board[x][y]) {
    board[x][y] *= value;
  }
  return board[x][y];
}

function translateBoard(board, [xOffset, yOffset]) {
  let newBoard = {};
  for (let x in board) {
    x = Number(x);
    for (let y in board[x]) {
      y = Number(y);
      setBoardValue(newBoard, [x + xOffset, y + yOffset], board[x][y]);
    }
  }
  return newBoard;
}

function scaleBoard(board, [xScale, yScale]) {
  let newBoard = {};
  for (let x in board) {
    x = Number(x);
    for (let y in board[x]) {
      y = Number(y);
      setBoardValue(newBoard, [x * xOffset, y * yOffset], board[x][y]);
    }
  }
  return newBoard;
}

function flipBoardSigns(board) {
  let newBoard = {};
  for (let x in board) {
    x = Number(x);
    for (let y in board[x]) {
      y = Number(y);
      setBoardValue(newBoard, [x, y], -board[x][y]);
    }
  }
  return newBoard;
}

function combineBoards(boards) {
  if (!Array.isArray(boards)) {
    throw Error('boards must be an array of boards');
  }
  let newBoard = {};
  for (let board of boards) {
    for (let x in board) {
      x = Number(x);
      for (let y in board[x]) {
        y = Number(y);
        setBoardValue(newBoard, [x, y], board[x][y]);
      }
    }
  }
  return newBoard;
}

function fillAreaRandom(board, dim, density, minValue, maxValue) {
  let numberRange = maxValue - minValue + 1;
  for (let i = 0; i < dim*dim*density; i++) {
    let randomX = Math.floor(Math.random()*dim-dim/2);
    let randomY = Math.floor(Math.random()*dim-dim/2);
    let randomValue = Math.floor(Math.random()*numberRange) + minValue;
    setBoardValue(board, [randomX, randomY], randomValue);
  }
}