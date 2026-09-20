"""Tiny demo app that exercises several real, versioned vulnerabilities --
deliberately paired "used" vs "unused" (and one "used but not called") so a
reachability analysis has all three outcomes to actually tell apart.

Every version below was chosen and verified (via a real `pip install` +
`pytest` run inside the actual python:3.12-slim sandbox image, not just
picked from memory) to (a) carry a real advisory in OSV.dev and (b) still
actually install and import cleanly on modern Python -- several older,
more "famous" CVE versions (PyYAML/Pillow's originally pinned versions,
Jinja2 2.10, paramiko 2.0.0, lxml 4.6.2) were tried first and rejected
because they fail to build or fail at import time on Python 3.12.

- PyYAML 5.3.1 (CVE-2020-14343 / GHSA-8q59-q68h-6hv4): yaml.load() without
  an explicit safe Loader can deserialize arbitrary Python objects. Called
  below -> REACHABLE.
- Pillow 10.0.0 (CVE-2023-50447 / GHSA-3f63-hfp8-52jq, among ~35 others):
  arbitrary code execution via crafted image data. Never imported anywhere
  in this project -> NOT_REACHABLE.
- Jinja2 3.1.2 (CVE-2025-27516 / GHSA-cpwx-vrp4-4pq7): sandbox breakout via
  the `attr` filter selecting a format method. Template().render() is
  called below -> REACHABLE.
- requests 2.19.0 (CVE-2024-47081 / GHSA-9hjg-9r4m-mvj7): .netrc credential
  leak via a malicious URL. Listed in requirements.txt but never imported
  anywhere in this project -> NOT_REACHABLE.
- paramiko 2.10.1 (CVE-2023-48795 / GHSA-45x7-px36-x8w8, the "Terrapin"
  SSH prefix-truncation attack): imported below but never actually
  called -> UNKNOWN (imported, no confident call site found).
- lxml 4.9.3 (CVE-2026-41066 / GHSA-vfmq-68hx-4jfw): default iterparse()/
  ETCompatXMLParser() configuration allows XXE against local files.
  etree.fromstring() is called below -> REACHABLE.
"""
import paramiko  # noqa: F401 -- imported but intentionally never called
import yaml
from jinja2 import Template
from lxml import etree


def load_config(yaml_text: str) -> dict:
    return yaml.load(yaml_text, Loader=yaml.Loader)


def render_greeting(template_text: str, **context) -> str:
    return Template(template_text).render(**context)


def parse_xml(xml_text: str):
    return etree.fromstring(xml_text.encode("utf-8"))


if __name__ == "__main__":
    print(load_config("greeting: hello"))
    print(render_greeting("Hello {{ name }}!", name="world"))
    print(parse_xml("<root><child>value</child></root>"))
