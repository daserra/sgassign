import { Application, Assets } from "pixi.js";
import { TaskController } from "../tasks/TaskController";
import { AceOfShadowsController } from "../tasks/AceOfShadowsController";
import { Stage } from "@pixi/layers";
import { MagicWordsController } from "../tasks/MagicWordsController";

export enum Task {
  ACE_OF_SHADOWS,
  MAGIC_WORDS,
  PHOENIX_FLAME,
}

export class GameManager {
  private readonly _tasksControllers: Record<Task, TaskController>;
  private readonly _application: Application;

  constructor() {
    this._application = new Application({
      width: 1920,
      height: 1080,
      backgroundColor: 0x292826, // optional
    });

    this._application.stage = new Stage();
    document
      .getElementById("mainDiv")
      ?.appendChild(this._application.view as HTMLCanvasElement);

    this._tasksControllers = {
      [Task.ACE_OF_SHADOWS]: new AceOfShadowsController(),
      [Task.MAGIC_WORDS]: new MagicWordsController(),
      [Task.PHOENIX_FLAME]: new AceOfShadowsController(),
    };
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
    const taskController = this._tasksControllers[task];
    await taskController.loadTask();
    this._application.stage.addChild(taskController.view);
  }
}
