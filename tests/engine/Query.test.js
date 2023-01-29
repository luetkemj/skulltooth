import { beforeEach, describe, it, expect } from "vitest";
import { Component, Entity, Query, World } from "../../src/engine";

describe("Query", () => {
    let entity;
    let world;
    let aComponent;
    let bComponent;
    let cComponent;

    beforeEach(() => {
        world = new World();
        const id = "id";
        entity = new Entity(world, id);

        class A extends Component {
            static properties = {
                name: "aComponent",
            };
        }

        class B extends Component {
            static properties = {
                name: "bComponent",
            };
        }

        class C extends Component {
            static properties = {
                name: "cComponent",
            };
        }

        aComponent = A;
        bComponent = B;
        cComponent = C;
    });

    describe("matchAny", () => {
        it("should work", () => {
            const q = new Query({
                any: ["aComponent", "bComponent", "cComponent"],
            });

            expect(q.matchAny(entity)).toBeFalsy();

            entity.add(aComponent);

            expect(q.matchAny(entity)).toBeTruthy();
        });
    });

    describe("matchAll", () => {
        it("should work", () => {
            const q = new Query({
                all: ["aComponent", "bComponent", "cComponent"],
            });

            entity.add(aComponent);
            entity.add(bComponent);

            expect(q.matchAll(entity)).toBeFalsy();

            entity.add(cComponent);

            expect(q.matchAll(entity)).toBeTruthy();
        });
    });

    describe("matchNone", () => {
        it("should work", () => {
            const q = new Query({
                none: ["aComponent", "bComponent"],
            });

            entity.add(cComponent);

            expect(q.matchNone(entity)).toBeTruthy();

            entity.add(aComponent);

            expect(q.matchNone(entity)).toBeFalsy();
        });
    });

    describe("matches", () => {
        it("should work for matches", () => {
            const q = new Query({
                any: ["aComponent"],
                all: ["bComponent", "cComponent"],
                none: ["dComponent"],
            });

            entity.add(aComponent);
            entity.add(bComponent);
            entity.add(cComponent);

            q.matches(entity);

            expect(q.entities.has("id")).toBeTruthy();
        });

        it("should work for rejects", () => {
            const q = new Query({
                any: ["aComponent"],
                all: [],
                none: ["cComponent"],
            });

            entity.add(aComponent);
            entity.add(bComponent);
            entity.add(cComponent);

            q.matches(entity);

            expect(q.entities.has("id")).toBeFalsy();
        });

        it("should add matches and then delete rejections", () => {
            const q = new Query({
                any: ["aComponent"],
                all: [],
                none: ["cComponent"],
            });

            entity.add(aComponent);

            q.matches(entity);

            expect(q.entities.has("id")).toBeTruthy();

            entity.add(cComponent);

            q.matches(entity);

            expect(q.entities.has("id")).toBeFalsy();
        });
    });
});
