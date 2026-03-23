from __future__ import annotations

import argparse
from pathlib import Path

from packages.data.ingest.nflverse import NflverseIngestConfig, ingest_nflverse_weekly_players

DEFAULT_YEARS = [2023, 2024]
DEFAULT_RAW_DIR = Path("data/raw")
DEFAULT_INTERMEDIATE_DIR = Path("data/intermediate")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest weekly NFL player data from nflverse")
    parser.add_argument(
        "--years",
        nargs="+",
        type=int,
        default=DEFAULT_YEARS,
        help="Season years to ingest, e.g. --years 2023 2024",
    )
    parser.add_argument(
        "--raw-dir",
        type=Path,
        default=DEFAULT_RAW_DIR,
        help="Directory for raw parquet snapshots",
    )
    parser.add_argument(
        "--intermediate-dir",
        type=Path,
        default=DEFAULT_INTERMEDIATE_DIR,
        help="Directory for normalized parquet outputs",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    config = NflverseIngestConfig(
        years=args.years,
        raw_dir=args.raw_dir,
        intermediate_dir=args.intermediate_dir,
    )

    df = ingest_nflverse_weekly_players(config)
    print(
        f"Ingest complete: rows={df.height}, cols={df.width}, "
        f"years={min(args.years)}-{max(args.years)}"
    )


if __name__ == "__main__":
    main()