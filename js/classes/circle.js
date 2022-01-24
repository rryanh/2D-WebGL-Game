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
export default class Circle {
  constructor(positionVertex, colorVertex, x, y, radius, r, g, b, gameSizeX) {
    this.positionVertex = positionVertex;
    this.colorVertex = colorVertex;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.r = r;
    this.g = g;
    this.b = b;
    this.gameSizeX = gameSizeX;
  }
  updatePositionVertex = function (positionVertex) {
    this.positionVertex = positionVertex;
    return this;
  };
  updateRadius = function (radiusMultiplier) {
    if (this.radius + radiusMultiplier < this.gameSizeX * 0.6) {
      this.radius = this.radius + radiusMultiplier;
    }
    return this;
  };
}
