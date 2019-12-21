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

predefinedBoards['4 Gliders (Conway)'] = {"0":{"0":0},"3":{"3":1,"5":1,"-3":1},"4":{"4":1,"5":1,"-4":1,"-5":1},"5":{"4":1,"-4":1,"-3":1},"-2":{"3":0},"-3":{"3":1,"-3":1,"-5":1},"-4":{"4":1,"5":1,"-4":1,"-5":1},"-5":{"3":1,"4":1,"-4":1}};