import { Entity } from "./Entity";
import { Query } from "./Query";

export class World {
    _id = 0;
    _entities = new Map();
    _queries = [];

    constructor(engine) {
        this.engine = engine;
    }

    createId() {
        return ++this._id + Math.random().toString(36).slice(2, 10);
    }

    getEntity(id) {
        return this._entities.get(id);
    }

    getEntities() {
        return this._entities.values();
    }

    createEntity(id = this.createId()) {
        const entity = new Entity(this, id);

        this._entities.set(id, entity);

        return entity;
    }

    destroyEntity(id) {
        const entity = this.getEntity(id);

        if (entity) {
            entity.destroy();
        }
    }

    destroyEntities() {
        this._entities.forEach((entity) => {
            entity.destroy();
        });
    }

    destroy() {
        this.destroyEntities();
        this._id = 0;
        this._queries = [];
        this._entities = new Map();
    }

    createQuery(filters) {
        const query = new Query(filters);

        this._queries.push(query);

        return query;
    }

    matchQueries(entity) {
        this._queries.forEach((q) => q.matches(entity));
    }

    serialize(entities) {
        const json = [];
        const list = entities || this._entities;

        list.forEach((e) => {
            json.push(e.serialize());
        });

        return {
            entities: json,
        };
    }

    cloneEntity(entity) {
        const data = entity.serialize();

        data.id = this.createId();

        return this._deserializeEntity(data);
    }

    deserialize(data) {
        for (const entityData of data.entities) {
            this._deserializeEntity(entityData);
        }
    }

    _createOrGetEntityById(id) {
        return this.getEntity(id) || this.createEntity(id);
    }

    _deserializeEntity(data) {
        const { id, ...components } = data;
        const entity = this._createOrGetEntityById(id);

        Object.entries(components).forEach(([key, value]) => {
            const def = this.engine._components.get(key);
            entity.add(def, value);
        });

        return entity;
    }

    _destroyed(id) {
        return this._entities.delete(id);
    }
}
