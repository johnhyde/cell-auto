const cos60 = .5;
const sin60 = Math.sin(Math.PI/3);
const hexRadius = 0.5/Math.cos(Math.PI/6);
const hexHalfSideLength = 0.5*Math.tan(Math.PI/6);

var drawing = false;
var queueDraw = false;
function refreshContext(ctx, board, camera) {
  if (drawing) {
    queueDraw = true;
  } else {
    drawing = true;
    requestAnimationFrame(() => {
      draw(ctx, board, camera);
    });
  }
}

function draw(ctx, board, camera) {
  let startTime = +new Date();
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  ctx.fillStyle=styleMappings['background'];
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  renderBoardWithCamera(ctx, board, camera);
  console.log(`draw() ran in ${+new Date() - startTime}ms`);
  if (queueDraw) {
    queueDraw = false;
    requestAnimationFrame(() => {
      draw(ctx, board, camera);
    });
  } else {
    drawing = false;
  }
}

function renderBoardWithCamera(ctx, board, camera) {
  let incorrectSquares = [];
  let squaresToDrawByStyle = {};
  for (let style in styleMappings) {
    squaresToDrawByStyle[styleMappings[style]] = [];
  }
  let screenMinX = 0;
  let screenMinY = 0;
  let screenMaxX = ctx.canvas.width - 1;
  let screenMaxY = ctx.canvas.height - 1;
  // Doing it from these corners works for both square and hex grids
  let [maxX, minY] = convertPointFromScreenToBoard(ctx, [screenMaxX, screenMinY], camera);
  let [minX, maxY] = convertPointFromScreenToBoard(ctx, [screenMinX, screenMaxY], camera);
  let cameraOffsetX = Math.floor(ctx.canvas.width/2) - camera.focus.x;
  let cameraOffsetY = Math.floor(ctx.canvas.height/2) - camera.focus.y;
  for (let x in board) {
    x = Number(x);
    if (x >= minX && x <= maxX) {
      // Some of this column is in view!
      for (let y in board[x]) {
        y = Number(y);
        if (y >= minY && y <= maxY) {
          let style = styleMappings[board[x][y]] || styleMappings['???'];
          squaresToDrawByStyle[style].push([x, y]);
        }
      }
    }
  }
  ctx.save();
  ctx.translate(cameraOffsetX, cameraOffsetY);
  ctx.scale(camera.scale, camera.scale);
  for (let style in squaresToDrawByStyle) {
    ctx.fillStyle = style;
    ctx.beginPath();
    for (let pos of squaresToDrawByStyle[style]) {
      if (camera.hexGrid) {
        let [x, y] = convertCartToHex(pos);
        ctx.moveTo(x, y + hexRadius);
        ctx.lineTo(x + .5, y + hexHalfSideLength);
        ctx.lineTo(x + .5, y - hexHalfSideLength);
        ctx.lineTo(x, y - hexRadius);
        ctx.lineTo(x - .5, y - hexHalfSideLength);
        ctx.lineTo(x - .5, y + hexHalfSideLength);
      } else {
        ctx.rect(pos[0], pos[1], 1, 1);
      }
    }
    ctx.fill();
  }
  ctx.restore();
  // console.log(`Found incorrect squares: ${incorrectSquares.join(', ')}`);
  if (camera.showGrid) {
    if (!camera.hexGrid && camera.scale > 1) {
      drawCartGrid(ctx, camera);
    } else if (camera.hexGrid && camera.scale > 4) {
      drawHexGrid(ctx, camera);
    }
  }
}

function drawCartGrid(ctx, camera) {
  let cameraOffsetX = Math.floor(ctx.canvas.width/2) - camera.focus.x;
  let cameraOffsetY = Math.floor(ctx.canvas.height/2) - camera.focus.y;
  let gridStartX = cameraOffsetX % camera.scale;
  let gridStartY = cameraOffsetY % camera.scale;
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = styleMappings['line'];
  ctx.translate(0.5,0.5);
  // draw vertical lines
  for (let x = gridStartX; x < ctx.canvas.width; x += camera.scale) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height - 1);
  }
  // draw horizontal lines
  for (let y = gridStartY; y < ctx.canvas.height; y += camera.scale) {
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width-1, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawHexGrid(ctx, camera) {
  let cameraOffsetX = Math.floor(ctx.canvas.width/2) - camera.focus.x;
  let cameraOffsetY = Math.floor(ctx.canvas.height/2) - camera.focus.y;
  let yUnit = camera.scale * sin60;
  let gridStartY = cameraOffsetY % yUnit;
  let scaledHexRadius = hexRadius * camera.scale;
  let scaledHexHalfSideLength = hexHalfSideLength * camera.scale;
  let halfScale = .5 * camera.scale;
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = styleMappings['line'];
  for (let y = gridStartY - yUnit; y < ctx.canvas.height + yUnit; y += yUnit) {
    // we divide by sin60 here because y is already in hex
    // we need it in cart to calculate x in hex
    let gridStartX = (cameraOffsetX + ((y - cameraOffsetY)/sin60)*cos60) % camera.scale;
    for (let x = gridStartX - camera.scale; x < ctx.canvas.width + camera.scale; x += camera.scale) {
      ctx.moveTo(x, y + scaledHexRadius);
      ctx.lineTo(x + halfScale, y + scaledHexHalfSideLength);
      ctx.lineTo(x + halfScale, y - scaledHexHalfSideLength);
      ctx.lineTo(x, y - scaledHexRadius);
    }
  }
  ctx.stroke();
  ctx.restore();
}

function convertCartToHex([x, y]) {
  return [
    x + cos60 * y,
    sin60 * y,
  ];
}

function convertHexToCart([x, y]) {
  return [
    x - (cos60 * y)/sin60,
    y/sin60,
  ]
}

function convertPointFromScreenToBoard(ctx, [x, y], camera) {
  let boardX = (x - Math.floor(ctx.canvas.width/2) + camera.focus.x)/camera.scale;
  let boardY = (y - Math.floor(ctx.canvas.height/2) + camera.focus.y)/camera.scale;
  if (camera.hexGrid) {
    let boardPoint = convertHexToCart([boardX, boardY]).map(Math.round);
    let potentialPoints = [
      boardPoint,
      [boardPoint[0], boardPoint[1] + 1],
      [boardPoint[0] + 1, boardPoint[1]],
      [boardPoint[0], boardPoint[1] - 1],
      [boardPoint[0] - 1, boardPoint[1]],
    ];
    let closestBoardPoint = potentialPoints.map(([x, y]) => {
      // Find out how far from the point the different nearby hexes are
      let [hexX, hexY] = convertCartToHex([x, y]);
      return [
        Math.sqrt(Math.pow(hexX - boardX, 2) + Math.pow(hexY - boardY, 2)),
        [x, y],
      ];
    }).sort((a, b) => {  // Shortest distance is closest board point
      return a[0] - b[0];
    })[0][1]; // [0] gets the one with shortest distance, and [1] gets the point itself
    return closestBoardPoint;
  } else {
    return [Math.floor(boardX), Math.floor(boardY)];
  }
}

function lengthOfVector([x, y]) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}