import { describe, expect, it } from "vitest";
import { validate, type FieldSpec } from "./validate";

const spec: FieldSpec[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "quantity", label: "Quantity", type: "number", required: true },
  { name: "category", label: "Category", type: "select", options: ["a", "b"] },
];

describe("validate", () => {
  it("flags a missing required field", () => {
    const errors = validate({ quantity: 1 }, spec);
    expect(errors.name).toBe("Name is required");
  });

  it("flags a non-numeric value for a number field", () => {
    const errors = validate({ name: "Item", quantity: "abc" }, spec);
    expect(errors.quantity).toBe("Quantity must be a number");
  });

  it("returns no errors for valid values", () => {
    const errors = validate({ name: "Item", quantity: 3, category: "a" }, spec);
    expect(errors).toEqual({});
  });
});
