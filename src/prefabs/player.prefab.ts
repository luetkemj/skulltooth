import { addComponent, createEntity } from "../engine";
import { WId } from "../engine/index.types";

export const createPlayer = (wId: WId) => {
  const entity = createEntity({ wId });
  addComponent(entity.id, {
    appearance: {
      char: "@",
      tint: 0xff0088,
      tileSet: "ascii",
    },
    isPlayer: {},
    position: { x: 0, y: 0, z: 0 },
  });
};
