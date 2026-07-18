from __future__ import annotations

from collections import defaultdict
from copy import deepcopy
from typing import Any

import polars as pl

from packages.data.nflverse_history import SUM_COLUMNS, _aggregate_prior_stats
from packages.data.player_ids import normalize_player_name, normalize_position

SUPPORTED_POSITIONS = {"QB", "RB", "WR", "TE", "K"}
ID_CANDIDATES = ("gsis_id", "player_id", "nfl_id")
PLAYER_NAME_CANDIDATES = (
    "display_name",
    "player_display_name",
    "full_name",
    "player_name",
)
ROSTER_NAME_CANDIDATES = (
    "full_name",
    "player_name",
    "display_name",
    "player_display_name",
)
POSITION_CANDIDATES = ("position", "position_group")
TEAM_CANDIDATES = ("team", "team_abbr", "recent_team")
STATUS_CANDIDATES = ("status", "roster_status")

NFLVERSE_ALIAS_OVERRIDES: dict[str, tuple[str, ...]] = {
    "00-0035662": ("Hollywood Brown",),
}


def repair_current_roster_identities(
    release: dict[str, Any],
    *,
    players: pl.DataFrame,
    rosters: pl.DataFrame,
    stats: pl.DataFrame,
    prior_season: int,
    roster_season: int,
) -> dict[str, Any]:
    """Repair safe current-roster gaps without fuzzy identity guessing.

    Current NFL roster rows occasionally omit a GSIS ID for rookies even when the
    master player table already contains a provisional identity. Those rows are
    reconciled only when exact normalized name and position produce one candidate.
    A roster position also takes precedence over a master-table defensive position,
    which supports dual-role fantasy players such as Travis Hunter.
    """

    repaired = deepcopy(release)
    release_players = repaired.get("players")
    if not isinstance(release_players, list):
        raise TypeError("NFLverse history release players must be a list.")

    release_by_id = _release_players_by_id(release_players)
    candidates_by_key = _release_candidates_by_key(release_players)
    raw_players_by_id = _raw_players_by_id(players)
    history_by_id = _history_by_id(stats, prior_season)

    id_column = _first_existing_column(rosters, ID_CANDIDATES, required=False)
    name_column = _first_existing_column(rosters, ROSTER_NAME_CANDIDATES)
    position_column = _first_existing_column(rosters, POSITION_CANDIDATES)
    team_column = _first_existing_column(rosters, TEAM_CANDIDATES, required=False)
    status_column = _first_existing_column(rosters, STATUS_CANDIDATES, required=False)

    roster_rows = rosters
    if "season" in roster_rows.columns:
        roster_rows = roster_rows.filter(
            pl.col("season").cast(pl.Int64, strict=False) == roster_season
        )

    selected_columns = [name_column, position_column]
    for column in (id_column, team_column, status_column):
        if column is not None and column not in selected_columns:
            selected_columns.append(column)

    for row in roster_rows.select(selected_columns).iter_rows(named=True):
        roster_name = _clean_text(row.get(name_column))
        roster_position = normalize_position(row.get(position_column))
        if not roster_name or roster_position not in SUPPORTED_POSITIONS:
            continue

        roster_id = _clean_text(row.get(id_column)) if id_column is not None else None
        current_team = (
            _clean_text(row.get(team_column)) if team_column is not None else None
        )
        roster_status = (
            _clean_text(row.get(status_column)) if status_column is not None else None
        )

        if roster_id:
            player = release_by_id.get(roster_id)
            if player is None:
                raw_player = raw_players_by_id.get(roster_id, {})
                display_name = raw_player.get("display_name") or roster_name
                aliases = set(raw_player.get("aliases", []))
                aliases.add(roster_name)
                aliases.add(display_name)
                player = {
                    "nflverse_player_id": roster_id,
                    "canonical_player_id": f"nflverse:{roster_id}",
                    "display_name": display_name,
                    "normalized_name": normalize_player_name(display_name),
                    "aliases": sorted(aliases),
                    "position": roster_position,
                    "current_team": current_team,
                    "roster_status": roster_status,
                    "prior_season_stats": history_by_id.get(roster_id),
                }
                release_players.append(player)
                release_by_id[roster_id] = player
                _add_candidate_keys(candidates_by_key, player)
            else:
                _apply_roster_context(
                    player,
                    roster_name=roster_name,
                    roster_position=roster_position,
                    current_team=current_team,
                    roster_status=roster_status,
                )
            continue

        key = (normalize_player_name(roster_name), roster_position)
        candidates = candidates_by_key.get(key, [])
        if len(candidates) == 1:
            _apply_roster_context(
                candidates[0],
                roster_name=roster_name,
                roster_position=roster_position,
                current_team=current_team,
                roster_status=roster_status,
            )

    for player_id, aliases in NFLVERSE_ALIAS_OVERRIDES.items():
        player = release_by_id.get(player_id)
        if player is None:
            continue
        existing = {
            alias.strip()
            for alias in player.get("aliases", [])
            if isinstance(alias, str) and alias.strip()
        }
        existing.update(aliases)
        player["aliases"] = sorted(existing)

    return repaired


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


def _release_players_by_id(players: list[Any]) -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    for player in players:
        if not isinstance(player, dict):
            raise TypeError("NFLverse history release player entries must be objects.")
        player_id = player.get("nflverse_player_id")
        if isinstance(player_id, str) and player_id.strip():
            result[player_id] = player
    return result


def _release_candidates_by_key(
    players: list[Any],
) -> dict[tuple[str, str], list[dict[str, Any]]]:
    candidates: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for player in players:
        if not isinstance(player, dict):
            continue
        _add_candidate_keys(candidates, player)
    return candidates


def _add_candidate_keys(
    candidates: dict[tuple[str, str], list[dict[str, Any]]],
    player: dict[str, Any],
) -> None:
    position = normalize_position(player.get("position"))
    if position not in SUPPORTED_POSITIONS:
        return
    names = [player.get("display_name"), *(player.get("aliases") or [])]
    for name in names:
        if not isinstance(name, str) or not name.strip():
            continue
        key = (normalize_player_name(name), position)
        if player not in candidates[key]:
            candidates[key].append(player)


def _raw_players_by_id(players: pl.DataFrame) -> dict[str, dict[str, Any]]:
    id_column = _first_existing_column(players, ID_CANDIDATES)
    name_columns = [
        column for column in PLAYER_NAME_CANDIDATES if column in players.columns
    ]
    selected = [id_column, *name_columns]
    result: dict[str, dict[str, Any]] = {}
    for row in players.select(selected).iter_rows(named=True):
        player_id = _clean_text(row.get(id_column))
        names = [
            name
            for column in name_columns
            if (name := _clean_text(row.get(column))) is not None
        ]
        if not player_id or not names:
            continue
        result[player_id] = {
            "display_name": names[0],
            "aliases": sorted(set(names)),
        }
    return result


def _history_by_id(stats: pl.DataFrame, prior_season: int) -> dict[str, dict[str, Any]]:
    aggregated = _aggregate_prior_stats(stats, prior_season)
    fields = [
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
    histories: dict[str, dict[str, Any]] = {}
    for row in aggregated.iter_rows(named=True):
        player_id = row["nflverse_player_id"]
        history: dict[str, Any] = {"season": prior_season}
        for field in fields:
            value = row.get(field)
            if isinstance(value, float):
                value = round(value, 3)
            history[field] = value
        histories[player_id] = history
    return histories


def _apply_roster_context(
    player: dict[str, Any],
    *,
    roster_name: str,
    roster_position: str,
    current_team: str | None,
    roster_status: str | None,
) -> None:
    player["position"] = roster_position
    if current_team:
        player["current_team"] = current_team
    if roster_status:
        player["roster_status"] = roster_status
    aliases = {
        alias.strip()
        for alias in player.get("aliases", [])
        if isinstance(alias, str) and alias.strip()
    }
    aliases.add(roster_name)
    player["aliases"] = sorted(aliases)


def _first_existing_column(
    frame: pl.DataFrame,
    candidates: tuple[str, ...],
    *,
    required: bool = True,
) -> str | None:
    for column in candidates:
        if column in frame.columns:
            return column
    if required:
        raise ValueError(f"None of the candidate columns exist: {candidates}")
    return None


def _clean_text(value: object) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None
