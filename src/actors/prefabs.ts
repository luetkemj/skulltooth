import { Components } from "../engine";

export const renderable: Components = {
  appearance: {
    char: "?",
    tint: 0x333333,
    tileSet: "ascii",
  },
  position: { x: 0, y: 0, z: 0 },
};

export const tile: Components = {
  layer100: {},
};

export const blockingTile: Components = {
  isBlocking: {},
  isOpaque: {},
  layer100: {},
};

export const being: Components = {
  health: {
    max: 10,
    current: 10,
  },
  isBlocking: {},
  layer200: {},
};

export const mob: Components = {
  ai: {},
  pathThrough: {},
};
