class GameView {
  score = document.querySelector(".score");
  highscore = document.querySelector(".highscore");
  resetButton = document.querySelector(".reset");
  startButton = document.querySelector(".start");
  lose = document.querySelector(".lose");
  mainGame = document.getElementById("main-game");

  addHanderStartBtn(handler) {
    this.startButton.addEventListener("click", handler);
  }
  addHandlerResetBtn(handler) {
    this.resetButton.addEventListener("click", handler);
  }

  addHandlerMainGameClick(handler) {
    this.mainGame.addEventListener("click", handler);
  }

  setHighscore(text) {
    this.highscore.textContent = `${text}`;
  }

  setScore(text) {
    this.score.textContent = text;
  }
  // TODO: rename this
  setTextcontent(text) {
    this.lose.textContent = text;
  }
}

export default new GameView();
