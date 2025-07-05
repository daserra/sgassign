import { GameManager, Task } from "./core/GameManager";

export const gameManager = new GameManager();

async function bootstrap() {
  await gameManager.loadAssets({
    cardtop: "./assets/images/card_top.png",
    cardfront: "./assets/images/card_front.png",
  });

  await gameManager.loadTask(Task.ACE_OF_SHADOWS);
}

bootstrap();
