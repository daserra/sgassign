import { Application, Assets, Container } from "pixi.js";
import { TaskController } from "../tasks/TaskController";
import { AceOfShadowsController } from "../tasks/AceOfShadowsController";
import { Stage } from "@pixi/layers";
import { MagicWordsController } from "../tasks/MagicWordsController";
import { PhoenixFlameController } from "../tasks/PhoenixFlameController";

export enum Task {
  ACE_OF_SHADOWS,
  MAGIC_WORDS,
  PHOENIX_FLAME,
}

export class GameManager {
  private readonly _tasksControllers: Record<Task, TaskController>;
  private readonly _application: Application;
  private _currentActiveTask: Task | undefined;
  private _uiContainer: Container;
  private _taskContainer: Container;

  constructor() {
    this._application = new Application({
      width: 1920,
      height: 1080,
      backgroundColor: 0x292826, // optional
    });

    this._application.stage = new Stage(); //Required for Layer library to works properly

    document
      .getElementById("mainDiv")
      ?.appendChild(this._application.view as HTMLCanvasElement);

    this._tasksControllers = {
      [Task.ACE_OF_SHADOWS]: new AceOfShadowsController(),
      [Task.MAGIC_WORDS]: new MagicWordsController(),
      [Task.PHOENIX_FLAME]: new PhoenixFlameController(),
    };

    this._taskContainer = new Container();
    this._application.stage.addChild(this._taskContainer);
    this._uiContainer = new Container();
    this._application.stage.addChild(this._uiContainer);
  }

  goFullScreen() {
    const canvas = this._application.view as HTMLCanvasElement;
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  }

  async loadAssets(assets: Record<string, string>) {
    const assetsKeys: string[] = [];
    Object.keys(assets).forEach((assetKey) => {
      assetsKeys.push(assetKey);
      Assets.add({ alias: assetKey, src: assets[assetKey] });
    });

    await Assets.load(assetsKeys);
  }

  async loadTask(task: Task) {
    if (this._currentActiveTask !== undefined) {
      await this._tasksControllers[this._currentActiveTask].closeTask();
      this._taskContainer.removeChildren();
    }
    this._currentActiveTask = task;
    const taskController = this._tasksControllers[this._currentActiveTask];
    await taskController.loadTask();
    this.taskContainer.addChild(taskController.view);
  }

  get globalTicker() {
    return this._application.ticker;
  }

  get taskContainer() {
    return this._taskContainer;
  }

  get uiContainer() {
    return this._uiContainer;
  }
}
