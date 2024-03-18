type PosId = string;
type Pos = { x: number; y: number; z: number };

export const toPosId = (pos: Pos): PosId => {
  return `${pos.x},${pos.y},${pos.z}`;
};

export const toPos = (posId: PosId): Pos => {
  const coords = posId.split(",").map((coord) => parseInt(coord, 10));
  return { x: coords[0], y: coords[1], z: coords[2] };
};

export const insideCircle = (center: Pos, radius: number, candidate: Pos): Boolean => {
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
