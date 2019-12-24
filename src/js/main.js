var canvas;
var ctx;
var boardSelect;
var ruleSetSelect;
var showGridCheckbox;
var hexGridCheckbox;

var mouseState = {
  mouseDown: false,
  mouseDownPosition: [0, 0],
  delta: [0, 0],
  minDeltaLength: 4,
  isDrag: false,
};

var player = {
  playing: false,
  timeoutId: 0,
  intervalMs: 100,
}
var speedScalingFactor = .8;

var camera1 = {
  scale: 15,
  focus: {
    x: 0,
    y: 0,
  },
  showGrid: true,
  hexGrid: false,
};
var scaleScalingFactor = 1.2;

var board1 = {};

var colorMappings = {
  // '-3': [0,0,0,255],
  // '-2': [31,31,31,255],
  // '-1': [63,63,63,255],
  // '0': [0,0,0,0],
  // '1': [191,191,191,255],
  // '2': [223,223,223,255],
  // '3': [255,255,255,255],
  '-3': [0,0,255,255],
  '-2': [0,127,255,255],
  '-1': [0,255,255,255],
  '0': [0,0,0,0],
  '1': [255,255,0,255],
  '2': [255,127,0,255],
  '3': [255,0,0,255],
  'background': [127,127,127,255],
  'line': [150,150,150,255],
  '???': [0,255,0,255],
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


  showGridCheckbox = document.getElementById('show-grid');
  showGridCheckbox.checked = camera1.showGrid;

  hexGridCheckbox = document.getElementById('hex-grid');
  hexGridCheckbox.checked = camera1.hexGrid;

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
  refreshContext(ctx, board1, camera1);
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
    camera1.focus.x -= mouseState.delta[0];
    camera1.focus.y -= mouseState.delta[1];
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
    let currentRuleSet = ruleSets[ruleSetSelect.value];
    let minValue = Math.min(currentRuleSet.minValue || -Infinity, 0);
    let maxValue = Math.max(currentRuleSet.maxValue || Infinity, 0);
    let boardPoint = convertPointFromScreenToBoard(ctx, [e.clientX, e.clientY], camera1);
    let increment = 1;
    if (e.shiftKey) {
      increment = -1;
    }
    let newValue = incrementBoardValue(board1, boardPoint, increment);
    if (newValue < minValue || newValue > maxValue) {
      setBoardValue(board1, boardPoint, 0);
    }
    refresh();
  }
  mouseState.isDrag = false;
}

function wheelListener(e) {
  if (logging.events) console.log('wheel');
  camera1.focus.x -= Math.floor(e.deltaX/2);
  camera1.focus.y += Math.floor(e.deltaY/2);
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
  if (player.playing) {
    player.playing = false;
    clearTimeout(player.timeoutId);
  } else {
    player.playing = true;
    step();
  }
}

function step() {
  let startTime = +new Date();
  // board1 = getNextBoard(board1);
  let currentRuleSet = ruleSets[ruleSetSelect.value];
  board1 = currentRuleSet.step(board1);
  let timeElapsedMs = +new Date() - startTime;
  console.log(`generated new board in ${timeElapsedMs}ms`);
  if (player.playing) {
    let timeLeftInInterval = Math.max(5, player.intervalMs - timeElapsedMs);;
    console.log(`doing next step in ${timeLeftInInterval}ms`);
    if (timeLeftInInterval > 0) {
      player.timeoutId = setTimeout(step, timeLeftInInterval);
    } else {
      window.requestAnimationFrame(step);
    }
  }
  refresh();
}

function speedUp() {
  player.intervalMs *= speedScalingFactor;
}

function speedDown() {
  player.intervalMs /= speedScalingFactor;
}

function scaleUp() {
  let tempFocusX = camera1.focus.x / camera1.scale;
  let tempFocusY = camera1.focus.y / camera1.scale;
  camera1.scale = Math.ceil(camera1.scale * scaleScalingFactor);
  camera1.focus.x = Math.round(tempFocusX * camera1.scale);
  camera1.focus.y = Math.round(tempFocusY * camera1.scale);
  refresh();
}

function scaleDown() {
  let tempFocusX = camera1.focus.x / camera1.scale;
  let tempFocusY = camera1.focus.y / camera1.scale;
  camera1.scale = Math.max(1, Math.floor(camera1.scale / scaleScalingFactor));
  camera1.focus.x = Math.round(tempFocusX * camera1.scale);
  camera1.focus.y = Math.round(tempFocusY * camera1.scale);
  refresh();
}

function showHideControls() {
  let buttonsDiv = document.getElementById('buttons-div');
  let showHideControlsButton = document.getElementById('show-hide-controls-button');
  buttonsDiv.hidden = !buttonsDiv.hidden;
  showHideControlsButton.innerHTML = buttonsDiv.hidden ? '►' : '◄';

}

function showHideMore() {
  let moreControlsDiv = document.getElementById('more-controls-div');
  let showHideControlsButton = document.getElementById('show-hide-more-button');
  moreControlsDiv.hidden = !moreControlsDiv.hidden;
  showHideControlsButton.innerHTML = moreControlsDiv.hidden ? '▼' : '▲';
}

function fillAreaRandomFromInput() {
  let dimensionInput = document.getElementById('fill-area-dim');
  let densityInput = document.getElementById('fill-area-density');
  let dim = dimensionInput.value;
  let density = densityInput.value/100;
  let { minValue, maxValue } = ruleSets[ruleSetSelect.value];
  fillAreaRandom(board1, dim, density, minValue, maxValue);
  refresh();
}

function showHideGrid() {
  camera1.showGrid = !camera1.showGrid;
  showGridCheckbox.checked = camera1.showGrid;
  refresh();
}

function toggleHexGrid() {
  camera1.hexGrid = !camera1.hexGrid;
  hexGridCheckbox.checked = camera1.hexGrid;
  refresh();
}

function loadSelectedRuleSet() {
  //
}

function loadSelectedBoard() {
  let selectedBoardName = boardSelect.value;
  console.log(`user tried to load this board: ${selectedBoardName}`);
  let selectedBoard = predefinedBoards[selectedBoardName];
  if (selectedBoard) {
    board1 = JSON.parse(JSON.stringify(selectedBoard));
    refresh();
  }
}