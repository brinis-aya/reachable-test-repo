from app import load_config, parse_xml, render_greeting


def test_load_config_reads_greeting():
    result = load_config("greeting: hello")
    assert result == {"greeting": "hello"}


def test_render_greeting_substitutes_name():
    assert render_greeting("Hello {{ name }}!", name="world") == "Hello world!"


def test_parse_xml_reads_child_text():
    root = parse_xml("<root><child>value</child></root>")
    assert root.find("child").text == "value"
