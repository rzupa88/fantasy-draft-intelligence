from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from pathlib import Path

import nflreadpy as nfl
import polars as pl

REQUIRED_OUTPUT_COLUMNS = [
    "season",
    "week",
    "player_name",
    "team",
    "position",
    "fantasy_points",
]

TEAM_COLUMN_CANDIDATES = [
    "recent_team",
    "team",
    "team_abbr",
    "posteam",
]

PLAYER_NAME_CANDIDATES = [
    "player_display_name",
    "player_name",
]

FANTASY_POINTS_CANDIDATES = [
    "fantasy_points",
    "fantasy_points_ppr",
]


@dataclass(frozen=True)
class NflverseIngestConfig:
    years: Sequence[int]
    raw_dir: Path
    intermediate_dir: Path


def _first_existing_column(df: pl.DataFrame, candidates: Sequence[str]) -> str:
    for column in candidates:
        if column in df.columns:
            return column
    raise ValueError(f"None of the candidate columns exist: {candidates}")


def _normalize_weekly_player_stats(df: pl.DataFrame) -> pl.DataFrame:
    player_name_col = _first_existing_column(df, PLAYER_NAME_CANDIDATES)
    team_col = _first_existing_column(df, TEAM_COLUMN_CANDIDATES)
    fantasy_points_col = _first_existing_column(df, FANTASY_POINTS_CANDIDATES)

    required_source_columns = {
    "season",
    "week",
    player_name_col,
    team_col,
    "position",
    fantasy_points_col,
}
    missing = required_source_columns.difference(df.columns)
    if missing:
        raise ValueError(f"Missing required source columns: {sorted(missing)}")

    normalized = (
        df.select(
            [
                pl.col("season").cast(pl.Int64),
                pl.col("week").cast(pl.Int64),
                pl.col(player_name_col).alias("player_name").cast(pl.Utf8),
                pl.col(team_col).alias("team").cast(pl.Utf8),
                pl.col("position").cast(pl.Utf8),
                pl.col(fantasy_points_col).alias("fantasy_points").cast(pl.Float64),
            ]
        )
        .filter(
            pl.col("season").is_not_null()
            & pl.col("week").is_not_null()
            & pl.col("player_name").is_not_null()
        )
        .with_columns(
            [
                pl.col("player_name").str.strip_chars(),
                pl.col("team").str.strip_chars(),
                pl.col("position").str.strip_chars(),
            ]
        )
        .sort(["season", "week", "player_name"])
    )

    missing_output = [col for col in REQUIRED_OUTPUT_COLUMNS if col not in normalized.columns]
    if missing_output:
        raise ValueError(f"Normalized output missing required columns: {missing_output}")

    return normalized


def load_weekly_player_stats(years: Iterable[int]) -> pl.DataFrame:
    years = sorted({int(year) for year in years})
    if not years:
        raise ValueError("At least one year must be provided")

    # nflreadpy load_player_stats() returns a Polars DataFrame and supports
    # week/reg/post/reg+post summary levels.
    raw = nfl.load_player_stats(seasons=years, summary_level="week")
    if not isinstance(raw, pl.DataFrame):
        raw = pl.from_pandas(raw)

    return raw


def write_partitioned_snapshots(
    raw_df: pl.DataFrame,
    normalized_df: pl.DataFrame,
    config: NflverseIngestConfig,
) -> None:
    config.raw_dir.mkdir(parents=True, exist_ok=True)
    config.intermediate_dir.mkdir(parents=True, exist_ok=True)

    raw_path = (
        config.raw_dir
        / f"nflverse_player_stats_weekly_{min(config.years)}_{max(config.years)}.parquet"
    )

    normalized_path = (
        config.intermediate_dir
        / f"nflverse_player_weekly_{min(config.years)}_{max(config.years)}.parquet"
    )

    # actually write the files (this was missing / broken)
    raw_df.write_parquet(raw_path)
    normalized_df.write_parquet(normalized_path)


def ingest_nflverse_weekly_players(config: NflverseIngestConfig) -> pl.DataFrame:
    raw_df = load_weekly_player_stats(config.years)
    normalized_df = _normalize_weekly_player_stats(raw_df)
    write_partitioned_snapshots(raw_df=raw_df, normalized_df=normalized_df, config=config)
    return normalized_df