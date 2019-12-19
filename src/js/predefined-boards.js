var predefinedBoards = {
  "(clear)": {},
};

function addLotsOfStars(name) {
  let stars = [{}];
  setBoardValue(stars[0], [0, 0], 2);
  setBoardValue(stars[0], [-1, 0], 2);
  setBoardValue(stars[0], [1, 0], 2);
  setBoardValue(stars[0], [0, -1], 2);
  setBoardValue(stars[0], [0, 1], 2);
  let blueStar = flipBoardSigns(stars[0]);
  stars.push(translateBoard(blueStar, [30, 0]));
  stars.push(translateBoard(blueStar, [-30, 0]));
  stars.push(translateBoard(blueStar, [0, 30]));
  stars.push(translateBoard(blueStar, [0, -30]));
  let board = combineBoards(stars);
  predefinedBoards[name] = board;
}

addLotsOfStars('Lots of Stars');