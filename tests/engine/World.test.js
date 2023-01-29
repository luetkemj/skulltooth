import { beforeEach, describe, it, expect, vi } from "vitest";
import { ComplexComponent, SimpleComponent } from "./data/components";
import { Engine, Entity, Query, World } from "../../src/engine";

describe("World", () => {
    let world;

    beforeEach(() => {
        world = new World();
    });

    describe("getEntity", () => {
        it("should work", () => {
            const entity = world.createEntity("eid1");
            expect(world.getEntity("eid1")).toBe(entity);
        });
    });

    describe("getEntities", () => {
        it("should work", () => {
            const e1 = world.createEntity("eid1");
            const e2 = world.createEntity("eid2");

            const entities = [...world.getEntities()];

            expect(entities.length).toBe(2);
            expect(entities.includes(e1)).toBeTruthy();
            expect(entities.includes(e2)).toBeTruthy();
        });
    });

    describe("createEntity", () => {
        it("should create an instance of Entity on _entities", () => {
            const entity = world.createEntity("eid1");

            expect(entity).toBeInstanceOf(Entity);
        });

        it("should work with a provided ID", () => {
            const entity = world.createEntity("eid1");

            expect(world._entities.get("eid1")).toBe(entity);
        });

        it("should work without a provided ID", () => {
            const entity = world.createEntity();

            expect(world._entities.get(entity.id)).toBe(entity);
        });
    });

    describe("serialize", () => {
        it("should work", () => {
            const e1 = world.createEntity("eid1");
            const e2 = world.createEntity("eid2");

            e1.add(SimpleComponent);
            e2.add(ComplexComponent);

            const data = world.serialize();

            expect(data).toEqual({
                entities: [
                    {
                        SimpleComponent: {
                            name: "SimpleComponent",
                        },
                        id: "eid1",
                    },
                    {
                        ComplexComponent: {
                            aString: "string",
                            anArray: [1, 2, 3],
                            anObject: {
                                a: "b",
                            },
                            name: "ComplexComponent",
                        },
                        id: "eid2",
                    },
                ],
            });
        });
    });

    describe("deserialize", () => {
        it("should work", () => {
            // create engine
            const eng = new Engine();

            // register components
            eng.registerComponent(SimpleComponent);
            eng.registerComponent(ComplexComponent);

            // create world1
            const wrld = eng.createWorld();

            // add entities
            const e1 = wrld.createEntity("eid1");
            const e2 = wrld.createEntity("eid2");

            // add components
            e1.add(SimpleComponent);
            e2.add(ComplexComponent);

            // serialize world1
            const data = wrld.serialize();

            // create world2
            const wrld2 = eng.createWorld();

            // deserialize world1 data into world2
            wrld2.deserialize(data);

            // make assertions
            const entities = [...wrld2.getEntities()];
            expect(entities.length).toBe(2);
            expect(wrld2.getEntity("eid1")).toBeTruthy();
            expect(wrld2.getEntity("eid2")).toBeTruthy();
        });
    });

    describe("createQuery", () => {
        it("should work", () => {
            world.createQuery({ any: ["A"] });

            expect(world._queries.length).toBe(1);
            expect(world._queries[0]).toBeInstanceOf(Query);
        });
    });

    describe("matchQueries", () => {
        it("should try to match all queries in the world", () => {
            world.createQuery({ any: ["A"] });
            world.createQuery({ all: ["B"] });
            world.createQuery({ none: ["C"] });

            const e1 = world.createEntity("eid1");

            world._queries[0].matches = vi.fn();
            world._queries[1].matches = vi.fn();
            world._queries[2].matches = vi.fn();

            world.matchQueries(e1);

            expect(world._queries[0].matches).toHaveBeenCalledTimes(1);
            expect(world._queries[1].matches).toHaveBeenCalledTimes(1);
            expect(world._queries[2].matches).toHaveBeenCalledTimes(1);
        });
    });
});
