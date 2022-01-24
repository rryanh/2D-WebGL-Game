import gameView from "../view/view";
import * as model from "../model/model";

const controlStartBtn = function () {
  model.startGame();
};

const controlResetBtn = function () {
  model.resetGame();
  gameView.setTextcontent(model.state.textContent);
};

const controlMainGameCLick = function (e) {
  model.getPosition(e);
};

const init = function () {
  gameView.addHanderStartBtn(controlStartBtn);
  gameView.addHandlerResetBtn(controlResetBtn);
  gameView.addHandlerMainGameClick(controlMainGameCLick);
};

init();
