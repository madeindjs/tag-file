import assert from "node:assert";
import { describe, it } from "node:test";
import { hasTag } from "./index.mjs";

describe(hasTag.name, () => {
  it("should detect tag at the end", () => assert.ok(hasTag("test#tag.txt", "tag")));

  it("should not detect the tag", () => assert.ok(!hasTag("test.txt", "tag")));

  it("should detect multiple tags", () => assert.ok(hasTag("test#tag1#tag2.txt", ["tag1", "tag2"])));

  it("should not detect multiple tags", () => assert.ok(!hasTag("test#tag1.txt", ["tag1", "tag2"])));
});
