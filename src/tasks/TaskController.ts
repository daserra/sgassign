import { Container } from "pixi.js";

export interface TaskController {
  view: Container;
  loadTask(): Promise<void>;
  closeTask(): Promise<void>;
}
