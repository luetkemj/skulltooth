import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { 
  createId,
  entities,
  createEntity,
  createWorld,
  worlds,
  resetEngine,
} from "./index";

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

describe("createEntity", () => {
    beforeEach(() => {
        createWorld({ wId: "1" });
    })
    afterEach(() => resetEngine())

  test("should work when no id is passed", () => {
    const entity = createEntity({ wId: "1" });
    expect(entities.get(entity.id)).toEqual(entity);
  });

  test("should work when id is passed", () => {
    const entity = createEntity({ eId: "abc123", wId: "1" });
    expect(entities.get(entity.id)).toEqual(entity);
    expect(entity.id).toBe("abc123");
  });
});

describe("createWorld", () => {
  test("should work", () => {
    createWorld({ wId: "123wrld", world: new Set(["abc1we"]) });
    expect(worlds).toEqual({ "123wrld": new Set(["abc1we"]) });
    console.log(worlds);
  });
});
