import { describe, expectTypeOf, it } from "vitest";
import type { Middleware, MiddlewareContext } from "../src/index.js";

describe("middleware types", () => {
  it("Middleware is a function type", () => {
    expectTypeOf<Middleware>().toBeFunction();
  });

  it("MiddlewareContext has request, context, and next", () => {
    expectTypeOf<MiddlewareContext>().toHaveProperty("request");
    expectTypeOf<MiddlewareContext>().toHaveProperty("context");
    expectTypeOf<MiddlewareContext>().toHaveProperty("next");
  });
});
