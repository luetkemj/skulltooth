import { random, times } from "lodash";
import {
  type Pos,
  type PosId,
  type Rectangle,
  // line,
  rectangle,
  rectsIntersect,
  toPosId,
} from "../grid";
import { getState } from "../main";
import { createWall } from "../prefabs/wall.prefab";
import { createFloor } from "../prefabs/floor.prefab";

type Tile = {
  x: number;
  y: number;
  z: number;
  sprite: string;
};

type Tiles = { [key: PosId]: Tile };

function digHorizontalPassage(posA: Pos, posB: Pos) {
  const tiles: Tiles = {};
  const start = Math.min(posA.x, posB.x);
  const end = Math.max(posA.x, posB.x) + 1;
  let x = start;

  while (x < end) {
    const tilePos = { ...posB, x };
    tiles[toPosId(tilePos)] = { ...tilePos, sprite: "FLOOR" };
    x++;
  }

  return tiles;
}

function digVerticalPassage(posA: Pos, posB: Pos): Tiles {
  const tiles: Tiles = {};
  const start = Math.min(posA.y, posB.y);
  const end = Math.max(posA.y, posB.y) + 1;
  let y = start;

  while (y < end) {
    const tilePos = { ...posA, y };
    tiles[toPosId(tilePos)] = { ...tilePos, sprite: "FLOOR" };
    y++;
  }

  return tiles;
}

type DungeonProps = {
  pos: Pos;
  width: number;
  height: number;
  minRoomSize: number;
  maxRoomSize: number;
  maxRoomCount: number;
};

export const buildDungeon = (props: DungeonProps) => {
  const {
    pos,
    width,
    height,
    minRoomSize = 6,
    maxRoomSize = 12,
    maxRoomCount = 30,
  } = props;

  const { x, y, z } = pos;

  // fill the entire space with walls so we can dig it out later
  const dungeon = rectangle(
    { x, y, z, width, height, hasWalls: false },
    {
      sprite: "WALL",
    }
  );

  // create room

  const rooms: Array<Rectangle> = [];
  let roomTiles = {};

  times(maxRoomCount, () => {
    let rw = random(minRoomSize, maxRoomSize);
    let rh = random(minRoomSize, maxRoomSize);
    let rx = random(x, width + x - rw - 1);
    let ry = random(y, height + y - rh - 1);

    // create a candidate room
    const candidate = rectangle(
      { x: rx, y: ry, z, width: rw, height: rh, hasWalls: true },
      { sprite: "FLOOR" }
    );

    // test if candidate is overlapping with any existing rooms
    if (!rooms.some((room) => rectsIntersect(room, candidate))) {
      rooms.push(candidate);
      roomTiles = { ...roomTiles, ...candidate.tiles };
    }
  });

  let prevRoom = null;
  let passageTiles = {};

  for (let room of rooms) {
    if (prevRoom) {
      passageTiles = {
        ...passageTiles,
        ...digHorizontalPassage(room.center, prevRoom.center),
        ...digVerticalPassage(room.center, prevRoom.center),
      };
    }

    prevRoom = room;
  }

  dungeon.tiles = { ...dungeon.tiles, ...roomTiles, ...passageTiles };

  //   // setup dTiles and add DIRT tag
  //   dungeon.dTiles = { ...dungeon.tiles };
  //   each(dungeon.dTiles, (val, key) => {
  //     dungeon.dTiles[key].tags = [];
  //     dungeon.dTiles[key].tags.push("DIRT");
  //   });
  //
  //   const rooms = [];
  //   let roomTiles = {};
  //
  //   times(maxRoomCount, () => {
  //     let rw = random(minRoomSize, maxRoomSize);
  //     let rh = random(minRoomSize, maxRoomSize);
  //     let rx = random(x, width + x - rw - 1);
  //     let ry = random(y, height + y - rh - 1);
  //
  //     // create a candidate room
  //     const candidate = rectangle(
  //       { x: rx, y: ry, width: rw, height: rh, hasWalls: true },
  //       { sprite: "FLOOR" }
  //     );
  //
  //     // test if candidate is overlapping with any existing rooms
  //     if (!rooms.some((room) => rectsIntersect(room, candidate))) {
  //       rooms.push(candidate);
  //       roomTiles = { ...roomTiles, ...candidate.tiles };
  //     }
  //   });
  //
  //   // add room tags
  //   each(roomTiles, (val, key) => {
  //     dungeon.dTiles[key].tags.push("ROOM");
  //     dungeon.dTiles[key].tags.push("FLOOR");
  //   });
  //
  //   let prevRoom = null;
  //   let passageTiles;
  //
  //   for (let room of rooms) {
  //     if (prevRoom) {
  //       const prev = prevRoom.center;
  //       const curr = room.center;
  //
  //       passageTiles = {
  //         ...passageTiles,
  //         ...digHorizontalPassage(prev.x, curr.x, curr.y),
  //         ...digVerticalPassage(prev.y, curr.y, prev.x),
  //       };
  //     }
  //
  //     prevRoom = room;
  //   }
  //
  //   dungeon.rooms = rooms;
  //
  //   dungeon.tiles = { ...dungeon.tiles, ...roomTiles, ...passageTiles };
  //
  //   // get perimeter walls for each room
  //   const addPerimeterTags = (cell) => {
  //     const posid = `${cell.x},${cell.y}`;
  //     if (dungeon.dTiles[posid]) {
  //       dungeon.dTiles[posid].tags.push("WALL");
  //       dungeon.dTiles[posid].tags.push("PERIMETER");
  //     }
  //   };
  //   each(rooms, (room) => {
  //     const sw = { x: room.x1, y: room.y2 - 1 }; // sw
  //     const se = { x: room.x2 - 1, y: room.y2 - 1 }; // se
  //     const nw = { x: room.x1, y: room.y1 };
  //     const ne = { x: room.x2 - 1, y: room.y1 };
  //
  //     line(nw, ne).forEach(addPerimeterTags);
  //     line(ne, se).forEach(addPerimeterTags);
  //     line(se, sw).forEach(addPerimeterTags);
  //     line(sw, nw).forEach(addPerimeterTags);
  //   });
  //
  //   // add passage tags
  //   each(passageTiles, (val, key) => {
  //     dungeon.dTiles[key].tags.push("PASSAGE");
  //   });
  //
  return dungeon;
};

export const generateDungeon = () => {
  const dungeon = buildDungeon({
    pos: { x: 0, y: 0, z: 0 },
    width: 74,
    height: 39,
    minRoomSize: 8,
    maxRoomSize: 18,
    maxRoomCount: 100,
  });

  const tiles = Object.values(dungeon.tiles);

  for (const tile of tiles) {
    let newTile;

    if (tile.sprite === "WALL") {
      newTile = createWall(getState().wId);
    }
    if (tile.sprite === "FLOOR") {
      newTile = createFloor(getState().wId);
    }

    if (!newTile) return;

    newTile.components.position!.x = tile.x;
    newTile.components.position!.y = tile.y;
    newTile.components.position!.z = tile.z;
  }
};
