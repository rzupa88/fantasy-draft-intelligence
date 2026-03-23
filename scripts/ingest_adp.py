from __future__ import annotations

import argparse
from pathlib import Path

from packages.data.constants import (
    DEFAULT_PILOT_YEARS,
    INTERMEDIATE_DATA_DIR,
    RAW_DATA_DIR,
)
from packages.data.ingest.adp import (
    DEFAULT_SOURCE_URLS,
    AdpIngestConfig,
    ingest_historical_adp,
)
from packages.shared.logging import get_logger

logger = get_logger(__name__)

DEFAULT_RAW_DIR = Path(RAW_DATA_DIR)
DEFAULT_INTERMEDIATE_DIR = Path(INTERMEDIATE_DATA_DIR)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest historical fantasy football ADP data")
    parser.add_argument(
        "--years",
        nargs="+",
        type=int,
        default=DEFAULT_PILOT_YEARS,
        help="Season years to ingest, e.g. --years 2023 2024",
    )
    parser.add_argument(
        "--raw-dir",
        type=Path,
        default=DEFAULT_RAW_DIR,
        help="Directory for raw HTML snapshots",
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

    source_urls = {year: DEFAULT_SOURCE_URLS[year] for year in args.years}

    config = AdpIngestConfig(
        years=args.years,
        raw_dir=args.raw_dir,
        intermediate_dir=args.intermediate_dir,
        source_urls=source_urls,
    )

    logger.info("Ingesting historical ADP for seasons=%s", args.years)
    df = ingest_historical_adp(config)
    logger.info(
        "ADP ingest complete: rows=%s cols=%s years=%s-%s",
        len(df),
        len(df.columns),
        min(args.years),
        max(args.years),
    )


if __name__ == "__main__":
    main()