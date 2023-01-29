export class ComponentRegistry {
    _map = {};

    register(clazz) {
        const key = clazz.name;

        if (!clazz.name) {
            throw "Classes must have a name property";
        }

        this._map[key] = clazz;
    }

    get(key) {
        return this._map[key];
    }
}
