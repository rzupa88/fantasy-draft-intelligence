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

## Current foundation

The repository includes:

- nflverse weekly data ingestion
- historical ADP ingestion
- canonical player ID normalization
- cross-source player reference data
- Parquet-based intermediate datasets
- a TypeScript shared-contract package
- a deterministic snake-draft engine
- position-aware roster allocation
- versioned draft export/import
- a deterministic explainable recommendation engine
- named recommendation scenarios and weight-comparison reports
- a React/Vite live draft-room shell
- full-draft, recommendation, and interface regression tests

## Current draft-room capabilities

The React interface currently supports:

- league name, team count, draft slot, rounds, and scoring setup
- an offline deterministic demo player release
- manual entry for every team selection
- automatic snake-order advancement
- search and position filters
- live recommendations for the user roster
- team-by-team roster tracking
- undo of the latest selection
- JSON draft export

The next interface increments will add pick correction, keyboard-first controls, import/recovery, broader roster customization, and end-to-end browser tests.

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
- **Local persistence:** SQLite
- **Testing:** pytest, Vitest, Playwright

See:

- [`docs/product-requirements.md`](docs/product-requirements.md)
- [`docs/architecture.md`](docs/architecture.md)
- [`docs/roadmap.md`](docs/roadmap.md)
- [`docs/draft-engine.md`](docs/draft-engine.md)
- [`docs/draft-persistence.md`](docs/draft-persistence.md)
- [`docs/recommendation-engine.md`](docs/recommendation-engine.md)
- [`docs/recommendation-evaluation.md`](docs/recommendation-evaluation.md)

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

Run the existing data pipeline and tests:

```bash
python scripts/ingest_adp.py
python scripts/ingest_nflverse.py
python scripts/build_player_reference.py
pytest
```

## Validation commands

```bash
npm run typecheck
npm test
npm run check
npm run evaluate:recommendations
npm run evaluate:recommendations:json
```

## Current project structure

```text
apps/
  draft-room/            # React/Vite live draft interface
packages/
  data/                  # Python ingestion and identity logic
  modeling/              # Python modeling package
  shared/                # Python shared package
  shared-types/          # TypeScript contracts and runtime release validation
  draft-engine/          # Deterministic TypeScript draft state engine
  recommendation-engine/ # Explainable scoring, scenarios, and evaluation reports
scripts/                 # Data entrypoints and recommendation evaluation command
data/                    # Raw, intermediate, and processed data
tests/                   # Python tests
docs/                    # Product and technical documentation
```

## Milestones

- **M1 — Historical data foundation:** established
- **M2 — Offline draft engine foundation:** established
- **M3 — Recommendation engine v1:** baseline and evaluation harness established
- **M4 — Local draft-room interface:** active
- **M5 — Desktop packaging and release**
