let stitchWidth = 20;
let margin = 200;
let cols = [];
let rows = [];

let speed = 0.04;
let stepFrames = 80;
let batchChance = 0.4;

let fadeFrames = 30;
let currentDirection = 'horizontal';

// Horizontal colours (blues)
let hColorEven = [40, 150, 210];
let hColorOdd  = [70, 110, 220];

// Vertical colours (reds)
let vColorEven = [220, 70, 60];
let vColorOdd  = [210, 50, 120];

let bandAlpha = 35;
let bandWidth = stitchWidth * 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(3);

  for (let i = -stitchWidth, idx = 0; i < width; i += stitchWidth, idx++) {
    cols.push(makeLineObject(i, idx, true));
  }

  for (let j = -stitchWidth, idx = 0; j < height; j += stitchWidth, idx++) {
    rows.push(makeLineObject(j, idx, false));
  }
}

function makeLineObject(pos, idx, isVertical) {
  return {
    pos: pos,
    idx: idx,
    slideOffset: 0,
    phase: 0,
    state: "waiting",
    cooldown: 0,
    fadeT: 0,
    isVertical: isVertical
  };
}

function draw() {
  background(30, 30, 47);

  drawBands();
  drawFaintGrid();

  if (frameCount % stepFrames === 0) {
    currentDirection =
      currentDirection === "horizontal" ? "vertical" : "horizontal";

    let group =
      currentDirection === "horizontal" ? rows : cols;

    for (let line of group) {
      if (line.state === "waiting" &&
          line.cooldown === 0 &&
          random() < batchChance) {
        line.state = "moving";
      }
    }
  }

  updateGroup(rows);
  updateGroup(cols);
}

function updateGroup(group) {

  for (let line of group) {

    if (line.cooldown > 0) line.cooldown--;

    if (line.state === "moving") {

      line.slideOffset += speed;

      if (line.slideOffset >= 1) {
        line.slideOffset = 0;
        line.phase = (line.phase + 1) % 2;

        line.state = "fading";
        line.fadeT = 0;
      }
    }

    else if (line.state === "fading") {

      line.fadeT += 1 / fadeFrames;

      if (line.fadeT >= 1) {
        line.fadeT = 0;
        line.state = "waiting";
        line.cooldown = stepFrames;
      }
    }

    if (line.isVertical) drawVertical(line);
    else drawHorizontal(line);
  }
}

function drawHorizontal(row) {

  for (let i = -stitchWidth; i < width; i += stitchWidth * 2) {

    let eased = easeInOut(row.slideOffset);
    let x = i + eased * stitchWidth + row.phase * stitchWidth;

    if (row.pos < margin || row.pos > height - margin) continue;

    let colIndex = floor(x / stitchWidth);

    let baseEven = color(...hColorEven);
    let baseOdd  = color(...hColorOdd);

    let isEven = colIndex % 2 === 0;

    let fromColor = isEven ? baseEven : baseOdd;
    let toColor   = isEven ? baseOdd  : baseEven;

    let finalColor = row.state === "fading"
      ? lerpColor(toColor, fromColor, row.fadeT)
      : fromColor;

    stroke(finalColor);
    line(x, row.pos, x + stitchWidth, row.pos);
  }
}

function drawVertical(col) {

  for (let j = -stitchWidth; j < height; j += stitchWidth * 2) {

    let eased = easeInOut(col.slideOffset);
    let y = j + eased * stitchWidth + col.phase * stitchWidth;

    if (col.pos < margin || col.pos > width - margin) continue;

    let rowIndex = floor(y / stitchWidth);

    let baseEven = color(...vColorEven);
    let baseOdd  = color(...vColorOdd);

    let isEven = rowIndex % 2 === 0;

    let fromColor = isEven ? baseEven : baseOdd;
    let toColor   = isEven ? baseOdd  : baseEven;

    let finalColor = col.state === "fading"
      ? lerpColor(toColor, fromColor, col.fadeT)
      : fromColor;

    stroke(finalColor);
    line(col.pos, y, col.pos, y + stitchWidth);
  }
}

function drawBands() {

  noStroke();

  // VERTICAL bands through grid cells (between vertical grid lines)
  for (let x = stitchWidth/2; x < width; x += stitchWidth) {

    let colIndex = floor((x - stitchWidth/2) / stitchWidth);

    let c = (colIndex % 2 === 0) ? hColorEven : hColorOdd;

    fill(c[0], c[1], c[2], bandAlpha);

    rect(x - bandWidth/2, 0, bandWidth, height);
  }

  // HORIZONTAL bands through grid cells (between horizontal grid lines)
  for (let y = stitchWidth/2; y < height; y += stitchWidth) {

    let rowIndex = floor((y - stitchWidth/2) / stitchWidth);

    let c = (rowIndex % 2 === 0) ? vColorEven : vColorOdd;

    fill(c[0], c[1], c[2], bandAlpha);

    rect(0, y - bandWidth/2, width, bandWidth);
  }

  noFill();
}
function drawFaintGrid() {

  stroke(255,255,255,12);
  strokeWeight(1);

  for (let x = 0; x < width; x += stitchWidth)
    line(x,0,x,height);

  for (let y = 0; y < height; y += stitchWidth)
    line(0,y,width,y);

  strokeWeight(3);
}

function easeInOut(t) {
  return t*t*(3-2*t);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

