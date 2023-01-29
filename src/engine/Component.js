const deepClone = (ob) => JSON.parse(JSON.stringify(ob));

export class Component {
    static properties = {};

    constructor(properties = {}) {
        const intrinsics = this.constructor.properties;

        Object.assign(this, intrinsics, properties);
    }

    destroy() {
        this.entity.remove(this);
    }

    serialize() {
        const ob = {};

        for (const key in this.constructor.properties) {
            ob[key] = this[key];
        }

        return deepClone(ob);
    }

    _onAttached(entity) {
        this.entity = entity;
        this.onAttached(entity);
    }

    _onDestroyed() {
        this.onDestroyed();
        delete this.entity;
    }

    _onEvent(evt) {
        this.onEvent(evt);

        if (typeof this[evt.handlerName] === "function") {
            this[evt.handlerName](evt);
        }
    }

    onAttached(entity) { }
    onDestroyed() { }
    onEvent(evt) { }
}
