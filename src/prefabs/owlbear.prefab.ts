import { addComponent, createEntity } from "../engine";
import { WId } from "../engine/index.types";
import { addEAP } from "../main";
import { Pos } from "../lib/grid";

export const createOwlbear = (wId: WId, position: Pos) => {
  const entity = createEntity({ wId });
  addComponent(entity.id, {
    ai: {},
    appearance: {
      char: "F",
      tint: 0xff0088,
      tileSet: "ascii",
    },
    pathThrough: {},
    position, 
    layer200: {},
    isBlocking: {},
  });
  addEAP(entity);
  return entity
};
