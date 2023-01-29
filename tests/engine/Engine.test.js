import { beforeEach, describe, it, expect } from "vitest";
import { SimpleComponent } from "./data/components";
import { ComponentRegistry, Engine, World } from "../../src/engine";

describe("Engine", () => {
    let engine;
    beforeEach(() => {
        engine = new Engine();
    });

    it("should work", () => {
        expect(engine).toBeInstanceOf(Engine);
        expect(engine._components).toBeInstanceOf(ComponentRegistry);
    });

    describe("registerComponent", () => {
        it("should work", () => {
            engine.registerComponent(SimpleComponent);

            expect(engine._components._map.SimpleComponent).toBe(SimpleComponent);
        });
    });

    describe("createWorld", () => {
        it("should work", () => {
            const world = engine.createWorld();

            expect(world).toBeInstanceOf(World);
            expect(world.engine).toBe(engine);
        });
    });
});
