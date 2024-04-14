import {
  type WId,
  ComponentTypes,
  addComponent,
  addPrefabs,
  createEntity,
} from "../engine";
import { addEAP } from "../main";
import { Pos } from "../lib/grid";
import {
  renderable,
  tile,
  blockingTile,
  being,
  mob,
  item,
} from "../actors/prefabs";
import { addPosition, removePosition } from "../lib/utils";
import { CHARS, COLORS } from "./graphics";

export const createFloor = (wId: WId, position?: Pos) => {
  const entity = createEntity({ wId });

  addPrefabs(entity.id, [renderable, tile]);

  entity.components.appearance!.char = CHARS.FLOOR;
  entity.components.appearance!.tint = COLORS.FLOOR;
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

  entity.components.appearance!.char = CHARS.WALL;
  entity.components.appearance!.tint = COLORS.WALL;
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
      char: CHARS.PLAYER,
      tint: COLORS.PLAYER,
      tileSet: "ascii",
    },
    isPlayer: {},
    name: "player",
    inventory: new Set(),
    health: {
      max: 100,
      current: 98,
    },
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
      char: CHARS.OWLBEAR,
      tint: COLORS.OWLBEAR,
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

export const createHealthPotion = (wId: WId, position?: Pos) => {
  const entity = createEntity({ wId });

  addPrefabs(entity.id, [renderable, item]);

  addComponent(entity.id, {
    appearance: {
      char: CHARS.POTION,
      tint: COLORS.POTION,
      tileSet: "ascii",
    },
    name: "health potion",
    effects: [
      {
        name: "heal",
        component: ComponentTypes.Health,
        delta: 3,
        duration: 1,
        id: "123",
      },
    ],
  });

  if (position) {
    addPosition(entity.id, position);
  } else {
    removePosition(entity.id);
  }

  return entity;
};

export const createPoison = (wId: WId, position?: Pos) => {
  const entity = createEntity({ wId });

  addPrefabs(entity.id, [renderable, item]);

  addComponent(entity.id, {
    appearance: {
      char: CHARS.POTION,
      tint: COLORS.POTION,
      tileSet: "ascii",
    },
    name: "poison",
    effects: [
      {
        name: "harm",
        component: ComponentTypes.Health,
        delta: -3,
        duration: 1,
        id: "123",
      },
    ],
  });

  if (position) {
    addPosition(entity.id, position);
  } else {
    removePosition(entity.id);
  }

  return entity;
};

export const createRock = (wId: WId, position?: Pos) => {
  const entity = createEntity({ wId });

  addPrefabs(entity.id, [renderable, item]);

  addComponent(entity.id, {
    appearance: {
      char: CHARS.ROCK,
      tint: COLORS.ROCK,
      tileSet: "ascii",
    },
    name: "rock",
  });

  if (position) {
    addPosition(entity.id, position);
  } else {
    removePosition(entity.id);
  }

  return entity;
};
