import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  createEntity,
  createId,
  createWorld,
  destroyAllEntities,
  destroyAllWorlds,
  destroyEntity,
  destroyWorld,
  getEntities,
  getEntity,
  getWorld,
  getWorlds,
  resetEngine,
} from "./index";

describe("engine", () => {
  beforeEach(() => {
    resetEngine();
  });
  describe("createId", () => {
    test("should work", () => {
      const og = Math.random;

      const mocked = vi.fn(() => 0.1);
      Math.random = mocked;

      expect(createId()).toBe("13lllllll");
      expect(createId()).toBe("23lllllll");
      expect(createId()).toBe("33lllllll");

      Math.random = og;
    });
  });

  describe("createWorld", () => {
    test("should work", () => {
      createWorld({ wId: "wid1", world: new Set(["eid1"]) });
      expect(getWorlds()).toEqual({ wid1: new Set(["eid1"]) });
    });
  });

  describe("getWorld", () => {
    test("should work", () => {
      const world = new Set(["eid1"]);
      createWorld({ wId: "wid1", world });
      expect(getWorld("wid1")).toEqual(world);
    });
  });

  describe("destroyEntity", () => {
    test("should destory only the specified entity", () => {
      createWorld({ wId: "wid1" });
      createEntity({ wId: "wid1", eId: "eid1" });
      createEntity({ wId: "wid1", eId: "eid2" });

      destroyEntity("eid1");

      expect(getWorld('wid1')).toEqual(new Set(["eid2"]));
      expect(getEntity("eid1")).toBe(undefined);
    });
  });

  describe("destroyWorld", () => {
    test("should destroy world and all entities within it", () => {
      createWorld({ wId: "wid1" });
      createWorld({ wId: "wid2" });
      createEntity({ wId: "wid1", eId: "eid1" });
      createEntity({ wId: "wid2", eId: "eid2" });

      destroyWorld("wid2");

      expect(getWorlds()).toEqual({ wid1: new Set(["eid1"]) });
      expect(getEntity("eid2")).toBe(undefined);
    });
  });

  describe("createEntity", () => {
    beforeEach(() => {
      createWorld({ wId: "wid1" });
    });

    test("should work when no id is passed", () => {
      const entity = createEntity({ wId: "wid1" });
      expect(getEntity(entity.id)).toEqual({
        id: entity.id,
        wId: "wid1",
        components: {},
      });
    });

    test("should work when id is passed", () => {
      const entity = createEntity({ eId: "eid1", wId: "wid1" });
      expect(getEntity(entity.id)).toEqual({
        id: "eid1",
        wId: "wid1",
        components: {},
      });
    });
  });

  describe("destroyAllEntities", () => {
    test("should work destroy all entities across all worlds", () => {
      createWorld({ wId: "wid1" });
      createWorld({ wId: "wid2" });

      createEntity({ eId: "eid1", wId: "wid1" });
      createEntity({ eId: "eid2", wId: "wid2" });

      destroyAllEntities();
      expect(getEntities()).toEqual(new Map());
      expect(getWorlds()).toEqual({ wid1: new Set(), wid2: new Set()})
    });
  });

  describe("destroyAllWorlds", () => {
    test("should work", () => {
      createWorld({ wId: "wid1" });
      destroyAllWorlds();
      expect(getWorlds()).toEqual({});
    });
  });
});
