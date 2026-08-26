# packages/data/warehouse/player_season.py
from __future__ import annotations

from pathlib import Path

import pandas as pd

from packages.data.constants import INTERMEDIATE_DATA_DIR
from packages.data.io import write_parquet
from packages.data.validation import ValidationError, assert_unique_key, require_columns

PROCESSED_DATA_DIR = Path("data/processed")

FANTASY_POSITIONS = {"QB", "RB", "WR", "TE"}
WAREHOUSE_KEY_COLUMNS = ["season", "canonical_player_id"]
WAREHOUSE_REQUIRED_COLUMNS = [
    "season",
    "canonical_player_id",
    "player_name",
    "normalized_player_name",
    "position",
    "team",
    "games_played",
    "fantasy_points_per_game",
    "adp_overall",
    "adp_pos_rank",
    "source_adp",
]


def _safe_mode(series: pd.Series):
    non_null = series.dropna()
    if non_null.empty:
        return None
    mode = non_null.mode()
    if mode.empty:
        return non_null.iloc[0]
    return mode.iloc[0]


def _build_adp_position_rank(adp_df: pd.DataFrame) -> pd.DataFrame:
    adp_df = adp_df.copy()

    require_columns(
        adp_df,
        [
            "season",
            "canonical_player_id",
            "position",
            "adp_overall",
        ],
    )

    adp_df = adp_df.sort_values(
        ["season", "position", "adp_overall", "canonical_player_id"]
    ).reset_index(drop=True)

    adp_df["adp_pos_rank"] = adp_df.groupby(["season", "position"]).cumcount() + 1

    return adp_df


def _assert_player_reference_coverage(
    player_reference_df: pd.DataFrame,
    stats_df: pd.DataFrame,
) -> None:
    reference_ids = set(player_reference_df["canonical_player_id"].dropna().astype(str))
    stats_ids = set(stats_df["canonical_player_id"].dropna().astype(str))
    missing_ids = sorted(stats_ids - reference_ids)

    if missing_ids:
        sample = missing_ids[:10]
        raise ValidationError(
            "Player reference table is missing canonical IDs used by the warehouse: "
            f"count={len(missing_ids)} sample={sample}"
        )


def aggregate_nflverse_to_player_season(nflverse_df: pd.DataFrame) -> pd.DataFrame:
    required = [
        "season",
        "canonical_player_id",
        "player_name",
        "normalized_player_name",
        "position",
        "team",
    ]
    require_columns(nflverse_df, required)

    df = nflverse_df.copy()

    # Expected weekly fantasy/stat columns may vary slightly across source versions.
    # We only aggregate columns that actually exist.
    sum_candidates = [
        "fantasy_points_ppr",
        "fantasy_points",
        "completions",
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
    sum_cols = [c for c in sum_candidates if c in df.columns]

    if "week" in df.columns:
        games_played_series = (
            df.groupby(WAREHOUSE_KEY_COLUMNS)["week"].nunique().rename("games_played")
        )
    else:
        games_played_series = df.groupby(WAREHOUSE_KEY_COLUMNS).size().rename("games_played")

    grouped = df.groupby(WAREHOUSE_KEY_COLUMNS, dropna=False)

    agg_dict: dict[str, str] = {col: "sum" for col in sum_cols}
    season_df = grouped.agg(agg_dict).reset_index()

    identity_df = grouped.agg(
        player_name=("player_name", _safe_mode),
        normalized_player_name=("normalized_player_name", _safe_mode),
        position=("position", _safe_mode),
        team=("team", _safe_mode),
    ).reset_index()

    season_df = season_df.merge(
        identity_df,
        on=WAREHOUSE_KEY_COLUMNS,
        how="left",
        validate="one_to_one",
    )

    season_df = season_df.merge(
        games_played_series.reset_index(),
        on=WAREHOUSE_KEY_COLUMNS,
        how="left",
        validate="one_to_one",
    )

    if "fantasy_points_ppr" in season_df.columns:
        season_df["fantasy_points_per_game"] = (
            season_df["fantasy_points_ppr"] / season_df["games_played"]
        ).round(2)
    elif "fantasy_points" in season_df.columns:
        season_df["fantasy_points_per_game"] = (
            season_df["fantasy_points"] / season_df["games_played"]
        ).round(2)
    else:
        season_df["fantasy_points_per_game"] = None

    assert_unique_key(season_df, WAREHOUSE_KEY_COLUMNS)

    return season_df


def prepare_adp_player_season(adp_df: pd.DataFrame) -> pd.DataFrame:
    required = [
        "season",
        "canonical_player_id",
        "player_name",
        "normalized_player_name",
        "position",
        "adp_overall",
        "source_name",
    ]
    require_columns(adp_df, required)

    df = _build_adp_position_rank(adp_df.copy())

    grouped = (
        df.sort_values(["season", "canonical_player_id", "adp_overall"])
        .groupby(WAREHOUSE_KEY_COLUMNS, dropna=False, as_index=False)
        .first()
    )

    grouped = grouped.rename(columns={"source_name": "source_adp"})

    keep_cols = [
        "season",
        "canonical_player_id",
        "player_name",
        "normalized_player_name",
        "position",
        "adp_overall",
        "adp_pos_rank",
        "source_adp",
    ]
    grouped = grouped[keep_cols]

    assert_unique_key(grouped, WAREHOUSE_KEY_COLUMNS)

    return grouped


def build_player_season_warehouse(
    nflverse_df: pd.DataFrame,
    adp_df: pd.DataFrame,
    player_reference_df: pd.DataFrame,
) -> pd.DataFrame:
    require_columns(
        player_reference_df,
        [
            "canonical_player_id",
            "normalized_player_name",
        ],
    )

    stats_df = aggregate_nflverse_to_player_season(nflverse_df)
    stats_df = stats_df[stats_df["position"].isin(FANTASY_POSITIONS)].copy()
    _assert_player_reference_coverage(player_reference_df, stats_df)

    adp_season_df = prepare_adp_player_season(adp_df)
    adp_season_df = adp_season_df[adp_season_df["position"].isin(FANTASY_POSITIONS)].copy()

    warehouse_df = stats_df.merge(
        adp_season_df[
            [
                "season",
                "canonical_player_id",
                "adp_overall",
                "adp_pos_rank",
                "source_adp",
            ]
        ],
        on=WAREHOUSE_KEY_COLUMNS,
        how="left",
        validate="one_to_one",
    )

    preferred_order = [
        "season",
        "canonical_player_id",
        "player_name",
        "normalized_player_name",
        "position",
        "team",
        "games_played",
        "fantasy_points_ppr",
        "fantasy_points",
        "fantasy_points_per_game",
        "adp_overall",
        "adp_pos_rank",
        "source_adp",
    ]
    existing_cols = [c for c in preferred_order if c in warehouse_df.columns]
    remaining_cols = [c for c in warehouse_df.columns if c not in existing_cols]
    warehouse_df = warehouse_df[existing_cols + remaining_cols]

    warehouse_df = warehouse_df.sort_values(
        ["season", "position", "adp_overall", "fantasy_points_per_game"],
        ascending=[True, True, True, False],
        na_position="last",
    ).reset_index(drop=True)

    require_columns(warehouse_df, WAREHOUSE_REQUIRED_COLUMNS)
    assert_unique_key(warehouse_df, WAREHOUSE_KEY_COLUMNS)

    return warehouse_df


def build_and_write_player_season_warehouse(
    seasons_label: str = "2023_2024",
) -> pd.DataFrame:
    intermediate_dir = Path(INTERMEDIATE_DATA_DIR)

    nflverse_path = intermediate_dir / f"nflverse_player_weekly_{seasons_label}.parquet"
    adp_path = intermediate_dir / f"adp_historical_{seasons_label}.parquet"
    player_ref_path = intermediate_dir / f"player_reference_{seasons_label}.parquet"

    nflverse_df = pd.read_parquet(nflverse_path)
    adp_df = pd.read_parquet(adp_path)
    player_reference_df = pd.read_parquet(player_ref_path)

    warehouse_df = build_player_season_warehouse(
        nflverse_df=nflverse_df,
        adp_df=adp_df,
        player_reference_df=player_reference_df,
    )

    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    output_path = PROCESSED_DATA_DIR / f"player_season_warehouse_{seasons_label}.parquet"
    write_parquet(warehouse_df, output_path)

    return warehouse_df
