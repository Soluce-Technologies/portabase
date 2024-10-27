import os
from functools import lru_cache

from settings.development import DevSettings
from settings.production import ProdSettings


@lru_cache
def get_settings():
    if os.getenv("ENVIRONMENT") == "development":
        return DevSettings()
    else:
        return ProdSettings()


config = get_settings()
