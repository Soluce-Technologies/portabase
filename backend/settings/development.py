from typing import List

from settings.base import Settings


class DevSettings(Settings):
    ALLOWED_HOSTS: List[str] = ["*"]
    SECRET_KEY: str = "changeme-secretkey"
    STAGE: bool = True
