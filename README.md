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
- full-draft and recommendation regression tests

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

## TypeScript setup

Requires Node.js 22 and npm 10 or later.

```bash
npm install
npm run check
```

Useful commands:

```bash
npm run typecheck
npm test
npm run test:watch
npm run build
```

## Current project structure

```text
packages/
  data/                  # Python ingestion and identity logic
  modeling/              # Python modeling package
  shared/                # Python shared package
  shared-types/          # TypeScript contracts and runtime release validation
  draft-engine/          # Deterministic TypeScript draft state engine
  recommendation-engine/ # Explainable TypeScript recommendation scoring
scripts/                 # Python pipeline entrypoints
data/                    # Raw, intermediate, and processed data
tests/                   # Python tests
docs/                    # Product and technical documentation
```

## Milestones

- **M1 — Historical data foundation:** established
- **M2 — Offline draft engine foundation:** established
- **M3 — Recommendation engine v1:** in progress
- **M4 — Local draft-room interface**
- **M5 — Desktop packaging and release**
