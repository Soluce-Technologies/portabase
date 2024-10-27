from settings.base import Settings


class ProdSettings(Settings):
    CRON: bool = True

