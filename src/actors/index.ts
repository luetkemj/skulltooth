import { type WId, addComponent, addPrefabs, createEntity } from "../engine";
import { addEAP } from "../main";
import { Pos } from "../lib/grid";
import { renderable, tile, blockingTile, being, mob } from "../actors/prefabs";

export const createFloor = (wId: WId, position?: Pos) => {
  const entity = createEntity({ wId });

  addPrefabs(entity.id, [renderable, tile]);

  entity.components.appearance!.char = "•";
  entity.components.name = "floor";

  if (position) {
    addComponent(entity.id, { position });
    addEAP(entity);
  }

  return entity;
};

export const createWall = (wId: WId, position?: Pos) => {
  const entity = createEntity({ wId });
  addPrefabs(entity.id, [renderable, blockingTile]);

  entity.components.appearance!.char = "#";
  entity.components.appearance!.tint = 0x808080;
  entity.components.name = "wall";

  if (position) {
    addComponent(entity.id, { position });
    addEAP(entity);
  }

  return entity;
};

export const createPlayer = (wId: WId, position?: Pos) => {
  const entity = createEntity({ wId });

  addPrefabs(entity.id, [renderable, being]);

  addComponent(entity.id, {
    appearance: {
      char: "@",
      tint: 0xff0088,
      tileSet: "ascii",
    },
    isPlayer: {},
    name: "player",
  });

  if (position) {
    addComponent(entity.id, { position });
    addEAP(entity);
  }

  return entity;
};

export const createOwlbear = (wId: WId, position?: Pos) => {
  const entity = createEntity({ wId });

  addPrefabs(entity.id, [renderable, being, mob]);

  addComponent(entity.id, {
    appearance: {
      char: "F",
      tint: 0xff0088,
      tileSet: "ascii",
    },
    name: "owlbear",
  });

  if (position) {
    addComponent(entity.id, { position });
    addEAP(entity);
  }

  return entity;
};
