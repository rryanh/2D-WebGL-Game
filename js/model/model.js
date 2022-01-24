import gameView from "../view/view";
import webgl from "../classes/webgl";
import Particle from "../classes/particle";
import Circle from "../classes/circle";

export const state = {
  bacteriaArray: [],
  particleArray: [],
  game: false,
  score: 0,
  highscore: 0,
  bacteriaOverThreshold_flag: false,
  textContent: "",
};

const canvas = document.querySelector("#main-game");
/** @type {WebGLRenderingContext} */
const background = document.querySelector("#main-game");
const gl = canvas.getContext("webgl");

const GAME_SIZE_X = canvas.clientWidth;
const GAME_SIZE_Y = canvas.clientHeight;
const GAME_CIRCLE_SIZE = canvas.clientWidth * 0.7;
const LOSE_SIZE = 300;
const PARTICLES_TO_CREATE = 120;
const PARTICLE_SIZE = 4;

const height = document.body.clientHeight;
const width = document.body.clientWidth;

const intialBacteriaSize = GAME_SIZE_X * 0.02;
const particleColor = [0, 0.4, 0];

/**
 * Updates the score based on the bacteria radius that was clicked
 * @param {number} radius
 */
const updateScore = function (radius) {
  if (!state.game) return;
  state.score += Math.round((radius * Math.log(radius)) / 5);
  if (state.score > state.highscore) state.highscore = state.score;
};

/**
 * Resets the state.game and scores
 */
export const resetGame = function () {
  state.bacteriaArray = [];
  state.game = false;
  resetDisplay();
  score = 0;
  highscore = highscore;
  state.score = 0;
  state.textContent = "";
  state.particleArray = [];
};

/**
 * Starts the state.game
 */
export const startGame = function () {
  createCircle(intialBacteriaSize, randomColor(), randomColor(), randomColor());
  if (state.textContent == "") {
    state.game = true;
  }
};

//---------------------------------------------------------------------------------//
// circle creation functions

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
  for (let i = 0; i < PARTICLES_TO_CREATE; i++) {
    let v = randomColor() * 8 - 4;
    let angle = randomColor() * 180 - 180;
    let vX = Math.cos(angle) * v;
    let vY = Math.sin(angle) * v;
    state.particleArray.push(new Particle(x, y, vX, vY, r, g, b));
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
  let x = GAME_CIRCLE_SIZE * Math.sin(Math.PI * 2 * (rand / 360));
  let y = GAME_CIRCLE_SIZE * Math.cos(Math.PI * 2 * (rand / 360));

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
  x /= GAME_SIZE_X;
  y /= GAME_SIZE_Y;
  radius /= GAME_SIZE_X;
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
    state.bacteriaArray.push(
      new Circle(
        positionVertex,
        colorVertex,
        x * GAME_SIZE_X,
        y * GAME_SIZE_Y,
        radius * GAME_SIZE_X,
        r,
        g,
        b,
        GAME_SIZE_X
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

/**
 * Translates click position from screen coords into game coords?
 * @todo find what this does
 */
export const getPosition = function (e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  x = x - GAME_SIZE_X / 2;
  y = (y - GAME_SIZE_Y / 2) * -1;
  clickDetection(x, y);
};

/**
 * Determines if click is within radius of a bacteria
 */
const clickDetection = function (x, y) {
  if (!state.game) return;
  state.bacteriaArray.forEach((bacteria, i, arr) => {
    let bool =
      Math.pow(x - bacteria.x / 2, 2) + Math.pow(y - bacteria.y / 2, 2) <
      Math.pow(bacteria.radius / 2, 2);
    if (bool) {
      updateScore(bacteria.radius);
      arr.splice(i, 1);
      createParticles(x + x, y + y, bacteria.r, bacteria.g, bacteria.b);
    }
  });
};

//----------------------------------------------------------------------------------//
// shader / vertex / gl stuff

//-----------------------------------------------------------------------//
//  game update functions

/**
 * attempts to spawn a new bacteria
 */
const attemptBacteriaCreation = function () {
  if (state.bacteriaArray.length < 10) {
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

  state.particleArray.forEach((particle, i) => {
    if (particle.updateIteration().iteration >= particle.maxIteration)
      state.particleArray.splice(i, 1);
  });
};

/**
 * draws each bacteria in state.bacteriaArray
 * updates each bacteria in state.bacteriaArray increasing their radius
 * also checks if any bacteria have reach a radius > lose condition
 */
const updateBacteria = function () {
  let thresholdPoints_flag = false;
  let loseConditionCount = 0;

  if (state.bacteriaArray.length === 0) {
    state.game = false;
    state.textContent = "You Win!";
    console.log(`you Win`);
  }

  state.bacteriaArray.forEach((bacteria) => {
    draw(bacteria.positionVertex, bacteria.colorVertex);
    let newPositionColorVertex = createCirclePositionColorVertex(
      bacteria.x,
      bacteria.y,
      bacteria.radius,
      bacteria.r,
      bacteria.g,
      bacteria.b,
      false
    );

    bacteria.updateRadius(0.5).updatePositionVertex(newPositionColorVertex[0]);

    if (bacteria.radius > LOSE_SIZE) {
      loseConditionCount++;
      thresholdPoints_flag = true;
    }
  });

  if (loseConditionCount > 1) {
    state.game = false;
    state.textContent = "You Lose!";
  }

  if (thresholdPoints_flag) {
    if (!bacteriaOverThreshold_flag) {
      bacteriaOverThreshold_flag = true;
      updateScore(500);
    }
  } else bacteriaOverThreshold_flag = false;
};

/**
 * draws the given positionVertex[] and colorVertex[] to the screen
 * @param {Array} positionVertex
 * @param {Array} colorVertex
 */
const draw = function (positionVertex, colorVertex) {
  webgl.draw(positionVertex, colorVertex);
};

/**
 * resets the display to show just the intial circle playing field
 */
const resetDisplay = function () {
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const intialGameCircle = createCirclePositionColorVertex(
    0,
    0,
    GAME_CIRCLE_SIZE,
    1,
    1,
    1,
    false
  );
  draw(intialGameCircle[0], intialGameCircle[1]);
};

/**
 * Checks for bacteria "touching" in state.bacteriaArray
 */
const checkForCircleConflict = function () {
  state.bacteriaArray.forEach((firstBacteria, i, arr) => {
    for (let j = i + 1; j < arr.length; j++) {
      let secondBacteria = arr[j];
      if (secondBacteria) {
        let bool =
          Math.pow(firstBacteria.x - secondBacteria.x, 2) +
            Math.pow(firstBacteria.y - secondBacteria.y, 2) <
          Math.pow(firstBacteria.radius + secondBacteria.radius, 2);
        if (bool) state.bacteriaArray.splice(j, 1);
      }
    }
  });
};

/**
 *
 */
const drawParticles_efficient = function () {
  if (state.particleArray.length === 0) return;
  let positionVertex = [];
  let colorVertex = [];
  let indicesArray = [];
  state.particleArray.forEach((particle, i) => {
    colorVertex.push(particle.r);
    colorVertex.push(particle.g);
    colorVertex.push(particle.b);
    positionVertex.push(particle.x / GAME_SIZE_X);
    positionVertex.push(particle.y / GAME_SIZE_Y);
    indicesArray.push(i);
  });

  // bind position
  webgl.drawParticles(positionVertex, colorVertex, indicesArray);
};

//-----------------------------------------------------------------------//
// Game loop
const updateUI = function () {
  gameView.setHighscore(state.highscore);
  gameView.setScore(state.score);
  gameView.setTextcontent(state.textContent);
};
resetDisplay();
setInterval(function () {
  updateUI();
  resetDisplay();
  if (state.game) {
    attemptBacteriaCreation();
    checkForCircleConflict();
    updateBacteria();
  }
  updateParticles();
}, 33);
