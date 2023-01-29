import { beforeEach, describe, it, expect, vi } from "vitest";
import {
    ComplexComponent,
    SimpleComponent,
    ComponentWithEvents,
    OtherComponentWithEvents,
} from "./data/components";
import { Entity, World } from "../../src/engine";

describe("Entity", () => {
    let entity;
    let world;

    beforeEach(() => {
        world = new World();
        world.matchQueries = vi.fn();

        const id = "id";
        entity = new Entity(world, id);
    });

    it("should work", () => {
        expect(entity.world).toBeInstanceOf(World);
        expect(entity.id).toEqual("id");
        expect(entity.components).toEqual({});
    });

    describe("add", () => {
        it("should work", () => {
            entity.add(SimpleComponent, { isTest: true });
            expect(entity.components.SimpleComponent).toBeInstanceOf(SimpleComponent);
            expect(entity.components.SimpleComponent.isTest).toBe(true);
            expect(entity.world.matchQueries).toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("should work", () => {
            entity.add(SimpleComponent, { isTest: true });
            entity.remove("SimpleComponent");
            expect(entity.components.SimpleComponent).toBeFalsy();
            expect(entity.world.matchQueries).toHaveBeenCalled();
        });
    });

    describe("serialize", () => {
        it("should work", () => {
            entity.add(SimpleComponent);
            entity.add(ComplexComponent);
            const data = entity.serialize();

            expect(data).toEqual({
                id: "id",
                ComplexComponent: {
                    name: "ComplexComponent",
                    anArray: [1, 2, 3],
                    anObject: { a: "b" },
                    aString: "string",
                },
                SimpleComponent: {
                    name: "SimpleComponent",
                },
            });
        });
    });

    describe("fireEvent", () => {
        it("should work", () => {
            const mockHandled = vi.fn();
            const mockNotHandled = vi.fn();

            entity.add(ComponentWithEvents);
            entity.add(OtherComponentWithEvents);
            entity.fireEvent("onTargetHandled", { mock: mockHandled });
            entity.fireEvent("onTarget", { mock: mockNotHandled });

            expect(mockHandled).toHaveBeenCalledTimes(1);
            expect(mockNotHandled).toHaveBeenCalledTimes(2);
        });
    });
});
