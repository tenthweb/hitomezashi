let stitchWidth = 40;
let margin = 200;
let cols = [];
let rows = [];
let speed = 0.04;
let stepFrames = 80; // how often new batches are picked
let batchChance = 0.4; // probability each stitch is picked in a batch
let currentDirection = 'horizontal'; // start with horizontal


function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(3);

  for (let i = -stitchWidth; i < width; i += stitchWidth) {
    cols.push({ x: i, slideOffset: 0, phase: 0, moving: false, cooldown: 0 });
  }

  for (let j =  -stitchWidth; j < height; j += stitchWidth) {
    rows.push({ y: j, slideOffset: 0, phase: 0, moving: false, cooldown: 0 });
  }
}

function draw() {
  background(30, 30, 47); // background colour



  // --- Pick random batch of rows/columns ---
  if (frameCount % stepFrames === 0) {
    
    currentDirection = (currentDirection === 'horizontal') ? 'vertical' : 'horizontal';
if (frameCount % stepFrames === 0) {
  if (currentDirection === 'horizontal') {
    for (let row of rows) {
      if (!row.moving && row.phase < 2 && row.cooldown === 0 && random() < batchChance) {
        row.moving = true;
      }
    }
  } else {
    for (let col of cols) {
      if (!col.moving && col.phase < 2 && col.cooldown === 0 && random() < batchChance) {
        col.moving = true;
      }
    }
  }
}}
  // --- Horizontal lines ---
  stroke(51, 161, 204); // horizontal thread colour
  for (let row of rows) {
    if (row.cooldown > 0) row.cooldown--;

    if (row.moving) {
      row.slideOffset = min(row.slideOffset + speed, 1); // clamp to 1

      if (row.slideOffset >= 1) {
        row.slideOffset = 0;
        row.phase += 1;
        row.moving = false;
        row.cooldown = stepFrames; // prevent immediate reactivation
      }

      if (row.phase >= 2) {
        row.phase = 0;
        row.slideOffset = 0; // snap back to exact start
      }
    }

    for (let i = 0; i < width; i += stitchWidth * 2) {
      let x = i + row.slideOffset * stitchWidth + row.phase * stitchWidth;
      if ((x < margin || x + stitchWidth > width - margin || (x >= margin && x + stitchWidth <= width - margin))
          && !(row.y < margin || row.y > height - margin)) {
        line(x, row.y, x + stitchWidth, row.y);
      }
    }
  }

  // --- Vertical lines ---
  stroke(214, 51, 108); // vertical thread colour
  for (let col of cols) {
    if (col.cooldown > 0) col.cooldown--;

    if (col.moving) {
      col.slideOffset = min(col.slideOffset + speed, 1);

      if (col.slideOffset >= 1) {
        col.slideOffset = 0;
        col.phase += 1;
        col.moving = false;
        col.cooldown = stepFrames;
      }

      if (col.phase >= 2) {
        col.phase = 0;
        col.slideOffset = 0;
      }
    }

    for (let j = 0; j < height; j += stitchWidth * 2) {
      let y = j + col.slideOffset * stitchWidth + col.phase * stitchWidth;
      if ((y < margin || y + stitchWidth > height - margin || (y >= margin && y + stitchWidth <= height - margin))
          && !(col.x < margin || col.x > width - margin)) {
        line(col.x, y, col.x, y + stitchWidth);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
