import { Text } from "pixi.js";
import { gameManager } from "../index";

export class FPSMeter {
  private readonly _fpsView: Text;
  private _lastUpdateTime = performance.now();
  private _frameCount = 0;

  constructor() {
    this._fpsView = new Text("FPS: ", {
      fontFamily: "Arial",
      fontSize: 30,
      fill: 0xffffff,
      align: "left",
    });
    this._fpsView.position.set(20, 120);
    gameManager.globalTicker.add(this.update.bind(this));
  }

  get view() {
    return this._fpsView;
  }

  private update() {
    this._frameCount++;
    const now = performance.now();
    if (now - this._lastUpdateTime >= 1000) {
      //it's being 1 sec or more
      this._fpsView.text = `FPS: ${this._frameCount}`;
      this._frameCount = 0;
      this._lastUpdateTime = now;
    }
  }
}
