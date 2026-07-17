from __future__ import annotations

import json
from pathlib import Path

import polars as pl
import pytest

from packages.data.nflverse_history import (
    build_nflverse_history_release,
    write_nflverse_history_release,
)


def _players() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "gsis_id": ["00-0039001", "00-0042002"],
            "display_name": ["Amon-Ra St. Brown", "Rookie Runner Jr."],
            "position": ["WR", "RB"],
        }
    )


def _rosters() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "season": [2026, 2026],
            "gsis_id": ["00-0039001", "00-0042002"],
            "full_name": ["Amon-Ra St. Brown", "Rookie Runner"],
            "position": ["WR", "RB"],
            "team": ["DET", "NYG"],
            "status": ["ACT", "ACT"],
        }
    )


def _stats() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "season": [2025, 2025, 2024],
            "season_type": ["REG", "REG", "REG"],
            "week": [1, 2, 1],
            "player_id": ["00-0039001", "00-0039001", "00-0039001"],
            "fantasy_points": [10.0, 20.0, 99.0],
            "fantasy_points_ppr": [15.0, 24.0, 109.0],
            "attempts": [0.0, 0.0, 0.0],
            "passing_yards": [0.0, 0.0, 0.0],
            "passing_tds": [0.0, 0.0, 0.0],
            "interceptions": [0.0, 0.0, 0.0],
            "carries": [1.0, 2.0, 0.0],
            "rushing_yards": [6.0, 12.0, 0.0],
            "rushing_tds": [0.0, 0.0, 0.0],
            "targets": [8.0, 7.0, 20.0],
            "receptions": [5.0, 4.0, 10.0],
            "receiving_yards": [70.0, 110.0, 200.0],
            "receiving_tds": [0.0, 1.0, 2.0],
            "passing_fumbles_lost": [0.0, 0.0, 0.0],
            "rushing_fumbles_lost": [0.0, 1.0, 0.0],
            "receiving_fumbles_lost": [0.0, 0.0, 0.0],
        }
    )


def test_builds_stable_identity_and_prior_season_summaries() -> None:
    release = build_nflverse_history_release(
        players=_players(),
        rosters=_rosters(),
        stats=_stats(),
        prior_season=2025,
        roster_season=2026,
        generated_at="2026-07-17T12:00:00+00:00",
    )

    assert release["schema_version"] == "1.0"
    assert release["source"] == "nflverse"
    assert release["prior_season"] == 2025
    assert release["roster_season"] == 2026
    assert len(release["players"]) == 2

    veteran = next(player for player in release["players"] if player["nflverse_player_id"] == "00-0039001")
    assert veteran["canonical_player_id"] == "nflverse:00-0039001"
    assert veteran["normalized_name"] == "amon_ra_st_brown"
    assert veteran["current_team"] == "DET"
    assert veteran["prior_season_stats"] == {
        "season": 2025,
        "games": 2,
        "fantasy_points_standard": 30.0,
        "fantasy_points_half_ppr": 34.5,
        "fantasy_points_ppr": 39.0,
        "points_per_game_standard": 15.0,
        "points_per_game_half_ppr": 17.25,
        "points_per_game_ppr": 19.5,
        "weekly_points_stddev_half_ppr": 4.75,
        "attempts": 0.0,
        "passing_yards": 0.0,
        "passing_tds": 0.0,
        "interceptions": 0.0,
        "carries": 3.0,
        "rushing_yards": 18.0,
        "rushing_tds": 0.0,
        "targets": 15.0,
        "receptions": 9.0,
        "receiving_yards": 180.0,
        "receiving_tds": 1.0,
        "fumbles_lost": 1.0,
    }

    rookie = next(player for player in release["players"] if player["nflverse_player_id"] == "00-0042002")
    assert rookie["display_name"] == "Rookie Runner Jr."
    assert "Rookie Runner" in rookie["aliases"]
    assert rookie["prior_season_stats"] is None


def test_writes_valid_json_release(tmp_path: Path) -> None:
    release = build_nflverse_history_release(
        players=_players(),
        rosters=_rosters(),
        stats=_stats(),
        prior_season=2025,
        roster_season=2026,
        generated_at="2026-07-17T12:00:00+00:00",
    )
    output = tmp_path / "history.json"

    write_nflverse_history_release(release, output)

    stored = json.loads(output.read_text(encoding="utf-8"))
    assert stored["players"][0]["canonical_player_id"].startswith("nflverse:")
    assert stored["generated_at"] == "2026-07-17T12:00:00+00:00"


def test_rejects_invalid_season_order() -> None:
    with pytest.raises(ValueError, match="seasons are invalid"):
        build_nflverse_history_release(
            players=_players(),
            rosters=_rosters(),
            stats=_stats(),
            prior_season=2026,
            roster_season=2025,
        )
