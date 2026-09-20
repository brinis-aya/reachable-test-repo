const { test } = require("node:test");
const assert = require("node:assert/strict");
const { mergeConfig, parseLooseConfig, isSupportedVersion } = require("../index.js");

test("mergeConfig merges override values over base values", () => {
  const result = mergeConfig({ a: 1, b: 2 }, { b: 3 });
  assert.deepEqual(result, { a: 1, b: 3 });
});

test("parseLooseConfig reads JSON5 with trailing commas", () => {
  const result = parseLooseConfig("{ a: 1, b: 2, }");
  assert.deepEqual(result, { a: 1, b: 2 });
});

test("isSupportedVersion accepts versions above 1.0.0", () => {
  assert.equal(isSupportedVersion("2.3.4"), true);
  assert.equal(isSupportedVersion("0.9.0"), false);
});
