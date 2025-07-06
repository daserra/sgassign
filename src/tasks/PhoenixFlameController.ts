import { TaskController } from "./TaskController";
import { Assets, Container, Filter, Sprite, TickerCallback } from "pixi.js";
import { gameManager } from "../index";
import { Emitter } from "@pixi/particle-emitter";
import {
  fireCoreEmitterConfig,
  fireEmberEmitterConfig,
  fireSmokeEmitterConfig,
} from "../Utils";

export class PhoenixFlameController implements TaskController {
  private readonly _view: Container;
  private readonly _flickerSettings = {
    flickerCurrent: 0.8,
    flickerTarget: 1.0,
    radiusCurrent: 0.35,
    radiusTarget: 0.35,
    flickerTimer: 0,
    nextFlickerTime: 0,
  };
  private _flickerEffectHandler: TickerCallback<any> | undefined;
  private _activeEmitters: Emitter[] = [];

  constructor() {
    this._view = new Container();
    this._view.eventMode = "none";
  }

  get view() {
    return this._view;
  }

  async closeTask() {
    if (this._flickerEffectHandler) {
      gameManager.globalTicker.remove(this._flickerEffectHandler);
      this._flickerEffectHandler = undefined;
      this._activeEmitters.forEach((emitter) => emitter.destroy());
      this._activeEmitters = [];
      this._view.removeChildren();
    }
  }

  async loadTask() {
    const background = new Sprite(Assets.get("island"));
    this._view.addChild(background);

    this.createLightEffect(background);

    this.createParticles();
  }

  private createLightEffect(background: Sprite) {
    const fragment = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float radius;
uniform float strength;
uniform vec2 center;     // centro do brilho
uniform vec3 glowColor;  // cor do brilho (RGB, 0~1)

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);

    float dist = distance(vTextureCoord, center);
    float glow = smoothstep(radius, 0.0, dist) * strength;

    // Efeito aditivo: cor original + glow color
    vec3 result = color.rgb + glow * glowColor;

    gl_FragColor = vec4(result, color.a);
}
`;

    const centerBrightFilter = new Filter(undefined, fragment, {
      radius: 0.25,
      strength: 0.6,
      center: [0.3, 0.53], // Centro mais à esquerda (x = 0.35, y = 0.5)
      glowColor: [1.0, 0.6, 0.1], // Laranja fogo (RGB: 255,153,26)
    });

    background.filters = [centerBrightFilter];

    this._flickerEffectHandler = this.animateFirelight.bind(
      this,
      centerBrightFilter
    );
    gameManager.globalTicker.add(this._flickerEffectHandler);
  }

  private createParticles() {
    const coreEmitter = new Emitter(this.view, fireCoreEmitterConfig);
    coreEmitter.emit = true;
    coreEmitter.autoUpdate = true;
    coreEmitter.updateSpawnPos(570, 560);
    this._activeEmitters.push(coreEmitter);

    const emberEmitter = new Emitter(this.view, fireEmberEmitterConfig);
    emberEmitter.emit = true;
    emberEmitter.autoUpdate = true;
    emberEmitter.updateSpawnPos(590, 520);
    this._activeEmitters.push(emberEmitter);

    const smokeEmitter = new Emitter(this.view, fireSmokeEmitterConfig);
    smokeEmitter.emit = true;
    smokeEmitter.autoUpdate = true;
    smokeEmitter.updateSpawnPos(600, 380);
    this._activeEmitters.push(smokeEmitter);
  }

  private animateFirelight(centerBrightFilter: any) {
    this._flickerSettings.flickerTimer +=
      gameManager.globalTicker.deltaMS / 1000;

    if (
      this._flickerSettings.flickerTimer > this._flickerSettings.nextFlickerTime
    ) {
      // New targets for all
      this._flickerSettings.flickerTarget = 0.8 + Math.random() * 0.2; // strength
      this._flickerSettings.radiusTarget = 0.3 + Math.random() * 0.04; // radius (size of glow)

      this._flickerSettings.flickerTimer = 0;
      this._flickerSettings.nextFlickerTime = 0.15 + Math.random() * 0.2;
    }

    // Lerp for smoothness
    this._flickerSettings.flickerCurrent +=
      (this._flickerSettings.flickerTarget -
        this._flickerSettings.flickerCurrent) *
      0.1;
    this._flickerSettings.radiusCurrent +=
      (this._flickerSettings.radiusTarget -
        this._flickerSettings.radiusCurrent) *
      0.1;

    // Apply to filter
    centerBrightFilter.uniforms.strength = this._flickerSettings.flickerCurrent;
    centerBrightFilter.uniforms.radius = this._flickerSettings.radiusCurrent;
  }
}
