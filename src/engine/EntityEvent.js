export class EntityEvent {
    data = {};
    prevented = false;
    handled = false;

    constructor(name, data = {}) {
        this.name = name;
        this.data = data;
        this.handlerName = this.name;
    }

    is(name) {
        return this.name === name;
    }

    handle() {
        this.handled = true;
        this.prevented = true;
    }

    prevent() {
        this.prevented = true;
    }
}
