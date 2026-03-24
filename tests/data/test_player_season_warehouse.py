from __future__ import annotations

import pandas as pd

from packages.data.warehouse.player_season import (
    aggregate_nflverse_to_player_season,
    build_player_season_warehouse,
    prepare_adp_player_season,
)


def test_aggregate_nflverse_to_player_season_rolls_up_weekly_rows():
    nflverse_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "week": 1,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 10.0,
                "receiving_yards": 50,
            },
            {
                "season": 2024,
                "week": 2,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 20.0,
                "receiving_yards": 100,
            },
        ]
    )

    result = aggregate_nflverse_to_player_season(nflverse_df)

    assert len(result) == 1
    assert result.loc[0, "games_played"] == 2
    assert result.loc[0, "fantasy_points_ppr"] == 30.0
    assert result.loc[0, "receiving_yards"] == 150
    assert result.loc[0, "fantasy_points_per_game"] == 15.0


def test_prepare_adp_player_season_adds_position_rank():
    adp_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "canonical_player_id": "rb_1",
                "player_name": "RB One",
                "normalized_player_name": "rb one",
                "position": "RB",
                "adp_overall": 5.0,
                "source_name": "fantasypros",
            },
            {
                "season": 2024,
                "canonical_player_id": "rb_2",
                "player_name": "RB Two",
                "normalized_player_name": "rb two",
                "position": "RB",
                "adp_overall": 10.0,
                "source_name": "fantasypros",
            },
        ]
    )

    result = prepare_adp_player_season(adp_df)

    assert len(result) == 2
    assert result.loc[result["canonical_player_id"] == "rb_1", "adp_pos_rank"].iloc[0] == 1
    assert result.loc[result["canonical_player_id"] == "rb_2", "adp_pos_rank"].iloc[0] == 2


def test_build_player_season_warehouse_merges_stats_and_adp():
    nflverse_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "week": 1,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 10.0,
            },
            {
                "season": 2024,
                "week": 2,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 20.0,
            },
        ]
    )

    adp_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "adp_overall": 12.0,
                "source_name": "fantasypros",
            }
        ]
    )

    player_reference_df = pd.DataFrame(
        [
            {
                "canonical_player_id": "player_1",
                "normalized_player_name": "a player",
                "source_name": "nflverse",
                "source_player_name": "A Player",
            }
        ]
    )

    result = build_player_season_warehouse(
        nflverse_df=nflverse_df,
        adp_df=adp_df,
        player_reference_df=player_reference_df,
    )

    assert len(result) == 1
    assert result.loc[0, "season"] == 2024
    assert result.loc[0, "canonical_player_id"] == "player_1"
    assert result.loc[0, "fantasy_points_ppr"] == 30.0
    assert result.loc[0, "games_played"] == 2
    assert result.loc[0, "adp_overall"] == 12.0


def test_build_player_season_warehouse_filters_to_fantasy_positions():
    nflverse_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "week": 1,
                "canonical_player_id": "qb_1",
                "player_name": "QB One",
                "normalized_player_name": "qb one",
                "position": "QB",
                "team": "BUF",
                "fantasy_points": 20.0,
            },
            {
                "season": 2024,
                "week": 1,
                "canonical_player_id": "c_1",
                "player_name": "Center One",
                "normalized_player_name": "center one",
                "position": "C",
                "team": "BUF",
                "fantasy_points": 0.0,
            },
        ]
    )

    adp_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "canonical_player_id": "qb_1",
                "player_name": "QB One",
                "normalized_player_name": "qb one",
                "position": "QB",
                "adp_overall": 50.0,
                "source_name": "fantasypros",
            },
            {
                "season": 2024,
                "canonical_player_id": "c_1",
                "player_name": "Center One",
                "normalized_player_name": "center one",
                "position": "C",
                "adp_overall": 999.0,
                "source_name": "fantasypros",
            },
        ]
    )

    player_reference_df = pd.DataFrame(
        [
            {"canonical_player_id": "qb_1", "normalized_player_name": "qb one"},
            {"canonical_player_id": "c_1", "normalized_player_name": "center one"},
        ]
    )

    result = build_player_season_warehouse(
        nflverse_df=nflverse_df,
        adp_df=adp_df,
        player_reference_df=player_reference_df,
    )

    assert set(result["position"]) == {"QB"}
    assert list(result["canonical_player_id"]) == ["qb_1"]
