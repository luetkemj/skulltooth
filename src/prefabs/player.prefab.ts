import { addComponent, createEntity } from "../engine";
import { WId } from "../engine/index.types";
import { addEAP } from "../main";
import { Pos } from "../lib/grid";

export const createPlayer = (wId: WId, position: Pos) => {
  const entity = createEntity({ wId });
  addComponent(entity.id, {
    appearance: {
      char: "@",
      tint: 0xff0088,
      tileSet: "ascii",
    },
    isPlayer: {},
    position, 
    layer200: {},
    isBlocking: {},
  });
  addEAP(entity);
  return entity
};
