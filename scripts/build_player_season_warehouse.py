# scripts/build_player_season_warehouse.py
from __future__ import annotations

import argparse
import logging

from packages.data.warehouse.player_season import build_and_write_player_season_warehouse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build the normalized player-season warehouse")
    parser.add_argument(
        "--seasons-label",
        default="2023_2024",
        help="Season range label used by the intermediate parquet files, e.g. 2023_2024",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    logger.info("Building player-season warehouse for %s", args.seasons_label)
    df = build_and_write_player_season_warehouse(seasons_label=args.seasons_label)
    logger.info(
        "Player-season warehouse complete: rows=%s cols=%s",
        len(df),
        len(df.columns),
    )


if __name__ == "__main__":
    main()
