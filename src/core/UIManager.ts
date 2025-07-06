import { Container, IPointData, Text } from "pixi.js";
import { Task } from "./GameManager";
import { gameManager } from "../index";
import { FPSMeter } from "./FpsMeter";

enum BUTTON_STATE {
  ACTIVE = "active",
  DEACTIVATED = "deactivated",
}

export class UIManager {
  private readonly _taskButtons: Text[] = [];

  constructor(private readonly _uiView: Container) {}

  addTaskButton(name: string, task: Task, position: IPointData): void {
    const button = this.createButton(
      name,
      this.onButtonTaskClicked.bind(this, task)
    );
    this._taskButtons.push(button);
    button.position.set(position.x, position.y);
    this._uiView.addChild(button);
  }

  private async onButtonTaskClicked(task: Task) {
    this.changeAllButtonsState(BUTTON_STATE.DEACTIVATED);
    await gameManager.loadTask(task);
    this.changeAllButtonsState(BUTTON_STATE.ACTIVE);
  }

  private changeAllButtonsState(state: BUTTON_STATE) {
    this._taskButtons.forEach((button) => {
      const isActive = state === BUTTON_STATE.ACTIVE;
      button.eventMode = isActive ? "static" : "none";
      button.style.fill = isActive ? 0xffffff : 0x8a8787;
    });
  }

  private createButton(name: string, onClick: () => void) {
    const button = new Text(name, {
      fontFamily: "Arial",
      fontSize: 30,
      fill: 0xffffff,
      align: "left",
    });
    button.cursor = "pointer";
    button.eventMode = "static";
    button.on("pointerdown", onClick);
    return button;
  }

  createFpsMeter() {
    const meter = new FPSMeter();
    this._uiView.addChild(meter.view);
  }

  private fpsUpdate() {}
}
