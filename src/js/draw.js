var drawing = false;
var queueDraw = false;
function refreshContext(ctx, board, camera) {
  if (drawing) {
    queueDraw = true;
  } else {
    drawing = true;
    window.requestAnimationFrame(() => {
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
    window.requestAnimationFrame(() => {
      draw(ctx, board, camera);
    });
  } else {
    drawing = false;
  }
}

const cos60 = .5;
const sin60 = Math.sin(Math.PI/3);

function renderBoardWithCamera(ctx, board, camera) {
  let incorrectSquares = [];
  let squaresToDrawByStyle = {};
  for (let style in styleMappings) {
    squaresToDrawByStyle[styleMappings[style]] = [];
  }
  let [minX, minY] = convertPointFromScreenToBoard(ctx, [0, 0], camera);
  let [maxX, maxY] = convertPointFromScreenToBoard(ctx, [ctx.canvas.width - 1, ctx.canvas.height - 1], camera);
  let cameraOffsetX = Math.floor(ctx.canvas.width/2) - camera.focus.x;
  let cameraOffsetY = Math.floor(ctx.canvas.height/2) - camera.focus.y;
  for (let x in board) {
    if (x >= minX && x <= maxX) {
      let convertedX = x*camera.scale + cameraOffsetX;
      // let convertedX = x + cameraOffsetX/camera.scale;
      // Some of this column is in view!
      for (let y in board[x]) {
        if (y >= minY && y <= maxY) {
          let convertedY = y*camera.scale + cameraOffsetY;
          // let convertedY = y + cameraOffsetY/camera.scale;
          let style = styleMappings[board[x][y]] || styleMappings['???'];
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
      if (camera.hexGrid) {
        // let hexX = pos[0] + cos60 * pos[1];
        // let hexY = sin60 * pos[1];
        // // ctx.moveTo(pos[0])
        // ctx.rect(hexX, hexY, camera.scale, camera.scale);
      } else {
        ctx.rect(pos[0], pos[1], camera.scale, camera.scale);
      }
      // ctx.rect(pos[0], pos[1], 1, 1);
    }
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  // console.log(`Found incorrect squares: ${incorrectSquares.join(', ')}`);
  if (camera.showGrid && camera.scale > 1) {
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
}

function convertPointFromScreenToBoard(ctx, [x, y], camera) {
  let boardX = Math.floor((x - Math.floor(ctx.canvas.width/2) + camera.focus.x)/camera.scale);
  let boardY = Math.floor((y - Math.floor(ctx.canvas.height/2) + camera.focus.y)/camera.scale);
  return [boardX, boardY];
}

function lengthOfVector([x, y]) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}