# Fantasy Footballers UDK Import

## Purpose

The draft room can build a local player-data release directly from Fantasy Footballers Ultimate Draft Kit exports. It accepts either one UDK ZIP package or a batch selection of the individual CSV and PDF files, without scraping the UDK website, uploading files to a server, or committing proprietary exports to Git.

## Draft-day workflow

1. Download fresh UDK exports shortly before the draft.
2. Open Fantasy Draft Intelligence.
3. Configure league size, scoring, roster slots, and the preferred ADP market.
4. Select **Import UDK files**.
5. Choose either the UDK ZIP or select all exported CSV and PDF files together.
6. Review the recognized-file, player, projection, and ADP coverage summary.
7. Resolve any import notes that materially affect the player pool.
8. Start the draft.

When loose exports are selected, the browser combines them into a temporary in-memory ZIP and passes that package through the same validated importer. The original files and temporary package are not uploaded or written into the repository.

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

The cheat-sheet PDF may be selected with the other files but is intentionally ignored. The CSV files are the authoritative machine-readable source.

## Projection calculation

For each offensive player, the importer calculates fantasy points from every available Andy, Jason, and Mike statistical projection using the league scoring selected in setup.

The normalized player projection is:

- the median of three analyst projections when all three are present;
- the median or mean midpoint of the available projections when two are present;
- the available analyst projection when only one is present;
- the UDK position-ranking projection when no analyst stat line is available.

Changing Standard, Half PPR, or Full PPR after importing rebuilds the release from the same UDK stat lines. A second import is not required.

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

When NFLverse history is also imported, deterministic matches replace the provisional IDs with stable NFLverse identities and add prior-season production.

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

A selection without any UDK position-ranking CSVs is rejected. A release that contains fewer players than the configured draft requires cannot start the draft.

## Privacy and repository rules

UDK content is for the member's private local use.

- Do not commit UDK ZIP or CSV exports.
- Do not bundle UDK data into a public installer.
- Do not publish normalized UDK releases.
- Tests use synthetic fixtures only.
- Application code may be versioned; proprietary source data remains local.

## Supported intake modes

- One `.zip` containing the UDK exports
- Multiple `.csv` and `.pdf` files selected in one file-picker operation

Both modes use the same recognition, validation, scoring, ADP conversion, and NFLverse enrichment pipeline.
