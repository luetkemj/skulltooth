import { describe, test, expect, beforeEach } from "vitest";
import { circle, insideCircle, toPosId, toPos } from "./grid";

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
    const radius = 3.5

    beforeEach(() => {
      c = circle(center, radius);
    });

    test("should return true if candidate is inside circle", () => {
      expect(insideCircle(center, radius, {x: 4, y: 2, z: 1})).toBeTruthy();
    });

    test("should return false if candidate is outside circle", () => {
      expect(insideCircle(center, radius, {x: 0, y: 0, z: 1})).toBeFalsy();
    });

    test("should ignore z", () => {
      expect(insideCircle(center, radius, {x: 4, y: 2, z: 3})).toBeTruthy();
    });
  });
});
