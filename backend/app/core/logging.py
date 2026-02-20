import logging
import sys
from typing import Any

_LOGgers: dict[str, logging.Logger] = {}


def setup_logging(
    level: str | int = "INFO",
    format_string: str | None = None,
) -> None:
    if format_string is None:
        format_string = "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s"
    if isinstance(level, str):
        level = getattr(logging, level.upper(), logging.INFO)
    logging.basicConfig(
        level=level,
        format=format_string,
        datefmt="%Y-%m-%d %H:%M:%S",
        stream=sys.stdout,
        force=True,
    )


def get_logger(name: str) -> logging.Logger:
    if name not in _LOGgers:
        _LOGgers[name] = logging.getLogger(name)
    return _LOGgers[name]
