from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import nflreadpy as nfl
import polars as pl

from packages.data.player_ids import normalize_player_name, normalize_position

HISTORY_SCHEMA_VERSION = "1.0"
SOURCE_NAME = "nflverse"

ID_CANDIDATES = ["gsis_id", "player_id", "nfl_id"]
PLAYER_NAME_CANDIDATES = ["display_name", "player_display_name", "full_name", "player_name"]
ROSTER_NAME_CANDIDATES = ["full_name", "player_name", "display_name", "player_display_name"]
POSITION_CANDIDATES = ["position", "position_group"]
TEAM_CANDIDATES = ["team", "team_abbr", "recent_team"]
STATUS_CANDIDATES = ["status", "roster_status"]

SUM_COLUMNS = [
    "attempts",
    "passing_yards",
    "passing_tds",
    "interceptions",
    "carries",
    "rushing_yards",
    "rushing_tds",
    "targets",
    "receptions",
    "receiving_yards",
    "receiving_tds",
]
FUMBLE_COLUMNS = ["passing_fumbles_lost", "rushing_fumbles_lost", "receiving_fumbles_lost"]


@dataclass(frozen=True)
class NflverseHistoryConfig:
    prior_season: int
    roster_season: int
    output_path: Path


def _first_existing_column(
    df: pl.DataFrame,
    candidates: list[str],
    *,
    required: bool = True,
) -> str | None:
    for column in candidates:
        if column in df.columns:
            return column
    if required:
        raise ValueError(f"None of the candidate columns exist: {candidates}")
    return None


def _numeric_expr(df: pl.DataFrame, column: str) -> pl.Expr:
    if column not in df.columns:
        return pl.lit(0.0).alias(column)
    return pl.col(column).cast(pl.Float64, strict=False).fill_null(0.0).alias(column)


def _normalize_players(players: pl.DataFrame) -> pl.DataFrame:
    id_col = _first_existing_column(players, ID_CANDIDATES)
    name_col = _first_existing_column(players, PLAYER_NAME_CANDIDATES)
    position_col = _first_existing_column(players, POSITION_CANDIDATES)

    alias_columns = [column for column in PLAYER_NAME_CANDIDATES if column in players.columns]
    selected = players.select(
        [
            (
                pl.col(id_col)
                .cast(pl.Utf8, strict=False)
                .str.strip_chars()
                .alias("nflverse_player_id")
            ),
            (
                pl.col(name_col)
                .cast(pl.Utf8, strict=False)
                .str.strip_chars()
                .alias("player_name")
            ),
            pl.col(position_col)
            .map_elements(normalize_position, return_dtype=pl.Utf8)
            .alias("position"),
            *[
                pl.col(column)
                .cast(pl.Utf8, strict=False)
                .str.strip_chars()
                .alias(f"alias_{index}")
                for index, column in enumerate(alias_columns)
            ],
        ]
    ).filter(pl.col("nflverse_player_id").is_not_null() & (pl.col("nflverse_player_id") != ""))

    alias_names = [column for column in selected.columns if column.startswith("alias_")]
    return (
        selected.with_columns(
            pl.concat_list([pl.col(column) for column in alias_names])
            .list.drop_nulls()
            .list.unique()
            .alias("aliases")
        )
        .drop(alias_names)
        .unique(subset=["nflverse_player_id"], keep="first")
    )


def _normalize_rosters(rosters: pl.DataFrame, roster_season: int) -> pl.DataFrame:
    id_col = _first_existing_column(rosters, ID_CANDIDATES)
    name_col = _first_existing_column(rosters, ROSTER_NAME_CANDIDATES)
    position_col = _first_existing_column(rosters, POSITION_CANDIDATES)
    team_col = _first_existing_column(rosters, TEAM_CANDIDATES, required=False)
    status_col = _first_existing_column(rosters, STATUS_CANDIDATES, required=False)

    filtered = rosters
    if "season" in filtered.columns:
        filtered = filtered.filter(pl.col("season").cast(pl.Int64, strict=False) == roster_season)

    return (
        filtered.select(
            [
                (
                    pl.col(id_col)
                    .cast(pl.Utf8, strict=False)
                    .str.strip_chars()
                    .alias("nflverse_player_id")
                ),
                (
                    pl.col(name_col)
                    .cast(pl.Utf8, strict=False)
                    .str.strip_chars()
                    .alias("roster_name")
                ),
                pl.col(position_col)
                .map_elements(normalize_position, return_dtype=pl.Utf8)
                .alias("roster_position"),
                (
                    pl.col(team_col).cast(pl.Utf8, strict=False).str.strip_chars()
                    if team_col is not None
                    else pl.lit(None, dtype=pl.Utf8)
                ).alias("current_team"),
                (
                    pl.col(status_col).cast(pl.Utf8, strict=False).str.strip_chars()
                    if status_col is not None
                    else pl.lit(None, dtype=pl.Utf8)
                ).alias("roster_status"),
            ]
        )
        .filter(pl.col("nflverse_player_id").is_not_null() & (pl.col("nflverse_player_id") != ""))
        .unique(subset=["nflverse_player_id"], keep="last")
    )


def _aggregate_prior_stats(stats: pl.DataFrame, prior_season: int) -> pl.DataFrame:
    id_col = _first_existing_column(stats, ID_CANDIDATES)
    working = stats
    if "season" in working.columns:
        working = working.filter(pl.col("season").cast(pl.Int64, strict=False) == prior_season)
    if "season_type" in working.columns:
        working = working.filter(pl.col("season_type").cast(pl.Utf8).str.to_uppercase() == "REG")

    fantasy_points_col = _first_existing_column(
        working,
        ["fantasy_points", "fantasy_points_standard"],
        required=False,
    )
    fantasy_points_ppr_col = _first_existing_column(
        working,
        ["fantasy_points_ppr", "fantasy_points"],
        required=False,
    )
    if fantasy_points_col is None or fantasy_points_ppr_col is None:
        raise ValueError("NFLverse stats must contain fantasy_points or fantasy_points_ppr.")

    week_expr = (
        pl.col("week").cast(pl.Int64, strict=False)
        if "week" in working.columns
        else pl.int_range(0, pl.len(), eager=False)
    )
    prepared = working.select(
        [
            (
                pl.col(id_col)
                .cast(pl.Utf8, strict=False)
                .str.strip_chars()
                .alias("nflverse_player_id")
            ),
            week_expr.alias("week"),
            pl.col(fantasy_points_col)
            .cast(pl.Float64, strict=False)
            .fill_null(0.0)
            .alias("fantasy_points_standard"),
            pl.col(fantasy_points_ppr_col)
            .cast(pl.Float64, strict=False)
            .fill_null(0.0)
            .alias("fantasy_points_ppr"),
            *[_numeric_expr(working, column) for column in SUM_COLUMNS],
            *[_numeric_expr(working, column) for column in FUMBLE_COLUMNS],
        ]
    ).filter(pl.col("nflverse_player_id").is_not_null() & (pl.col("nflverse_player_id") != ""))

    prepared = prepared.with_columns(
        [
            (pl.col("fantasy_points_standard") + pl.col("receptions") * 0.5).alias(
                "fantasy_points_half_ppr"
            ),
            pl.sum_horizontal([pl.col(column) for column in FUMBLE_COLUMNS]).alias(
                "fumbles_lost"
            ),
        ]
    )

    aggregated = prepared.group_by("nflverse_player_id").agg(
        [
            pl.col("week").n_unique().cast(pl.Int64).alias("games"),
            pl.col("fantasy_points_standard").sum().alias("fantasy_points_standard"),
            pl.col("fantasy_points_half_ppr").sum().alias("fantasy_points_half_ppr"),
            pl.col("fantasy_points_ppr").sum().alias("fantasy_points_ppr"),
            pl.col("fantasy_points_half_ppr")
            .std(ddof=0)
            .fill_null(0.0)
            .alias("weekly_points_stddev_half_ppr"),
            *[pl.col(column).sum().alias(column) for column in SUM_COLUMNS],
            pl.col("fumbles_lost").sum().alias("fumbles_lost"),
        ]
    )

    return aggregated.with_columns(
        [
            (pl.col("fantasy_points_standard") / pl.col("games")).alias(
                "points_per_game_standard"
            ),
            (pl.col("fantasy_points_half_ppr") / pl.col("games")).alias(
                "points_per_game_half_ppr"
            ),
            (pl.col("fantasy_points_ppr") / pl.col("games")).alias(
                "points_per_game_ppr"
            ),
        ]
    )


def build_nflverse_history_release(
    *,
    players: pl.DataFrame,
    rosters: pl.DataFrame,
    stats: pl.DataFrame,
    prior_season: int,
    roster_season: int,
    generated_at: str | None = None,
) -> dict[str, Any]:
    if prior_season < 2000 or roster_season < prior_season:
        raise ValueError("History and roster seasons are invalid.")

    generated_at = generated_at or datetime.now(UTC).isoformat()
    player_rows = _normalize_players(players)
    roster_rows = _normalize_rosters(rosters, roster_season)
    history_rows = _aggregate_prior_stats(stats, prior_season)

    identities = player_rows.join(roster_rows, on="nflverse_player_id", how="full", coalesce=True)
    identities = identities.with_columns(
        [
            pl.coalesce([pl.col("player_name"), pl.col("roster_name")]).alias("display_name"),
            pl.coalesce([pl.col("position"), pl.col("roster_position")]).alias(
                "resolved_position"
            ),
        ]
    )
    identities = identities.filter(
        pl.col("display_name").is_not_null()
        & pl.col("resolved_position").is_in(["QB", "RB", "WR", "TE", "K"])
    )
    enriched = identities.join(history_rows, on="nflverse_player_id", how="left")

    stat_fields = [
        "games",
        "fantasy_points_standard",
        "fantasy_points_half_ppr",
        "fantasy_points_ppr",
        "points_per_game_standard",
        "points_per_game_half_ppr",
        "points_per_game_ppr",
        "weekly_points_stddev_half_ppr",
        *SUM_COLUMNS,
        "fumbles_lost",
    ]

    output_players: list[dict[str, Any]] = []
    for row in enriched.sort(["resolved_position", "display_name"]).iter_rows(named=True):
        history = None
        if row.get("games") is not None:
            history = {"season": prior_season}
            for field in stat_fields:
                value = row.get(field)
                if isinstance(value, float):
                    value = round(value, 3)
                history[field] = value

        aliases = [
            alias
            for alias in (row.get("aliases") or [])
            if isinstance(alias, str) and alias.strip()
        ]
        roster_name = row.get("roster_name")
        if isinstance(roster_name, str) and roster_name.strip():
            aliases.append(roster_name.strip())
        display_name = str(row["display_name"]).strip()
        if display_name not in aliases:
            aliases.append(display_name)

        output_players.append(
            {
                "nflverse_player_id": row["nflverse_player_id"],
                "canonical_player_id": f"nflverse:{row['nflverse_player_id']}",
                "display_name": display_name,
                "normalized_name": normalize_player_name(display_name),
                "aliases": sorted(set(aliases)),
                "position": row["resolved_position"],
                "current_team": row.get("current_team"),
                "roster_status": row.get("roster_status"),
                "prior_season_stats": history,
            }
        )

    return {
        "schema_version": HISTORY_SCHEMA_VERSION,
        "source": SOURCE_NAME,
        "prior_season": prior_season,
        "roster_season": roster_season,
        "generated_at": generated_at,
        "players": output_players,
    }


def fetch_nflverse_history_inputs(
    *,
    prior_season: int,
    roster_season: int,
) -> tuple[pl.DataFrame, pl.DataFrame, pl.DataFrame]:
    players = nfl.load_players()
    rosters = nfl.load_rosters(seasons=[roster_season])
    stats = nfl.load_player_stats(seasons=[prior_season], summary_level="week")
    return players, rosters, stats


def write_nflverse_history_release(release: dict[str, Any], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(release, indent=2, sort_keys=True), encoding="utf-8")


def build_and_write_nflverse_history_release(config: NflverseHistoryConfig) -> dict[str, Any]:
    players, rosters, stats = fetch_nflverse_history_inputs(
        prior_season=config.prior_season,
        roster_season=config.roster_season,
    )
    release = build_nflverse_history_release(
        players=players,
        rosters=rosters,
        stats=stats,
        prior_season=config.prior_season,
        roster_season=config.roster_season,
    )
    write_nflverse_history_release(release, config.output_path)
    return release
