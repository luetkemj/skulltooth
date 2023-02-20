import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  addComponent,
  createEntity,
  createId,
  createQuery,
  createWorld,
  destroyAllEntities,
  destroyAllWorlds,
  destroyEntity,
  destroyWorld,
  getEntities,
  getEntity,
  getQueries,
  getQuery,
  getWorld,
  getWorlds,
  matchQuery,
  matchAllQueries,
  matchQueryAll,
  matchQueryAny,
  matchQueryNone,
  removeComponent,
  resetEngine,
  destroyAllQueries,
  getEngineSnapshot,
  stringifyEntities,
  parseEntities,
  stringifyWorlds,
  parseWorlds,
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

  describe("WORLD", () => {
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

    describe("destroyAllWorlds", () => {
      test("should work", () => {
        createWorld({ wId: "wid1" });
        destroyAllWorlds();
        expect(getWorlds()).toEqual({});
      });
    });
  });

  describe("ENTITY", () => {
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

    describe("destroyEntity", () => {
      test("should destory only the specified entity", () => {
        createWorld({ wId: "wid1" });
        createEntity({ wId: "wid1", eId: "eid1" });
        createEntity({ wId: "wid1", eId: "eid2" });

        destroyEntity("eid1");

        expect(getWorld("wid1")).toEqual(new Set(["eid2"]));
        expect(getEntity("eid1")).toBe(undefined);
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
        expect(getWorlds()).toEqual({ wid1: new Set(), wid2: new Set() });
      });
    });
  });

  describe("COMPONENT", () => {
    test("addComponent should work", () => {
      createWorld({ wId: "wid1" });
      createEntity({ wId: "wid1", eId: "eid1" });
      addComponent("eid1", { position: { x: 1, y: 0, z: 0 } });

      const entity = getEntity("eid1");
      expect(entity).toEqual({
        id: "eid1",
        wId: "wid1",
        components: {
          position: { x: 1, y: 0, z: 0 },
        },
      });
    });

    test("removeComponent should work", () => {
      createWorld({ wId: "wid1" });
      createEntity({ wId: "wid1", eId: "eid1" });
      addComponent("eid1", { position: { x: 1, y: 0, z: 0 } });

      const entity = getEntity("eid1");
      expect(entity).toEqual({
        id: "eid1",
        wId: "wid1",
        components: {
          position: { x: 1, y: 0, z: 0 },
        },
      });

      removeComponent("eid1", "position");

      expect(entity).toEqual({
        id: "eid1",
        wId: "wid1",
        components: {},
      });
    });
  });

  describe("QUERY", () => {
    test("createQuery should work", () => {
      const positionQuery = {
        name: "positionQuery",
        filters: { all: ["position"], any: [], none: [] },
        entities: new Set(),
      };
      const queries = createQuery(positionQuery.name, positionQuery.filters);
      expect(queries).toEqual({ positionQuery });
    });

    test("destroyAllQueries should work", () => {
      const positionQuery = {
        name: "positionQuery",
        filters: { all: ["position"], any: [], none: [] },
        entities: new Set(),
      };
      createQuery(positionQuery.name, positionQuery.filters);
      destroyAllQueries();
      expect(getQueries()).toEqual({});
    });

    test("getQueries should work", () => {
      const positionQuery = {
        name: "positionQuery",
        filters: { all: ["position"], any: [], none: [] },
        entities: new Set(),
      };
      createQuery(positionQuery.name, positionQuery.filters);
      expect(getQueries()).toEqual({ positionQuery });
    });

    test("getQuery should work", () => {
      const positionQuery = {
        name: "positionQuery",
        filters: { all: ["position"], any: [], none: [] },
        entities: new Set(),
      };
      createQuery(positionQuery.name, positionQuery.filters);
      expect(getQuery("positionQuery")).toEqual(positionQuery);
    });

    test("matchQueryAll should work", () => {
      const positionQuery = {
        name: "positionQuery",
        filters: { all: ["position"], any: [], none: [] },
        entities: new Set(),
      };
      createQuery(positionQuery.name, positionQuery.filters);

      createWorld({ wId: "wid1" });
      createEntity({ wId: "wid1", eId: "eid1" });
      createEntity({ wId: "wid1", eId: "eid2" });
      addComponent("eid1", { position: { x: 1, y: 0, z: 0 } });

      expect(matchQueryAll("eid1", "positionQuery")).toBe(true);
      expect(matchQueryAll("eid2", "positionQuery")).toBe(false);
    });

    test("matchQueryNone should work", () => {
      const positionQuery = {
        name: "positionQuery",
        filters: { all: [], any: [], none: ["position"] },
        entities: new Set(),
      };
      createQuery(positionQuery.name, positionQuery.filters);

      createWorld({ wId: "wid1" });
      createEntity({ wId: "wid1", eId: "eid1" });
      createEntity({ wId: "wid1", eId: "eid2" });
      addComponent("eid1", { position: { x: 1, y: 0, z: 0 } });

      expect(matchQueryNone("eid1", "positionQuery")).toBe(false);
      expect(matchQueryNone("eid2", "positionQuery")).toBe(true);
    });

    test("matchQueryAny should work", () => {
      const positionQuery = {
        name: "positionQuery",
        filters: { all: [], any: ["position", "fake"], none: [] },
        entities: new Set(),
      };
      createQuery(positionQuery.name, positionQuery.filters);

      createWorld({ wId: "wid1" });
      createEntity({ wId: "wid1", eId: "eid1" });
      createEntity({ wId: "wid1", eId: "eid2" });
      addComponent("eid1", { position: { x: 1, y: 0, z: 0 } });

      expect(matchQueryAny("eid1", "positionQuery")).toBe(true);
      expect(matchQueryAny("eid2", "positionQuery")).toBe(false);
    });

    test("matchQuery should work", () => {
      const positionQuery = {
        name: "positionQuery",
        filters: { all: ["position"], any: [], none: [] },
        entities: new Set(),
      };
      createQuery(positionQuery.name, positionQuery.filters);

      createWorld({ wId: "wid1" });
      createEntity({ wId: "wid1", eId: "eid1" });
      addComponent("eid1", { position: { x: 1, y: 0, z: 0 } });

      const matches = matchQuery("eid1", "positionQuery");

      expect(matches).toEqual(new Set(["eid1"]));

      removeComponent("eid1", "position");

      const matches2 = matchQuery("eid1", "positionQuery");

      expect(matches2).toEqual(new Set([]));
    });

    test("matchAllQueries should work", () => {
      const isBlockingQuery = {
        name: "isBlockingQuery",
        filters: { all: [], any: ["isBlocking"], none: [] },
        entities: new Set(),
      };
      const positionQuery = {
        name: "positionQuery",
        filters: { all: ["position"], any: [], none: [] },
        entities: new Set(),
      };

      createQuery(positionQuery.name, positionQuery.filters);
      createQuery(isBlockingQuery.name, isBlockingQuery.filters);

      createWorld({ wId: "wid1" });
      createEntity({ wId: "wid1", eId: "eid1" });
      addComponent("eid1", { position: { x: 1, y: 0, z: 0 } });
      addComponent("eid1", { isBlocking: {} });

      matchAllQueries("eid1");

      expect(getQueries()).toEqual({
        positionQuery: {
          ...positionQuery,
          entities: new Set(["eid1"]),
        },
        isBlockingQuery: {
          ...isBlockingQuery,
          entities: new Set(["eid1"]),
        },
      });
    });
  });

  describe("SAVE AND LOAD", () => {
    beforeEach(() => {
      createWorld({ wId: "wid1" });
      createWorld({ wId: "wid2" });
      createEntity({ wId: "wid1", eId: "eid1" });
      createEntity({ wId: "wid2", eId: "eid2" });
      addComponent("eid1", { position: { x: 1, y: 0, z: 0 } });
      addComponent("eid2", { isBlocking: {} });
    });

    test("stringifyWorlds", () => {
      const json = stringifyWorlds(getWorlds());
      expect(json).toEqual(JSON.stringify({ wid1: ["eid1"], wid2: ["eid2"] }));
    });

    test("parseWorlds", () => {
      const worlds = getWorlds();
      const json = stringifyWorlds(getWorlds());
      const data = parseWorlds(json);
      expect(data).toEqual(worlds);
    });

    test("stringifyEntities", () => {
      const json = stringifyEntities(getEntities());
      expect(json).toEqual(
        JSON.stringify([
          [
            "eid1",
            {
              id: "eid1",
              wId: "wid1",
              components: { position: { x: 1, y: 0, z: 0 } },
            },
          ],
          ["eid2", { id: "eid2", wId: "wid2", components: { isBlocking: {} } }],
        ])
      );
    });

    test("parseEntities", () => {
      const entities = getEntities();
      const json = stringifyEntities(getEntities());
      const data = parseEntities(json);
      expect(entities).toEqual(data);
    });

    test("getEngineSnapshot", () => {
      const snap = getEngineSnapshot();
      expect(snap).toEqual({
        entities:
          '[["eid1",{"id":"eid1","wId":"wid1","components":{"position":{"x":1,"y":0,"z":0}}}],["eid2",{"id":"eid2","wId":"wid2","components":{"isBlocking":{}}}]]',
        worlds: '{"wid1":["eid1"],"wid2":["eid2"]}',
        _id: 0,
      });
    });
  });

  // get stringify working so I can test properly against the entire state of the engine
  test("INTEGRATION", () => {
    createQuery("positionQuery", { all: ["position"], any: [], none: [] });
    createQuery("isBlockingQuery", { all: [], any: ["isBlocking"], none: [] });

    createWorld({ wId: "wid1" });
    createEntity({ wId: "wid1", eId: "eid1" });
    createEntity({ wId: "wid1", eId: "eid2" });

    addComponent("eid1", { position: { x: 1, y: 0, z: 0 } });
    addComponent("eid2", { isBlocking: {} });

    expect(getQuery("positionQuery").entities.has("eid1")).toBe(true);
    expect(getQuery("isBlockingQuery").entities.has("eid2")).toBe(true);

    removeComponent("eid1", "position");
    addComponent("eid2", { position: { x: 1, y: 0, z: 0 } });

    expect(getQuery("positionQuery").entities.has("eid1")).toBe(false);
    expect(getQuery("positionQuery").entities.has("eid2")).toBe(true);
    expect(getQuery("isBlockingQuery").entities.has("eid2")).toBe(true);
  });
});
