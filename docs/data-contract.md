# Player Data Release Contract

## Purpose

The Python pipeline publishes versioned player data for the desktop application. The live application consumes the release locally and does not scrape or refresh data during a draft.

## Release envelope

Each release must include:

```json
{
  "schema_version": "1.0",
  "season": 2026,
  "release_id": "2026-preseason-v1",
  "generated_at": "ISO-8601 timestamp",
  "sources": [],
  "players": []
}
```

## Required player fields

- `canonical_player_id`
- `display_name`
- `position`
- `nfl_team`
- `bye_week`
- `overall_rank`
- `position_rank`
- `adp`
- `projected_points`
- `tier`
- `risk_score`
- `upside_score`
- `availability_status`

Fields may be nullable where a source does not provide a value, but identity, name, and position are required for every draftable player.

## Validation rules

- `canonical_player_id` is unique within a release.
- Position values come from a controlled enum.
- Numeric ranks and ADP values are positive when present.
- Tier values are positive integers when present.
- The release ID uniquely identifies immutable content.
- The desktop application rejects an unsupported major schema version.

## Identity rule

Raw player names must never be used as cross-source join keys. All source mappings resolve to `canonical_player_id` before a player enters the release.

## Storage direction

Parquet remains appropriate for intermediate and research datasets. The final desktop-consumable release may be JSON, compressed JSON, or imported into SQLite. The selected format must preserve the same versioned contract.
