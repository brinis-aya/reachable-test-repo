# reachable-test-repo

A deliberately vulnerable sample project, built to test the
[Reachable](https://github.com/) security scanner end to end. **Do not use
these dependency versions in a real project.**

## What's in here, on purpose

Every version below carries a real advisory in [OSV.dev](https://osv.dev)
and was verified with a real `pip install`/`npm install` + test run inside
the actual sandbox base images (`python:3.12-slim`, `node:20-slim`) that
Reachable's fix-and-validate pipeline uses — not just picked from memory.
Several older, more "famous" CVE versions were tried first and rejected
because they no longer build or import on modern Python/Node.

| Ecosystem | Package | Version | Vulnerable? | Actually used in code? |
|---|---|---|---|---|
| Python (pip) | `PyYAML` | 5.3.1 | Yes — [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343) | **Reachable** — `app.py` calls `yaml.load()` |
| Python (pip) | `Pillow` | 10.0.0 | Yes — [CVE-2023-50447](https://nvd.nist.gov/vuln/detail/CVE-2023-50447), among ~35 others | **Not reachable** — never imported anywhere |
| Python (pip) | `Jinja2` | 3.1.2 | Yes — [CVE-2025-27516](https://nvd.nist.gov/vuln/detail/CVE-2025-27516) (sandbox breakout) | **Reachable** — `app.py` calls `Template().render()` |
| Python (pip) | `requests` | 2.19.0 | Yes — [CVE-2024-47081](https://nvd.nist.gov/vuln/detail/CVE-2024-47081) (`.netrc` credential leak) | **Not reachable** — never imported anywhere |
| Python (pip) | `paramiko` | 2.10.1 | Yes — [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795) ("Terrapin" SSH attack) | **Unknown** — imported in `app.py` but never called |
| Python (pip) | `lxml` | 4.9.3 | Yes — [CVE-2026-41066](https://nvd.nist.gov/vuln/detail/CVE-2026-41066) (XXE) | **Reachable** — `app.py` calls `etree.fromstring()` |
| Node (npm) | `lodash` | 4.17.15 | Yes — [CVE-2020-8203](https://nvd.nist.gov/vuln/detail/CVE-2020-8203) / [CVE-2021-23337](https://nvd.nist.gov/vuln/detail/CVE-2021-23337) | **Reachable** — `index.js` calls `_.merge()` |
| Node (npm) | `minimist` | 0.0.8 | Yes — [CVE-2020-7598](https://nvd.nist.gov/vuln/detail/CVE-2020-7598) | **Not reachable** — never required anywhere |
| Node (npm) | `node-fetch` | 2.6.0 | Yes — [CVE-2022-0235](https://nvd.nist.gov/vuln/detail/CVE-2022-0235) (leaks secure headers on redirect) | **Reachable** — `index.js` calls `fetch()` |
| Node (npm) | `ansi-regex` | 3.0.0 | Yes — [CVE-2021-3807](https://nvd.nist.gov/vuln/detail/CVE-2021-3807) (ReDoS) | **Not reachable** — never required anywhere |
| Node (npm) | `minimatch` | 3.0.4 | Yes — [CVE-2026-27904](https://nvd.nist.gov/vuln/detail/CVE-2026-27904) (ReDoS) | **Unknown** — required in `index.js` but never called |
| Node (npm) | `json5` | 1.0.1 | Yes — [CVE-2022-46175](https://nvd.nist.gov/vuln/detail/CVE-2022-46175) (prototype pollution) | **Reachable** — `index.js` calls `JSON5.parse()` |
| Node (npm) | `express` | 4.16.0 | Yes — [CVE-2024-43796](https://nvd.nist.gov/vuln/detail/CVE-2024-43796), among others | **Not reachable** — never required anywhere |
| Node (npm) | `semver` | 5.7.1 | Yes — [CVE-2022-25883](https://nvd.nist.gov/vuln/detail/CVE-2022-25883) (ReDoS) | **Reachable** — `index.js` calls `semver.satisfies()` |

The point: a good scanner should flag all fourteen as known vulnerabilities
via OSV.dev, but should also be able to tell the three outcomes apart —
**reachable** (real code calls into the vulnerable path), **not reachable**
(present in the manifest, never imported/required), and **unknown**
(imported/required, but no confident call site found) — rather than
treating every listed dependency as equally urgent.

## Running it

```bash
pip install -r requirements.txt
python app.py
pytest

npm install
npm test
```
