let stitchWidth = 20;
let margin = 100;
let cols = [];
let rows = [];
let waveSpeed = 0.02;
let wavePhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < width; i += stitchWidth) {
    cols.push({
      x: i,
      targetOffset: 0,
      slideOffset: random()
    });
  }

  for (let j = 0; j < height; j += stitchWidth) {
    rows.push({
      y: j,
      targetOffset: 0,
      slideOffset: random()
    });
  }
}

function slide(obj) {
  let speed = 0.15;
  obj.slideOffset += (obj.targetOffset - obj.slideOffset) * speed;
  if (abs(obj.slideOffset - obj.targetOffset) < 0.01) obj.slideOffset = obj.targetOffset;
}

function updateWaves() {
  wavePhase += waveSpeed;

  for (let i = 0; i < cols.length; i++) {
    let t = (i / cols.length) + wavePhase;
    cols[i].targetOffset = (sin(TWO_PI * t) > 0) ? 1 : 0;
  }

  for (let j = 0; j < rows.length; j++) {
    let t = (j / rows.length) + wavePhase;
    rows[j].targetOffset = (sin(TWO_PI * t) > 0) ? 1 : 0;
  }
}

function draw() {
  background(20);
  strokeWeight(5);

  updateWaves();

  stroke(200, 50, 255);
  for (let col of cols) {
    slide(col);
    for (let j = 0; j < height; j += stitchWidth * 2) {
      let y = j + col.slideOffset * stitchWidth;
      if ((y < margin || y + stitchWidth > height - margin || (y >= margin && y + stitchWidth <= height - margin))
          && !(col.x < margin || col.x > width - margin)) {
        line(col.x, y, col.x, y + stitchWidth);
      }
    }
  }

  stroke(0, 220, 255);
  for (let row of rows) {
    slide(row);
    for (let i = 0; i < width; i += stitchWidth * 2) {
      let x = i + row.slideOffset * stitchWidth;
      if ((x < margin || x + stitchWidth > width - margin || (x >= margin && x + stitchWidth <= width - margin))
          && !(row.y < margin || row.y > height - margin)) {
        line(x, row.y, x + stitchWidth, row.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
