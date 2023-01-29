import { Component } from "./Component";
import { EntityEvent } from "./EntityEvent";

export class Entity {
    constructor(world, id) {
        this.world = world;
        this.id = id;
        this.components = {};
    }

    add(clazz, properties) {
        const component = new clazz(properties);

        const key = component.name;

        this.components[key] = component;

        component._onAttached(this);

        this.world.matchQueries(this);
    }

    remove(componentName) {
        const key = componentName;

        delete this.components[key];

        this.world.matchQueries(this);
    }

    destroy() {
        for (const k in this.components) {
            this.components[k]._onDestroyed();
            delete this.components[k];
        }

        this.world.matchQueries(this);
        this.world._destroyed(this.id);
        this.components = {};
        this.isDestroyed = true;
    }

    serialize() {
        const components = {};

        for (const key in this.components) {
            const component = this.components[key];

            if (component instanceof Component) {
                components[key] = component.serialize();
            }
        }

        return {
            id: this.id,
            ...components,
        };
    }

    clone() {
        return this.world.cloneEntity(this);
    }

    fireEvent(name, data) {
        const evt = new EntityEvent(name, data);

        for (const key in this.components) {
            const v = this.components[key];

            v._onEvent(evt);

            if (evt.prevented) {
                return evt;
            }
        }

        return evt;
    }
}
