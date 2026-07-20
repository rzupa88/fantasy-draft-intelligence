from __future__ import annotations

import polars as pl
import pytest

from packages.data.nflverse_release_filter import (
    filter_to_draft_relevant_players,
    repair_current_roster_identities,
)


def test_keeps_current_roster_and_prior_season_contributors() -> None:
    release = {
        "schema_version": "1.0",
        "players": [
            {
                "nflverse_player_id": "current-rookie",
                "current_team": "NYG",
                "prior_season_stats": None,
            },
            {
                "nflverse_player_id": "veteran-free-agent",
                "current_team": None,
                "prior_season_stats": {"games": 12},
            },
            {
                "nflverse_player_id": "college-only",
                "current_team": None,
                "prior_season_stats": None,
            },
        ],
    }

    filtered = filter_to_draft_relevant_players(release)

    assert [player["nflverse_player_id"] for player in filtered["players"]] == [
        "current-rookie",
        "veteran-free-agent",
    ]
    assert len(release["players"]) == 3


def test_deduplicates_stable_ids_without_name_guessing() -> None:
    player = {
        "nflverse_player_id": "00-001",
        "current_team": "DET",
        "prior_season_stats": None,
    }
    filtered = filter_to_draft_relevant_players({"players": [player, dict(player)]})

    assert filtered["players"] == [player]


def test_repairs_missing_roster_ids_positions_and_aliases() -> None:
    release = {
        "schema_version": "1.0",
        "prior_season": 2025,
        "roster_season": 2026,
        "players": [
            _release_player("BEC122142", "Carson Beck", "QB"),
            _release_player("00-0035662", "Marquise Brown", "WR", team="PHI"),
        ],
    }
    players = pl.DataFrame(
        {
            "gsis_id": ["BEC122142", "00-0040718", "00-0035662"],
            "display_name": ["Carson Beck", "Travis Hunter", "Marquise Brown"],
            "position": ["QB", "CB", "WR"],
        }
    )
    rosters = pl.DataFrame(
        {
            "season": [2026, 2026, 2026],
            "gsis_id": [None, "00-0040718", "00-0035662"],
            "full_name": ["Carson Beck", "Travis Hunter", "Marquise Brown"],
            "position": ["QB", "WR", "WR"],
            "team": ["ARI", "JAX", "PHI"],
            "status": ["RES", "ACT", "ACT"],
        }
    )
    stats = pl.DataFrame(
        {
            "season": [2025],
            "season_type": ["REG"],
            "week": [1],
            "player_id": ["00-0040718"],
            "fantasy_points": [8.0],
            "fantasy_points_ppr": [11.0],
            "receptions": [3.0],
        }
    )

    repaired = repair_current_roster_identities(
        release,
        players=players,
        rosters=rosters,
        stats=stats,
        prior_season=2025,
        roster_season=2026,
    )

    carson = _find_player(repaired, "BEC122142")
    assert carson["current_team"] == "ARI"
    assert carson["roster_status"] == "RES"

    travis = _find_player(repaired, "00-0040718")
    assert travis["position"] == "WR"
    assert travis["current_team"] == "JAX"
    assert travis["prior_season_stats"]["fantasy_points_half_ppr"] == 9.5

    marquise = _find_player(repaired, "00-0035662")
    assert "Hollywood Brown" in marquise["aliases"]

    filtered = filter_to_draft_relevant_players(repaired)
    assert {player["nflverse_player_id"] for player in filtered["players"]} == {
        "BEC122142",
        "00-0040718",
        "00-0035662",
    }


def test_does_not_assign_missing_roster_id_when_name_is_ambiguous() -> None:
    release = {
        "players": [
            _release_player("player-one", "Chris Smith", "WR"),
            _release_player("player-two", "Chris Smith", "WR"),
        ]
    }
    players = pl.DataFrame(
        {
            "gsis_id": ["player-one", "player-two"],
            "display_name": ["Chris Smith", "Chris Smith"],
            "position": ["WR", "WR"],
        }
    )
    rosters = pl.DataFrame(
        {
            "season": [2026],
            "gsis_id": [None],
            "full_name": ["Chris Smith"],
            "position": ["WR"],
            "team": ["BUF"],
            "status": ["RES"],
        }
    )
    stats = pl.DataFrame(
        {
            "season": [2025],
            "season_type": ["REG"],
            "week": [1],
            "player_id": ["unrelated"],
            "fantasy_points": [0.0],
            "fantasy_points_ppr": [0.0],
        }
    )

    repaired = repair_current_roster_identities(
        release,
        players=players,
        rosters=rosters,
        stats=stats,
        prior_season=2025,
        roster_season=2026,
    )

    assert all(player["current_team"] is None for player in repaired["players"])


def test_rejects_invalid_player_payloads() -> None:
    with pytest.raises(TypeError, match="players must be a list"):
        filter_to_draft_relevant_players({"players": None})

    with pytest.raises(TypeError, match="entries must be objects"):
        filter_to_draft_relevant_players({"players": ["bad"]})

    with pytest.raises(TypeError, match="require nflverse_player_id"):
        filter_to_draft_relevant_players({"players": [{"current_team": "BUF"}]})


def _release_player(
    player_id: str,
    name: str,
    position: str,
    *,
    team: str | None = None,
) -> dict[str, object]:
    return {
        "nflverse_player_id": player_id,
        "canonical_player_id": f"nflverse:{player_id}",
        "display_name": name,
        "normalized_name": name.lower().replace(" ", "_"),
        "aliases": [name],
        "position": position,
        "current_team": team,
        "roster_status": None,
        "prior_season_stats": None,
    }


def _find_player(release: dict[str, object], player_id: str) -> dict[str, object]:
    players = release["players"]
    assert isinstance(players, list)
    return next(
        player
        for player in players
        if isinstance(player, dict) and player["nflverse_player_id"] == player_id
    )
