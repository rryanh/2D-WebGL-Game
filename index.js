const canvas = document.querySelector("#main-game");
/** @type {WebGLRenderingContext} */
const background = document.querySelector("#main-game");
const gl = canvas.getContext("webgl");

const height = document.body.clientHeight;
const width = document.body.clientWidth;
const gameSizeX = canvas.clientWidth;
const gameSizeY = canvas.clientHeight;
const gameSizeC = canvas.clientWidth * 0.7;
const displayScore = document.querySelector(".score");
const displayHighscore = document.querySelector(".highscore");
const resetButton = document.querySelector(".reset");
const startButton = document.querySelector(".start");
const lose = document.querySelector(".lose");
const intialBacteriaSize = gameSizeX * 0.02;
const loseCondition = 300;
const particleSize = 4;
const particleColor = [0, 0.4, 0];
let bacteriaArray = [];
let particleArray = [];
let game = false;
let score = 0;
let highscore = 0;
let bacteriaOverThreshold_flag = false;

/**
 * Updates the score based on the bacteria radius that was clicked
 * @param {number} radius
 */
const updateScore = function (radius) {
  if (game) {
    let bacteriaScore = (radius * Math.log(radius)) / 5;
    score += Math.round(bacteriaScore);
    if (score > highscore) {
      highscore = score;
    }
    displayScore.textContent = score;
    displayHighscore.textContent = highscore;
  }
};
/**
 * Resets the game and scores
 */
const resetGame = function () {
  bacteriaArray = [];
  game = false;
  resetDisplay();
  score = 0;
  highscore = displayHighscore.textContent;
  displayScore.textContent = 0;
  lose.textContent = "";
  particleArray = [];
};

/**
 * Starts the game
 */
const startGame = function () {
  createCircle(intialBacteriaSize, randomColor(), randomColor(), randomColor());
  if (lose.textContent == "") {
    game = true;
  }
};

startButton.addEventListener("click", startGame);

resetButton.addEventListener("click", resetGame);
//---------------------------------------------------------------------------------//
// circle creation functions

/**
 * frame for circle
 * @param {Array} positionVertex
 * @param {Array} colorVertex
 * @param {number} x x center relative to canvas
 * @param {number} y y center relative to canvas
 * @param {number} radius radius of circle
 * @param {number} r number from 0 - 1
 * @param {number} g number from 0 - 1
 * @param {number} b number from 0 - 1
 */
class Circle {
  constructor(positionVertex, colorVertex, x, y, radius, r, g, b) {
    this.positionVertex = positionVertex;
    this.colorVertex = colorVertex;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.r = r;
    this.g = g;
    this.b = b;
  }
  updatePositionVertex = function (positionVertex) {
    this.positionVertex = positionVertex;
  };
  updateRadius = function (radiusMultiplier) {
    if (this.radius + radiusMultiplier < gameSizeX * 0.6) {
      this.radius = this.radius + radiusMultiplier;
    }
  };
}

/**
 * creates a particle
 * @param {number} x x position on screen
 * @param {Number} y y position on screen
 * @param {Number} vX velocity x direction
 * @param {Number} vY velocity y direction
 * @param {Number} r 0-1 color
 * @param {Number} g 0-1 color
 * @param {Number} b 0-1 color
 */
class Particle {
  constructor(x, y, vX, vY, r, g, b) {
    this.x = x;
    this.y = y;
    this.vX = vX;
    this.vY = vY;
    this.r = r;
    this.g = g;
    this.b = b;
    this.iteration = 0;
    this.maxIteration = randomColor() * randomColor() * 95 + 5;
  }
  updateIteration = function () {
    this.iteration++;
    this.x += this.vX;
    this.y += this.vY;
  };
}

/**
 * returns a random number between 0 and 1
 */
const randomColor = function () {
  return Math.random();
};

/**
 * Creates new particles
 * @param {Number} x x position to spawn particles
 * @param {Number} y y position to spawn particles
 */
const createParticles = function (x, y, r, g, b) {
  for (let i = 0; i < 250; i++) {
    let v = randomColor() * 8 - 4;
    let angle = randomColor() * 180 - 180;
    let vX = Math.cos(angle) * v;
    let vY = Math.sin(angle) * v;
    console.log(vX, vY);
    particleArray.push(new Particle(x, y, vX, vY, r, g, b));
  }
};

/**
 * Returns array[] containing generated positionVertex[] and colorvertex[]
 * @param {number} size
 * @param {number} r
 * @param {number} g
 * @param {number} b
 *
 */
const createCircle = function (size, r, g, b) {
  let rand = Math.round(Math.random() * 360);
  let x = gameSizeC * Math.sin(Math.PI * 2 * (rand / 360));
  let y = gameSizeC * Math.cos(Math.PI * 2 * (rand / 360));

  return createCirclePositionColorVertex(x, y, size, r, g, b, true);
};

/**
 * returns positionVertex [] and colorVertex []
 * @param {number} x x position in canvas
 * @param {number} y y position in canvas
 * @param {number} radius radius of circle
 * @param {number} r number from 0 - 1
 * @param {number} g number from 0 - 1
 * @param {number} b number from 0 - 1
 * @param {boolean} createBacteria_FLAG true if circle should be a bacteria
 */
const createCirclePositionColorVertex = function (
  x,
  y,
  radius,
  r,
  g,
  b,
  createBacteria_FLAG = false
) {
  let xRelativePosition;
  let yRelativePosition;
  let positionVertex = [];
  x /= gameSizeX;
  y /= gameSizeY;
  radius /= gameSizeX;
  positionVertex.push(x);
  positionVertex.push(y);

  for (let i = 0; i < 361; i++) {
    xRelativePosition = radius * Math.sin(Math.PI * 2 * (i / 360));
    yRelativePosition = radius * Math.cos(Math.PI * 2 * (i / 360));
    positionVertex.push(xRelativePosition + x);
    positionVertex.push(yRelativePosition + y);
  }

  let colorVertex = generateColorVertex(positionVertex, r, g, b);
  if (createBacteria_FLAG) {
    bacteriaArray.push(
      new Circle(
        positionVertex,
        colorVertex,
        x * gameSizeX,
        y * gameSizeY,
        radius * gameSizeX,
        r,
        g,
        b
      )
    );
  }
  return [positionVertex, colorVertex];
};

/**
 * Returns colorVertex array for given postionVertex Array
 * @param {Array}number vertex
 * @param {number} r number from 0 - 1
 * @param {number} g number from 0 - 1
 * @param {number} b number from 0 - 1
 */
const generateColorVertex = function (vertex, r, g, b) {
  let colorArray = [];
  for (let i = 0; i < vertex.length / 2; i++) {
    colorArray.push(r);
    colorArray.push(g);
    colorArray.push(b);
  }
  return colorArray;
};

// --------------------------------------------------------------------------------- //
//Click detection functions

const getPosition = function (e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  x = x - gameSizeX / 2;
  y = (y - gameSizeY / 2) * -1;
  clickDetection(x, y);
};

const clickDetection = function (x, y) {
  if (game) {
    for (let i = bacteriaArray.length - 1; i > -1; i--) {
      let bacteria = bacteriaArray[i];
      let bool =
        Math.pow(x - bacteria.x / 2, 2) + Math.pow(y - bacteria.y / 2, 2) <
        Math.pow(bacteria.radius / 2, 2);
      if (bool) {
        updateScore(bacteriaArray[i].radius);
        bacteriaArray.splice(i, 1);
        i = -2;
        createParticles(x + x, y + y, bacteria.r, bacteria.g, bacteria.b);
      }
    }
  }
};

const mainGame = document
  .getElementById("main-game")
  .addEventListener("click", getPosition);
//----------------------------------------------------------------------------------//
// shader / vertex / gl stuff

if (gl === null) {
  alert(
    "Unable to initialize WebGL. Your browser or machine may not support it."
  );
}
gl.viewport(0, 0, canvas.width, canvas.height);

const positionBuff = gl.createBuffer();
const colorBuff = gl.createBuffer();
const indicesBuff = gl.createBuffer();
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
    precision mediump float;
    attribute vec2 position;
    attribute vec3 color;
    varying vec3 varyingColor;
    void main() {
      gl_PointSize = 2.0;
        varyingColor = color;
        gl_Position = vec4(position,0, 1);
        
}
`
);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
    precision mediump float;
      varying vec3 varyingColor;
      void main() {
          gl_FragColor = vec4(varyingColor, 1);
      }
      `
);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// for position
const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

//for color
const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

//-----------------------------------------------------------------------//
// Particle GL stuff

let particleShader = `

`;
//-----------------------------------------------------------------------//
//  game update functions

/**
 * attempts to spawn a new bacteria
 */
const attemptBacteriaCreation = function () {
  if (bacteriaArray.length < 10) {
    if (randomColor() > 0.97) {
      createCircle(
        intialBacteriaSize,
        randomColor(),
        randomColor(),
        randomColor()
      );
    }
  }
};

/**
 * Updates particle array
 *
 *
 */
const updateParticles = function () {
  drawParticles_efficient();
  for (let i = 0; i < particleArray.length; i++) {
    const particle = particleArray[i];
    particle.updateIteration();
    if (particle.iteration >= particle.maxIteration) {
      particleArray.splice(i, 1);
      i--;
    }
  }
};

/**
 * draws each bacteria in bacteriaArray
 * updates each bacteria in bacteriaArray increasing their radius
 * also checks if any bacteria have reach a radius > lose condition
 */
const updateBacteria = function () {
  let thresholdPoints_flag = false;
  let loseConditionCount = 0;
  if (bacteriaArray.length === 0) {
    game = false;
    lose.textContent = "You Win!";
    console.log(`you Win`);
  }
  // drawTest();
  for (let i = 0; i < bacteriaArray.length; i++) {
    draw(bacteriaArray[i].positionVertex, bacteriaArray[i].colorVertex);
    let bacteria = bacteriaArray[i];
    let newPositionColorVertex = createCirclePositionColorVertex(
      bacteria.x,
      bacteria.y,
      bacteria.radius,
      bacteria.r,
      bacteria.g,
      bacteria.b,
      false
    );
    bacteriaArray[i].updateRadius(0.5);
    bacteriaArray[i].updatePositionVertex(newPositionColorVertex[0]);
    if (bacteriaArray[i].radius > loseCondition) {
      loseConditionCount++;
      thresholdPoints_flag = true;
    }
  }
  if (loseConditionCount > 1) {
    game = false;
    lose.textContent = "You Lose!";
  }
  if (thresholdPoints_flag) {
    if (!bacteriaOverThreshold_flag) {
      bacteriaOverThreshold_flag = true;
      updateScore(500);
    }
  } else {
    bacteriaOverThreshold_flag = false;
  }
};

/**
 * draws the given positionVertex[] and colorVertex[] to the screen
 * @param {Array} positionVertex
 * @param {Array} colorVertex
 */
const draw = function (positionVertex, colorVertex) {
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positionVertex),
    gl.DYNAMIC_DRAW
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(colorVertex),
    gl.DYNAMIC_DRAW
  );
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 362);
};

const draw2 = function (positionVertex, colorVertex) {
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positionVertex),
    gl.DYNAMIC_DRAW
  );

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 362);
};
/**
 * @param {Array} bacterialArray
 * @param {Array} particleArray
 */
const drawEfficient = function (bacterialArray, particleArray) {
  let positionVertex = [];
  let colorVertex = [];
  bacterialArray.forEach((element) => {
    for (let i = 0; i < element.positionVertex.length; i++) {
      positionVertex.push(element.positionVertex[i]);
      colorVertex.push(element.colorVertex[i]);
    }
  });
  particleArray.forEach((element) => {
    for (let i = 0; i < element.positionVertex.length; i++) {
      positionVertex.push(element.positionVertex[i]);
      colorVertex.push(element.colorVertex[i]);
    }
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positionVertex),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorVertex), gl.STATIC_DRAW);
  for (let index = 0; index < positionVertex.length; index += 362) {
    gl.drawArrays(gl.TRIANGLE_FAN, index, 362);
  }
};

/**
 * resets the display to show just the intial circle playing field
 */
const resetDisplay = function () {
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  let intialGameCircle = createCirclePositionColorVertex(
    0,
    0,
    gameSizeC,
    1,
    1,
    1,
    false
  );
  draw(intialGameCircle[0], intialGameCircle[1]);
};

/**
 * Checks for bacteria "touching" in bacteriaArray
 */
const checkForCircleConflict = function () {
  for (let i = 0; i < bacteriaArray.length - 1; i++) {
    for (let j = i + 1; j < bacteriaArray.length; j++) {
      let firstBacteria = bacteriaArray[i];
      let secondBacteria = bacteriaArray[j];
      if (secondBacteria !== undefined) {
        let bool =
          Math.pow(firstBacteria.x - secondBacteria.x, 2) +
            Math.pow(firstBacteria.y - secondBacteria.y, 2) <
          Math.pow(firstBacteria.radius + secondBacteria.radius, 2);
        if (bool) {
          bacteriaArray.splice(j, 1);
        }
      }
    }
  }
};

const drawParticles_efficient = function () {
  if (particleArray.length > 0) {
    let positionVertex = [];
    let colorVertex = [];
    let indicesArray = [];
    for (let i = 0; i < particleArray.length; i++) {
      const particle = particleArray[i];
      colorVertex.push(particle.r);
      colorVertex.push(particle.g);
      colorVertex.push(particle.b);
      positionVertex.push(particle.x / gameSizeX);
      positionVertex.push(particle.y / gameSizeY);
    }
    for (let i = 0; i < particleArray.length; i++) {
      indicesArray.push(i);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(positionVertex),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(colorVertex),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuff);

    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indicesArray),
      gl.STATIC_DRAW
    );
    gl.drawElements(gl.POINTS, indicesArray.length, gl.UNSIGNED_SHORT, 0);
  }
};
//-----------------------------------------------------------------------//
// Game loop
resetDisplay();
setInterval(function () {
  resetDisplay();
  if (game) {
    attemptBacteriaCreation();
    checkForCircleConflict();
    updateBacteria();
  }
  updateParticles();
}, 33);
