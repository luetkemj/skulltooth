import { addComponent, createEntity } from "../engine";
import { WId } from "../engine/index.types";
import { addEAP } from "../main";
import { Pos } from "../grid";

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
  });
  addEAP(entity);
};
