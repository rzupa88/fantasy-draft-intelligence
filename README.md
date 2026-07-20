# Fantasy Draft Intelligence

A local-first fantasy football draft assistant designed to run on a laptop without relying on Sleeper, Yahoo, ESPN, or another live draft platform.

## Product goal

At any draft pick, identify which available player offers the best risk-adjusted value relative to market price, positional scarcity, expected availability, and roster needs.

## Core principles

- The live draft experience must work without an internet connection.
- Git is the operating system for the project.
- ADP is an input, not the answer.
- Recommendations must be explainable.
- Cross-source player joins use `canonical_player_id`, never raw player names.
- Draft state, recommendation logic, and the user interface remain independently testable.
- Proprietary projection exports remain local and are never committed to the repository.

## Current foundation

The repository includes:

- nflverse weekly data ingestion
- historical ADP ingestion
- canonical player ID normalization
- cross-source player reference data
- Parquet-based intermediate datasets
- a compact NFLverse identity and prior-season history release builder
- a TypeScript shared-contract package
- a deterministic snake-draft engine
- position-aware roster allocation
- versioned draft export/import
- a deterministic explainable recommendation engine
- named recommendation scenarios and weight-comparison reports
- a React/Vite live draft room with local recovery
- Fantasy Footballers UDK ZIP import and release normalization
- deterministic UDK-to-NFLverse matching and review reporting
- Vitest and Playwright regression coverage

## Current draft-room capabilities

The React interface currently supports:

- league name, team count, draft slot, and scoring setup
- editable QB, RB, WR, TE, FLEX, SUPERFLEX, K, DST, and bench counts
- draft rounds derived automatically from roster capacity
- standard, no-kicker, no-defense, extra-flex, two-QB, and superflex roster structures
- one-step import of a Fantasy Footballers UDK ZIP package
- UDK Andy, Jason, and Mike statistical projections recalculated for the selected scoring format
- Average, Sleeper, ESPN, Yahoo, and Underdog ADP markets
- UDK rankings, tiers, risk scores, upside scores, and bye weeks
- import of a compact NFLverse identity and prior-season history JSON release
- deterministic name, position, alias, and team-assisted player matching
- stable NFLverse IDs for matched players
- prior-season Standard, Half PPR, and Full PPR production
- a visible unmatched and ambiguous-player review list
- an offline deterministic demo release when no UDK package is loaded
- manual entry for every team selection
- automatic snake-order advancement
- search and position filters
- keyboard-first search, navigation, selection, undo, and export
- live recommendations for the user roster
- team-by-team roster tracking
- undo and historical pick correction
- autosave after every state change
- automatic restoration after refresh or browser closure
- JSON draft export and import
- browser-tested recovery, backup, custom-roster, UDK-upload, and NFLverse-enrichment workflows

The next data increment is generating and inspecting a real preseason history release, resolving any real-world identity exceptions, and expanding historical replay evaluation. SQLite persistence and Tauri desktop packaging follow.

## Draft-day data refresh

Generate the open NFLverse history release before the draft:

```bash
python scripts/build_nflverse_history_release.py \
  --prior-season 2025 \
  --roster-season 2026
```

Then:

1. Download fresh UDK CSV exports.
2. Keep the exported folder structure and compress the files into one ZIP.
3. Configure scoring, league size, roster slots, and the desired ADP market.
4. Import the NFLverse history JSON and UDK ZIP in either order.
5. Review UDK coverage and NFLverse identity matches.
6. Start the draft.

NFLverse generation requires a network connection, but the completed JSON file and all draft-room processing work offline. UDK ZIP processing and NFLverse matching happen locally in the browser.

See:

- [`docs/udk-import.md`](docs/udk-import.md) for recognized UDK files, projection math, ADP conversion, and privacy rules.
- [`docs/nflverse-history.md`](docs/nflverse-history.md) for history generation, match rules, release fields, and limitations.

## Target application

The completed product will be a locally installed desktop application with:

- manual pick entry
- configurable snake-draft settings
- live roster and available-player tracking
- dynamic player recommendations
- undo and pick correction
- local autosave and recovery
- draft export and import
- no required network connection during the draft

The initial tested format is a 12-team redraft snake league with configurable scoring and roster settings.

## Architecture direction

- **Data preparation:** Python, Polars/Pandas, DuckDB, Parquet
- **Draft and recommendation engines:** TypeScript
- **Interface:** React and Vite
- **Desktop packaging:** Tauri
- **Local persistence:** browser recovery now; SQLite for the desktop release
- **Testing:** pytest, Vitest, Playwright

See:

- [`docs/product-requirements.md`](docs/product-requirements.md)
- [`docs/architecture.md`](docs/architecture.md)
- [`docs/roadmap.md`](docs/roadmap.md)
- [`docs/draft-engine.md`](docs/draft-engine.md)
- [`docs/draft-persistence.md`](docs/draft-persistence.md)
- [`docs/recommendation-engine.md`](docs/recommendation-engine.md)
- [`docs/recommendation-evaluation.md`](docs/recommendation-evaluation.md)
- [`docs/udk-import.md`](docs/udk-import.md)
- [`docs/nflverse-history.md`](docs/nflverse-history.md)

## Run the draft room

Requires Node.js 22 and npm 10 or later.

```bash
npm install
npm run dev
```

Vite serves the local app at `http://localhost:5173` by default. In GitHub Codespaces, open the forwarded port when prompted.

Build the browser application:

```bash
npm run build
npm run preview
```

## Python setup

Requires Python 3.11 or later.

```bash
python -m venv .venv
source .venv/bin/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -e ".[dev]"
```

Run the data pipeline and tests:

```bash
python scripts/ingest_adp.py
python scripts/ingest_nflverse.py
python scripts/build_player_reference.py
python scripts/build_nflverse_history_release.py --prior-season 2025 --roster-season 2026
pytest
```

## Validation commands

```bash
npm run typecheck
npm test
npm run check
npm run build
npm run evaluate:recommendations
npx playwright install chromium
npm run test:e2e
```

## Current project structure

```text
apps/
  draft-room/            # React/Vite interface, UDK importer, and NFLverse matcher
e2e/                     # Playwright browser workflows
packages/
  data/                  # Python ingestion, identity, and history-release logic
  modeling/              # Python modeling package
  shared/                # Python shared package
  shared-types/          # TypeScript contracts and runtime release validation
  draft-engine/          # Deterministic TypeScript draft state engine
  recommendation-engine/ # Explainable scoring, scenarios, and evaluation reports
scripts/                 # Data and recommendation entrypoints
data/                    # Raw, intermediate, and processed data
tests/                   # Python tests
docs/                    # Product and technical documentation
```

## Milestones

- **M1 — Historical data foundation:** established
- **M2 — Offline draft engine foundation:** established
- **M3 — Recommendation engine v1:** baseline and evaluation harness established
- **M4 — Local draft-room interface:** functional, recoverable, roster-configurable, UDK-enabled, and NFLverse-enriched
- **M5 — Desktop packaging and release**
