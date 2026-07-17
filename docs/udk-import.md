# Fantasy Footballers UDK Import

## Purpose

The draft room can build a local player-data release directly from a Fantasy Footballers Ultimate Draft Kit ZIP package. This supports a simple draft-day refresh workflow without scraping the UDK website, uploading files to a server, or committing proprietary exports to Git.

## Draft-day workflow

1. Download fresh UDK CSV exports shortly before the draft.
2. Keep the exported folder structure and compress the files into one ZIP archive.
3. Open Fantasy Draft Intelligence.
4. Configure league size, scoring, roster slots, and the preferred ADP market.
5. Select **Import UDK ZIP** and choose the archive.
6. Review the recognized-file, player, projection, and ADP coverage summary.
7. Resolve any import notes that materially affect the player pool.
8. Start the draft.

The archive is processed inside the browser. The original ZIP is not uploaded anywhere and is not written into the repository.

## Recognized files

The importer recognizes these UDK exports by filename:

- `UDK Position Rankings - QB.csv`
- `UDK Position Rankings - RB.csv`
- `UDK Position Rankings - WR.csv`
- `UDK Position Rankings - TE.csv`
- `UDK Position Rankings - K.csv`
- `UDK Position Rankings - DST.csv`
- Andy, Jason, and Mike projection CSVs for QB, RB, WR, and TE
- UDK ADP Comparison CSV
- Career Snapshot / Consistency Chart CSVs
- Value Scout CSV

The cheat-sheet PDF is intentionally ignored. The CSV files are the authoritative machine-readable source.

## Projection calculation

For each offensive player, the importer calculates fantasy points from every available Andy, Jason, and Mike statistical projection using the league scoring selected in setup.

The normalized player projection is:

- the median of three analyst projections when all three are present;
- the median or mean midpoint of the available projections when two are present;
- the available analyst projection when only one is present;
- the UDK position-ranking projection when no analyst stat line is available.

Changing Standard, Half PPR, or Full PPR after importing rebuilds the release from the same UDK stat lines. A second upload is not required.

## ADP conversion

UDK platform ADP is supplied in round-and-pick notation, such as `3.07`. The importer converts that to an overall selection using the configured league size.

Available markets:

- Average
- Sleeper
- ESPN
- Yahoo
- Underdog

When the selected platform is blank for a player, the importer falls back to Average ADP and then to the first available platform value.

## Release fields

The generated `PlayerDataRelease` includes:

- provisional local canonical player ID
- name, position, team, and bye week
- overall and positional rank
- scoring-adjusted projected points
- selected-market ADP
- tier
- risk score
- upside score
- release season, timestamp, source labels, and release ID

The provisional UDK IDs are deterministic name-and-position identifiers. A later NFLverse identity step will replace or map them to stable cross-source player IDs.

## Validation and error handling

The importer reports:

- recognized and ignored files
- total ranked players
- players with at least one analyst projection
- players covered by all three analysts
- ranked players found in the ADP comparison
- players with usable selected-market ADP
- projection or ADP rows that did not match a ranking row
- malformed or unsupported rows

A ZIP without any UDK position-ranking CSVs is rejected. A release that contains fewer players than the configured draft requires cannot start the draft.

## Privacy and repository rules

UDK content is for the member's private local use.

- Do not commit UDK ZIP or CSV exports.
- Do not bundle UDK data into a public installer.
- Do not publish normalized UDK releases.
- Tests use synthetic fixtures only.
- Application code may be versioned; proprietary source data must remain local.

## Current limitation

The UDK import supplies the projection, ranking, tier, risk, upside, and market layers. Prior-year NFL statistics and stable NFLverse player IDs are not yet merged into this release. That is the next data-development increment.
