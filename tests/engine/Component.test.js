import { describe, it, expect } from "vitest";
import { Component } from "../../src/engine";
import { ComplexComponent, SimpleComponent } from "./data/components";

describe("Component", () => {
    it("extending should work", () => {
        const TestComponent = new SimpleComponent();

        expect(TestComponent.name).toBe("SimpleComponent");
        expect(TestComponent).toBeInstanceOf(Component);
    });

    it("constructor should work", () => {
        const TestComponent = new SimpleComponent({ foo: "fig" });

        expect(TestComponent.name).toBe("SimpleComponent");
        expect(TestComponent.foo).toBe("fig");
    });

    describe("serialize", () => {
        it("should work", () => {
            const TestComponent = new ComplexComponent();

            const data = TestComponent.serialize();

            expect(data).toEqual({
                name: "ComplexComponent",
                anArray: [1, 2, 3],
                anObject: { a: "b" },
                aString: "string",
            });
        });
    });
});
