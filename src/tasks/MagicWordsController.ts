import { TaskController } from "./TaskController";
import { Container, Graphics, ITextStyle, Sprite, Text } from "pixi.js";
import { sleepInMs } from "../Utils";

enum AVATAR_POSITION {
  LEFT = "left",
  RIGHT = "right",
}

interface DialogSettings {
  dialogue: Array<{ name: string; text: string }>;
  emojies: Array<{ name: string; url: string }>;
  avatars: Array<{ name: string; url: string; position: AVATAR_POSITION }>;
}

interface MagicWordSettings {
  dialogTextStyle: Partial<ITextStyle>;
  dialogLineMaxWidth: number;
  timeBeforeRenderingNextCharacter: number;
}

export class MagicWordsController implements TaskController {
  private readonly _view: Container;
  private _dialogBar: Graphics;
  private _abortController: AbortController | undefined;
  private _dialogSettings: DialogSettings = {
    avatars: [],
    emojies: [],
    dialogue: [],
  };
  private readonly _taskSettings: MagicWordSettings = {
    dialogTextStyle: {
      fontFamily: "Arial",
      fontSize: 40,
      fill: 0x292826, // white color
      align: "left",
    },
    dialogLineMaxWidth: 600,
    timeBeforeRenderingNextCharacter: 50,
  };

  constructor() {
    this._view = new Container();
    this._dialogBar = new Graphics();
    this._dialogBar.lineStyle(4, 0x0099ff, 1);
    this._dialogBar.beginFill(0xffffff);
    this._dialogBar.drawRoundedRect(0, 0, 900, 250, 20);
    this._dialogBar.endFill();
    this._dialogBar.position.set(150, 300);
    this.view.addChild(this._dialogBar);
  }

  get view() {
    return this._view;
  }

  async closeTask() {
    this._abortController?.abort();
    this._dialogBar.removeChildren();
  }

  async loadTask() {
    await this.loadConfig();
    this.startDialogue();
  }

  private async loadConfig() {
    this._abortController = new AbortController();
    const response = await fetch(
      "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords"
    );
    this._dialogSettings = (await response.json()) as DialogSettings;
  }

  private async startDialogue() {
    const avatars = this._dialogSettings.avatars.reduce(
      (avatars, { name, position, url }) => {
        avatars[name] = { sprite: Sprite.from(url), position };
        return avatars;
      },
      {} as Record<string, { sprite: Sprite; position: AVATAR_POSITION }>
    );

    const nameLabel = new Text("", {
      fontFamily: "Arial",
      fontSize: 20,
      fill: 0x292826, // white color
      align: "center",
    });
    nameLabel.position.set(26, 130);

    for (const dialog of this._dialogSettings.dialogue) {
      if (this._abortController?.signal.aborted) break;
      if (avatars[dialog.name]) {
        const { sprite, position } = avatars[dialog.name];
        this._dialogBar.addChild(sprite);
        if (position === AVATAR_POSITION.RIGHT) {
          sprite.position.set(700, -100);
        } else {
          sprite.position.set(80, -100);
        }
        sprite.addChild(nameLabel);
        nameLabel.text = dialog.name;
      }
      await this.writeDialog(dialog.text);
      if (this._abortController?.signal.aborted) break;
      await sleepInMs(3000);
      this._dialogBar.removeChildren();
    }
  }

  private async writeDialog(dialog: string) {
    const characters = dialog.split("");

    const firstLine = new Text("", this._taskSettings.dialogTextStyle);
    firstLine.position.set(40, 100);

    this._dialogBar.addChild(firstLine);
    let currentLine = firstLine;

    let parsingEmoji = false;
    let emojiName = "";

    for (
      let characterIndex = 0;
      characterIndex < characters.length;
      characterIndex++
    ) {
      if (this._abortController?.signal.aborted) {
        break;
      }

      //is start of emoji
      if (characters[characterIndex] === "{") {
        parsingEmoji = true;
        continue;
      } else if (characters[characterIndex] === "}") {
        const emoji = this.createEmojiByName(emojiName);
        if (emoji) {
          this._dialogBar.addChild(emoji);
          emoji.position.set(
            currentLine.x + currentLine.width + 5, // adds 5 space after current line for fitting the emoji
            currentLine.y
          );
          currentLine.text += "     "; //consider the emoji space as part of current line so next line continue from emoji
        }
        parsingEmoji = false;

        continue;
      } else if (parsingEmoji) {
        emojiName += characters[characterIndex];
        continue;
      }

      currentLine.text += characters[characterIndex];
      if (
        currentLine.width >= this._taskSettings.dialogLineMaxWidth &&
        characters[characterIndex + 1] === " " //break line only when a space is found
      ) {
        characters[characterIndex + 1] = ""; //the next space character can be ignored when breaking line
        const newLine = new Text("", this._taskSettings.dialogTextStyle);
        newLine.x = currentLine.x;
        newLine.y = currentLine.y + currentLine.height;
        currentLine = newLine;
        this._dialogBar.addChild(newLine);
      }
      await sleepInMs(this._taskSettings.timeBeforeRenderingNextCharacter);
    }
  }

  private createEmojiByName(name: string) {
    const emojiData = this._dialogSettings.emojies.find(
      (emoji) => emoji.name === name
    );

    if (!emojiData) return null;

    const emoji = Sprite.from(emojiData.url);
    emoji.scale.set(0.3);
    return emoji;
  }
}
