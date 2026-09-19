const { test } = require("node:test");
const assert = require("node:assert/strict");
const { mergeConfig } = require("../index.js");

test("mergeConfig merges override values over base values", () => {
  const result = mergeConfig({ a: 1, b: 2 }, { b: 3 });
  assert.deepEqual(result, { a: 1, b: 3 });
});
