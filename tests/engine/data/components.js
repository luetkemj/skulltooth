import { Component } from "../../../src/engine";

export class SimpleComponent extends Component {
    static properties = {
        name: "SimpleComponent",
    };
}

export class ComplexComponent extends Component {
    static properties = {
        name: "ComplexComponent",
        anArray: [1, 2, 3],
        anObject: { a: "b" },
        aString: "string",
    };
}

export class ComponentWithEvents extends Component {
    static properties = {
        name: "ComponentWithEvents",
    };

    onTarget(evt) {
        evt.data.mock();
    }

    onTargetHandled(evt) {
        evt.data.mock();
        evt.handle();
    }
}

export class OtherComponentWithEvents extends Component {
    static properties = {
        name: "OtherComponentWithEvents",
    };

    onTarget(evt) {
        evt.data.mock();
    }

    onTargetHandled(evt) {
        evt.data.mock();
        evt.handle();
    }
}

