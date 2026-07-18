from __future__ import annotations

import pytest

from packages.data.nflverse_release_filter import filter_to_draft_relevant_players


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


def test_rejects_invalid_player_payloads() -> None:
    with pytest.raises(TypeError, match="players must be a list"):
        filter_to_draft_relevant_players({"players": None})

    with pytest.raises(TypeError, match="entries must be objects"):
        filter_to_draft_relevant_players({"players": ["bad"]})

    with pytest.raises(TypeError, match="require nflverse_player_id"):
        filter_to_draft_relevant_players({"players": [{"current_team": "BUF"}]})
