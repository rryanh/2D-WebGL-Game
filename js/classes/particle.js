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
export default class Particle {
  constructor(x, y, vX, vY, r, g, b) {
    this.x = x;
    this.y = y;
    this.vX = vX;
    this.vY = vY;
    this.r = r;
    this.g = g;
    this.b = b;
    this.iteration = 0;
    this.maxIteration = Math.random() * Math.random() * 95 + 5;
  }
  updateIteration = function () {
    this.iteration++;
    this.x += this.vX;
    this.y += this.vY;
    return this;
  };
}
