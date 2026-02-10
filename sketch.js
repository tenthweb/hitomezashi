let stitchWidth = 20;
let margin = 150;
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

  // Vertical lines
  stroke(200, 50, 255); // fixed vertical colour
  for (let col of cols) {
    slide(col);

    for (let j = 0; j < height; j += stitchWidth * 2) {
      let y = j + col.slideOffset * stitchWidth;

      // Draw vertical only in top/bottom margins or center, skip corners
      if ((y < margin || y + stitchWidth > height - margin || (y >= margin && y + stitchWidth <= height - margin))
          && !(col.x < margin || col.x > width - margin)) {
        line(col.x, y, col.x, y + stitchWidth);
      }
    }

    if (frameCount % 120 === 0) col.targetOffset = random([0,1]);
  }

  // Horizontal lines
  stroke(0, 220, 255); // fixed horizontal colour
  for (let row of rows) {
    slide(row);

    for (let i = 0; i < width; i += stitchWidth * 2) {
      let x = i + row.slideOffset * stitchWidth;

      // Draw horizontal only in left/right margins or center, skip corners
      if ((x < margin || x + stitchWidth > width - margin || (x >= margin && x + stitchWidth <= width - margin))
          && !(row.y < margin || row.y > height - margin)) {
        line(x, row.y, x + stitchWidth, row.y);
      }
    }

    if (frameCount % 120 === 0) row.targetOffset = random([0,1]);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
