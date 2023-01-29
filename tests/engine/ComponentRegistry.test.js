import { beforeEach, describe, it, expect } from "vitest";
import { SimpleComponent } from "./data/components";
import { ComponentRegistry } from "../../src/engine";

describe("ComponentRegistry", () => {
    let componentRegistry;
    beforeEach(() => {
        componentRegistry = new ComponentRegistry();
    });

    describe("register", () => {
        it("should work", () => {
            componentRegistry.register(SimpleComponent);

            expect(componentRegistry._map.SimpleComponent).toBe(SimpleComponent);
        });
    });

    describe("get", () => {
        it("should work", () => {
            componentRegistry.register(SimpleComponent);

            expect(componentRegistry.get("SimpleComponent")).toBe(SimpleComponent);
        });
    });
});
