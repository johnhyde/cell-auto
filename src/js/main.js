var canvas;
var ctx;
var boardSelect;
var ruleSetSelect;
var currentRuleSet;

var mouseState = {
  mouseDown: false,
  mouseDownPosition: [0, 0],
  delta: [0, 0],
  minDeltaLength: 4,
  isDrag: false,
};

var s = { // scope (for ui)
  showControls: true,
  showMore: true,
  showHelp: false,
  fillAreaDim: 50,
  fillAreaDensity: 50,
};

s.player = {
  playing: false,
  timeoutId: 0,
  baseIntervalMs: 2000,
  index: 10,
  minIndex: 0,
  maxIndex: 22,
  get intervalMs() {
    return Math.max(1000/60 + 5, this.baseIntervalMs * Math.pow(speedScalingFactor, this.index));
  }
}
var speedScalingFactor = .8;
var boardHistoryLimit = 80;

s.currentCamera = {
  scale: 15,
  focus: {
    x: 0,
    y: 0,
  },
  showGrid: true,
  hexGrid: true,
};
var scaleScalingFactor = 1.2;

var currentBoard = {};
var boardHistory = [];

var colorMappings = {
  // '-3': [0,0,0,255],
  // '-2': [31,31,31,255],
  // '-1': [63,63,63,255],
  // '0': [0,0,0,0],
  // '1': [191,191,191,255],
  // '2': [223,223,223,255],
  // '3': [255,255,255,255],
  '-3': [0,0,255,1],
  '-2': [0,127,255,1],
  '-1': [0,255,255,1],
  '0': [0,0,0,0],
  '1': [255,255,0,1],
  '2': [255,127,0,1],
  '3': [255,0,0,1],
  '4': [200,0,100,1],
  '5': [127,0,127,1],
  'background': [127,127,127,1],
  'line': [150,150,150,1],
  '???': [0,255,0,1],
};

function getColorMappingStyle(key) {
  let color = colorMappings[key] || [0,255,0,255];
  return `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
}

var styleMappings = {};
for (let key in colorMappings) {
  styleMappings[key] = getColorMappingStyle(key);
}

var logging = {
  events: false,
};

window.onload = () => {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d', { alpha: false });

  canvas.addEventListener('mousedown', mouseDownListener);
  canvas.addEventListener('touchstart', mouseDownListener);
  canvas.addEventListener('mousemove', mouseMoveListener);
  canvas.addEventListener('touchmove  ', mouseMoveListener);
  canvas.addEventListener('mouseup', mouseUpListener);
  canvas.addEventListener('touchend', mouseUpListener);
  canvas.addEventListener('mouseout', mouseOutListener);
  canvas.addEventListener('touchcancel', mouseOutListener);
  canvas.addEventListener('click', clickListener);
  canvas.addEventListener('wheel', wheelListener);

  window.addEventListener('keyup', keyUpListener);
  window.addEventListener('resize', refresh);

  rivets.bind(document.body, s);

  s.ruleSets = ruleSets;
  ruleSetSelect = document.getElementById('rule-set-select');
  for (let ruleSetName in ruleSets) {
    let option = document.createElement("option");
    option.text = ruleSetName;
    ruleSetSelect.add(option);
  }
  loadSelectedRuleSet();

  boardSelect = document.getElementById('board-select');
  for (let boardName in predefinedBoards) {
    let option = document.createElement("option");
    option.text = boardName;
    boardSelect.add(option);
  }

  // fakeSetup();
  refresh();
};

function refresh() {
  refreshContext(ctx, currentBoard, s.currentCamera);
}

function mouseDownListener(e) {
  if (logging.events) console.log('mousedown');
  mouseState.mouseDown = true;
  mouseState.isDrag = false;
  mouseState.mouseDownPosition = [e.clientX, e.clientY];
}

function mouseMoveListener(e) {
  if (logging.events) console.log('mousemove');
  if (mouseState.mouseDown) {
    mouseState.delta[0] += e.movementX;
    mouseState.delta[1] += e.movementY;
  }
  if (mouseState.isDrag || lengthOfVector(mouseState.delta) >= mouseState.minDeltaLength) {
    mouseState.isDrag = true; // in case it wasn't already
    s.currentCamera.focus.x -= mouseState.delta[0];
    s.currentCamera.focus.y -= mouseState.delta[1];
    mouseState.delta = [0, 0];
    refresh();
  }
}

function mouseUpListener(e) {
  if (logging.events) console.log('mouseup');
  mouseState.mouseDown = false;
}

function mouseOutListener(e) {
  if (logging.events) console.log('mouseout');
  mouseState.mouseDown = false;
  mouseState.isDrag = false;
  mouseState.delta = [0, 0];
}

function clickListener(e) {
  if (logging.events) console.log('click');
  if (!mouseState.isDrag) {
    let minValue = Math.min(currentRuleSet.minValue || 0, 0);
    let maxValue = Math.max(currentRuleSet.maxValue || 0, 0);
    let boardPoint = convertPointFromScreenToBoard(ctx, [e.clientX, e.clientY], s.currentCamera);
    let increment = 1;
    if (e.shiftKey) {
      increment = -1;
    }
    let newValue = incrementBoardValue(currentBoard, boardPoint, increment);
    if (newValue < minValue || newValue > maxValue) {
      setBoardValue(currentBoard, boardPoint, 0);
    }
    refresh();
  }
  mouseState.isDrag = false;
}

function wheelListener(e) {
  if (logging.events) console.log('wheel');
  s.currentCamera.focus.x += Math.floor(e.deltaX/2);
  s.currentCamera.focus.y += Math.floor(e.deltaY/2);
  refresh();
}

function keyUpListener(e) {
  if (logging.events) console.log(`keyup code: ${e.keyCode} | ${e.key} | ${e.code}`);
  switch (e.key) {
    case ' ':
      if (canvas === document.activeElement) {
        startStopAutoplaying();
      }
      break;
    case 's':
      startStopAutoplaying();
      break;
    case 'ArrowRight':
      step();
      break;
    case 'ArrowLeft':
      stepBackward();
      break;
    case 'ArrowUp':
      speedUp()
      break;
    case 'ArrowDown':
      speedDown();
      break;
    case '+':
      scaleUp();
      break;
    case '-':
      scaleDown();
      break;
    case 'g':
      showHideGrid();
      break;
    case 'x':
      toggleHexGrid();
      break;
    case 'h':
      showHideControls();
      break;
    case 'm':
      showHideMore();
      break;
    case 'f':
      fillAreaRandomFromInput();
      break;
  }
}

function startStopAutoplaying() {
  if (s.player.playing) {
    s.player.playing = false;
    clearTimeout(s.player.timeoutId);
  } else {
    s.player.playing = true;
    step();
  }
}

function step() {
  let startTime = +new Date();
  boardHistory.push(currentBoard);
  if (boardHistory.length > boardHistoryLimit) {
    boardHistory = boardHistory.slice(boardHistory.length - boardHistoryLimit);
  }
  currentBoard = currentRuleSet.step(currentBoard);
  let timeElapsedMs = +new Date() - startTime;
  console.log(`generated new board in ${timeElapsedMs}ms`);
  if (s.player.playing) {
    let timeLeftInInterval = Math.max(0, s.player.intervalMs - timeElapsedMs);;
    console.log(`doing next step in ${timeLeftInInterval}ms`);
    s.player.timeoutId = setTimeout(step, timeLeftInInterval);
  }
  refresh();
}

function stepBackward() {
  if (boardHistory.length > 0) {
    currentBoard = boardHistory.pop();
    refresh();
  }
}

function speedUp() {
  s.player.index++;
  s.player.index = Math.min(s.player.index, s.player.maxIndex);
}

function speedDown() {
  s.player.index--;
  s.player.index = Math.max(s.player.index, s.player.minIndex);
}

function scaleUp() {
  let tempFocusX = s.currentCamera.focus.x / s.currentCamera.scale;
  let tempFocusY = s.currentCamera.focus.y / s.currentCamera.scale;
  s.currentCamera.scale = Math.ceil(s.currentCamera.scale * scaleScalingFactor);
  s.currentCamera.focus.x = Math.round(tempFocusX * s.currentCamera.scale);
  s.currentCamera.focus.y = Math.round(tempFocusY * s.currentCamera.scale);
  refresh();
}

function scaleDown() {
  let tempFocusX = s.currentCamera.focus.x / s.currentCamera.scale;
  let tempFocusY = s.currentCamera.focus.y / s.currentCamera.scale;
  s.currentCamera.scale = Math.max(1, Math.floor(s.currentCamera.scale / scaleScalingFactor));
  s.currentCamera.focus.x = Math.round(tempFocusX * s.currentCamera.scale);
  s.currentCamera.focus.y = Math.round(tempFocusY * s.currentCamera.scale);
  refresh();
}

function showHideControls() {
  s.showControls = !s.showControls;
}

function showHideMore() {
  s.showMore = !s.showMore;
}

function fillAreaRandomFromInput() {
  let density = s.fillAreaDensity/100;
  let { minValue, maxValue } = currentRuleSet;
  fillAreaRandom(currentBoard, s.fillAreaDim, density, minValue, maxValue);
  refresh();
}

function showHideGrid() {
  s.currentCamera.showGrid = !s.currentCamera.showGrid;
  refresh();
}

function toggleHexGrid() {
  s.currentCamera.hexGrid = !s.currentCamera.hexGrid;
  refresh();
}

function loadSelectedRuleSet() {
  currentRuleSet = ruleSets[ruleSetSelect.value];
}

function loadSelectedBoard() {
  let selectedBoardName = boardSelect.value;
  console.log(`user tried to load this board: ${selectedBoardName}`);
  let selectedBoard = predefinedBoards[selectedBoardName];
  if (selectedBoard) {
    currentBoard = JSON.parse(JSON.stringify(selectedBoard));
    refresh();
  }
}