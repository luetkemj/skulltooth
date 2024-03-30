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
  layer100: {},
  isBlocking: {},
  isOpaque: {},
};

export const being: Components = {
  layer200: {},
  isBlocking: {},
};

export const mob: Components = {
  ai: {},
  pathThrough: {},
};
