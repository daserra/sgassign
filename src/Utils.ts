import { EmitterConfigV3 } from "@pixi/particle-emitter";

export function sleepInMs(sleepTime: number) {
  return new Promise((resolve) => setTimeout(resolve, sleepTime));
}

export const fireCoreEmitterConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.8,
    max: 1,
  },
  frequency: 0.001,
  emitterLifetime: -1,
  maxParticles: 1000,
  addAtBack: false,
  pos: {
    x: 0,
    y: 0,
  },
  behaviors: [
    {
      type: "alpha",
      config: {
        alpha: {
          list: [
            {
              value: 0.22916666666666663,
              time: 0,
            },
            {
              value: 0,
              time: 1,
            },
          ],
        },
      },
    },
    {
      type: "color",
      config: {
        color: {
          list: [
            {
              value: "#ff622c",
              time: 0,
            },
            {
              value: "#ad370c",
              time: 1,
            },
          ],
        },
      },
    },
    {
      type: "scale",
      config: {
        scale: {
          list: [
            {
              value: 0.463157894736842,
              time: 0,
            },
            {
              value: 0.22894736842105268,
              time: 1,
            },
          ],
          isStepped: false,
        },
        minMult: 2,
      },
    },
    {
      type: "moveAcceleration",
      config: {
        accel: {
          x: 0,
          y: 0,
        },
        minStart: 0,
        maxStart: 0,
        rotate: true,
      },
    },
    {
      type: "moveSpeed",
      config: {
        speed: {
          list: [
            {
              value: 56.315789473684205,
              time: 0,
            },
            {
              value: 152.63157894736835,
              time: 1,
            },
          ],
        },
        minMult: 0.5,
      },
    },
    {
      type: "rotation",
      config: {
        minStart: 265,
        maxStart: 275,
        minSpeed: 30,
        maxSpeed: 45,
        accel: 20,
      },
    },
    {
      type: "spawnShape",
      config: {
        type: "polygonalChain",
        data: [
          [
            {
              x: 8,
              y: 0,
            },
            {
              x: -10,
              y: -14,
            },
            {
              x: 67,
              y: -32,
            },
          ],
          [
            {
              x: 84,
              y: -11,
            },
            {
              x: 10,
              y: 0,
            },
            {
              x: 20,
              y: -53,
            },
          ],
        ],
      },
    },
    {
      type: "blendMode",
      config: {
        blendMode: "add",
      },
    },
  ],
};
export const fireEmberEmitterConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.8,
    max: 1.2,
  },
  frequency: 0.01,
  emitterLifetime: -1,
  maxParticles: 10,
  addAtBack: false,
  pos: {
    x: 0,
    y: 0,
  },
  behaviors: [
    {
      type: "alphaStatic",
      config: {
        alpha: 1,
      },
    },
    {
      type: "color",
      config: {
        color: {
          list: [
            {
              value: "#e89405",
              time: 0,
            },
            {
              value: "#ee5000",
              time: 0.31,
            },
            {
              value: "#1f1f1f",
              time: 0.73,
            },
            {
              value: "#000000",
              time: 1,
            },
          ],
        },
      },
    },
    {
      type: "scale",
      config: {
        scale: {
          list: [
            {
              value: 0.2,
              time: 0,
            },
            {
              value: 0.044736842105263186,
              time: 1,
            },
          ],
          isStepped: false,
        },
        minMult: 1,
      },
    },
    {
      type: "moveAcceleration",
      config: {
        accel: {
          x: 0,
          y: 0,
        },
        minStart: 600,
        maxStart: 600,
        rotate: true,
      },
    },
    {
      type: "moveSpeed",
      config: {
        speed: {
          list: [
            {
              value: 201.05263157894737,
              time: 0,
            },
            {
              value: 218.42105263157885,
              time: 1,
            },
          ],
        },
        minMult: 0.5,
      },
    },
    {
      type: "rotationStatic",
      config: {
        min: 250,
        max: 290,
      },
    },
    {
      type: "spawnShape",
      config: {
        type: "torus",
        data: {
          x: 0,
          y: 0,
          radius: 50,
          innerRadius: 10,
          rotation: true,
        },
      },
    },
    {
      type: "blendMode",
      config: {
        blendMode: "add",
      },
    },
  ],
};
export const fireSmokeEmitterConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.8,
    max: 1.5,
  },
  frequency: 0.01,
  emitterLifetime: -1,
  maxParticles: 200,
  addAtBack: false,
  pos: {
    x: 0,
    y: 0,
  },
  behaviors: [
    {
      type: "alpha",
      config: {
        alpha: {
          list: [
            {
              value: 0.22916666666666663,
              time: 0,
            },
            {
              value: 0,
              time: 1,
            },
          ],
        },
      },
    },
    {
      type: "colorStatic",
      config: {
        color: "#575757",
      },
    },
    {
      type: "scale",
      config: {
        scale: {
          list: [
            {
              value: 0.8052631578947369,
              time: 0,
            },
            {
              value: 0.2947368421052632,
              time: 1,
            },
          ],
          isStepped: false,
        },
        minMult: 1,
      },
    },
    {
      type: "moveAcceleration",
      config: {
        accel: {
          x: 0,
          y: 0,
        },
        minStart: 600,
        maxStart: 600,
        rotate: true,
      },
    },
    {
      type: "moveSpeed",
      config: {
        speed: {
          list: [
            {
              value: 108.94736842105269,
              time: 0,
            },
            {
              value: 47.368421052631504,
              time: 1,
            },
          ],
        },
        minMult: 0.5,
      },
    },
    {
      type: "rotation",
      config: {
        minStart: 270,
        maxStart: 270,
        minSpeed: 30,
        maxSpeed: 45,
        accel: 20,
      },
    },
    {
      type: "spawnShape",
      config: {
        type: "torus",
        data: {
          x: 0,
          y: 0,
          radius: 50,
          innerRadius: 10,
          rotation: true,
        },
      },
    },
    {
      type: "blendMode",
      config: {
        blendMode: "normal",
      },
    },
  ],
};
