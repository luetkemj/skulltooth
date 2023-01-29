import _ from "lodash";

export class Query {
    constructor(filters) {
        this.entities = new Set();

        this.any = filters.any || [];
        this.all = filters.all || [];
        this.none = filters.none || [];
    }

    matchAny(entity) {
        if (this.any.length) {
            return _.some(
                this.any,
                (componentName) => entity.components[componentName]
            );
        }

        return true;
    }

    matchAll(entity) {
        if (this.all.length) {
            return _.every(
                this.all,
                (componentName) => entity.components[componentName]
            );
        }

        return true;
    }

    matchNone(entity) {
        if (this.none.length) {
            return _.every(
                this.none,
                (componentName) => !entity.components[componentName]
            );
        }

        return true;
    }

    matches(entity) {
        if (
            this.matchAny(entity) &&
            this.matchAll(entity) &&
            this.matchNone(entity)
        ) {
            this.entities.add(entity.id);
        } else {
            this.entities.delete(entity.id);
        }
    }
}
