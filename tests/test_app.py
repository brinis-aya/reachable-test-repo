from app import load_config


def test_load_config_reads_greeting():
    result = load_config("greeting: hello")
    assert result == {"greeting": "hello"}
