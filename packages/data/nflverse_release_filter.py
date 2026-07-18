from __future__ import annotations

from copy import deepcopy
from typing import Any


def filter_to_draft_relevant_players(release: dict[str, Any]) -> dict[str, Any]:
    """Keep current-roster players and genuine prior-season fantasy contributors.

    nflverse's master player table includes historical and college-only identities. Those
    records are useful upstream, but they make a draft-day identity release noisy and can
    create duplicate name/position candidates. A player is draft relevant when they are on
    a current roster or have a summarized prior-season stat line.
    """

    filtered = deepcopy(release)
    players = release.get("players")
    if not isinstance(players, list):
        raise TypeError("NFLverse history release players must be a list.")

    retained: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    for player in players:
        if not isinstance(player, dict):
            raise TypeError("NFLverse history release player entries must be objects.")

        player_id = player.get("nflverse_player_id")
        if not isinstance(player_id, str) or not player_id.strip():
            raise TypeError("NFLverse history players require nflverse_player_id.")

        is_current = isinstance(player.get("current_team"), str) and bool(
            player["current_team"].strip()
        )
        has_history = player.get("prior_season_stats") is not None
        if not is_current and not has_history:
            continue
        if player_id in seen_ids:
            continue

        seen_ids.add(player_id)
        retained.append(player)

    filtered["players"] = retained
    return filtered
