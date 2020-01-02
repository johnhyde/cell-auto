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
predefinedBoards['3 Gliders (Hex V2)'] = {"0":{"-2":1,"-4":1},"1":{"-2":1,"-5":1},"2":{"-2":1,"-3":1,"-4":1,"-5":1},"3":{"-2":1},"4":{"-3":1},"7":{"-11":1,"-10":1,"-9":0},"8":{"-11":0,"-12":1},"9":{"-2":1,"-3":1,"-12":1,"-11":0,"-13":1},"10":{"-2":1,"-4":1,"-13":0,"-11":0,"-12":1,"-14":1},"11":{"-2":1,"-5":1,"-7":1,"-14":0,"-11":0,"-12":1,"-15":1},"12":{"-3":1,"-4":1,"-5":1,"-6":1,"-7":1,"-12":0,"-13":1,"-14":1,"-16":0,"-15":1},"-1":{"-2":1,"-3":1}};
