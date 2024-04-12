import { Components } from "../engine";

export const renderable: Components = {
  appearance: {
    char: "?",
    tint: 0x333333,
    tileSet: "ascii",
  },
  position: { x: 0, y: 0, z: 0 },
  name: "unnamed",
};

export const tile: Components = {
  layer: 100,
  name: "unnamed",
};

export const blockingTile: Components = {
  isBlocking: {},
  isOpaque: {},
  layer: 101,
  name: "unnamed",
};

export const being: Components = {
  health: {
    max: 10,
    current: 10,
  },
  isBlocking: {},
  layer: 201,
  name: "unnamed",
  legendable: {},
  activeEffects: [],
};

export const item: Components = {
  layer: 200,
  legendable: {},
  pickup: {},
};

export const mob: Components = {
  ai: {},
  pathThrough: {},
  legendable: {},
};
