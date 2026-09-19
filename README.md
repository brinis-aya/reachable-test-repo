# reachable-test-repo

A deliberately vulnerable sample project, built to test the
[Reachable](https://github.com/) security scanner end to end. **Do not use
these dependency versions in a real project.**

## What's in here, on purpose

| Ecosystem | Package | Version | Vulnerable? | Actually used in code? |
|---|---|---|---|---|
| Python (pip) | `PyYAML` | 5.3.1 | Yes — [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343), fixed in 5.4 | **Yes** — `app.py` calls `yaml.load()` |
| Python (pip) | `Pillow` | 8.1.0 | Yes — multiple CVEs, fixed in 8.1.2+ | **No** — never imported anywhere |
| Node (npm) | `lodash` | 4.17.15 | Yes — [CVE-2020-8203](https://nvd.nist.gov/vuln/detail/CVE-2020-8203) / [CVE-2021-23337](https://nvd.nist.gov/vuln/detail/CVE-2021-23337), fixed in 4.17.21 | **Yes** — `index.js` calls `_.merge()` |
| Node (npm) | `minimist` | 0.0.8 | Yes — [CVE-2020-7598](https://nvd.nist.gov/vuln/detail/CVE-2020-7598), fixed in 1.2.3/0.2.1 | **No** — never required anywhere |

The point: a good scanner should flag all four as known vulnerabilities via
OSV.dev, but should be able to tell that the PyYAML and lodash issues are
actually reachable (real code calls into the vulnerable path), while Pillow
and minimist are just present in the manifest and unused — lower priority,
not silently hidden.

## Running it

```bash
pip install -r requirements.txt
python app.py
pytest

npm install
npm test
```

Note: `PyYAML==5.3.1` and `Pillow==8.1.0` predate Python 3.12 and have no
prebuilt wheels for it, so `pip install` will try to compile them from
source there (slow, needs a C compiler) — use Python 3.9–3.11 if you want
to literally install these exact pinned versions. That's normal for old,
unpatched dependencies; it doesn't affect Reachable's ability to detect
them from `requirements.txt` alone.
