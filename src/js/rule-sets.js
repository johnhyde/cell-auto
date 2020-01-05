let hexTribesTribeCount = 5;

var ruleSets = {
  'Hex Tribes V2': {
    minValue: 0,
    maxValue: hexTribesTribeCount,
    step: hexTribesV2Step,
  },
  'Hex Tribes': {
    minValue: 0,
    maxValue: hexTribesTribeCount,
    step: hexTribesStep,
  },
  'unnamed1': {
    minValue: -3,
    maxValue: 3,
    step: unnamed1Step,
  },
  'Conway\'s Game of Life': {
    minValue: 0,
    maxValue: 1,
    step: conwayStep,
  },
  'Hex Game of Life': {
    minValue: 0,
    maxValue: 1,
    step: hexConwayStep,
  },
  'Hex Game of Life V2': {
    minValue: 0,
    maxValue: 1,
    step: hexConwayV2Step,
  },
  'Hex Game of Life V3': {
    minValue: 0,
    maxValue: 1,
    step: hexConwayV3Step,
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
      let neighborValue = neighborCountBoard[x][y];
      if (neighborValue < 3.5 && neighborValue > 2 ||  (neighborValue === 2 && getBoardValue(board, [x, y]) === 1)) {
        setBoardValue(newBoard, [x, y], 1);
      }
    }
  }
  return newBoard;
}

function hexConwayV2Step(board) {
  let neighborCountBoard = {};
  let newBoard = {};
  for (let x in board) {
    x = Number(x);
    for (let y in board[x]) {
      y = Number(y);
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
      let neighborValue = neighborCountBoard[x][y];
      if (neighborValue < 3 && neighborValue > 2 ||  ((neighborValue === 2 || neighborValue === 3 || neighborValue === 3.5) && getBoardValue(board, [x, y]) === 1)) {
        setBoardValue(newBoard, [x, y], 1);
      }
    }
  }
  return newBoard;
}

function hexConwayV3Step(board) {
  let neighborCountBoard = {};
  let newBoard = {};
  for (let x in board) {
    x = Number(x);
    for (let y in board[x]) {
      y = Number(y);
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
      let neighborValue = neighborCountBoard[x][y];
      if (neighborValue < 3 && neighborValue > 2 ||  ((neighborValue === 2 || neighborValue === 3.5) && getBoardValue(board, [x, y]) === 1)) {
        setBoardValue(newBoard, [x, y], 1);
      }
    }
  }
  return newBoard;
}

function hexTribesStep(board) {
  let neighborCountBoard = {};
  let newBoard = {};
  for (let x in board) {
    x = Number(x);
    for (let y in board[x]) {
      y = Number(y);
      let tribe = board[x][y];
      if (tribe > 0 && tribe <= hexTribesTribeCount) {
        let neighbors = [
          [x - 1, y    ],
          [x - 1, y + 1],
          [x    , y + 1],
          [x + 1, y    ],
          [x + 1, y - 1],
          [x    , y - 1],
        ];
        let oppositeNeighbors = [
          [x + 1, y    ],
          [x + 1, y - 1],
          [x    , y - 1],
          [x - 1, y    ],
          [x - 1, y + 1],
          [x    , y + 1],
        ];
        let farOppositeNeighbors = [
          [x + 2, y    ],
          [x + 2, y - 2],
          [x    , y - 2],
          [x - 2, y    ],
          [x - 2, y + 2],
          [x    , y + 2],
        ];
        for (let i = 0; i < 6; i++) {
          let [neighborX, neighborY] = neighbors[i];
          if (getBoardValue(neighborCountBoard, [neighborX, neighborY]) === 0) {
            setBoardValue(neighborCountBoard, [neighborX, neighborY], new Array(hexTribesTribeCount).fill(0));
          }
          let neighborTribe = getBoardValue(board, oppositeNeighbors[i]);
          if (neighborTribe !== 0) {
            neighborCountBoard[neighborX][neighborY][neighborTribe - 1] += 1; //making tribe zero-indexed
          }
          let farNeighborTribe = getBoardValue(board, farOppositeNeighbors[i]);
          if (farNeighborTribe !== 0) {
            neighborCountBoard[neighborX][neighborY][farNeighborTribe - 1] += .5; //making tribe zero-indexed
          }
          neighborCountBoard[neighborX][neighborY][tribe - 1] += 1; //making tribe zero-indexed
        }
      }
    }
  }
  for (let x in neighborCountBoard) {
    for (let y in neighborCountBoard[x]) {
      let neighborValues = neighborCountBoard[x][y];
      let biggestNeighborCount = neighborValues.slice(0).sort().reverse()[0];
      let winningTribe = neighborValues.indexOf(biggestNeighborCount) + 1; //make tribe one-indexed again
      let currentTribe = getBoardValue(board, [x, y]);
      let tied = neighborValues.indexOf(biggestNeighborCount, winningTribe) !== -1; // someone else got the same count
      if (tied) {
        if (neighborValues[currentTribe - 1] === biggestNeighborCount) { // don't forget that neighborValues is zero-indexed
          // The current tribe wins the tie
          winningTribe = currentTribe;
        } else {
          // The current tribe is destroyed by stronger warring tribes
          continue;
        }
      }
      if (
        biggestNeighborCount <= 4.5 && biggestNeighborCount >= 3
        || (biggestNeighborCount <= 3 && biggestNeighborCount >= 2.5 && currentTribe === winningTribe)
        || (currentTribe !== 0 && currentTribe !== winningTribe)
        ) {
        setBoardValue(newBoard, [x, y], winningTribe);
      }
    }
  }
  return newBoard;
}

function hexTribesV2Step(board) {
  let neighborCountBoard = {};
  let newBoard = {};
  for (let x in board) {
    x = Number(x);
    for (let y in board[x]) {
      y = Number(y);
      let tribe = board[x][y];
      if (tribe > 0 && tribe <= hexTribesTribeCount) {
        let neighbors = [
          [x - 1, y    ],
          [x - 1, y + 1],
          [x    , y + 1],
          [x + 1, y    ],
          [x + 1, y - 1],
          [x    , y - 1],
        ];
        let oppositeNeighbors = [
          [x + 1, y - 1],
          [x    , y - 1],
          [x - 1, y    ],
          [x - 1, y + 1],
          [x    , y + 1],
          [x + 1, y    ],
        ];
        let farOppositeNeighbors = [
          [x + 1, y - 2],
          [x - 1, y - 1],
          [x - 2, y + 1],
          [x - 1, y + 2],
          [x + 1, y + 1],
          [x + 2, y - 1],
        ];
        for (let i = 0; i < 6; i++) {
          let [neighborX, neighborY] = neighbors[i];
          if (getBoardValue(neighborCountBoard, [neighborX, neighborY]) === 0) {
            setBoardValue(neighborCountBoard, [neighborX, neighborY], new Array(hexTribesTribeCount).fill(0));
          }
          let neighborTribe = getBoardValue(board, oppositeNeighbors[i]);
          if (neighborTribe !== 0) {
            neighborCountBoard[neighborX][neighborY][neighborTribe - 1] += .5; //making tribe zero-indexed
            let farNeighborTribe = getBoardValue(board, farOppositeNeighbors[i]);
            if (farNeighborTribe !== 0) {
              neighborCountBoard[neighborX][neighborY][farNeighborTribe - 1] += .25; //making tribe zero-indexed
            }
          }
          neighborCountBoard[neighborX][neighborY][tribe - 1] += 1; //making tribe zero-indexed
        }
      }
    }
  }
  let countStats = {};
  for (let x in neighborCountBoard) {
    for (let y in neighborCountBoard[x]) {
      let neighborValues = neighborCountBoard[x][y];
      let biggestNeighborCount = neighborValues.slice(0).sort().reverse()[0];
      if (!countStats[biggestNeighborCount *4]) {
        countStats[biggestNeighborCount *4] = 0;
      }
      countStats[biggestNeighborCount *4]++;
      let winningTribe = neighborValues.indexOf(biggestNeighborCount) + 1; //make tribe one-indexed again
      let currentTribe = getBoardValue(board, [x, y]);
      let tied = neighborValues.indexOf(biggestNeighborCount, winningTribe) !== -1; // someone else got the same count
      if (tied) {
        if (neighborValues[currentTribe - 1] === biggestNeighborCount) { // don't forget that neighborValues is zero-indexed
          // The current tribe wins the tie
          winningTribe = currentTribe;
        } else {
          // The current tribe is destroyed by stronger warring tribes
          continue;
        }
      }
      let maxLive = 4.5;
      let minBorn = 3;
      let minSurvive = 2.5;
      if (
        biggestNeighborCount <= maxLive && biggestNeighborCount >= minBorn
        // || biggestNeighborCount === 6
        || (biggestNeighborCount <= maxLive && biggestNeighborCount >= minSurvive && currentTribe === winningTribe)
        || (currentTribe !== 0 && currentTribe !== winningTribe)
        ) {
        setBoardValue(newBoard, [x, y], winningTribe);
      }
    }
  }
  console.log(JSON.stringify(countStats, null, 2));
  return newBoard;
}
