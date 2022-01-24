class WebGL {
  #canvas = document.querySelector("#main-game");
  #gl = this.#canvas.getContext("webgl");
  #positionBuff;
  #colorBuff;
  #indicesBuff;
  #vertexShader;
  /** @type {WebGLRenderingContext} */
  constructor() {
    this.#gl = this.#canvas.getContext("webgl");
    if (this.#gl === null) alert("Unable to initialize WebGL");

    this.#gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);

    this.#positionBuff = this.#gl.createBuffer();
    this.#colorBuff = this.#gl.createBuffer();
    this.#indicesBuff = this.#gl.createBuffer();
    this.#vertexShader = this.#gl.createShader(this.#gl.VERTEX_SHADER);

    this.#gl.shaderSource(
      this.#vertexShader,
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

    this.#gl.compileShader(this.#vertexShader);

    const fragmentShader = this.#gl.createShader(this.#gl.FRAGMENT_SHADER);

    this.#gl.shaderSource(
      fragmentShader,
      `
          precision mediump float;
            varying vec3 varyingColor;
            void main() {
                gl_FragColor = vec4(varyingColor, 1);
            }
            `
    );
    this.#gl.compileShader(fragmentShader);

    const program = this.#gl.createProgram();
    this.#gl.attachShader(program, this.#vertexShader);
    this.#gl.attachShader(program, fragmentShader);
    this.#gl.linkProgram(program);

    // for position
    const positionLocation = this.#gl.getAttribLocation(program, `position`);
    this.#gl.enableVertexAttribArray(positionLocation);
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#positionBuff);
    this.#gl.vertexAttribPointer(
      positionLocation,
      2,
      this.#gl.FLOAT,
      false,
      0,
      0
    );

    //for color
    const colorLocation = this.#gl.getAttribLocation(program, `color`);
    this.#gl.enableVertexAttribArray(colorLocation);
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#colorBuff);
    this.#gl.vertexAttribPointer(colorLocation, 3, this.#gl.FLOAT, false, 0, 0);

    this.#gl.useProgram(program);
  }

  draw(positionVertex, colorVertex) {
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#positionBuff);
    this.#gl.bufferData(
      this.#gl.ARRAY_BUFFER,
      new Float32Array(positionVertex),
      this.#gl.DYNAMIC_DRAW
    );
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#colorBuff);
    this.#gl.bufferData(
      this.#gl.ARRAY_BUFFER,
      new Float32Array(colorVertex),
      this.#gl.DYNAMIC_DRAW
    );
    this.#gl.drawArrays(this.#gl.TRIANGLE_FAN, 0, 362);
  }

  drawParticles(positionVertex, colorVertex, indicesArray) {
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#positionBuff);
    this.#gl.bufferData(
      this.#gl.ARRAY_BUFFER,
      new Float32Array(positionVertex),
      this.#gl.STATIC_DRAW
    );
    // bind color
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#colorBuff);
    this.#gl.bufferData(
      this.#gl.ARRAY_BUFFER,
      new Float32Array(colorVertex),
      this.#gl.STATIC_DRAW
    );

    // bind indices
    this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, this.#indicesBuff);
    this.#gl.bufferData(
      this.#gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indicesArray),
      this.#gl.STATIC_DRAW
    );

    this.#gl.drawElements(
      this.#gl.POINTS,
      indicesArray.length,
      this.#gl.UNSIGNED_SHORT,
      0
    );
  }
}

export default new WebGL();
