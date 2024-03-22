import { describe, test, expect, beforeEach } from "vitest";
import {
  circle,
  diagonalDistance,
  distance,
  getDirection,
  getNeighbor,
  getNeighbors,
  insideCircle,
  isAtSamePosition,
  isNeighbor,
  isOnRectEdge,
  lerp,
  lerpPoint,
  line,
  randomNeighbor,
  rectangle,
  rectsIntersect,
  roundPoint,
  toPosId,
  toPos,
  getVelocity,
} from "./grid";

describe("grid", () => {
  describe("toPosId", () => {
    test("should work", () => {
      expect(toPosId({ x: 1, y: 2, z: 3 })).toBe("1,2,3");
    });
  });

  describe("toPos", () => {
    test("should work", () => {
      expect(toPos("1,2,3")).toEqual({ x: 1, y: 2, z: 3 });
    });
  });

  describe("circle", () => {
    test("should work", () => {
      const c = circle({ x: 5, y: 5, z: 1 }, 3.5);
      expect(c).toEqual({
        posIds: [
          "4,2,1",
          "5,2,1",
          "6,2,1",
          "3,3,1",
          "4,3,1",
          "5,3,1",
          "6,3,1",
          "7,3,1",
          "2,4,1",
          "3,4,1",
          "4,4,1",
          "5,4,1",
          "6,4,1",
          "7,4,1",
          "8,4,1",
          "2,5,1",
          "3,5,1",
          "4,5,1",
          "5,5,1",
          "6,5,1",
          "7,5,1",
          "8,5,1",
          "2,6,1",
          "3,6,1",
          "4,6,1",
          "5,6,1",
          "6,6,1",
          "7,6,1",
          "8,6,1",
          "3,7,1",
          "4,7,1",
          "5,7,1",
          "6,7,1",
          "7,7,1",
          "4,8,1",
          "5,8,1",
          "6,8,1",
        ],
        center: "5,5,1",
        diameter: 7,
        top: 1.5,
        bottom: 8.5,
        left: 1.5,
        right: 8.5,
      });
    });
  });

  describe("insideCircle", () => {
    let c;
    const center = { x: 5, y: 5, z: 1 };
    const radius = 3.5;

    beforeEach(() => {
      c = circle(center, radius);
    });

    test("should return true if candidate is inside circle", () => {
      expect(insideCircle(center, radius, { x: 4, y: 2, z: 1 })).toBeTruthy();
    });

    test("should return false if candidate is outside circle", () => {
      expect(insideCircle(center, radius, { x: 0, y: 0, z: 1 })).toBeFalsy();
    });

    test("should ignore z", () => {
      expect(insideCircle(center, radius, { x: 4, y: 2, z: 3 })).toBeTruthy();
    });
  });

  describe("lerp", () => {
    test("should work", () => {
      expect(lerp(0, 1, 0.3)).toBe(0.3);
      expect(lerp(0, 100, 0.3)).toBe(30);
      expect(lerp(3, 5, 0.3)).toBe(3.6);
      expect(lerp(5, 3, 0.3)).toBe(4.4);
    });
  });

  describe("lerpPoint", () => {
    test("should work", () => {
      expect(
        lerpPoint({ x: 0, y: 0, z: 1 }, { x: 100, y: 100, z: 1 }, 0.3)
      ).toEqual({ x: 30, y: 30, z: 1 });
    });
  });

  describe("diagonalDistance", () => {
    test("should work", () => {
      expect(
        diagonalDistance({ x: 0, y: 0, z: 1 }, { x: 5, y: 10, z: 1 })
      ).toEqual(10);
    });
  });

  describe("roundPoint", () => {
    test("should work", () => {
      expect(roundPoint({ x: 0.6, y: 0.3, z: 1 })).toEqual({
        x: 1,
        y: 0.0,
        z: 1,
      });
    });
  });

  describe("line", () => {
    test("should work", () => {
      expect(line({ x: 1, y: 1, z: 1 }, { x: 3, y: 3, z: 1 })).toEqual([
        {
          x: 1,
          y: 1,
          z: 1,
        },
        {
          x: 2,
          y: 2,
          z: 1,
        },
        {
          x: 3,
          y: 3,
          z: 1,
        },
      ]);
    });
  });

  describe("rectangle", () => {
    test("should work without walls", () => {
      expect(
        rectangle(
          {
            x: 1,
            y: 1,
            z: 1,
            height: 2,
            width: 3,
            hasWalls: false,
          },
          { extra: "props" }
        )
      ).toEqual({
        x1: 1,
        x2: 4,
        y1: 1,
        y2: 3,
        z: 1,
        width: 3,
        height: 2,
        center: {
          x: 3,
          y: 2,
          z: 1,
        },
        hasWalls: false,
        tiles: {
          "1,1,1": {
            x: 1,
            y: 1,
            z: 1,
            extra: "props",
          },
          "2,1,1": {
            x: 2,
            y: 1,
            z: 1,
            extra: "props",
          },
          "3,1,1": {
            x: 3,
            y: 1,
            z: 1,
            extra: "props",
          },
          "1,2,1": {
            x: 1,
            y: 2,
            z: 1,
            extra: "props",
          },
          "2,2,1": {
            x: 2,
            y: 2,
            z: 1,
            extra: "props",
          },
          "3,2,1": {
            x: 3,
            y: 2,
            z: 1,
            extra: "props",
          },
        },
      });
    });
    test("should work with walls", () => {
      expect(
        rectangle(
          {
            x: 1,
            y: 1,
            z: 1,
            height: 3,
            width: 4,
            hasWalls: true,
          },
          { extra: "props" }
        )
      ).toEqual({
        x1: 1,
        x2: 5,
        y1: 1,
        y2: 4,
        z: 1,
        center: {
          x: 3,
          y: 3,
          z: 1,
        },
        hasWalls: true,
        tiles: {
          "2,2,1": {
            x: 2,
            y: 2,
            z: 1,
            extra: "props",
          },
          "3,2,1": {
            x: 3,
            y: 2,
            z: 1,
            extra: "props",
          },
        },
        width: 4,
        height: 3,
      });
    });
  });

  describe("rectsIntersect", () => {
    test("should work when rectangles intersect", () => {
      const r1 = rectangle(
        {
          x: 1,
          y: 1,
          z: 1,
          height: 2,
          width: 3,
          hasWalls: false,
        },
        { extra: "props" }
      );
      const r2 = rectangle(
        {
          x: 2,
          y: 2,
          z: 1,
          height: 2,
          width: 3,
          hasWalls: false,
        },
        { extra: "props" }
      );
      expect(rectsIntersect(r1, r2)).toBeTruthy();
    });

    test("should work when rectangles do not intersect", () => {
      const r1 = rectangle(
        {
          x: 1,
          y: 1,
          z: 1,
          height: 2,
          width: 3,
          hasWalls: false,
        },
        { extra: "props" }
      );
      const r2 = rectangle(
        {
          x: 5,
          y: 5,
          z: 1,
          height: 2,
          width: 3,
          hasWalls: false,
        },
        { extra: "props" }
      );
      expect(rectsIntersect(r1, r2)).toBeFalsy();
    });
  });

  describe("distance", () => {
    test("should work", () => {
      expect(distance({ x: 1, y: 1, z: 1 }, { x: 5, y: 15, z: 1 })).toBe(14);
    });
  });

  describe("isOnRectEdge", () => {
    test("should work when on north edge", () => {
      expect(
        isOnRectEdge(
          { x: 100, y: 9, z: 1 },
          { width: 10, height: 10, mapX: 1, mapY: 9 }
        )
      ).toBeTruthy();
    });
    test("should work when on south edge", () => {
      expect(
        isOnRectEdge(
          { x: 100, y: 19, z: 1 },
          { width: 10, height: 10, mapX: 9, mapY: 10 }
        )
      ).toBeTruthy();
    });
    test("should work when on east edge", () => {
      expect(
        isOnRectEdge(
          { x: 18, y: 100, z: 1 },
          { width: 10, height: 10, mapX: 9, mapY: 1 }
        )
      ).toBeTruthy();
    });
    test("should work when on west edge", () => {
      expect(
        isOnRectEdge(
          { x: 9, y: 100, z: 1 },
          { width: 10, height: 10, mapX: 9, mapY: 1 }
        )
      ).toBeTruthy();
    });
    test("should work when not on edge", () => {
      expect(
        isOnRectEdge(
          { x: 100, y: 100, z: 1 },
          { width: 10, height: 10, mapX: 9, mapY: 1 }
        )
      ).toBeFalsy();
    });
  });

  describe("getNeighbors", () => {
    test("should work when all neighbors are out of bounds", () => {
      expect(
        getNeighbors(
          { x: 100, y: 9, z: 1 },
          "cardinal",
          { width: 10, height: 10 },
          true
        )
      ).toEqual([]);
    });

    test("should work when some neighbors are out of bounds", () => {
      expect(
        getNeighbors(
          { x: 9, y: 9, z: 1 },
          "cardinal",
          { width: 10, height: 10 },
          true
        )
      ).toEqual(["9,8,1", "8,9,1"]);
    });

    test("should work when all neighbors are in bounds", () => {
      expect(
        getNeighbors(
          { x: 5, y: 5, z: 1 },
          "cardinal",
          { width: 10, height: 10 },
          true
        )
      ).toEqual(["5,4,1", "6,5,1", "5,6,1", "4,5,1"]);
    });
  });

  describe("isAtSamePosition", () => {
    test("should work when positions are the same", () => {
      expect(
        isAtSamePosition({ x: 100, y: 9, z: 1 }, { x: 100, y: 9, z: 1 })
      ).toBeTruthy();
    });

    test("should work when positions are not the same", () => {
      expect(
        isAtSamePosition({ x: 0, y: 9, z: 0 }, { x: 10, y: 9, z: 0 })
      ).toBeFalsy();
    });
  });

  describe("isNeighbor", () => {
    test("should work when positions are neighbors", () => {
      expect(
        isNeighbor({ x: 9, y: 9, z: 0 }, { x: 10, y: 9, z: 0 })
      ).toBeTruthy();
    });

    test("should work when positions are not neighbors", () => {
      expect(
        isNeighbor({ x: 0, y: 9, z: 0 }, { x: 10, y: 9, z: 0 })
      ).toBeFalsy();
    });

    test("should work when positions are the same", () => {
      expect(
        isNeighbor({ x: 100, y: 9, z: 1 }, { x: 100, y: 9, z: 1 })
      ).toBeFalsy();
    });
  });

  describe("randomNeighbor", () => {
    test("should work", () => {
      const pos = { x: 1, y: 1, z: 1 };
      const ran = randomNeighbor(pos);
      const dist = distance(pos, ran);
      expect(dist).toBe(1);
    });
  });

  describe("getNeighbor", () => {
    const pos = { x: 1, y: 1, z: 1 };

    test("should work N", () => {
      const n = getNeighbor(pos, "N");
      expect(n).toEqual({ x: 1, y: 0, z: 1 });
    });
    test("should work E", () => {
      const n = getNeighbor(pos, "E");
      expect(n).toEqual({ x: 2, y: 1, z: 1 });
    });
    test("should work S", () => {
      const n = getNeighbor(pos, "S");
      expect(n).toEqual({ x: 1, y: 2, z: 1 });
    });
    test("should work W", () => {
      const n = getNeighbor(pos, "W");
      expect(n).toEqual({ x: 0, y: 1, z: 1 });
    });
    test("should work NE", () => {
      const n = getNeighbor(pos, "NE");
      expect(n).toEqual({ x: 2, y: 0, z: 1 });
    });
    test("should work NW", () => {
      const n = getNeighbor(pos, "NW");
      expect(n).toEqual({ x: 0, y: 0, z: 1 });
    });
    test("should work SE", () => {
      const n = getNeighbor(pos, "SE");
      expect(n).toEqual({ x: 2, y: 2, z: 1 });
    });
    test("should work SW", () => {
      const n = getNeighbor(pos, "SW");
      expect(n).toEqual({ x: 0, y: 2, z: 1 });
    });
  });

  describe("getDirection", () => {
    const pos = { x: 1, y: 1, z: 1 };

    test("should work N", () => {
      const dir = getDirection({ x: 1, y: 0, z: 1 }, pos);
      expect(dir).toEqual({ dir: "N", x: 0, y: -1 });
    });
    test("should work E", () => {
      const dir = getDirection({ x: 2, y: 1, z: 1 }, pos);
      expect(dir).toEqual({ dir: "E", x: 1, y: 0 });
    });
    test("should work S", () => {
      const dir = getDirection({ x: 1, y: 2, z: 1 }, pos);
      expect(dir).toEqual({ dir: "S", x: 0, y: 1 });
    });
    test("should work W", () => {
      const dir = getDirection({ x: 0, y: 1, z: 1 }, pos);
      expect(dir).toEqual({ dir: "W", x: -1, y: 0 });
    });
    test("should work NE", () => {
      const dir = getDirection({ x: 2, y: 0, z: 1 }, pos);
      expect(dir).toEqual({ dir: "NE", x: 1, y: -1 });
    });
    test("should work NW", () => {
      const dir = getDirection({ x: 0, y: 0, z: 1 }, pos);
      expect(dir).toEqual({ dir: "NW", x: -1, y: -1 });
    });
    test("should work SE", () => {
      const dir = getDirection({ x: 2, y: 2, z: 1 }, pos);
      expect(dir).toEqual({ dir: "SE", x: 1, y: 1 });
    });
    test("should work SW", () => {
      const dir = getDirection({ x: 0, y: 2, z: 1 }, pos);
      expect(dir).toEqual({ dir: "SW", x: -1, y: 1 });
    });
  });

  describe("getVelocity", () => {
    test("should work", () => {
      const posA = { x: 0, y: 0, z: 1 };
      const posB = { x: 1, y: 1, z: 1 };
      expect(getVelocity(posA, posB)).toEqual({ x: -1, y: -1 });
    });
  });
});
