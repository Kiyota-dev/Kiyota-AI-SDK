import { describe, expect, it } from "vitest";

describe("cli placeholder", () => {
  it("exports commands", async () => {
    const { chatCommand } = await import("../src/commands/chat.js");
    expect(typeof chatCommand).toBe("function");
  });
});
