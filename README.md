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

The repository currently includes the first historical data foundation:

- nflverse weekly data ingestion
- historical ADP ingestion
- canonical player ID normalization
- cross-source player reference data
- Parquet-based intermediate datasets
- validation and unit tests

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

## Python setup

Requires Python 3.11 or later.

```bash
python -m venv .venv
source .venv/bin/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -e ".[dev]"
```

## Existing data pipeline

```bash
python scripts/ingest_adp.py
python scripts/ingest_nflverse.py
python scripts/build_player_reference.py
pytest
```

## Current project structure

```text
packages/
  data/
    ingest/
    player_ids.py
    io.py
    validation.py
scripts/
  ingest_adp.py
  ingest_nflverse.py
  build_player_reference.py
data/
  raw/
  intermediate/
tests/
  data/
docs/
```

## Milestones

- **M1 — Historical data foundation:** established
- **M2 — Offline draft engine foundation:** current
- **M3 — Recommendation engine v1**
- **M4 — Local draft-room interface**
- **M5 — Desktop packaging and release**
