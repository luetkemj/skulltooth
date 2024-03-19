type PosId = string;
type Pos = { x: number; y: number; z: number };

export const toPosId = (pos: Pos): PosId => {
  return `${pos.x},${pos.y},${pos.z}`;
};

export const toPos = (posId: PosId): Pos => {
  const coords = posId.split(",").map((coord) => parseInt(coord, 10));
  return { x: coords[0], y: coords[1], z: coords[2] };
};

export const insideCircle = (
  center: Pos,
  radius: number,
  candidate: Pos
): Boolean => {
  const dx = center.x - candidate.x;
  const dy = center.y - candidate.y;
  const distance_squared = dx * dx + dy * dy;
  return distance_squared <= radius * radius;
};

export const circle = (center: Pos, radius: number) => {
  const diameter = radius % 1 ? radius * 2 : radius * 2 + 1;
  const top = center.y - radius;
  const bottom = center.y + radius;
  const left = center.x - radius;
  const right = center.x + radius;

  const posIds: Array<PosId> = [];

  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      const cx = Math.ceil(x);
      const cy = Math.ceil(y);
      const cz = center.z;

      const candidate = { x: cx, y: cy, z: cz };
      if (insideCircle(center, radius, candidate)) {
        posIds.push(toPosId(candidate));
      }
    }
  }

  return {
    posIds,
    center: toPosId(center),
    diameter,
    top,
    bottom,
    left,
    right,
  };
};

export const lerp = (start: number, end: number, t: number): number => {
  return start + t * (end - start);
};

export const lerpPoint = (pos0: Pos, pos1: Pos, t: number): Pos => {
  const x = lerp(pos0.x, pos1.x, t);
  const y = lerp(pos0.y, pos1.y, t);
  const z = pos0.z;

  return { x, y, z };
};

const diagonalDistance = (pos0: Pos, pos1: Pos): number => {
  const dx = pos1.x - pos0.x;
  const dy = pos1.y - pos0.y;
  return Math.max(Math.abs(dx), Math.abs(dy));
};

const roundPoint = (pos: Pos) => {
  const x = Math.round(pos.x);
  const y = Math.round(pos.y);
  const z = pos.z;

  return { x, y, z };
};

export const line = (pos0: Pos, pos1: Pos): Array<Pos> => {
  let points = [];
  let N = diagonalDistance(pos0, pos1);
  for (let step = 0; step <= N; step++) {
    let t = N === 0 ? 0.0 : step / N;
    points.push(roundPoint(lerpPoint(pos0, pos1, t)));
  }
  return points;
};

type Tile = { x: number; y: number; z: number; [key: string]: any };
type Tiles = { [key: string]: Tile };
type Rectangle = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  z: number;
  center: Pos;
  hasWalls: boolean;
  tiles: Tiles;
};

interface RectangleProps {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  hasWalls: boolean;
}

export const rectangle = (
  rectangleProps: RectangleProps,
  tileProps: any
): Rectangle => {
  const { x, y, z, width, height, hasWalls } = rectangleProps;

  const tiles: Tiles = {};

  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  if (hasWalls) {
    for (let yi = y1 + 1; yi < y2 - 1; yi++) {
      for (let xi = x1 + 1; xi < x2 - 1; xi++) {
        tiles[`${xi},${yi},${z}`] = { x: xi, y: yi, z, ...tileProps };
      }
    }
  } else {
    for (let yi = y1; yi < y2; yi++) {
      for (let xi = x1; xi < x2; xi++) {
        tiles[`${xi},${yi},${z}`] = { x: xi, y: yi, z, ...tileProps };
      }
    }
  }

  const center = {
    x: Math.round((x1 + x2) / 2),
    y: Math.round((y1 + y2) / 2),
    z,
  };

  return { x1, x2, y1, y2, z, center, hasWalls, tiles };
};

export const rectsIntersect = (rect1: Rectangle, rect2: Rectangle): boolean => {
  return (
    rect1.x1 <= rect2.x2 &&
    rect1.x2 >= rect2.x1 &&
    rect1.y1 <= rect2.y2 &&
    rect1.y2 >= rect2.y1
  );
};

export const distance = (pos1: Pos, pos2: Pos): number => {
  const x = Math.pow(pos2.x - pos1.x, 2);
  const y = Math.pow(pos2.y - pos1.y, 2);
  return Math.floor(Math.sqrt(x + y));
};

// todo: how do we get grid in here? It's coming from state... I think...
// probably should just pass it in as an arg...
// don't really even need this function TBH - could likely just delete it.
export const isOnMapEdge = (pos: Pos): boolean => {
  const { x, y } = pos;
  const { width, height, x: mapX, y: mapY } = grid.map;

  if (x === mapX) return true; // west edge
  if (y === mapY) return true; // north edge
  if (x === mapX + width - 1) return true; // east edge
  if (y === mapY + height - 1) return true; // south edge

  return false;
};
