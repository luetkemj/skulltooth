import { describe, it, expect } from "vitest";
import { Component, Engine } from "../../src/engine";

describe("Shenk", () => {
    it("should work", () => {
        // create engine
        const engine = new Engine();

        // create world
        const world = engine.createWorld();
        const world2 = engine.createWorld();

        // create components
        class Name extends Component {
            name = "Name";
            static properties = {
                moniker: "",
            };
        }

        class Position extends Component {
            name = "Position";
            static properties = {
                x: 0,
                y: 0,
            };

            onMove(evt) {
                this.x = evt.data.x || this.x;
                this.y = evt.data.y || this.y;
            }
        }

        class Living extends Component {
            name = "Living";
        }

        // register components
        engine.registerComponent(Name);
        engine.registerComponent(Position);
        engine.registerComponent(Living);

        // create queries
        const LivingQuery = world.createQuery({ all: ["Living"] });
        const NotLivingQuery = world.createQuery({ none: ["Living"] });

        // create entities
        const rock = world.createEntity("rockid");
        const frog = world.createEntity("frogid");

        // add components to entities
        rock.add(Position, { x: 1, y: 1 });
        rock.add(Name, { moniker: "Rock" });

        frog.add(Position, { x: 1, y: 1 });
        frog.add(Living);
        frog.add(Name, { moniker: "Frog" });

        expect(frog.components.Living).toBeTruthy();

        // modify components in a system
        LivingQuery.entities.forEach((eid) => {
            world.getEntity(eid).remove("Living");
        });

        expect(frog.components.Living).toBeFalsy();
        expect(LivingQuery.entities.size).toBe(0);

        NotLivingQuery.entities.forEach((eid) => {
            world.getEntity(eid).add(Living);
        });

        expect(frog.components.Living).toBeTruthy();
        expect(rock.components.Living).toBeTruthy();

        frog.fireEvent("onMove", { x: 2, y: 3 });

        expect(frog.components.Position.x).toBe(2);
        expect(frog.components.Position.y).toBe(3);

        const data = world.serialize();

        expect(data).toEqual({
            entities: [
                {
                    id: "rockid",
                    Position: { x: 1, y: 1 },
                    Name: { moniker: "Rock" },
                    Living: {},
                },
                {
                    id: "frogid",
                    Position: { x: 2, y: 3 },
                    Name: { moniker: "Frog" },
                    Living: {},
                },
            ],
        });

        world2.deserialize(data);

        const data2 = world2.serialize();

        expect(data2).toEqual({
            entities: [
                {
                    id: "rockid",
                    Position: { x: 1, y: 1 },
                    Name: { moniker: "Rock" },
                    Living: {},
                },
                {
                    id: "frogid",
                    Position: { x: 2, y: 3 },
                    Name: { moniker: "Frog" },
                    Living: {},
                },
            ],
        });
    });
});
