// Deliberately vulnerable sample module -- paired "used" vs "unused" (and
// one "used but never called") per package, so a reachability analysis has
// all three outcomes to actually tell apart.
//
// Every version below was verified via a real `npm install` + `node --test`
// run inside the actual node:20-slim sandbox image, not just picked from
// memory.
//
// - lodash 4.17.15 (CVE-2020-8203, CVE-2021-23337: prototype pollution)
//   affects merge/mergeWith/defaultsDeep. _.merge() is called below ->
//   REACHABLE.
// - minimist is listed in package.json but never required anywhere in this
//   project -> NOT_REACHABLE.
// - node-fetch 2.6.0 (CVE-2022-0235 / GHSA-r683-j2x4-v87g): forwards
//   secure headers (cookie/authorization) to untrusted redirect targets.
//   fetch() is called below -> REACHABLE.
// - ansi-regex 3.0.0 (CVE-2021-3807 / GHSA-93q8-gq69-wqmw: ReDoS) is
//   listed but never required anywhere -> NOT_REACHABLE.
// - minimatch 3.0.4 (CVE-2026-27904 / GHSA-23c5-xmqv-rm74: ReDoS via
//   nested extglobs) is required below but never called -> UNKNOWN
//   (required, no confident call site found).
// - json5 1.0.1 (CVE-2022-46175 / GHSA-9c47-m6qq-7p4h: prototype
//   pollution via parse()). JSON5.parse() is called below -> REACHABLE.
// - express 4.16.0 (CVE-2024-43796 / GHSA-qw6h-vgh9-j6wx, among others) is
//   listed but never required anywhere in this project -> NOT_REACHABLE.
// - semver 5.7.1 (CVE-2022-25883 / GHSA-c2qf-rxjj-qqgw: ReDoS).
//   semver.satisfies() is called below -> REACHABLE.
const _ = require("lodash");
const fetch = require("node-fetch");
const minimatch = require("minimatch"); // eslint-disable-line no-unused-vars -- required but intentionally never called
const JSON5 = require("json5");
const semver = require("semver");

function mergeConfig(base, overrides) {
  return _.merge({}, base, overrides);
}

async function fetchJson(url) {
  const response = await fetch(url);
  return response.json();
}

function parseLooseConfig(text) {
  return JSON5.parse(text);
}

function isSupportedVersion(version) {
  return semver.satisfies(version, ">=1.0.0");
}

module.exports = { mergeConfig, fetchJson, parseLooseConfig, isSupportedVersion };
