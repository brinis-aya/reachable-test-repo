// Tiny demo module that actually uses lodash's merge/defaultsDeep path.
//
// lodash < 4.17.19/4.17.21 (CVE-2020-8203, CVE-2021-23337: prototype
// pollution) affects the merge/mergeWith/defaultsDeep family. Calling
// _.merge() here on user-shaped input means a reachability analysis should
// flag this as REACHABLE, not just "listed in package.json".
//
// minimist is intentionally listed in package.json but never required
// anywhere in this project, as the "not reachable" counterpart.
const _ = require("lodash");

function mergeConfig(base, overrides) {
  return _.merge({}, base, overrides);
}

module.exports = { mergeConfig };
