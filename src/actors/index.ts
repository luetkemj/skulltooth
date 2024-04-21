import { world, Entity } from "../engine/engine";
// import {
//   type WId,
//   ComponentTypes,
//   addComponent,
//   addPrefabs,
//   createEntity,
//   DamageTypes,
// } from "../engine";
import { addEAP } from "../main";
import { Pos } from "../lib/grid";
// import {
//   renderable,
//   tile,
//   blockingTile,
//   being,
//   mob,
//   item,
// } from "../actors/prefabs";
// import { addPosition, removePosition } from "../lib/utils";
import { CHARS, COLORS } from "./graphics";

export const createFloor = (position?: Pos) => {
  const entity = world.add({
    appearance: {
      char: CHARS.FLOOR,
      tint: COLORS.FLOOR,
      tileSet: "ascii",
    },
    layer: 100,
    name: "floor",
    position,
  });
  addEAP(entity);
  return entity;
};

export const createWall = (position?: Pos) => {
  const entity = world.add({
    appearance: {
      char: CHARS.WALL,
      tint: COLORS.WALL,
      tileSet: "ascii",
    },
    layer: 100,
    name: "wall",
    position,
    blocking: true,
    isOpaque: true,
  });
  addEAP(entity);
  return entity;
};

export const createPlayer = (position?: Pos) => {
  const entity = world.add({
    appearance: {
      char: CHARS.PLAYER,
      tint: COLORS.PLAYER,
      tileSet: "ascii",
    },
    position,
    health: {
      max: 10,
      current: 10,
    },
    layer: 201,
    name: "unnamed",
    legendable: true,
    activeEffects: [],
    blocking: true,
    isOpaque: true,
    isPlayer: true,
  });
  addEAP(entity);
  return entity;
};

// export const createOwlbear = (wId: WId, position?: Pos) => {
//   const entity = createEntity({ wId });
//
//   addPrefabs(entity.id, [renderable, being, mob]);
//
//   addComponent(entity.id, {
//     appearance: {
//       char: CHARS.OWLBEAR,
//       tint: COLORS.OWLBEAR,
//       tileSet: "ascii",
//     },
//     name: "owlbear",
//   });
//
//   if (position) {
//     addComponent(entity.id, { position });
//     addEAP(entity);
//   }
//
//   return entity;
// };
//
// export const createHealthPotion = (wId: WId, position?: Pos) => {
//   const entity = createEntity({ wId });
//
//   addPrefabs(entity.id, [renderable, item]);
//
//   addComponent(entity.id, {
//     appearance: {
//       char: CHARS.POTION,
//       tint: COLORS.POTION,
//       tileSet: "ascii",
//     },
//     name: "health potion",
//     effects: [
//       {
//         name: "heal",
//         component: ComponentTypes.Health,
//         delta: 3,
//         duration: 1,
//         id: "123",
//       },
//     ],
//   });
//
//   if (position) {
//     addPosition(entity.id, position);
//   } else {
//     removePosition(entity.id);
//   }
//
//   return entity;
// };
//
// export const createPoison = (wId: WId, position?: Pos) => {
//   const entity = createEntity({ wId });
//
//   addPrefabs(entity.id, [renderable, item]);
//
//   addComponent(entity.id, {
//     appearance: {
//       char: CHARS.POTION,
//       tint: COLORS.POTION,
//       tileSet: "ascii",
//     },
//     name: "poison",
//     effects: [
//       {
//         name: "harm",
//         component: ComponentTypes.Health,
//         delta: -3,
//         duration: 1,
//         id: "123",
//       },
//     ],
//   });
//
//   if (position) {
//     addPosition(entity.id, position);
//   } else {
//     removePosition(entity.id);
//   }
//
//   return entity;
// };
//
// export const createRock = (wId: WId, position?: Pos) => {
//   const entity = createEntity({ wId });
//
//   addPrefabs(entity.id, [renderable, item]);
//
//   addComponent(entity.id, {
//     appearance: {
//       char: CHARS.ROCK,
//       tint: COLORS.ROCK,
//       tileSet: "ascii",
//     },
//     name: "rock",
//     damages: [
//       {
//         type: DamageTypes.BLUDGEONING,
//         delta: -5,
//         sourceEId: "",
//       },
//     ],
//   });
//
//   if (position) {
//     addPosition(entity.id, position);
//   } else {
//     removePosition(entity.id);
//   }
//
//   return entity;
// };
