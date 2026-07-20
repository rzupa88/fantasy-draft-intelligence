# NFLverse Identity and History Enrichment

## Purpose

The NFLverse history release adds stable player identity and objective prior-season production to the local UDK draft release.

The source responsibilities remain deliberately separate:

- **Fantasy Footballers UDK:** projections, rankings, tiers, risk, upside, bye weeks, and market ADP
- **NFLverse:** stable player IDs, current team/status, aliases, and prior-season statistics
- **Fantasy Draft Intelligence:** matching, roster context, replacement value, scarcity, expected availability, and final recommendations

No UDK projection value is overwritten by NFLverse history.

## Generate the history release

Install the Python dependencies, then run:

```bash
python scripts/build_nflverse_history_release.py \
  --prior-season 2025 \
  --roster-season 2026
```

The default output is:

```text
data/processed/nflverse_history_2025_2026.json
```

A different output path can be supplied:

```bash
python scripts/build_nflverse_history_release.py \
  --prior-season 2025 \
  --roster-season 2026 \
  --output /path/to/nflverse-history.json
```

Generation requires an internet connection because `nflreadpy` downloads the source datasets. The completed JSON file is self-contained and can be imported and used offline during the draft.

## Data included

Each identity record can contain:

- NFLverse/GSIS player ID
- stable canonical ID in the form `nflverse:<player-id>`
- current display name
- normalized name and known aliases
- position
- current team
- roster status
- prior-season games
- Standard, Half PPR, and Full PPR fantasy points
- points per game for each scoring format
- Half PPR weekly scoring standard deviation
- passing, rushing, and receiving volume and production
- fumbles lost

Current players without prior-season statistics, including rookies, still receive stable identities and a null history record.

Team defenses remain UDK team records because the NFLverse release is player-oriented.

## Release cleanup and roster repair

The raw NFLverse player universe contains historical and college-only identities that are not useful during a current redraft. Release generation therefore keeps only players who have a current team or genuine prior-season fantasy production.

Current roster data can also contain safe, repairable identity gaps:

- A rookie roster row may omit a GSIS ID while the master player table already has one provisional identity.
- A current roster position may be more useful for fantasy than the master-table position for a dual-role player.
- A widely used nickname may not be present in the source aliases.

The release builder handles these cases conservatively:

1. Missing roster IDs are reconciled only when exact normalized name and position identify one master record.
2. Ambiguous same-name candidates are never assigned automatically.
3. Current roster position takes precedence when it is a supported fantasy position.
4. Small stable-ID alias overrides are allowed for verified nickname exceptions.
5. Current team and roster status are attached before irrelevant historical identities are removed.

## Matching rules

The browser joins UDK and NFLverse records without aggressive guessing.

1. Normalize the player name and position.
2. Automatically accept one exact normalized-name and position match.
3. When multiple players share a normalized name, use current team only when it resolves to one candidate.
4. Never automatically accept a fuzzy name match.
5. Surface fuzzy candidates, collisions, and unmatched players in the setup review panel.
6. Prevent the same NFLverse player ID from being assigned to more than one UDK player.

A player keeps the temporary UDK ID unless a deterministic NFLverse match is found.

## Real 2025/2026 validation

The cleaned 2025/2026 release was tested against the current UDK package used to develop the importer.

- 340 individual QB, RB, WR, TE, and K records were evaluated.
- 340 received deterministic NFLverse identities.
- 0 were ambiguous.
- 0 were unmatched.
- 290 matched players also received 2025 history.
- 32 defenses remained correctly separate as UDK team records.

The repaired release contains 1,046 draft-relevant player identities rather than the nearly 9,000 historical and college-only records in the unfiltered master universe.

## Draft-day workflow

1. Generate or obtain the latest NFLverse history JSON.
2. Download fresh UDK files and create one ZIP.
3. Open the draft assistant.
4. Import the NFLverse JSON and UDK ZIP in either order.
5. Select league scoring, team count, roster configuration, and ADP market.
6. Review match coverage and any players needing attention.
7. Start the draft.

The combined release is rebuilt automatically when scoring, team count, or ADP market changes.

## Privacy and storage

- UDK files remain local and are never committed.
- NFLverse history is stored separately from proprietary projections.
- Browser import does not upload either file to a server.
- The combined player release is embedded in the local draft state and its JSON backup.
- Repository tests use synthetic UDK and NFLverse fixtures only.

## Remaining limitation

The review panel reports ambiguous and unmatched players but does not yet provide a manual candidate-selection control. The current validated package has full deterministic coverage, but a future UDK or NFLverse update could introduce a new exception. Such players remain valid UDK draft records with temporary IDs until a verified alias, roster repair, or manual-selection feature resolves them.
