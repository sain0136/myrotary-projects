import { test } from "@japa/runner";
import assert from "assert";

function sum(a: number, b: number) {
  preChecks(a, b);
  return a + b;
}

function sub(a: number, b: number) {
  preChecks(a, b);
  return a - b;
}

function mult(a: number, b: number) {
  preChecks(a, b);
  return a * b;
}

function isNumber(...args: number[]) {
  const valid = args.every((arg) => typeof arg === "number");
  if (!valid) {
    throw new Error("Invalid input: all arguments must be numbers");
  }
}

function paraLimitException(...args: number[]) {
  const valid = args.every((arg) => arg < 1000);
  if (!valid) {
    throw new Error("Invalid input: all arguments must be less than 1000");
  }
}

function preChecks(...args: number[]) {
  isNumber(...args);
  paraLimitException(...args);
}


test.group("Math.libs", () => {
  test("sum", () => {
    assert.equal(sum(2, 2), 4);
  });

  test("sum with non-numeric inputs", () => {
    // TypeScript may prevent directly passing invalid types, so you might need to bypass type checks for testing purposes.
    assert.throws(() => sum('a' as any, 2), /Invalid input: all arguments must be numbers/);
  });

  test("sub", () => {
    assert.equal(sub(2, 2), 0);
  });

  test("sub with argument near upper limit", () => {
    assert.equal(sub(999, 1), 998);
  });

  test("sub with argument at upper limit", () => {
    assert.throws(
      () => sub(1000, 1),
      /Invalid input: all arguments must be less than 1000/
    );
  });

  test("mult", () => {
    assert.equal(mult(2, 2), 4);
    assert.equal(mult(2, 0), 0);
  });
});
