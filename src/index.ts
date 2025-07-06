import { GameManager, Task } from "./core/GameManager";
import {
  fireCoreEmitterConfig,
  fireEmberEmitterConfig,
  fireSmokeEmitterConfig,
} from "./Utils";
import { Assets } from "pixi.js";
import { UIManager } from "./core/UIManager";

export const gameManager = new GameManager();

async function bootstrap() {
  await gameManager.loadAssets({
    cardtop: "./assets/images/card_top.png",
    cardfront: "./assets/images/card_front.png",
    island: "./assets/images/island.png",
    fireCore: "./assets/images/fireCore.png",
    fireSmoke: "./assets/images/fireSmoke.png",
    ember: "./assets/images/ember.png",
  });

  //Assigned loaded textures to the particles configs
  fireCoreEmitterConfig.behaviors.push({
    type: "textureSingle",
    config: {
      texture: Assets.get("fireCore"),
    },
  });

  fireEmberEmitterConfig.behaviors.push({
    type: "textureSingle",
    config: {
      texture: Assets.get("ember"),
    },
  });

  fireSmokeEmitterConfig.behaviors.push({
    type: "textureSingle",
    config: {
      texture: Assets.get("fireSmoke"),
    },
  });

  await gameManager.loadTask(Task.PHOENIX_FLAME);

  const uiManager = new UIManager(gameManager.uiContainer);
  uiManager.addTaskButton("Ace of Shadows", Task.ACE_OF_SHADOWS, {
    x: 100,
    y: 100,
  });
  uiManager.addTaskButton("Magic Words", Task.MAGIC_WORDS, {
    x: 100,
    y: 150,
  });
  uiManager.addTaskButton("Phoenix Flame", Task.PHOENIX_FLAME, {
    x: 100,
    y: 200,
  });
}

bootstrap();
