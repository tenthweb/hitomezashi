let stitchWidth = 70;
let cols = [];
let rows = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < width; i += stitchWidth) {
    cols.push({
      x: i,
      targetOffset: random([0,1]),
      slideOffset: random()
    });
  }

  for (let j = 0; j < height; j += stitchWidth) {
    rows.push({
      y: j,
      targetOffset: random([0,1]),
      slideOffset: random()
    });
  }
}

function slide(obj) {
  let speed = 0.15;
  obj.slideOffset += (obj.targetOffset - obj.slideOffset) * speed;
  if (abs(obj.slideOffset - obj.targetOffset) < 0.01) obj.slideOffset = obj.targetOffset;
}

function draw() {
  background(20);
  strokeWeight(5);

  for (let col of cols) {
    slide(col);
    let c1 = color(120, 0, 255);
    let c2 = color(255, 150, 100);
    stroke(lerpColor(c1, c2, col.slideOffset));

    for (let j = 0; j < height; j += stitchWidth * 2) {
      let y = j + col.slideOffset * stitchWidth;
      line(col.x, y, col.x, y + stitchWidth);
    }

    if (frameCount % 120 === 0) col.targetOffset = random([0,1]);
  }

  for (let row of rows) {
    slide(row);
    let c1 = color(0, 200, 255);
    let c2 = color(0, 255, 120);
    stroke(lerpColor(c1, c2, row.slideOffset));

    for (let i = 0; i < width; i += stitchWidth * 2) {
      let x = i + row.slideOffset * stitchWidth;
      line(x, row.y, x + stitchWidth, row.y);
    }

    if (frameCount % 120 === 0) row.targetOffset = random([0,1]);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
