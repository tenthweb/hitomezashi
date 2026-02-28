let stitchWidth = 40;
let margin = 200;
let cols = [];
let rows = [];
let speed = 0.04;
let stepFrames = 80; // how often new batches are picked
let batchChance = 0.4; // probability each stitch is picked in a batch
let currentDirection = 'horizontal'; // start with horizontal

// unified parity colours
let colorEven = [51, 161, 204]; // blue
let colorOdd  = [214, 51, 108]; // red

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(3);

  // create columns
  for (let i = -stitchWidth, idx = 0; i < width; i += stitchWidth, idx++) {
    cols.push({
      x: i,
      slideOffset: 0,
      phase: 0,
      moving: false,
      cooldown: 0,
      idx: idx
    });
  }

  // create rows
  for (let j = -stitchWidth, idx = 0; j < height; j += stitchWidth, idx++) {
    rows.push({
      y: j,
      slideOffset: 0,
      phase: 0,
      moving: false,
      cooldown: 0,
      idx: idx
    });
  }
}

function drawFaintGrid() {
  stroke(255, 255, 255, 12);
  strokeWeight(1);
  for (let x = 0; x < width; x += stitchWidth) line(x, 0, x, height);
  for (let y = 0; y < height; y += stitchWidth) line(0, y, width, y);
}

function draw() {
  background(30, 30, 47);
  drawFaintGrid();

  // --- Pick random batch of rows/columns ---
  if (frameCount % stepFrames === 0) {
    currentDirection = (currentDirection === 'horizontal') ? 'vertical' : 'horizontal';

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
  }

  // --- Horizontal lines ---
  for (let row of rows) {
    if (row.cooldown > 0) row.cooldown--;

    if (row.moving) {
      row.slideOffset = min(row.slideOffset + speed, 1);
      if (row.slideOffset >= 1) {
        row.slideOffset = 0;
        row.phase += 1;
        row.moving = false;
        row.cooldown = stepFrames;
      }
      if (row.phase >= 2) {
        row.phase = 0;
        row.slideOffset = 0;
      }
    }

    for (let i = -stitchWidth; i < width; i += stitchWidth * 2) {
      let x = i + row.slideOffset * stitchWidth + row.phase * stitchWidth;

      if ((x < margin || x + stitchWidth > width - margin || (x >= margin && x + stitchWidth <= width - margin))
          && !(row.y < margin || row.y > height - margin)) {

        // Determine column index of this stitch
        let colIndex = floor(x / stitchWidth);

        // Use same parity colour for all rows and columns
        stroke((colIndex % 2 === 0) ? color(...colorEven) : color(...colorOdd));

        line(x, row.y, x + stitchWidth, row.y);
      }
    }
  }

  // --- Vertical lines ---
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

    for (let j = -stitchWidth; j < height; j += stitchWidth * 2) {
      let y = j + col.slideOffset * stitchWidth + col.phase * stitchWidth;

      if ((y < margin || y + stitchWidth > height - margin || (y >= margin && y + stitchWidth <= height - margin))
          && !(col.x < margin || col.x > width - margin)) {

        // Determine row index of this stitch
        let rowIndex = floor(y / stitchWidth);

        // Use same parity colour for verticals
        stroke((rowIndex % 2 === 0) ? color(...colorEven) : color(...colorOdd));

        line(col.x, y, col.x, y + stitchWidth);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
