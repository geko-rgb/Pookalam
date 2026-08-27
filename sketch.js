// ============================================================
//  POOKALAM GENERATOR  —  Onam Floral Mandala
//  Procedurally draws a traditional Pookalam using radial
//  symmetry, layered geometric shapes and colour gradients.
//  Output: 1024 x 1024 PNG
//  Uses polygon approximation for curves (no bezierVertex)
// ============================================================

function setup() {
  createCanvas(1024, 1024);
  pixelDensity(1); // ensure 1024x1024 export is deterministic
  noLoop();
}

// Press 'S' to export PNG (1024x1024)
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('pookalam-render', 'png');
  }
}

function draw() {
  background('#ffbe6f');
  translate(width / 2, height / 2);

  // ---- LAYER 1: Diamond border ----
  drawCheckerboard();

  // ---- LAYER 2: White ring separator ----
  noStroke();
  fill(255);
  circle(0, 0, 500);

  // ---- LAYER 3: Swirl ring ----
  fill(46, 90, 28);
  circle(0, 0, 704);
  drawSwirlRing();

  // ---- LAYER 4: White ring separator ----
  fill(255);
  circle(0, 0, 590);

  // ---- LAYER 5: Inner petal ring ----
  fill(46, 90, 28);
  circle(0, 0, 580);
  drawInnerPetalRing();

  // ---- LAYER 6: White border & dark green centre ----
  fill(255);
  circle(0, 0, 360);
  fill(10, 75, 35);
  circle(0, 0, 350);
    // ---- Minimalist lotus buds in the gaps ----
  const budRadius = 125;
  const gapAngles = [PI/6, PI/2, 5*PI/6, 7*PI/6, 3*PI/2, 11*PI/6];
  const budScale = 0.18;   // adjust for size
  
  for (let i = 0; i < 6; i++) {
    let angle = gapAngles[i];
    let bx = budRadius * cos(angle);
    let by = budRadius * sin(angle);
    let budRotation = angle + PI/2;   // points outward from centre
    drawMinimalLotus(bx, by, budScale, budRotation);
  }

  // ---- LAYER 7: Centre medallion ----
  drawCenterMedallion();
}

// ============================================================
//  HELPER: Sample points along a cubic Bezier curve
// ============================================================
function bezierPoints(p0, p1, p2, p3, n) {
  let pts = [];
  for (let i = 0; i <= n; i++) {
    let t = i / n;
    let x = pow(1 - t, 3) * p0[0] + 3 * pow(1 - t, 2) * t * p1[0] + 3 * (1 - t) * pow(t, 2) * p2[0] + pow(t, 3) * p3[0];
    let y = pow(1 - t, 3) * p0[1] + 3 * pow(1 - t, 2) * t * p1[1] + 3 * (1 - t) * pow(t, 2) * p2[1] + pow(t, 3) * p3[1];
    pts.push([x, y]);
  }
  return pts;
}

// ============================================================
//  HELPER: Draw a leaf/eye shape (single petal)
// ============================================================
function drawLeafShape(baseX, tipX, maxWidth, fillColor) {
  let len = Math.abs(tipX - baseX);
  let reverse = tipX < baseX;
  if (reverse) {
    let temp = baseX;
    baseX = tipX;
    tipX = temp;
  }

  let c1 = [baseX + len * 0.3, -maxWidth * 0.95];
  let c2 = [baseX + len * 0.7, -maxWidth * 0.7];
  let c3 = [baseX + len * 0.7, maxWidth * 0.6];
  let c4 = [baseX + len * 0.3, maxWidth * 0.85];

  fill(fillColor);
  noStroke();
  beginShape();
  vertex(baseX, 0);
  let pts1 = bezierPoints([baseX, 0], c1, c2, [tipX, 0], 20);
  for (let p of pts1) vertex(p[0], p[1]);
  let pts2 = bezierPoints([tipX, 0], c3, c4, [baseX, 0], 20);
  for (let p of pts2) vertex(p[0], p[1]);
  endShape(CLOSE);
}

// ============================================================
//  DIAMOND RING — 5 interlocking layers
//  Colours (inner→outer): burgundy, white, orange, yellow, brown
// ============================================================
function drawCheckerboard() {
  const innerRadius = 348;
  const outerRadius = 420;
  const numLayers = 5;
  const numDiamonds = 200;

  const colors = [
    [180, 20, 0],   // deep red-brown
    [255, 200, 0],  // yellow
    [255, 140, 0],  // orange
    [255, 255, 255],// white
    [139, 0, 0]     // burgundy
  ];
  colors.reverse();

  const layerWidth = (outerRadius - innerRadius) / numLayers;
  const diamondSize = layerWidth * 1.5;

  noStroke();

  for (let layer = 0; layer < numLayers; layer++) {
    let r = innerRadius + layer * layerWidth + layerWidth / 2;
    let angleOffset = (layer % 2) * PI / numDiamonds;

    for (let i = 0; i < numDiamonds; i++) {
      let angle = i * TWO_PI / numDiamonds + angleOffset;
      let cx = r * cos(angle);
      let cy = r * sin(angle);

      let radHalf = diamondSize * 0.6;
      let tanHalf = diamondSize * 0.4;

      let radX = cos(angle);
      let radY = sin(angle);
      let tanX = -sin(angle);
      let tanY = cos(angle);

      let p1x = cx + radX * radHalf;
      let p1y = cy + radY * radHalf;
      let p2x = cx + tanX * tanHalf;
      let p2y = cy + tanY * tanHalf;
      let p3x = cx - radX * radHalf;
      let p3y = cy - radY * radHalf;
      let p4x = cx - tanX * tanHalf;
      let p4y = cy - tanY * tanHalf;

      fill(colors[layer]);
      beginShape();
      vertex(p1x, p1y);
      vertex(p2x, p2y);
      vertex(p3x, p3y);
      vertex(p4x, p4y);
      endShape(CLOSE);
    }
  }
}

// ============================================================
//  SWIRL RING
// ============================================================
function drawSwirlRing() {
  const ringRadius = 315;
  const numSwirls = 29;

  for (let i = 0; i < numSwirls; i++) {
    let angle = i * TWO_PI / numSwirls;
    let x = ringRadius * cos(angle);
    let y = ringRadius * sin(angle);
    let toCenter = atan2(-y, -x);
    drawSpiral(x, y, 72, toCenter);
  }
}

// ============================================================
//  CIRCULAR SWIRL MOTIF — Orange ribbon uses canvas gradient
//  No gaps, no WebGL, works in 2D
// ============================================================
function drawSpiral(cx, cy, size, rotation) {
  const R = size / 2;
  const thetaMax = 2.0 * TWO_PI;
  const R0 = 0.03 * R;
  const growth = (R - R0) / thetaMax;

  const N = 120;
  const STEPS = 20;

  const W_white = 0.22 * R;
  const W_orange_max = 1.3 * W_white;
  const W_maroon_max = 0.77 * W_orange_max;

  let outerPts = [], whiteInnerPts = [], orangeInnerPts = [], maroonInnerPts = [];

  for (let i = 0; i <= N; i++) {
    let t = i / N;
    let theta = -t * thetaMax;
    let r = R0 + growth * t * thetaMax;
    if (r > R) r = R;

    let lx = r * cos(theta);
    let ly = r * sin(theta);

    let x = cx + lx * cos(rotation) - ly * sin(rotation);
    let y = cy + lx * sin(rotation) + ly * cos(rotation);

    let nx = cos(theta + rotation);
    let ny = sin(theta + rotation);

    // Widths (unchanged)
    let baseTaper = constrain(t / 0.2, 0, 1);
    let endRamp = 2.0 + 0.5 * constrain((t - 0.4) / 0.6, 0, 1);
    let whiteW = W_white * baseTaper * endRamp;

    let orangeFactor;
    if (t <= 0.5) {
      orangeFactor = 0.7 + 0.6 * (t / 0.5);
    } else {
      orangeFactor = 1.5 - 0.3 * ((t - 0.5) / 0.5);
    }
    let orangeW = W_white * orangeFactor;

    let maroonFactor = 0.4 + 0.8 * constrain(t / 0.4, 0, 1);
    let maroonW = W_maroon_max * maroonFactor;

    let total = whiteW + orangeW + maroonW;
    let half = total / 2;

    let outerOff = half;
    let wOOff = half - whiteW;
    let oMOff = wOOff - orangeW;
    let innerOff = oMOff - maroonW;

    let maxOff = R - r;
    if (outerOff > maxOff) outerOff = maxOff;
    if (wOOff > maxOff) wOOff = maxOff;
    if (oMOff > maxOff) oMOff = maxOff;
    if (innerOff > maxOff) innerOff = maxOff;

    outerPts.push([x + outerOff * nx, y + outerOff * ny]);
    whiteInnerPts.push([x + wOOff * nx, y + wOOff * ny]);
    orangeInnerPts.push([x + oMOff * nx, y + oMOff * ny]);
    maroonInnerPts.push([x + innerOff * nx, y + innerOff * ny]);
  }

  // ---- Save originals ----
  let whiteInner_orig = whiteInnerPts.slice();
  let orangeInner_orig = orangeInnerPts.slice();

  // ---- Tail (tangential) ----
  let theta_exit = -thetaMax;
  let tx = cos(theta_exit + HALF_PI);
  let ty = sin(theta_exit + HALF_PI);
  let rot_tx = tx * cos(rotation) - ty * sin(rotation);
  let rot_ty = tx * sin(rotation) + ty * cos(rotation);

  let lastOuter = outerPts[outerPts.length - 1];
  let lastInner = whiteInnerPts[whiteInnerPts.length - 1];

  for (let j = 1; j <= STEPS; j++) {
    let s = (j / STEPS) * 0.4 * R;
    outerPts.push([lastOuter[0] + s * rot_tx, lastOuter[1] + s * rot_ty]);
    whiteInnerPts.push([lastInner[0] + s * rot_tx, lastInner[1] + s * rot_ty]);
  }

  // ---- 1. Draw White ribbon (solid) ----
  noStroke();
  fill(255);
  beginShape();
  for (let p of outerPts) vertex(p[0], p[1]);
  for (let i = whiteInnerPts.length - 1; i >= 0; i--) {
    vertex(whiteInnerPts[i][0], whiteInnerPts[i][1]);
  }
  endShape(CLOSE);

  // ---- 2. Draw Orange ribbon using canvas gradient (no gaps) ----
  let ctx = drawingContext;   // get the canvas context

  // Build the polygon path for the orange ribbon
  ctx.beginPath();
  // Outer boundary (whiteInner_orig) forward
  for (let i = 0; i < whiteInner_orig.length; i++) {
    let x = whiteInner_orig[i][0];
    let y = whiteInner_orig[i][1];
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  // Inner boundary (orangeInner_orig) backward
  for (let i = orangeInner_orig.length - 1; i >= 0; i--) {
    let x = orangeInner_orig[i][0];
    let y = orangeInner_orig[i][1];
    ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Create a linear gradient from start (centre) to end (outer)
  let grad = ctx.createLinearGradient(
    whiteInner_orig[0][0], whiteInner_orig[0][1],
    whiteInner_orig[whiteInner_orig.length-1][0], whiteInner_orig[whiteInner_orig.length-1][1]
  );
  grad.addColorStop(0, 'rgb(230, 97, 0)');        // burgundy red
  grad.addColorStop(1, 'rgb(248, 228, 92)');    // pink red

  ctx.fillStyle = grad;
  ctx.fill();

  // ---- 3. Draw Maroon ribbon (solid) ----
  fill(110, 17, 34);
  beginShape();
  for (let p of orangeInner_orig) vertex(p[0], p[1]);
  for (let i = maroonInnerPts.length - 1; i >= 0; i--) {
    vertex(maroonInnerPts[i][0], maroonInnerPts[i][1]);
  }
  endShape(CLOSE);

  // ---- 4. Inner white tip ----
  noStroke();
  fill(255);
  let tipSize = 0.12 * R;
  ellipse(cx, cy, tipSize * 2, tipSize * 2);
  push();
  translate(cx, cy);
  rotate(-PI / 3);
  ellipse(tipSize * 0.6, 0, tipSize * 0.6, tipSize * 0.3);
  pop();
}
// ============================================================
//  PINWHEEL FLOWER (used inside inner petal ring)
// ============================================================
function drawSmallFlower(cx, cy, size) {
  push();
  translate(cx, cy);

  const petals = 8;
  const petalLen = size * 0.9;
  const petalWidth = size * 0.55;
  const baseX = size * 0.4
  const tipX = baseX + petalLen;

  noStroke();
  fill(255);
  circle(0, 0, size * 1.3);

  fill(245, 125, 26);
  circle(0, 0, size * 0.5);
  fill(122, 58, 30);
  circle(0, 0, size * 0.25);

  for (let i = 0; i < petals; i++) {
    let angle = i * TWO_PI / petals;
    push();
    rotate(angle);

    let offsetDir = (i % 2 == 0) ? 1 : -1;

    drawLeafShape(baseX, tipX, petalWidth, [255, 201, 46]);

    let orangeLen = petalLen * 0.6;
    let orangeWidth = petalWidth * 0.65;
    let orangeBase = baseX + petalLen * -0.05;
    let orangeTip = orangeBase + orangeLen;
    push();
    translate(0, offsetDir * petalWidth * 0.15);
    drawLeafShape(orangeBase, orangeTip, orangeWidth, [222, 83, 16]);
    pop();

    let skipRed = (i == 9 || i == 10);
    if (!skipRed) {
      let redLen = petalLen * 0.5;
      let redWidth = petalWidth * 0.25;
      let redBase = baseX - 3;
      let redTip = redBase + redLen;
      push();
      translate(0, offsetDir * petalWidth * 0.2);
      drawLeafShape(redBase, redTip, redWidth, [182, 29, 51]);
      pop();
    }

    pop();
  }

  pop();
}



// ============================================================
//  INNER PETAL RING
// ============================================================
function drawInnerPetalRing() {
  const numPetals = 12;
  const petalRadius = 205;
  const petalLen = 170;
  const petalW = 88;

  for (let i = 0; i < numPetals; i++) {
    let angle = i * TWO_PI / numPetals;
    push();
    rotate(angle + TWO_PI / 4);
    drawLargePetalInward(petalRadius, petalLen, petalW);
    pop();
  }

  for (let i = 0; i < numPetals; i++) {
    let angle = i * TWO_PI / numPetals + TWO_PI / numPetals + TWO_PI / 8;
    let fx = 260 * cos(angle);
    let fy = 260 * sin(angle);
    drawSmallFlower(fx, fy, 17);
  }
}

// ============================================================
//  MINIMALIST LOTUS BUD — No outlines, vibrant red/pink fills
//  Colours: centre (crimson), inner (red‑pink), outer (hot pink)
//  Customise by changing the colour arrays below
// ============================================================
function drawMinimalLotus(cx, cy, scale, rotation) {
  push();
  translate(cx, cy);
  rotate(rotation);
  
  // ---- VIBRANT COLOUR CUSTOMISATION ----
  // Change these RGB values to adjust petal colours (set alpha to 255 for solid)
  const centerColor = [180, 30, 50, 255];     // rich crimson red
  const innerColor  = [210, 50, 70, 255];     // bright red‑pink
  const outerColor  = [220, 80, 100, 255];    // hot pink
  
  // ---- Petal data ----
  const petals = [
    { angle: -PI/3, height: 140, width: 65, type: 'outer', color: outerColor },
    { angle: -PI/6, height: 170, width: 55, type: 'inner', color: innerColor },
    { angle: 0,      height: 200, width: 45, type: 'center', color: centerColor },
    { angle: PI/6,   height: 170, width: 55, type: 'inner', color: innerColor },
    { angle: PI/3,   height: 140, width: 65, type: 'outer', color: outerColor }
  ];
  
  const pts = 20;
  
  // ---- Draw each petal (no outlines) ----
  for (let p of petals) {
    push();
    rotate(p.angle);
    
    let h = p.height * scale;
    let w = p.width * scale;
    let c = p.color;
    
    // ---- Fill with vibrant colour (solid) ----
    fill(c[0], c[1], c[2], c[3]);
    noStroke();   // no outlines at all
    
    // ---- Petal shape ----
    let leftPts = bezierPoints([0,0], [-w, -h*0.25], [-w, -h*0.75], [0, -h], pts);
    let rightPts = bezierPoints([0, -h], [w, -h*0.75], [w, -h*0.25], [0,0], pts);
    beginShape();
    for (let pt of leftPts) vertex(pt[0], pt[1]);
    for (let i = rightPts.length - 1; i >= 0; i--) {
      vertex(rightPts[i][0], rightPts[i][1]);
    }
    endShape(CLOSE);
    
    // ---- Pink accents (kept, but now they are a deeper pink/red) ----
    if (p.type === 'center') {
      stroke(255, 100, 130);          // brighter pink accent
      strokeWeight(1.5 * scale);
      let baseY = -20 * scale;
      let endY = -50 * scale;
      line(-15 * scale, baseY, -15 * scale, endY);
      line(15 * scale, baseY, 15 * scale, endY);
    } else if (p.type === 'inner') {
      let isLeft = p.angle < 0;
      let offset = 20 * scale;
      let x = isLeft ? -offset : offset;
      let baseY = -15 * scale;
      let endY = -40 * scale;
      stroke(255, 100, 130);
      strokeWeight(1.5 * scale);
      line(x, baseY, x, endY);
    }
    pop();
  }
  
  // ---- Base yellow bead ----
  noStroke();
  fill('#f9f06b');
  circle(0, 10 * scale, 35 * scale);
  
  pop();
}
// ============================================================
//  STACKED TEARDROP PETAL (used in inner petal ring)
// ============================================================
function drawLargePetalInward(radius, len, width) {
  let tipX = radius - len / 2;

  const layers = [
    { lenFrac: 1.00, widthFrac: 0.98, color: [255, 255, 255] },
    { lenFrac: 0.93, widthFrac: 0.92, color: [125, 17, 32] },
    { lenFrac: 0.80, widthFrac: 0.75, color: [190, 26, 45] },
    { lenFrac: 0.70, widthFrac: 0.65, color: [255, 200, 46] },
    { lenFrac: 0.60, widthFrac: 0.55, color: [255, 138, 30] },
    { lenFrac: 0.53, widthFrac: 0.45, color: [125, 17, 32] },
  ];

  for (let i = 0; i < layers.length; i++) {
    let l = len * layers[i].lenFrac;
    let w = width * layers[i].widthFrac;
    drawTeardrop(tipX, l, w, layers[i].color);
  }

  // ---- 3 dots inside the seed ----
  let seedLen = len * 0.46;
  let seedWidth = width * 0.19;
  let cx = tipX + seedLen * 0.9;
  let cy = 0;
  let dotSize = seedWidth * 0.3;

  let dotColors = [
    [255, 204, 58],
    [255, 204, 58],
    [255, 169, 42]
  ];
  let offsets = [
    [-5, -dotSize * 1.2],
    [dotSize * 0.3, 0],
    [-dotSize * 1.1, dotSize * 0.6]
  ];

  noStroke();
  for (let i = 0; i < 3; i++) {
    fill(dotColors[i]);
    circle(cx + offsets[i][0], cy + offsets[i][1], dotSize);
  }
}

// ============================================================
//  CENTRE MEDALLION
// ============================================================
function drawCenterMedallion() {
  const numPetals = 6;
  const petalLen = 170;
  const petalMaxWidth = 68;
  const innerRadius = 10;

  for (let i = 0; i < numPetals; i++) {
    let angle = i * TWO_PI / numPetals ;
    push();
    rotate(angle);
    drawLayeredPetal(innerRadius, petalLen, petalMaxWidth);
    pop();
  }

  fill(139, 69, 19);
  circle(0, 0, 60);
  fill(255, 200, 0);
  circle(0, 0, 50);
  fill(255, 140, 0);
  for (let i = 0; i < 12; i++) {
    let angle = i * TWO_PI / 12;
    let r = 16;
    circle(r * cos(angle), r * sin(angle), 6);
  }
  fill(139, 69, 19);
  for (let i = 0; i < 8; i++) {
    let angle = i * TWO_PI / 8 + 0.2;
    let r = 9;
    circle(r * cos(angle), r * sin(angle), 4);
  }
  fill(255, 200, 0);
  for (let i = 0; i < 5; i++) {
    let angle = i * TWO_PI / 5;
    let r = 4;
    circle(r * cos(angle), r * sin(angle), 2.5);
  }
}

function drawLayeredPetal(innerRadius, len, maxWidth) {
  let layers = [
    { color: [255, 255, 255], shrink: 0 },
    { color: [74, 18, 32],    shrink: 12 },
    { color: [184, 30, 46],   shrink: 28 },
    { color: [255, 127, 36],  shrink: 44 },
    { color: [255, 197, 39],  shrink: 60 },
  ];

  for (let i = 0; i < layers.length; i++) {
    let s = layers[i].shrink;
    let L = len - s;
    let W = maxWidth * (1 - s / (len * 1.8));
    let baseX = 18;
    let tipX = 10 + L;
    drawLeafShape(baseX, tipX, W, layers[i].color);
  }

  let yellowLen = len - 60;
  let yellowWidth = maxWidth * (1 - 60 / (len * 1.2));
  let yellowBase = innerRadius;
  let yellowTip = innerRadius + yellowLen;
  noStroke();
  fill(255);
  ellipse(yellowBase + 10, 0, 22, yellowWidth * 0.5);

  let eyeLen = len * 0.48;
  let eyeWidth = maxWidth * 0.58;
  let eyeBase = innerRadius + 2;
  let eyeTip = eyeBase + eyeLen;
  drawLeafShape(eyeBase, eyeTip, eyeWidth, [255, 255, 255]);

  let dotLen = eyeLen * 0.65;
  let dotWidth = eyeWidth * 0.65;
  let dotBase = eyeBase + (eyeLen - dotLen) * 0.35;
  let dotTip = dotBase + dotLen;
  drawLeafShape(dotBase, dotTip, dotWidth, [74, 18, 32]);

  let lightLen = dotLen * 0.5;
  let lightWidth = dotWidth * 0.5;
  let lightBase = dotBase + (dotLen - lightLen) * 0.5;
  let lightTip = lightBase + lightLen;
  drawLeafShape(lightBase, lightTip, lightWidth, [210, 180, 140]);
}

// ============================================================
//  HELPER: Draw a teardrop (tip at left, base at right)
// ============================================================
function drawTeardrop(tipX, length, width, fillColor) {
  let baseX = tipX + length;
  let c1 = [tipX + length * 0.3, -width * 0.95];
  let c2 = [tipX + length * 0.7, -width * 0.7];
  let c3 = [tipX + length * 0.7,  width * 0.6];
  let c4 = [tipX + length * 0.3,  width * 0.85];

  fill(fillColor);
  noStroke();
  beginShape();
  vertex(tipX, 0);
  let pts1 = bezierPoints([tipX, 0], c1, c2, [baseX, 0], 20);
  for (let p of pts1) vertex(p[0], p[1]);
  let pts2 = bezierPoints([baseX, 0], c3, c4, [tipX, 0], 20);
  for (let p of pts2) vertex(p[0], p[1]);
  endShape(CLOSE);
}
