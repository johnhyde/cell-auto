var canvas;
var ctx;

var mouseState = {
  mouseDown: false,
  mouseDownPosition: [0, 0],
  delta: [0, 0],
  minDeltaLength: 4,
  isDrag: false,
};

var camera1 = {
  scale: 5,
  focus: {
    x: 0,
    y: 0,
  },
  showGrid: false,
};
var board1 = [];

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

var fillStyleMappings = {};
for (let key in colorMappings) {
  fillStyleMappings[key] = getColorMappingStyle(key);
}

var player = {
  playing: false,
  timeoutId: 0,
  intervalMs: 100,
}

var logging = {
  events: false,
};

window.onload = () => {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d', { alpha: false });

  canvas.addEventListener('mousedown', mouseDownListener);
  canvas.addEventListener('mousemove', mouseMoveListener);
  canvas.addEventListener('mouseup', mouseUpListener);
  canvas.addEventListener('mouseout', mouseOutListener);
  canvas.addEventListener('click', clickListener);

  window.addEventListener('keyup', keyUpListener);

  fakeSetup();
  refresh();
};

window.onresize = () => {
  refresh();
};

var drawing = false;
var queueDraw = false;
function refresh() {
  if (drawing) {
    queueDraw = true;
  } else {
    drawing = true;
    setTimeout(draw, 0);
  }
}

function draw() {
  let startTime = +new Date();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // ctx.beginPath();
  // ctx.moveTo(30, 96);
  // ctx.lineTo(70, 66);
  // ctx.lineTo(103, 76);
  // ctx.lineTo(170, 15);
  // ctx.stroke();
  ctx.fillStyle=fillStyleMappings['background'];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  renderBoardWithCamera(ctx, board1, camera1);
  console.log(`draw() ran in ${+new Date() - startTime}ms`);
  if (queueDraw) {
    queueDraw = false;
    setTimeout(draw, 0);
  } else {
    drawing = false;
  }
}

function renderBoardWithCamera(ctx, board, camera) {
  let incorrectSquares = [];
  let squaresToDrawByStyle = {};
  for (let style in fillStyleMappings) {
    squaresToDrawByStyle[fillStyleMappings[style]] = [];
  }
  let [minX, minY] = convertPointFromScreenToBoard([0, 0], camera);
  let [maxX, maxY] = convertPointFromScreenToBoard([canvas.width - 1, canvas.height - 1], camera);
  let cameraOffsetX = Math.floor(canvas.width/2) - camera.focus.x;
  let cameraOffsetY = Math.floor(canvas.height/2) - camera.focus.y;
  for (let x in board) {
    if (x >= minX && x <= maxX) {
      let convertedX = x*camera.scale + cameraOffsetX;
      // let convertedX = x + cameraOffsetX/camera.scale;
      // Some of this column is in view!
      for (let y in board[x]) {
        if (y >= minY && y <= maxY) {
          let convertedY = y*camera.scale + cameraOffsetY;
          // let convertedY = y + cameraOffsetY/camera.scale;
          let style = fillStyleMappings[board[x][y]] || fillStyleMappings['???'];
          // squaresToDrawByStyle[style].push([x, y]);
          squaresToDrawByStyle[style].push([convertedX, convertedY]);
        }
      }
    }
  }
  for (let style in squaresToDrawByStyle) {
    // ctx.scale(camera.scale, camera.scale);
    ctx.fillStyle = style;
    ctx.beginPath();
    for (let pos of squaresToDrawByStyle[style]) {
      ctx.rect(pos[0], pos[1], camera.scale, camera.scale);
      // ctx.rect(pos[0], pos[1], 1, 1);
    }
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  // ctx.setTransform(1, 0, 0, 1, 0, 0);
  // console.log(`Found incorrect squares: ${incorrectSquares.join(', ')}`);
}

function pointFromScreenFallsOnBoardLine([x, y], camera) {
  let remainderX = (x - Math.floor(canvas.width/2) + camera.focus.x)%camera.scale;
  let remainderY = (y - Math.floor(canvas.height/2) + camera.focus.y)%camera.scale;
  return remainderX*remainderY == 0 ; // only one of them needs to be zero
}

function convertPointFromScreenToBoard([x, y], camera) {
  let boardX = Math.floor((x - Math.floor(canvas.width/2) + camera.focus.x)/camera.scale);
  let boardY = Math.floor((y - Math.floor(canvas.height/2) + camera.focus.y)/camera.scale);
  return [boardX, boardY];
}

function lengthOfVector([x, y]) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
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
    let boardPoint = convertPointFromScreenToBoard([e.clientX, e.clientY], camera1);
    let currentValue = getBoardValue(board1, boardPoint);
    let newValue = 1;
    if (e.shiftKey) {
      newValue = -1;
    }
    incrementBoardValue(board1, boardPoint, newValue);
    refresh();
  }
  mouseState.isDrag = false;
}

function keyUpListener(e) {
  if (logging.events) console.log(`keyup code: ${e.keyCode} | ${e.key} | ${e.code}`);
  switch (e.key) {
    case ' ':
      startStopAutoplaying();
      break;
    case 'ArrowRight':
      step();
      break;
    case 'ArrowUp':
      player.intervalMs *= .8;
      break;
    case 'ArrowDown':
      player.intervalMs /= .8;
      break;
    case '+':
      camera1.scale++;
      refresh();
      break;
    case '-':
      camera1.scale = Math.max(1, camera1.scale - 1);
      refresh();
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
  board1 = getNextBoard(board1);
  if (player.playing) {
    player.timeoutId = setTimeout(step, player.intervalMs);
  }
  refresh();
}

function fakeSetup() {
  setBoardValue(board1, [0, 0], -1);
  setBoardValue(board1, [1, 1], 1);
  setBoardValue(board1, [3, -2], 1);
  setBoardValue(board1, [-3, -3], 1);
  setBoardValue(board1, [-4, 4], 1);
  let dim = 30;
  let density = 1/3;
  for (let i = 0; i < dim*dim*density; i++) {
    setBoardValue(board1, [Math.floor(Math.random()*dim-dim/2), Math.floor(Math.random()*dim-dim/2)], Math.floor(Math.random()*7)-3);
  }
}