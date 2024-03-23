import { describe, test, expect } from "vitest";
import { buildDungeon } from "./dungeon";

describe("pcgn/dungeon", () => {
  describe("buildDungeon", () => {
    test("should work", () => {
      const props = {
        pos: {x: 0, y: 0, z: 0},
        width: 3,
        height: 3,
        minRoomSize: 6,
        maxRoomSize: 12,
        maxRoomCount: 30,
      };

      const dungeon = buildDungeon(props)

      expect(dungeon).toBe([]);
    });
  });
});
