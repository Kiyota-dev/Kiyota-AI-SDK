import { describe, expect, it } from "vitest";
import { combineHeaders } from "../src/headers/combine-headers.js";
import { withUserAgentSuffix } from "../src/headers/with-user-agent-suffix.js";
import { withoutTrailingSlash } from "../src/url/without-trailing-slash.js";

describe("header and url helpers", () => {
  it("combines headers and skips undefined", () => {
    expect(
      combineHeaders({ Authorization: "Bearer token" }, { "X-Custom": "value", Skip: undefined }),
    ).toEqual({
      Authorization: "Bearer token",
      "X-Custom": "value",
    });
  });

  it("adds user agent suffix", () => {
    expect(withUserAgentSuffix({ "User-Agent": "my-app" }, "nurovia/1.0.0")).toEqual({
      "User-Agent": "my-app nurovia/1.0.0",
    });
  });

  it("removes trailing slash", () => {
    expect(withoutTrailingSlash("https://api.example.com/")).toBe("https://api.example.com");
    expect(withoutTrailingSlash("https://api.example.com")).toBe("https://api.example.com");
    expect(withoutTrailingSlash(undefined)).toBeUndefined();
  });
});
