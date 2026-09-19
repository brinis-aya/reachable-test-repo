"""Tiny demo app that actually uses PyYAML's vulnerable code path.

PyYAML < 5.4 (CVE-2020-14343 / GHSA-8q59-q68h-6hv4): yaml.load() without an
explicit safe Loader can deserialize arbitrary Python objects. This module
calls it exactly that way, so a reachability analysis should flag this as
REACHABLE, not just "listed in requirements.txt".
"""
import yaml


def load_config(yaml_text: str) -> dict:
    return yaml.load(yaml_text, Loader=yaml.Loader)


if __name__ == "__main__":
    print(load_config("greeting: hello"))
