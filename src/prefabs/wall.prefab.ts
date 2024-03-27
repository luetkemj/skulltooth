import { addComponent, createEntity } from "../engine";
import { WId } from "../engine/index.types";

export const createWall = (wId: WId) => {
  const entity = createEntity({ wId });
  return addComponent(entity.id, {
    appearance: {
      char: "#",
      tint: 0x808080,
      tileSet: "ascii",
    },
    position: { x: 0, y: 0, z: 0 },
    isBlocking: {},
    layer100: {},
    isOpaque: {},
  });
};
