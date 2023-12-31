import assert from "node:assert";
import { describe, it } from "node:test";
import { addTagToFilename, removeTagToFilename, toggleTagToFilename } from "./index.mjs";

describe(toggleTagToFilename.name, () => {
  it("should append a tag to a filename", () =>
    assert.strictEqual(toggleTagToFilename("test#tag1.txt", "tag"), "test#tag1#tag.txt"));

  it("should add a tag to a filename", () =>
    assert.strictEqual(toggleTagToFilename("test.txt", "tag"), "test#tag.txt"));

  it("should add a tag to an absolute file path", () =>
    assert.strictEqual(toggleTagToFilename("/home/me/test.txt", "tag"), "/home/me/test#tag.txt"));

  it("should remove a tag to a filename", () =>
    assert.strictEqual(toggleTagToFilename("test#tag.txt", "tag"), "test.txt"));

  it("should remove a tag to a filename and keep others", () =>
    assert.strictEqual(toggleTagToFilename("test#tag1#tag.txt", "tag"), "test#tag1.txt"));

  describe("multiple", () => {
    it("should add tags to a filename", () =>
      assert.strictEqual(toggleTagToFilename("test.txt", ["tag1", "tag2"]), "test#tag1#tag2.txt"));
  });
});

describe(toggleTagToFilename.name, () => {
  it("should add a tag to a filename", () =>
    assert.strictEqual(addTagToFilename("test#tag1.txt", "tag"), "test#tag1#tag.txt"));

  it("should not remove a tag to a filename", () =>
    assert.strictEqual(addTagToFilename("test#tag.txt", "tag"), "test#tag.txt"));
});

describe(removeTagToFilename.name, () => {
  it("should not add a tag to a filename", () =>
    assert.strictEqual(removeTagToFilename("test.txt", "tag"), "test.txt"));

  it("should remove a tag to a filename and keep others", () =>
    assert.strictEqual(removeTagToFilename("test#tag1#tag.txt", "tag"), "test#tag1.txt"));
});
