import { TaskController } from "./TaskController";
import { Assets, Container, IPointData, Sprite } from "pixi.js";
import { sleepInMs } from "../Utils";
import { Layer } from "@pixi/layers";
import gsap from "gsap";

enum MOVEMENT_DIRECTION {
  LEFT_TO_RIGHT,
  RIGHT_TO_LEFT,
}

interface AceOfShadowsSettings {
  numberOfCards: number;
  movementDurationInSeconds: number;
  leftStackInitialPosition: IPointData;
  rightStackInitialPosition: IPointData;
}

export class AceOfShadowsController implements TaskController {
  private readonly _view: Container;
  private _abortController: AbortController | undefined;
  private _currentTween: gsap.core.Tween | undefined;
  private _layer = new Layer();
  private _leftStack: Sprite[] = [];
  private _rightStack: Sprite[] = [];
  private readonly _taskSettings: AceOfShadowsSettings = {
    numberOfCards: 144,
    movementDurationInSeconds: 2,
    leftStackInitialPosition: { x: 100, y: 300 },
    rightStackInitialPosition: { x: 600, y: 300 },
  };

  constructor() {
    this._view = new Container();
    this._view.addChild(this._layer);
    this._layer.group.enableSort = true;
  }

  get view() {
    return this._view;
  }

  async closeTask() {
    if (!this._abortController?.signal.aborted) {
      this._abortController?.abort();
    }
    this._currentTween?.kill();
    this.view.removeChildren();
    this._abortController = undefined;
    this._leftStack = [];
    this._rightStack = [];
  }

  async loadTask() {
    this.setupCards();
    this._abortController = new AbortController();
    this.moveCards(MOVEMENT_DIRECTION.LEFT_TO_RIGHT);
  }

  private setupCards() {
    const { leftStackInitialPosition, numberOfCards } = this._taskSettings;

    for (let cardIndex = 0; cardIndex <= numberOfCards; cardIndex++) {
      const cardSprite = new Sprite(Assets.get("cardfront"));
      cardSprite.parentLayer = this._layer;
      this.view.addChild(cardSprite);
      cardSprite.position.set(
        leftStackInitialPosition.x + cardIndex,
        leftStackInitialPosition.y - cardIndex
      );
      this._leftStack.push(cardSprite);
    }
  }

  private async moveCards(movementDirection: MOVEMENT_DIRECTION) {
    const { rightStackInitialPosition, leftStackInitialPosition } =
      this._taskSettings;
    if (movementDirection === MOVEMENT_DIRECTION.LEFT_TO_RIGHT) {
      await this.emptyStack(
        this._leftStack,
        this._rightStack,
        rightStackInitialPosition
      );
    } else {
      await this.emptyStack(
        this._rightStack,
        this._leftStack,
        leftStackInitialPosition
      );
    }
    const nextDirection =
      movementDirection === MOVEMENT_DIRECTION.RIGHT_TO_LEFT
        ? MOVEMENT_DIRECTION.LEFT_TO_RIGHT
        : MOVEMENT_DIRECTION.RIGHT_TO_LEFT;

    if (!this._abortController?.signal.aborted)
      await this.moveCards(nextDirection);
  }

  private async emptyStack(
    fromStack: Sprite[],
    toStack: Sprite[],
    finalPosition: IPointData
  ) {
    const { movementDurationInSeconds } = this._taskSettings;
    let cardMovedIndex = 0;
    while (fromStack.length > 0 && !this._abortController?.signal.aborted) {
      const card = fromStack.pop();
      if (card) {
        card.zOrder = 1000;
        this._currentTween = gsap.to(card, {
          x: finalPosition.x + cardMovedIndex,
          y: finalPosition.y - cardMovedIndex,
          duration: movementDurationInSeconds,
        });
        await this._currentTween;
        card.zOrder = cardMovedIndex;
        toStack.push(card);
      }
      cardMovedIndex += 1;
      await sleepInMs(1000);
    }
  }
}
