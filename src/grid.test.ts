import { describe, test, expect } from "vitest";
import { toPosId, toPos } from "./grid";

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
});
