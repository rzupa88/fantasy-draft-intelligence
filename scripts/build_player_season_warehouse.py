# scripts/build_player_season_warehouse.py
from __future__ import annotations

import logging

from packages.data.warehouse.player_season import (
    build_and_write_player_season_warehouse,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


def main() -> None:
    seasons_label = "2023_2024"
    logger.info("Building player-season warehouse for %s", seasons_label)
    df = build_and_write_player_season_warehouse(seasons_label=seasons_label)
    logger.info(
        "Player-season warehouse complete: rows=%s cols=%s",
        len(df),
        len(df.columns),
    )


if __name__ == "__main__":
    main()
