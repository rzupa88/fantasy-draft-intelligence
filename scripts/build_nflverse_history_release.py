from __future__ import annotations

import argparse
from datetime import UTC, datetime
from pathlib import Path

from packages.data.nflverse_history import (
    NflverseHistoryConfig,
    build_and_write_nflverse_history_release,
)


def parse_args() -> argparse.Namespace:
    current_year = datetime.now(UTC).year
    parser = argparse.ArgumentParser(
        description="Build a compact NFLverse identity and prior-season history release"
    )
    parser.add_argument(
        "--prior-season",
        type=int,
        default=current_year - 1,
        help="Completed NFL season to summarize, e.g. 2025",
    )
    parser.add_argument(
        "--roster-season",
        type=int,
        default=current_year,
        help="Current roster season used for team and rookie identity data, e.g. 2026",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output JSON path. Defaults under data/processed/.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    output = args.output or Path(
        f"data/processed/nflverse_history_{args.prior_season}_{args.roster_season}.json"
    )
    release = build_and_write_nflverse_history_release(
        NflverseHistoryConfig(
            prior_season=args.prior_season,
            roster_season=args.roster_season,
            output_path=output,
        )
    )
    players = release["players"]
    with_history = sum(player["prior_season_stats"] is not None for player in players)
    print(
        f"NFLverse history release written: {output} | "
        f"players={len(players)} | prior_stats={with_history}"
    )


if __name__ == "__main__":
    main()
