from __future__ import annotations

import argparse

from packages.data.io import write_parquet
from packages.data.ingest.nflverse import fetch_weekly_player_data
from packages.shared.logging import get_logger

logger = get_logger(__name__)


def main(years: list[int]) -> None:
    logger.info("Fetching nflverse weekly player data for years=%s", years)
    df = fetch_weekly_player_data(years)
    output_path = "data/raw/nflverse_weekly_sample.parquet"
    write_parquet(df, output_path)
    logger.info("Wrote %s rows to %s", len(df), output_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--years", nargs="+", type=int, required=True)
    args = parser.parse_args()
    main(args.years)
