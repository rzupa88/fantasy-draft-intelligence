# Fantasy Draft Intelligence — Project Context

This file is auto-generated to give ChatGPT a compact, practical understanding of the repository. It is meant to support feature planning, debugging, architecture discussions, and implementation help.

## Project Summary

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

## Quickstart and Useful Commands

Potentially useful commands and setup hints found in project files:

```text
A local-first fantasy football draft assistant designed to run on a laptop without relying on Sleeper, Yahoo, ESPN, or another live draft platform.
- Draft state, recommendation logic, and the user interface remain independently testable.
- a compact NFLverse identity and prior-season history release builder
- Vitest and Playwright regression coverage
- browser-tested recovery, backup, custom-roster, UDK-upload, and NFLverse-enrichment workflows
python scripts/build_nflverse_history_release.py \
6. Start the draft.
The completed product will be a locally installed desktop application with:
The initial tested format is a 12-team redraft snake league with configurable scoring and roster settings.
- **Testing:** pytest, Vitest, Playwright
## Run the draft room
npm install
npm run dev
Build the browser application:
npm run build
npm run preview
pip install -e ".[dev]"
Run the data pipeline and tests:
python scripts/build_player_reference.py
python scripts/build_nflverse_history_release.py --prior-season 2025 --roster-season 2026
pytest
npm run typecheck
npm test
npm run check
npm run evaluate:recommendations
npx playwright install chromium
npm run test:e2e
shared-types/          # TypeScript contracts and runtime release validation
tests/                   # Python tests
[build-system]
build-backend = "setuptools.build_meta"
dev = [
"pytest>=8.2.0",
[tool.ruff.lint]
[tool.pytest.ini_options]
testpaths = ["tests"]
.PHONY: install lint format test bootstrap ingest-nflverse ingest-adp validate
install:
pip install -e .[dev]
lint:
test:
```

## Repository Structure

```text
├── apps
│   ├── api
│   ├── draft-room
│   │   ├── public
│   │   │   └── data
│   │   ├── src
│   │   │   ├── components
│   │   │   ├── App.tsx
│   │   │   ├── bundled-nflverse-history.ts
│   │   │   ├── demo-data.ts
│   │   │   ├── draft-board.css
│   │   │   ├── draft-factory.ts
│   │   │   ├── draft-storage.ts
│   │   │   ├── main.tsx
│   │   │   ├── nflverse-history.css
│   │   │   ├── nflverse-history.ts
│   │   │   ├── recovery.css
│   │   │   ├── roster-config.css
│   │   │   ├── styles.css
│   │   │   ├── udk-import.css
│   │   │   └── udk-importer.ts
│   │   ├── tests
│   │   │   ├── app.test.tsx
│   │   │   ├── bundled-nflverse-history.test.ts
│   │   │   ├── league-draft-board.test.tsx
│   │   │   ├── nflverse-history.test.ts
│   │   │   ├── recovery.test.ts
│   │   │   └── udk-importer.test.ts
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── web
├── artifacts
│   ├── figures
│   ├── model_cards
│   └── reports
├── config
│   └── settings.yaml
├── data
│   ├── intermediate
│   ├── processed
│   └── raw
├── docs
│   ├── adr
│   │   └── 0000-adr-template.md
│   ├── architecture
│   │   └── README.md
│   ├── research
│   │   └── README.md
│   ├── runbooks
│   │   └── README.md
│   ├── architecture.md
│   ├── data-contract.md
│   ├── decision-log.md
│   ├── draft-engine.md
│   ├── draft-persistence.md
│   ├── local-development.md
│   ├── m2-backlog.md
│   ├── MASTER_PROJECT_PLAN.md
│   ├── nflverse-history.md
│   ├── product-requirements.md
│   ├── recommendation-engine.md
│   ├── recommendation-evaluation.md
│   ├── release-criteria.md
│   ├── repository-audit.md
│   ├── roadmap.md
│   ├── SOURCE_INVENTORY.md
│   ├── testing-strategy.md
│   └── udk-import.md
├── e2e
│   ├── bundled-history.spec.ts
│   ├── draft-room.spec.ts
│   └── udk-loose-files.spec.ts
├── notebooks
│   ├── exploratory
│   ├── modeling
│   └── validation
├── packages
│   ├── data
│   │   ├── ingest
│   │   │   ├── __init__.py
│   │   │   ├── adp.py
│   │   │   ├── coaching.py
│   │   │   └── nflverse.py
│   │   ├── warehouse
│   │   │   └── player_season.py
│   │   ├── __init__.py
│   │   ├── constants.py
│   │   ├── io.py
│   │   ├── nflverse_history.py
│   │   ├── nflverse_release_filter.py
│   │   ├── player_ids.py
│   │   └── validation.py
│   ├── draft-engine
│   │   ├── src
│   │   │   ├── errors.ts
│   │   │   ├── index.ts
│   │   │   ├── order.ts
│   │   │   ├── serialization.ts
│   │   │   └── state.ts
│   │   ├── tests
│   │   │   ├── fixtures.ts
│   │   │   ├── order.test.ts
│   │   │   ├── serialization.test.ts
│   │   │   └── state.test.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── modeling
│   │   ├── __init__.py
│   │   └── baseline.py
│   ├── recommendation-engine
│   │   ├── src
│   │   │   ├── benchmarks.ts
│   │   │   ├── evaluation.ts
│   │   │   └── index.ts
│   │   ├── tests
│   │   │   ├── evaluation.test.ts
│   │   │   ├── fixtures.ts
│   │   │   └── recommendation.test.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── shared
│   │   ├── __init__.py
│   │   └── logging.py
│   └── shared-types
│       ├── src
│       │   └── index.ts
│       ├── tests
│       │   └── player-data-release.test.ts
│       ├── package.json
│       └── tsconfig.json
├── scripts
│   ├── bootstrap.py
│   ├── build_nflverse_history_release.py
│   ├── build_player_reference.py
│   ├── build_player_season_warehouse.py
│   ├── evaluate_recommendations.mjs
│   ├── ingest_adp.py
│   ├── ingest_nflverse.py
│   ├── package_bundled_nflverse.py
│   └── validate_data.py
├── tests
│   ├── data
│   │   ├── ingest
│   │   │   ├── test_adp.py
│   │   │   └── test_nflverse.py
│   │   ├── test_player_ids.py
│   │   ├── test_player_season_warehouse.py
│   │   └── test_player_season_warehouse.py:146:5
│   ├── test_nflverse_history.py
│   ├── test_nflverse_release_filter.py
│   ├── test_smoke.py
│   └── test_validation.py
├── tools
│   └── build_project_context.py
├── debug_adp.csv
├── Makefile
├── package.json
├── playwright.config.ts
├── PROJECT_CONTEXT.md
├── pyproject.toml
├── README.md
├── tsconfig.base.json
├── tsconfig.json
└── vitest.config.ts
```

## Root Configuration and Dependency Files

### `README.md`

```text
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
- **Desktop

[TRUNCATED]
```

### `pyproject.toml`

```text
[build-system]
requires = ["setuptools>=68", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "fantasy-draft-intelligence"
version = "0.1.0"
description = "Local-first fantasy football draft intelligence platform"
readme = "README.md"
requires-python = ">=3.11"
authors = [
  { name = "Ryan Zupa" }
]
dependencies = [
  "beautifulsoup4>=4.12.0",
  "duckdb>=1.0.0",
  "lxml>=5.2.0",
  "nflreadpy>=0.1.0",
  "pandas>=2.2.0",
  "polars>=1.0.0",
  "pyarrow>=16.0.0",
  "pydantic>=2.7.0",
  "pyyaml>=6.0.1",
  "requests>=2.32.0",
  "rich>=13.7.1",
  "scikit-learn>=1.5.0",
  "typer>=0.12.3"
]

[project.optional-dependencies]
dev = [
  "black>=24.4.2",
  "ipykernel>=6.29.4",
  "jupyter>=1.0.0",
  "pytest>=8.2.0",
  "ruff>=0.5.0"
]

[tool.setuptools]
packages = ["packages.data", "packages.data.ingest", "packages.modeling", "packages.shared"]

[tool.black]
line-length = 100
target-version = ["py311"]

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]
ignore = []

[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["."]
```

### `Makefile`

```text
.PHONY: install lint format test bootstrap ingest-nflverse ingest-adp validate

install:
	pip install -e .[dev]

lint:
	ruff check .

format:
	black .

test:
	pytest

bootstrap:
	python scripts/bootstrap.py

ingest-nflverse:
	python scripts/ingest_nflverse.py --years 2023 2024

ingest-adp:
	python scripts/ingest_adp.py

validate:
	python scripts/validate_data.py
```

### `config/settings.yaml`

```text
project:
  name: fantasy-draft-intelligence
  default_scoring_format: half_ppr
  pilot_years:
    - 2023
    - 2024

paths:
  raw_data: data/raw
  intermediate_data: data/intermediate
  processed_data: data/processed
  artifacts: artifacts

validation:
  fail_on_duplicate_keys: true
  fail_on_missing_required_columns: true
```

## Key Documentation

### `docs/adr/0000-adr-template.md`

```text
# ADR-0000: Title Goes Here

- **Status:** Proposed
- **Date:** YYYY-MM-DD
- **Decision Makers:**
- **Related Issues:**

## Context
What problem are we solving?

## Decision
What did we decide?

## Rationale
Why was this chosen over alternatives?

## Alternatives Considered
- Option A
- Option B
- Option C

## Consequences
### Positive
-

### Negative
-

## Follow-Up Actions
- [ ]
- [ ]
```

### `docs/architecture.md`

```text
# Architecture Decision Record

## Delivery model

Fantasy Draft Intelligence will be developed in Git and released as a locally installed desktop application. The production draft workflow must not depend on a hosted server or live connection to a fantasy platform.

## System boundaries

### 1. Data preparation

**Technology:** Python, Polars/Pandas, DuckDB, Parquet

Responsibilities:

- ingest historical and preseason sources
- normalize names, teams, and positions
- maintain canonical player identity
- calculate reusable features
- validate records
- publish a compact, versioned app-ready dataset

The existing Python pipeline remains the source of truth for football data preparation.

### 2. Draft engine

**Technology:** TypeScript package with no interface dependency

Responsibilities:

- league settings
- snake-order generation
- pick sequencing
- roster assignment
- available-player tracking
- undo and correction
- state validation
- serializable draft state

The engine must be deterministic. Given the same settings and pick history, it must produce the same draft state.

### 3. Recommendation engine

**Technology:** TypeScript package with no interface dependency

Responsibilities:

- base player valuation
- value over replacement
- tier urgency
- positional scarcity
- roster need
- ADP value
- expected availability
- risk and upside adjustments
- human-readable recommendation reasons

The recommendation engine accepts draft state, league settings, and the player dataset. It must not read directly from UI state or storage.

### 4. Desktop interface

**Technology:** React, TypeScript, Vite

Responsibilities:

- draft setup
- player search and filters
- manual pick entry
- live draft board
- roster views
- recommendation display
- error handling
- export and restoration controls

### 5. Desktop shell and persistence

**Technology:** Tauri and SQLite

Responsibilities:

- native desktop packaging
- local database access
- atomic saves and migrations
- file-based import and export
- application data directories
- Windows installer creation

## Repository direction

The current Python repository will evolve into a monorepo without discarding the existing data foundation.

```text
apps/
  desktop/                 # React/Vite/Tauri application
packages/
  data/                    # existing Python data package
  draft-engine/            # TypeScript domain logic
  recommendation-engine/   # TypeScript decision logic
  shared-types/            # shared TypeScript schemas
data/
  raw/
  intermediate/
  releases/                # versioned app-ready datasets
docs/
scripts/
tests/
```

The structure will be introduced incrementally. Empty scaffolding should not replace working code merely to match the target diagram.

## Data contracts

### Canonical identity

All cross-source joins use `canonical_player_id`. Raw player names are display fields, not keys.

### Player data release

Each player-data release must include:

- schema version
- season
- generated timestamp
- source metadata
- player records
- validation summary

The desktop application must reject incompatible schema versions with a clear error.

### Draft state

Draft state must be serializable and versioned. At minimum it contains:

- state schema version
- draft ID
- league settings
- ordered fantasy teams
- ordered pick slots
- pick history
- current pick index
- created and updated timestamps
- selected player-data release

Derived values such as available players should be reproducible from the stored settings and pick history whenever practical.

## Offline rules

- No network call may be required to create, run, save, restore, or finish a draft.
- Data updates occur before draft day through explicit scripts or imported release files.
- The application must remain usable when network interfaces are disabled.
- Remote analytics and telemetry are excluded from MVP.

## Testing strategy

- `pytest`: Python ingestion, normalization, and release generation
- `Vitest`: draft and recommendation engines
- `Playwright`: complete draft-room workflows
- fixture drafts: deterministic twelve-team simulations
- packaging smoke test: launch installed application and complete offline save/restore

## Decision rationale

Tauri provides a native application with a smaller footprint than an Electron-based alternative while allowing the interface and domain logic to remain in TypeScript. SQLite offers durable local persistence and explicit migrations. Separating data preparation from live draft logic prevents Python or internet dependencies from leaking into the packaged draft experience.
```

### `docs/architecture/README.md`

```text
# Architecture Notes

This directory stores system design decisions, data flow structure, and architectural principles.

---

## Data Architecture Overview

The project follows a layered, reproducible data pipeline designed to support stable cross-source joins and downstream modeling.

### Pipeline Flow


raw source data
↓
normalized source tables (ADP, nflverse, etc.)
↓
canonical player ID enrichment
↓
player reference table (cross-source mapping)


---

## Core Components

### 1. Source Ingestion

Located in:

packages/data/ingest/


Responsibilities:
- extract data from external sources
- normalize schema into structured tables
- write outputs to `data/intermediate/`

---

### 2. Canonical Player ID Layer

Located in:

packages/data/player_ids.py


Responsibilities:
- normalize player names across sources
- generate a stable `canonical_player_id`
- handle:
  - suffixes (Jr., Sr., III)
  - punctuation (D.J. vs DJ)
  - casing and whitespace
  - DST naming inconsistencies

---

### 3. Player Reference Table

Built via:

scripts/build_player_reference.py


Output:

data/intermediate/player_reference_<years>.parquet


Responsibilities:
- unify player identities across sources
- enable consistent joins between datasets
- act as a foundational lookup table

---

## Design Decisions

### Canonical IDs as Join Key

All joins across datasets must use:


canonical_player_id


**Reason:**
Raw `player_name` fields are inconsistent across sources and will lead to:
- broken joins
- duplicate entities
- incorrect modeling inputs

---

### Code-First Data Logic

- All normalization and ID logic lives in `packages/data/`
- Notebooks are for exploration only
- Ensures reproducibility and testability

---

### Intermediate Data = Source of Truth

- All normalized datasets are stored in `data/intermediate/`
- Format: Parquet
- These serve as the foundation for:
  - feature engineering
  - modeling
  - validation

---

## Next Architecture Steps

- Introduce alias resolution layer (nicknames, edge cases)
- Add additional data sources (injuries, depth charts)
- Build feature engineering pipeline
- Introduce modeling layer with versioned outputs
```

### `docs/MASTER_PROJECT_PLAN.md`

```text

```

### `docs/research/README.md`

```text
# Research Notes

This directory stores research summaries that translate exploratory analysis into product and modeling decisions.

Each research note should include:
- question
- data used
- method
- findings
- limitations
- implications
```

### `docs/runbooks/README.md`

```text
# Runbooks

This directory stores step-by-step operational procedures.

Suggested future runbooks:
- historical backfill runbook
- preseason refresh runbook
- model training runbook
- release checklist
```

### `docs/SOURCE_INVENTORY.md`

```text
# Source Inventory

## Purpose
This document tracks every external data source used by the project and how each source is normalized into the data warehouse.

---

## Guiding Rules

- Prefer free and reproducible sources
- Minimize scraping surface area
- Snapshot volatile data where practical
- Document provenance for every dataset
- Normalize all sources into a common schema with canonical IDs

---

## Core Sources

### 1. nflverse

**Use for:**
- weekly player stats
- rosters
- schedules
- snap counts
- play-by-play
- team-level data where applicable

**Access method:**
- Python package / supported data access workflows

**Priority:** Primary

**Output location:**

data/intermediate/nflverse_player_weekly_<years>.parquet


**Normalized fields (key subset):**
- season
- player_name
- position
- team
- stats fields (yards, TDs, etc.)
- **normalized_player_name**
- **canonical_player_id**
- source_name

---

### 2. FantasyPros

**Use for:**
- historical ADP
- market pricing baseline

**Access method:**
- controlled extraction from season-specific ADP pages
- explicit URL manifest by season
- raw HTML snapshots stored locally

**Raw storage:**

data/raw/adp_fantasypros_<season>_overall.html


**Output location:**

data/intermediate/adp_historical_<years>.parquet


**Current provenance:**
- FantasyPros NFL historical overall ADP (2023, 2024)

**Normalized fields:**
- season
- player_name
- position
- adp_overall
- source_name
- **normalized_player_name**
- **entity_type** (player / DST)
- **canonical_player_id**

---

### 3. Pro-Football-Reference

**Use for:**
- coaching history
- team-level reference data
- fallback validation

**Access method:**
- targeted scrape or manual ingestion

**Priority:** Secondary

---

## Derived Artifacts

### Player Reference Table

**Location:**

data/intermediate/player_reference_<years>.parquet


**Purpose:**
- provides a unified mapping of players across all sources
- enables stable joins between datasets

**Built from:**
- normalized nflverse output
- normalized ADP output

**Key fields:**
- canonical_player_id
- normalized_player_name
- source_name
- source_player_name

---

## Join Standard (Critical)

> All cross-source joins must use `canonical_player_id`.

Raw `player_name` values are not reliable due to:
- suffix differences (Jr., Sr., III)
- punctuation (D.J. vs DJ)
- spacing / casing inconsistencies
- DST naming differences

---

## Datasets Required for MVP

- weekly player stats
- season-level stats
- snap counts
- rosters
- ADP
- coaching history
- team context

---

## Open Questions

- ADP historical depth across more seasons
- alias handling (nicknames, alternate spellings)
- DST normalization edge cases
- whether coaching data should be fully manual for MVP
```

### `docs/data-contract.md`

```text
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
```

### `docs/decision-log.md`

```text
# Decision Log

## 2026-07-16 — Local desktop delivery

**Decision:** Release the finished product as a locally installed laptop application rather than a hosted service.

**Consequences:**

- The live draft requires no remote server.
- Draft state is stored locally.
- The application must be tested with networking disabled.
- A packaged user does not need development tools.

## 2026-07-16 — Preserve the Python data foundation

**Decision:** Keep the existing Python ingestion and normalization work and add the live application incrementally.

**Consequences:**

- Python prepares versioned player-data releases.
- Python is not required during a packaged live draft.
- Existing canonical player IDs remain the cross-source identity key.

## 2026-07-16 — TypeScript domain engines

**Decision:** Implement draft-state and recommendation logic as interface-independent TypeScript packages.

**Consequences:**

- Logic can run in the desktop application without a Python process.
- Engines can be unit-tested separately from React and Tauri.
- Shared schemas reduce mismatch between interface and domain behavior.

## 2026-07-16 — React, Vite, Tauri, and SQLite

**Decision:** Use React/Vite for the interface, Tauri for native packaging, and SQLite for durable local persistence.

**Consequences:**

- The project retains web-development speed while producing a desktop installer.
- Draft saves use explicit database migrations and local backup/export.
- Tauri and Rust tooling are introduced only after the draft engine is stable.

## 2026-07-16 — Draft engine before interface

**Decision:** Do not build the visual draft room until a deterministic draft engine can complete simulated drafts.

**Consequences:**

- Snake ordering, picks, rosters, undo, correction, and serialization are verified before UI complexity is added.
- The first feature milestone is test-driven domain logic rather than mockups.
```

### `docs/draft-engine.md`

```text
# Draft Engine Core

## Scope

Milestone 2 uses a deterministic TypeScript domain engine with no dependency on React, Tauri, SQLite, or a recommendation model.

## Packages

- `@fdi/shared-types` owns the versioned player-data contract and shared league/draft/export types.
- `@fdi/draft-engine` owns snake order, pick transitions, player availability, roster allocation, undo, correction, and draft serialization.

## State invariants

1. Draft order contains exactly `teamCount * rounds` slots.
2. Roster capacity per team equals the configured number of rounds.
3. Every order slot has a unique overall pick.
4. Pick history is always a contiguous prefix of the generated order.
5. A player can appear in pick history at most once.
6. Every drafted player exists in the loaded player-data release.
7. Every pick is assigned to one legal roster slot for that player's position.
8. Available players are derived from the immutable initial player pool minus drafted players.
9. Undo and correction return a new state and do not mutate prior state.
10. `nextOverallPick` is `null` only when the draft is complete.
11. State transitions increment `revision`.

## Roster allocation

Roster assignment is treated as a bipartite matching problem rather than a first-fit list.

For each fantasy team, the engine expands configured roster rules into concrete slots such as `RB #1`, `RB #2`, `FLEX #1`, and `BENCH #1`. It then finds a complete legal matching between drafted players and those slots.

This prevents a flexible player from occupying a scarce slot when a later, more constrained player needs it. For example, a wide receiver drafted before a running back can be moved to FLEX so the running back can occupy the dedicated RB slot.

If no complete legal assignment exists, the pick or correction fails with `ROSTER_INVALID` and the previous state remains unchanged.

## Public operations

- `createDraftTeams`
- `generateSnakeDraftOrder`
- `createDraftState`
- `makePick`
- `undoLastPick`
- `correctPick`
- `getCurrentOrderSlot`
- `getPlayerById`
- `buildRosters`
- `buildRosterAssignments`
- `serializeDraftState`
- `deserializeDraftState`

## Error behavior

Expected domain failures use `DraftEngineError` with stable codes. Current codes include invalid settings, invalid player data, duplicate or unavailable players, illegal roster construction, missing picks, completed drafts, invalid draft exports, and unsupported export schema versions.

## Validation

The regression suite includes:

- odd/even snake order
- user-team identification
- roster-capacity validation
- pick sequencing
- duplicate prevention
- position-aware roster allocation
- constrained-versus-flexible maximum matching
- illegal-position rejection
- undo
- earlier-pick correction
- versioned export/import round trips
- malformed and tampered export rejection
- a complete 12-team, 16-round, 192-pick simulation
- player-data release validation
```

### `docs/draft-persistence.md`

```text
# Draft Persistence Contract

## Purpose

A live draft must survive application closure without depending on a remote service. The draft engine therefore provides a versioned, self-contained JSON export that can later be stored in SQLite, written to disk, or used for manual backup.

## Schema version

The current export schema is `1.0`.

Unsupported schema versions are rejected explicitly rather than being interpreted optimistically.

## Export envelope

```json
{
  "schema_version": "1.0",
  "exported_at": "2026-07-16T15:30:00Z",
  "draft": {
    "draftId": "example-draft",
    "settings": {},
    "teams": [],
    "playerDataRelease": {},
    "pickPlayerIds": [],
    "revision": 0
  }
}
```

## Stored versus derived data

The export stores only the authoritative inputs required to reproduce the draft:

- draft ID
- league settings
- fantasy teams
- full versioned player-data release
- ordered canonical player IDs for completed picks
- revision number

The following fields are deliberately not stored because they are deterministic and can be rebuilt:

- snake-draft order
- roster-slot assignments
- available-player IDs
- current pick
- draft status

## Import behavior

Import does not trust derived state from a file. It:

1. Validates the export envelope and schema version.
2. Validates league settings, teams, and player data.
3. Creates a fresh draft state.
4. Replays every pick through the normal draft engine.
5. Recomputes roster allocation, availability, status, and the next pick.
6. Restores the saved revision after confirming it is valid.

This replay model catches duplicate players, unknown players, illegal roster construction, corrupt team settings, and altered pick histories.

## API

```ts
const json = serializeDraftState(state);
const restoredState = deserializeDraftState(json);
```

`serializeDraftState` also refuses to export an internally inconsistent in-memory state. This protects future persistence adapters from silently saving corrupted data.

## Future storage adapters

The desktop application can use the same serialization boundary for:

- SQLite autosave records
- `.json` backup files
- crash-recovery snapshots
- draft duplication and archival

Storage technology may change without changing the draft engine's persistence contract.
```

### `docs/local-development.md`

```text
# Local Development Contract

The project is developed in Git and the finished application runs locally on a laptop.

## Current Python foundation

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
pytest
ruff check .
black --check .
```

macOS or Linux:

```bash
source .venv/bin/activate
pip install -e ".[dev]"
pytest
ruff check .
black --check .
```

## Target root commands

As the TypeScript and desktop workspaces are introduced, the repository will provide root commands for:

```text
npm run setup
npm run test
npm run lint
npm run build
npm run dev
npm run package
npm run data:update
npm run data:validate
```

The commands must be implemented before they are advertised as operational in the root README.

## Packaged-user rule

Development commands are for contributors only. The released Windows application must launch through an installer-created shortcut and must not require Git, Python, Node, Rust, or a terminal on the user's machine.
```

### `docs/m2-backlog.md`

```text
# M2 Backlog: Offline Draft Engine Foundation

## Epic 1 — TypeScript workspace

- Add root Node workspace configuration.
- Add TypeScript, ESLint, formatting, and Vitest configuration.
- Add `packages/shared-types`.
- Add `packages/draft-engine`.
- Document local development commands.

**Acceptance:** TypeScript builds and a sample unit test passes from the repository root.

## Epic 2 — League configuration

- Define team-count constraints.
- Define scoring format metadata.
- Define roster-slot and FLEX eligibility schemas.
- Validate rounds against total roster capacity.
- Add twelve-team default fixture.

**Acceptance:** Invalid league settings return structured validation errors.

## Epic 3 — Draft order

- Generate ordered snake-draft pick slots.
- Expose round, pick-in-round, overall pick, and fantasy team.
- Support configurable team count and rounds.
- Add boundary tests at every round reversal.

**Acceptance:** Known fixtures produce the exact expected order.

## Epic 4 — Draft state

- Define versioned draft-state schema.
- Create a new draft from settings and ordered teams.
- Apply a valid pick.
- Reject duplicate players and out-of-sequence picks.
- Derive current pick and team on the clock.
- Derive drafted and available player IDs.

**Acceptance:** State transitions are deterministic and immutable.

## Epic 5 — Rosters

- Assign drafted players to fantasy teams.
- Track position counts.
- Determine open starter and bench slots.
- Validate player position against configured slots.
- Support FLEX eligibility.

**Acceptance:** Every fixture roster matches its pick history.

## Epic 6 — Recovery tools

- Undo the last pick.
- Correct a historical pick by replaying later state.
- Serialize draft state.
- Restore serialized state.
- Reject unsupported schema versions.

**Acceptance:** Save/restore and undo/correction preserve a valid draft.

## Epic 7 — Simulation suite

- Add a complete twelve-team player fixture.
- Run a complete automated snake draft.
- Test multiple draft slots.
- Test duplicate, invalid, undo, correction, and restore scenarios.

**Acceptance:** Repeated simulations produce no state divergence.

## Definition of done

M2 is complete only when:

- all draft-engine unit tests pass;
- formatting and lint checks pass;
- a full draft simulation completes;
- domain packages have no React, Tauri, database, or network dependency;
- README commands match the actual workspace commands.
```

### `docs/nflverse-history.md`

```text
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
```

### `docs/product-requirements.md`

```text
# Product Requirements: Offline Draft Assistant

## Status

Baseline specification for Milestone 2.

## Problem

Fantasy managers drafting in person or on an unsupported platform often rely on static rankings, spreadsheets, or a second online draft room. Those tools do not fully account for the live player pool, roster construction, positional runs, tier drops, or the probability that a player will survive to the manager's next selection.

## Product objective

Build a desktop application that helps one user manage and optimize a fantasy football redraft while every selection is entered manually. The live draft must remain fully functional without internet access.

## Initial target

- Redraft leagues
- Snake draft
- Twelve teams as the primary tested configuration
- Configurable team count
- Standard, half-PPR, full-PPR, and custom scoring inputs
- Configurable roster and bench positions
- QB, RB, WR, TE, FLEX, K, and DST
- One local user operating the draft board

## Core workflow

### Before the draft

1. Create or restore a draft.
2. Select league size, draft slot, scoring, roster settings, and rounds.
3. Load a versioned player-data package.
4. Review the generated draft order and settings.

### During the draft

1. Enter each selected player and fantasy team.
2. Advance the snake draft order automatically.
3. Update all rosters and the available-player pool.
4. Recalculate recommendations after each pick.
5. Undo or correct entry mistakes without corrupting draft state.
6. Autosave locally after every state change.

### After the draft

1. Review the completed board and every roster.
2. Review the user's roster analysis.
3. Export the draft to a local file.
4. Reopen the draft later.

## MVP functional requirements

### Draft configuration

- Team count
- User draft position
- Snake-order generation
- Scoring configuration
- Starting-position configuration
- FLEX eligibility
- Bench size
- Number of rounds

### Player pool

Each app-ready player record must support:

- canonical player ID
- name
- NFL team
- position
- bye week
- overall rank
- positional rank
- ADP
- projection
- tier
- risk indicator
- upside indicator
- injury or availability status when supplied

### Draft state

- Current round and overall pick
- Team on the clock
- Ordered pick history
- Team rosters
- Available and drafted player status
- Undo last pick
- Correct an earlier pick
- Duplicate-pick prevention
- Roster validation

### Recommendation output

Display a ranked shortlist with:

- recommendation score
- primary reason
- tier and tier-drop context
- roster-fit context
- positional scarcity
- ADP value
- expected availability at the user's next pick
- risk and upside summary
- alternatives

### Persistence

- Local autosave after every pick
- Recovery after application closure
- Local draft export and import
- No cloud account
- No required remote database

## Non-functional requirements

- The installed application must work in airplane mode.
- A normal user must not need Python, Node, Git, or a terminal to run the packaged release.
- Search and pick entry must remain responsive with the full player pool.
- Core engines must be deterministic and unit-testable independently of the UI.
- Player datasets must be versioned and replaceable without rebuilding recommendation logic.
- A failed or interrupted save must not silently destroy the previous valid draft state.

## Explicitly outside MVP

- Sleeper, Yahoo, ESPN, or NFL platform synchronization
- Auction drafts
- Dynasty and keeper valuation
- Best ball
- IDP
- Online multiplayer
- AI chat
- Draft-day data scraping
- Paid data dependencies

## MVP acceptance criteria

The milestone is complete when:

1. A twelve-team draft can run from first pick through the final round.
2. No drafted player remains available.
3. Every pick appears on the correct roster and board position.
4. Undo and correction restore a valid state.
5. Closing and reopening the application restores the draft.
6. Recommendations update after every selection.
7. Recommendation explanations identify why the player is valuable now.
8. The packaged application completes a draft without network access.
```

### `docs/recommendation-engine.md`

```text
# Recommendation Engine v1

## Purpose

The recommendation engine converts the current deterministic draft state into a ranked, explainable shortlist of available players. It has no dependency on React, Tauri, SQLite, a network service, or a machine-learning model.

The first version is deliberately transparent. Every recommendation exposes its component scores, contextual values, and plain-language reasons so the weights can be evaluated and tuned through simulations.

## Public API

```ts
const result = recommendPlayers(draftState, {
  limit: 5,
});

const onePlayer = scorePlayer(draftState, "canonical-player-id");
const replacementLevels = getReplacementLevels(draftState);
```

## Default scoring components

Each component is normalized to a score from 0 through 100. The weighted result is also bounded from 0 through 100.

| Component | Default weight | Purpose |
|---|---:|---|
| Base value | 22% | Blends projected points and overall rank among available players. |
| Value over replacement | 20% | Measures projected production above the league-specific replacement player at the position. |
| Roster need | 18% | Rewards players who fill open dedicated or flexible starting slots. |
| Tier urgency | 12% | Identifies thinning tiers and the final available player in a tier. |
| ADP value | 10% | Rewards players available later than market cost and penalizes reaches. |
| Expected availability | 8% | Estimates whether the player is likely to survive until the user's next selection. |
| Upside | 5% | Rewards stronger upside scores relative to the remaining player pool. |
| Risk safety | 5% | Rewards lower risk scores relative to the remaining player pool. |

Weights are configurable per call. They are validated and normalized before use, allowing simulations to isolate or tune individual components without changing engine code.

## Replacement-level calculation

Replacement rank is derived from the league's starting roster demand rather than a fixed universal position rank.

For each position:

1. Dedicated starting slots count fully.
2. Flexible slots contribute fractionally across their eligible positions.
3. Bench slots do not affect replacement demand.
4. Per-team demand is multiplied by league size.
5. The player at the resulting positional rank becomes the replacement baseline.

Example: in a four-team league with one RB starter and one three-position FLEX, RB demand is approximately 1.33 players per team, producing an RB replacement rank of six.

## Roster-need behavior

The engine reads the roster slots already assigned by the draft engine.

- An open dedicated starter position receives the strongest need score.
- An open FLEX or SUPERFLEX opportunity receives a moderate need score.
- A position that can only enter the bench receives a low need score.
- A position with no remaining legal roster slot receives zero.

This keeps recommendation logic aligned with the same roster rules that validate manual draft selections.

## Tier urgency

Tier urgency is based on the number of available players remaining at the candidate's position and tier.

- One remaining player: maximum urgency
- Two remaining: high urgency
- Three remaining: moderate urgency
- Four remaining: limited urgency
- Larger tiers: low urgency

A meaningful projected-points drop to the next tier adds urgency.

## Expected availability

The engine locates the user's next selection in the generated snake order and compares the player's ADP with that selection window.

This is an intentionally simple deterministic estimate for v1. It does not yet simulate opponent behavior or produce a calibrated probability.

## Explainability

Each recommendation includes:

- total recommendation score
- all eight component scores
- current overall pick
- user's next pick
- picks until the user's next pick
- replacement rank and projected replacement value
- projected points above replacement
- number of same-tier players remaining
- one primary reason
- up to three ranked reasons

Reason ordering considers both component strength and configured weight.

## Determinism

For a fixed draft state, player-data release, and weight configuration, output ordering is deterministic.

Ties are resolved by:

1. higher projected points
2. better overall rank
3. better ADP
4. canonical player ID

## Current limitations

Recommendation Engine v1 is a baseline decision model, not the final strategy engine.

It does not yet include:

- opponent positional-need modeling
- positional-run velocity
- calibrated probability of surviving to the next pick
- correlation or stacking strategy
- playoff schedule context
- historical backtesting against realized season outcomes
- Monte Carlo draft simulations
- learned or personalized weights

These should be added only after the baseline model is exercised through repeatable mock-draft simulations.

## Validation

The focused regression suite covers:

- projected value and value-over-replacement ordering
- unfilled starter needs
- final-player tier urgency
- ADP fall and reach behavior
- next-pick availability urgency
- drafted-player exclusion
- deterministic output
- bounded scores and explanation presence
- league-specific replacement ranks
- custom weight isolation
- invalid configuration rejection
```

### `docs/recommendation-evaluation.md`

```text
# Recommendation Evaluation Harness

## Purpose

Recommendation Engine v1 is deterministic, but deterministic output is not automatically good output. The evaluation harness turns draft strategy assumptions into named, repeatable scenarios so weight changes can be measured before they reach the live draft room.

The harness is deliberately separate from the graphical interface. It can run in Codespaces, on a local laptop, or in CI using only the TypeScript packages.

## Commands

Run the complete evaluation report:

```bash
npm run evaluate:recommendations
```

Return the complete report as JSON:

```bash
npm run evaluate:recommendations:json
```

Write a deterministic score snapshot manifest while producing the normal report:

```bash
npm run evaluate:recommendations -- --write-snapshots=artifacts/recommendation-snapshots.json
```

The command exits with a nonzero status when any behavioral expectation fails.

## Built-in scenarios

The initial suite covers six strategic questions:

1. **Elite value:** Does an elite player clearly separate from the remaining pool?
2. **Open starter:** Does a roster-focused profile fill a missing starter before adding redundant depth?
3. **Tier cliff:** Does an urgency-focused profile recognize the final player before a meaningful positional tier drop?
4. **Will not return:** Does the engine distinguish between taking a player now and waiting until the user's next selection?
5. **Risk versus reward:** Do safety-first and upside-first profiles make intentionally different choices?
6. **Drafted-player filter:** Is a previously selected player excluded from every recommendation list?

These are synthetic benchmark states. They are small enough to understand by inspection and stable enough to identify regressions.

## Weight profiles

The harness compares the same scenario under multiple named profiles:

- `default`
- `value-heavy`
- `roster-first`
- `urgency-first`
- `upside-first`
- `safety-first`

Profiles are not user-facing strategy presets yet. They are diagnostic tools that show whether a component actually influences the ranking in the expected direction.

## Expectations

A scenario can assert:

- the top-ranked player
- the first players in ranking order
- one player ranking before another
- inclusion or exclusion
- explanation text
- minimum or maximum component scores
- an allowed total-score range

Expectations without a `profileId` apply to the configured baseline profile. Profile-specific expectations apply only to that named weight profile.

## Score snapshots

Each scenario/profile evaluation captures a JSON-safe snapshot containing:

- recommendation order
- total scores
- all eight component scores
- replacement and next-pick context
- primary explanation
- full explanation list

Snapshot output contains no generated timestamp, so the same engine and inputs produce identical JSON. A saved manifest can therefore be diffed in Git when intentional tuning changes the score surface.

## Weight comparison report

The Markdown report displays the leading recommendation for every scenario/profile pair and explicitly identifies scenarios where the top player changes between profiles.

This does not declare one profile correct. It exposes sensitivity. A profile that never changes a ranking may have weights too weak to matter; a profile that changes every scenario may be overpowered.

## Tuning workflow

1. Add or update a named scenario that represents the strategic behavior being discussed.
2. Add a narrow expectation describing the intended outcome.
3. Run the evaluation suite using the current weights.
4. Adjust one component or profile at a time.
5. Review failed expectations and score snapshots.
6. Commit the scenario, rationale, and intentional snapshot changes together.

Do not tune weights solely to make one anecdotal scenario pass. A change should improve the intended behavior without causing unrelated scenarios to regress.

## Public API

```ts
const report = runRecommendationEvaluation(scenarios, {
  profiles,
  baselineProfileId: "default",
});

const markdown = formatRecommendationEvaluationReport(report);
const snapshots = createRecommendationSnapshotManifest(report);
```

The evaluator accepts an injectable recommendation runner. Production use defaults to `recommendPlayers`; tests may inject a controlled runner so expectation and reporting behavior can be validated independently.

## Current limits

- Scenarios are synthetic and do not yet replay historical drafts.
- Expected availability still uses the v1 ADP-window heuristic.
- The harness measures recommendation behavior, not eventual fantasy points or league win probability.
- Exact-score snapshots should support review, not replace behavioral expectations.

The next evaluation layer will replay larger mock drafts and compare roster outcomes across strategies.
```

### `docs/release-criteria.md`

```text
# Release Criteria

## M2 draft-engine release gate

- TypeScript packages build from a clean checkout.
- Unit tests cover snake order, picks, rosters, undo, correction, and serialization.
- A complete twelve-team draft simulation passes.
- Domain logic has no network, UI, or database dependency.

## v1.0 desktop release gate

- Windows installer builds successfully.
- Application launches without Python, Node, Git, or a terminal.
- A complete draft can be conducted with networking disabled.
- Autosave survives application closure and relaunch.
- Exported drafts can be imported into a clean installation.
- Duplicate and invalid picks cannot silently corrupt state.
- Player-data schema incompatibility produces a clear error.
- User documentation matches the released workflow.
```

### `docs/repository-audit.md`

```text
# Repository Baseline Audit

## Scope

This audit records the initial state observed before building the offline draft application.

## Confirmed strengths

- Existing Python package configuration targets Python 3.11 or later.
- Historical data tooling already uses Pandas, Polars, DuckDB, Parquet, nflreadpy, and scikit-learn.
- The repository defines a canonical player ID layer.
- Cross-source player joins are intended to use `canonical_player_id`.
- Existing scripts cover ADP ingestion, nflverse ingestion, and player-reference construction.
- pytest, Ruff, and Black are already configured.
- The repository is private and the owner has full administrative and write permission.

## Baseline issues corrected in this branch

- The README contained conversational wrapper text and nested Markdown code fences.
- `pyarrow` was declared twice with different minimum versions.
- The existing README described a Codespaces-first research platform but did not define the local desktop delivery model.
- Product scope, offline rules, system boundaries, and milestone acceptance criteria were not recorded in repository documentation.

## Known audit limitations

The connected GitHub interface allowed direct inspection and editing of known repository paths but did not provide a complete recursive file-tree listing in this session. Runtime validation was also unavailable because the execution environment could not clone GitHub and did not include the GitHub CLI.

Accordingly, this branch makes only low-risk documentation and dependency-cleanup changes. Functional source-code changes will begin after the next implementation branch inspects the relevant files directly and adds executable draft-engine tests.

## Next audit actions

Before changing the Python data pipeline:

1. Inspect every module under `packages/data`.
2. Inspect every current test under `tests/data`.
3. Run the existing ingestion and test commands in an environment with repository checkout access.
4. Record current test counts and failures.
5. Confirm whether generated data files are intentionally tracked or ignored.
6. Add a CI workflow that reproduces the validated local commands.

## Baseline conclusion

The existing data foundation should be retained. The project should evolve incrementally into a monorepo, beginning with a separately testable TypeScript draft engine rather than restructuring or replacing the working Python pipeline.
```

### `docs/roadmap.md`

```text
# Implementation Roadmap

## M1 — Historical data foundation

**Status:** Existing foundation

- nflverse ingestion
- historical ADP ingestion
- canonical player IDs
- player reference table
- Parquet outputs
- validation tests

## M2 — Offline draft engine foundation

**Status:** Baseline implementation complete

**Goal:** Establish the domain model and run a complete draft without a graphical interface.

### Deliverables

1. Repository baseline and documentation
2. TypeScript workspace and shared schemas
3. League-settings model
4. Snake-order generator
5. Draft-state reducer
6. Pick validation and duplicate prevention
7. Roster construction and open-slot calculations
8. Undo and historical pick correction
9. State serialization and fixtures
10. Complete twelve-team simulation tests

### Exit criteria

- A deterministic automated test completes an entire draft.
- Every roster and pick slot is correct.
- Undo and correction leave the state valid.
- State can be serialized and restored without information loss.

The baseline exit criteria are covered by the draft-engine, roster-allocation, persistence, and full-draft regression suites.

## M3 — Recommendation engine v1

**Status:** Baseline scoring and evaluation harness implemented

**Goal:** Return explainable recommendations after every pick.

### Deliverables

1. App-ready player data release schema
2. Replacement-level calculations
3. Base value and VOR
4. Positional tiers and tier urgency
5. Roster-need scoring
6. Positional scarcity scoring
7. ADP value
8. Expected-availability estimate
9. Risk and upside inputs
10. Recommendation explanations
11. Named scenario and weight-comparison evaluation harness
12. Larger mock-draft and historical replay evaluation

### Exit criteria

- Recommendations change logically with roster and draft state.
- Every recommendation has a structured explanation.
- Engine output is deterministic for fixed inputs.
- Repeatable scenarios expose scoring behavior for tuning.
- Recommendation behavior can be checked in CI before interface changes merge.

Items 1 through 11 have baseline implementations. Broader calibration with real preseason releases can continue without blocking interface work because the stable public API is protected by the evaluation harness.

## M4 — Local draft-room interface

**Status:** Functional, recoverable, roster-configurable, UDK-enabled, and NFLverse-enriched browser application implemented

**Goal:** Make the engine practical during a real draft.

### Deliverables

1. React and Vite application — baseline complete
2. New-draft setup flow — baseline complete
3. Player search and filters — baseline complete
4. Manual pick entry — baseline complete
5. Live draft board and recent-pick feed — baseline complete
6. Team roster views — baseline complete
7. Recommendation panel — baseline complete
8. Undo and correction interface — complete
9. Keyboard-first workflow — baseline complete
10. Draft import, autosave, and recovery — complete for the browser application
11. Playwright end-to-end tests — baseline complete
12. Custom roster editor — complete
13. Fantasy Footballers UDK ZIP import — complete
14. NFLverse identity and prior-year-stat enrichment — baseline complete
15. Real preseason release calibration and saved identity overrides — pending

### Current behavior

- Setup creates a real deterministic draft state rather than mocked UI state.
- Every manual selection advances the snake order through the draft engine.
- Position-aware roster assignments are shown for every fantasy team.
- Recommendations recalculate from the current user roster and remaining player pool.
- Picks can be corrected by replaying the authoritative selection history.
- The interface autosaves after every state change and restores the latest valid draft after a reload.
- Versioned JSON backups can be exported, cleared from local recovery, and imported again.
- Keyboard shortcuts support search, player navigation, drafting, undo, export, and latest-pick correction.
- League setup supports editable QB, RB, WR, TE, FLEX, SUPERFLEX, K, DST, and bench counts.
- Draft rounds and total selections are derived automatically from roster capacity.
- Standard, no-kicker, no-defense, extra-flex, two-QB, and superflex structures are supported.
- A UDK ZIP is recognized and normalized entirely in the browser.
- Andy, Jason, and Mike stat lines are rescored for Standard, Half PPR, or Full PPR and combined by median.
- Average, Sleeper, ESPN, Yahoo, and Underdog ADP can be selected and converted to overall picks using league size.
- Import coverage and unmatched rows are shown before the draft starts.
- A compact NFLverse JSON release supplies stable IDs, aliases, current teams, roster status, and prior-season statistics.
- UDK players are matched deterministically by normalized name and position, with team used only to resolve collisions.
- Fuzzy and ambiguous matches are reported for review rather than accepted automatically.
- Rookies and current players without prior-year statistics can still receive stable identities.
- UDK remains authoritative for projections, rankings, tiers, risk, upside, and ADP.
- The combined release replaces the fictional player pool while remaining local to the user's device.
- Playwright validates keyboard drafting, recovery, correction, undo, export, import, custom roster setup, UDK ZIP upload, NFLverse import, stable-ID matching, and combined draft creation in Chromium.

### Exit criteria

- A user can complete a draft without developer assistance.
- Common pick entry requires minimal interaction.
- Errors are recoverable and clearly explained.
- A browser-level test completes a representative draft workflow.
- A fresh day-of-draft UDK package can replace the demonstration release without code changes.
- UDK players can be enriched with stable NFLverse identities and prior-year history without changing UDK projections.

The interface, resilience, roster, UDK import, and NFLverse enrichment baseline criteria are covered. Remaining M4 data work is real-release calibration, manual identity overrides for genuine exceptions, and broader historical replay evaluation.

## M5 — Local persistence and desktop release

**Status:** Browser recovery proven; desktop persistence and packaging pending

**Goal:** Deliver a normal Windows laptop application that works offline.

### Deliverables

1. Tauri desktop shell
2. SQLite database and migrations
3. Autosave after each state change
4. Draft recovery
5. JSON export and import
6. Versioned player-data imports
7. Offline verification
8. Windows installer build
9. User guide and release checklist

### Exit criteria

- The application installs and launches without development tools.
- A complete draft works in airplane mode.
- Closing and reopening restores the latest valid state.

Browser storage has already validated the autosave/recovery behavior and state boundaries. M5 replaces that browser adapter with durable SQLite-backed desktop persistence while preserving the same engine contracts.

## Deferred roadmap

After v1.0:

- tight-end premium and fully custom scoring
- auction drafts
- dynasty and keeper logic
- best ball
- automated mock opponents
- Monte Carlo availability modeling
- user-facing strategy profiles
- draft replay and post-draft grading

## Implementation order

The active build sequence is:

1. Complete the deterministic draft-state engine.
2. Enforce position-aware roster legality.
3. Add versioned export and restoration.
4. Implement Recommendation Engine v1.
5. Add named recommendation scenarios, score snapshots, and weight comparisons.
6. Build the React/Vite draft-room shell against stable engine APIs.
7. Add pick correction, keyboard controls, import/recovery, and browser end-to-end tests.
8. Add custom roster editing.
9. Add day-of-draft UDK ZIP import and normalization.
10. Match UDK players to NFLverse identities and prior-year statistics.
11. Generate and calibrate a real preseason re

[TRUNCATED]
```

## Important Source Files

### `packages/data/ingest/adp.py`

```text
from __future__ import annotations

import re
from dataclasses import dataclass
from io import StringIO
from pathlib import Path
from typing import Final
from urllib.request import Request, urlopen

import pandas as pd

from packages.data.constants import (
    DEFAULT_PILOT_YEARS,
    INTERMEDIATE_DATA_DIR,
    RAW_DATA_DIR,
)
from packages.data.io import write_parquet
from packages.data.player_ids import attach_canonical_ids_pandas
from packages.data.validation import assert_unique_key, require_columns

REQUIRED_OUTPUT_COLUMNS: Final[list[str]] = [
    "season",
    "player_name",
    "normalized_player_name",
    "entity_type",
    "canonical_player_id",
    "position",
    "adp_overall",
    "source_name",
]

UNIQUE_KEY_COLUMNS: Final[list[str]] = [
    "season",
    "canonical_player_id",
    "source_name",
]

SOURCE_NAME: Final[str] = "fantasypros"

DEFAULT_SOURCE_URLS: Final[dict[int, str]] = {
    2023: "https://www.fantasypros.com/nfl/adp/overall.php?year=2023",
    2024: "https://www.fantasypros.com/nfl/adp/overall.php?year=2024",
}

REQUEST_HEADERS: Final[dict[str, str]] = {
    "User-Agent": "fantasy-draft-intelligence/0.1 (+historical-adp-ingestion)"
}


@dataclass(frozen=True)
class AdpIngestConfig:
    years: list[int]
    raw_dir: Path
    intermediate_dir: Path
    source_urls: dict[int, str]


def default_config() -> AdpIngestConfig:
    return AdpIngestConfig(
        years=list(DEFAULT_PILOT_YEARS),
        raw_dir=Path(RAW_DATA_DIR),
        intermediate_dir=Path(INTERMEDIATE_DATA_DIR),
        source_urls=dict(DEFAULT_SOURCE_URLS),
    )


def _fetch_html(url: str) -> str:
    request = Request(url, headers=REQUEST_HEADERS)
    with urlopen(request) as response:  # noqa: S310
        return response.read().decode("utf-8")


def _extract_raw_table_from_html(html: str, season: int) -> pd.DataFrame:
    tables = pd.read_html(StringIO(html))
    if not tables:
        raise ValueError(f"No HTML tables found for season {season}")

    raw = tables[0].copy()
    raw.columns = [str(col).strip() for col in raw.columns]

    expected_columns = {"Player Team (Bye)", "POS", "AVG"}
    missing_columns = expected_columns.difference(raw.columns)
    if missing_columns:
        raise ValueError(
            f"Missing expected FantasyPros columns for season {season}: "
            f"{sorted(missing_columns)}"
        )

    raw["season"] = season
    raw["source_name"] = SOURCE_NAME
    return raw


def _split_player_name(value: object) -> str:
    text = str(value).strip()
    if not text:
        return text

    text = re.sub(r"\s+[A-Z]{2,3}\s+\(\d+\)$", "", text)
    return text.strip()


def _extract_position(value: object) -> str:
    text = str(value).strip().upper()
    if not text:
        return text

    for valid_position in ("QB", "RB", "WR", "TE", "DST", "K"):
        if text.startswith(valid_position):
            return valid_position

    return text


def normalize_historical_adp(raw_df: pd.DataFrame) -> pd.DataFrame:
    normalized = pd.DataFrame(
        {
            "season": pd.to_numeric(raw_df["season"], errors="coerce").astype("Int64"),
            "player_name": raw_df["Player Team (Bye)"].map(_split_player_name),
            "position": raw_df["POS"].map(_extract_position),
            "adp_overall": pd.to_numeric(raw_df["AVG"], errors="coerce"),
            "source_name": raw_df["source_name"].astype("string").str.strip(),
        }
    )

    normalized["player_name"] = normalized["player_name"].astyp

[TRUNCATED]
```

### `packages/data/ingest/coaching.py`

```text
from __future__ import annotations

import pandas as pd


def fetch_coaching_history() -> pd.DataFrame:
    """
    Placeholder coaching history extractor.

    MVP may begin with a manually maintained table.
    """
    return pd.DataFrame(
        [
            {
                "season": 2024,
                "team": "EX",
                "head_coach": "Example HC",
                "offensive_coordinator": "Example OC",
            }
        ]
    )
```

### `packages/data/ingest/nflverse.py`

```text
from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from pathlib import Path

import nflreadpy as nfl
import polars as pl

from packages.data.player_ids import attach_canonical_ids_polars

REQUIRED_OUTPUT_COLUMNS = [
    "season",
    "week",
    "player_name",
    "normalized_player_name",
    "entity_type",
    "canonical_player_id",
    "team",
    "position",
    "fantasy_points",
    "source_name",
]

TEAM_COLUMN_CANDIDATES = [
    "recent_team",
    "team",
    "team_abbr",
    "posteam",
]

PLAYER_NAME_CANDIDATES = [
    "player_display_name",
    "player_name",
]

FANTASY_POINTS_CANDIDATES = [
    "fantasy_points",
    "fantasy_points_ppr",
]

SOURCE_NAME = "nflverse"


@dataclass(frozen=True)
class NflverseIngestConfig:
    years: Sequence[int]
    raw_dir: Path
    intermediate_dir: Path


def _first_existing_column(df: pl.DataFrame, candidates: Sequence[str]) -> str:
    for column in candidates:
        if column in df.columns:
            return column
    raise ValueError(f"None of the candidate columns exist: {candidates}")


def _normalize_weekly_player_stats(df: pl.DataFrame) -> pl.DataFrame:
    player_name_col = _first_existing_column(df, PLAYER_NAME_CANDIDATES)
    team_col = _first_existing_column(df, TEAM_COLUMN_CANDIDATES)
    fantasy_points_col = _first_existing_column(df, FANTASY_POINTS_CANDIDATES)

    required_source_columns = {
        "season",
        "week",
        player_name_col,
        team_col,
        "position",
        fantasy_points_col,
    }
    missing = required_source_columns.difference(df.columns)
    if missing:
        raise ValueError(f"Missing required source columns: {sorted(missing)}")

    normalized = (
        df.select(
            [
                pl.col("season").cast(pl.Int64),
                pl.col("week").cast(pl.Int64),
                pl.col(player_name_col).alias("player_name").cast(pl.Utf8),
                pl.col(team_col).alias("team").cast(pl.Utf8),
                pl.col("position").cast(pl.Utf8),
                pl.col(fantasy_points_col).alias("fantasy_points").cast(pl.Float64),
            ]
        )
        .filter(
            pl.col("season").is_not_null()
            & pl.col("week").is_not_null()
            & pl.col("player_name").is_not_null()
        )
        .with_columns(
            [
                pl.col("player_name").str.strip_chars(),
                pl.col("team").str.strip_chars(),
                pl.col("position").str.strip_chars(),
                pl.lit(SOURCE_NAME).alias("source_name"),
            ]
        )
    )

    normalized = attach_canonical_ids_polars(normalized)
    normalized = normalized.select(REQUIRED_OUTPUT_COLUMNS)
    normalized = normalized.sort(["season", "week", "canonical_player_id"])

    missing_output = [col for col in REQUIRED_OUTPUT_COLUMNS if col not in normalized.columns]
    if missing_output:
        raise ValueError(f"Normalized output missing required columns: {missing_output}")

    return normalized


def fetch_weekly_player_data(years: Iterable[int]) -> pl.DataFrame:
    return load_weekly_player_stats(years)


def load_weekly_player_stats(years: Iterable[int]) -> pl.DataFrame:
    years = sorted({int(year) for year in years})
    if not years:
        raise ValueError("At least one year must be provided")

    raw = nfl.load_player_stats(seasons=years, summary_level="week")
    if not isinstance(raw, pl.DataFrame):
        raw = pl.from_

[TRUNCATED]
```

### `packages/data/validation.py`

```text
from collections.abc import Sequence

import pandas as pd


class ValidationError(Exception):
    """Raised when a data validation check fails."""


def require_columns(df: pd.DataFrame, required_columns: Sequence[str]) -> None:
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise ValidationError(f"Missing required columns: {missing}")


def assert_unique_key(df: pd.DataFrame, key_columns: Sequence[str]) -> None:
    duplicates = df.duplicated(subset=list(key_columns), keep=False)
    if duplicates.any():
        dup_count = int(duplicates.sum())
        raise ValidationError(
            f"Found {dup_count} duplicate rows for key columns: {list(key_columns)}"
        )
```

### `packages/modeling/baseline.py`

```text
from __future__ import annotations

import pandas as pd


def adp_baseline_rank(df: pd.DataFrame) -> pd.DataFrame:
    """
    Minimal baseline that treats ADP as the model prediction.
    """
    output = df.copy()
    if "adp_overall" in output.columns:
        output["predicted_rank_from_adp"] = output["adp_overall"]
    return output
```

### `scripts/ingest_adp.py`

```text
from __future__ import annotations

import argparse
from pathlib import Path

from packages.data.constants import (
    DEFAULT_PILOT_YEARS,
    INTERMEDIATE_DATA_DIR,
    RAW_DATA_DIR,
)
from packages.data.ingest.adp import (
    DEFAULT_SOURCE_URLS,
    AdpIngestConfig,
    ingest_historical_adp,
)
from packages.shared.logging import get_logger

logger = get_logger(__name__)

DEFAULT_RAW_DIR = Path(RAW_DATA_DIR)
DEFAULT_INTERMEDIATE_DIR = Path(INTERMEDIATE_DATA_DIR)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest historical fantasy football ADP data")
    parser.add_argument(
        "--years",
        nargs="+",
        type=int,
        default=DEFAULT_PILOT_YEARS,
        help="Season years to ingest, e.g. --years 2023 2024",
    )
    parser.add_argument(
        "--raw-dir",
        type=Path,
        default=DEFAULT_RAW_DIR,
        help="Directory for raw HTML snapshots",
    )
    parser.add_argument(
        "--intermediate-dir",
        type=Path,
        default=DEFAULT_INTERMEDIATE_DIR,
        help="Directory for normalized parquet outputs",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    source_urls = {year: DEFAULT_SOURCE_URLS[year] for year in args.years}

    config = AdpIngestConfig(
        years=args.years,
        raw_dir=args.raw_dir,
        intermediate_dir=args.intermediate_dir,
        source_urls=source_urls,
    )

    logger.info("Ingesting historical ADP for seasons=%s", args.years)
    df = ingest_historical_adp(config)
    logger.info(
        "ADP ingest complete: rows=%s cols=%s years=%s-%s",
        len(df),
        len(df.columns),
        min(args.years),
        max(args.years),
    )


if __name__ == "__main__":
    main()
```

### `scripts/ingest_nflverse.py`

```text
from __future__ import annotations

import argparse
from pathlib import Path

from packages.data.ingest.nflverse import NflverseIngestConfig, ingest_nflverse_weekly_players

DEFAULT_YEARS = [2023, 2024]
DEFAULT_RAW_DIR = Path("data/raw")
DEFAULT_INTERMEDIATE_DIR = Path("data/intermediate")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest weekly NFL player data from nflverse")
    parser.add_argument(
        "--years",
        nargs="+",
        type=int,
        default=DEFAULT_YEARS,
        help="Season years to ingest, e.g. --years 2023 2024",
    )
    parser.add_argument(
        "--raw-dir",
        type=Path,
        default=DEFAULT_RAW_DIR,
        help="Directory for raw parquet snapshots",
    )
    parser.add_argument(
        "--intermediate-dir",
        type=Path,
        default=DEFAULT_INTERMEDIATE_DIR,
        help="Directory for normalized parquet outputs",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    config = NflverseIngestConfig(
        years=args.years,
        raw_dir=args.raw_dir,
        intermediate_dir=args.intermediate_dir,
    )

    df = ingest_nflverse_weekly_players(config)
    print(
        f"Ingest complete: rows={df.height}, cols={df.width}, "
        f"years={min(args.years)}-{max(args.years)}"
    )


if __name__ == "__main__":
    main()
```

### `scripts/validate_data.py`

```text
from packages.data.ingest.adp import fetch_historical_adp
from packages.data.validation import require_columns


def main() -> None:
    adp = fetch_historical_adp()
    require_columns(adp, ["season", "player_name", "position", "adp_overall"])
    print("Validation passed.")


if __name__ == "__main__":
    main()
```

### `tests/test_nflverse_history.py`

```text
from __future__ import annotations

import json
from pathlib import Path

import polars as pl
import pytest

from packages.data.nflverse_history import (
    build_nflverse_history_release,
    write_nflverse_history_release,
)


def _players() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "gsis_id": ["00-0039001", "00-0042002"],
            "display_name": ["Amon-Ra St. Brown", "Rookie Runner Jr."],
            "position": ["WR", "RB"],
        }
    )


def _rosters() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "season": [2026, 2026],
            "gsis_id": ["00-0039001", "00-0042002"],
            "full_name": ["Amon-Ra St. Brown", "Rookie Runner"],
            "position": ["WR", "RB"],
            "team": ["DET", "NYG"],
            "status": ["ACT", "ACT"],
        }
    )


def _stats() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "season": [2025, 2025, 2024],
            "season_type": ["REG", "REG", "REG"],
            "week": [1, 2, 1],
            "player_id": ["00-0039001", "00-0039001", "00-0039001"],
            "fantasy_points": [10.0, 20.0, 99.0],
            "fantasy_points_ppr": [15.0, 24.0, 109.0],
            "attempts": [0.0, 0.0, 0.0],
            "passing_yards": [0.0, 0.0, 0.0],
            "passing_tds": [0.0, 0.0, 0.0],
            "interceptions": [0.0, 0.0, 0.0],
            "carries": [1.0, 2.0, 0.0],
            "rushing_yards": [6.0, 12.0, 0.0],
            "rushing_tds": [0.0, 0.0, 0.0],
            "targets": [8.0, 7.0, 20.0],
            "receptions": [5.0, 4.0, 10.0],
            "receiving_yards": [70.0, 110.0, 200.0],
            "receiving_tds": [0.0, 1.0, 2.0],
            "passing_fumbles_lost": [0.0, 0.0, 0.0],
            "rushing_fumbles_lost": [0.0, 1.0, 0.0],
            "receiving_fumbles_lost": [0.0, 0.0, 0.0],
        }
    )


def test_builds_stable_identity_and_prior_season_summaries() -> None:
    release = build_nflverse_history_release(
        players=_players(),
        rosters=_rosters(),
        stats=_stats(),
        prior_season=2025,
        roster_season=2026,
        generated_at="2026-07-17T12:00:00+00:00",
    )

    assert release["schema_version"] == "1.0"
    assert release["source"] == "nflverse"
    assert release["prior_season"] == 2025
    assert release["roster_season"] == 2026
    assert len(release["players"]) == 2

    veteran = next(
        player for player in release["players"] if player["nflverse_player_id"] == "00-0039001"
    )
    assert veteran["canonical_player_id"] == "nflverse:00-0039001"
    assert veteran["normalized_name"] == "amon_ra_st_brown"
    assert veteran["current_team"] == "DET"
    assert veteran["prior_season_stats"] == {
        "season": 2025,
        "games": 2,
        "fantasy_points_standard": 30.0,
        "fantasy_points_half_ppr": 34.5,
        "fantasy_points_ppr": 39.0,
        "points_per_game_standard": 15.0,
        "points_per_game_half_ppr": 17.25,
        "points_per_game_ppr": 19.5,
        "weekly_points_stddev_half_ppr": 4.75,
        "attempts": 0.0,
        "passing_yards": 0.0,
        "passing_tds": 0.0,
        "interceptions": 0.0,
        "carries": 3.0,
        "rushing_yards": 18.0,
        "rushing_tds": 0.0,
        "targets": 15.0,
        "receptions": 9.0,
        "receiving_yards": 180.0,
        "receiving_tds": 1.0,
        "fumbles_lost": 1.0,
    }

    rookie = next(
        player for player in release["players"] if player["nflverse_player_i

[TRUNCATED]
```

### `tests/test_nflverse_release_filter.py`

```text
from __future__ import annotations

import polars as pl
import pytest

from packages.data.nflverse_release_filter import (
    filter_to_draft_relevant_players,
    repair_current_roster_identities,
)


def test_keeps_current_roster_and_prior_season_contributors() -> None:
    release = {
        "schema_version": "1.0",
        "players": [
            {
                "nflverse_player_id": "current-rookie",
                "current_team": "NYG",
                "prior_season_stats": None,
            },
            {
                "nflverse_player_id": "veteran-free-agent",
                "current_team": None,
                "prior_season_stats": {"games": 12},
            },
            {
                "nflverse_player_id": "college-only",
                "current_team": None,
                "prior_season_stats": None,
            },
        ],
    }

    filtered = filter_to_draft_relevant_players(release)

    assert [player["nflverse_player_id"] for player in filtered["players"]] == [
        "current-rookie",
        "veteran-free-agent",
    ]
    assert len(release["players"]) == 3


def test_deduplicates_stable_ids_without_name_guessing() -> None:
    player = {
        "nflverse_player_id": "00-001",
        "current_team": "DET",
        "prior_season_stats": None,
    }
    filtered = filter_to_draft_relevant_players({"players": [player, dict(player)]})

    assert filtered["players"] == [player]


def test_repairs_missing_roster_ids_positions_and_aliases() -> None:
    release = {
        "schema_version": "1.0",
        "prior_season": 2025,
        "roster_season": 2026,
        "players": [
            _release_player("BEC122142", "Carson Beck", "QB"),
            _release_player("00-0035662", "Marquise Brown", "WR", team="PHI"),
        ],
    }
    players = pl.DataFrame(
        {
            "gsis_id": ["BEC122142", "00-0040718", "00-0035662"],
            "display_name": ["Carson Beck", "Travis Hunter", "Marquise Brown"],
            "position": ["QB", "CB", "WR"],
        }
    )
    rosters = pl.DataFrame(
        {
            "season": [2026, 2026, 2026],
            "gsis_id": [None, "00-0040718", "00-0035662"],
            "full_name": ["Carson Beck", "Travis Hunter", "Marquise Brown"],
            "position": ["QB", "WR", "WR"],
            "team": ["ARI", "JAX", "PHI"],
            "status": ["RES", "ACT", "ACT"],
        }
    )
    stats = pl.DataFrame(
        {
            "season": [2025],
            "season_type": ["REG"],
            "week": [1],
            "player_id": ["00-0040718"],
            "fantasy_points": [8.0],
            "fantasy_points_ppr": [11.0],
            "receptions": [3.0],
        }
    )

    repaired = repair_current_roster_identities(
        release,
        players=players,
        rosters=rosters,
        stats=stats,
        prior_season=2025,
        roster_season=2026,
    )

    carson = _find_player(repaired, "BEC122142")
    assert carson["current_team"] == "ARI"
    assert carson["roster_status"] == "RES"

    travis = _find_player(repaired, "00-0040718")
    assert travis["position"] == "WR"
    assert travis["current_team"] == "JAX"
    assert travis["prior_season_stats"]["fantasy_points_half_ppr"] == 9.5

    marquise = _find_player(repaired, "00-0035662")
    assert "Hollywood Brown" in marquise["aliases"]

    filtered = filter_to_draft_relevant_players(repaired)
    assert {player["nflverse_player_id"] for player in filtered["players"]} == {

[TRUNCATED]
```

### `tests/test_smoke.py`

```text
import pandas as pd
import polars as pl

from packages.data.ingest import adp as adp_module
from packages.data.ingest import nflverse as nflverse_module


def test_fetch_historical_adp_returns_dataframe(monkeypatch) -> None:
    expected = pd.DataFrame({"season": [2024], "player_name": ["Test Player"]})

    monkeypatch.setattr(
        adp_module,
        "ingest_historical_adp",
        lambda config: expected,
    )

    result = adp_module.fetch_historical_adp()

    assert isinstance(result, pd.DataFrame)
    assert result.equals(expected)


def test_fetch_weekly_player_data_returns_dataframe(monkeypatch) -> None:
    expected = pl.DataFrame({"season": [2024], "week": [1]})

    monkeypatch.setattr(
        nflverse_module,
        "load_weekly_player_stats",
        lambda years: expected,
    )

    result = nflverse_module.fetch_weekly_player_data([2024])

    assert isinstance(result, pl.DataFrame)
    assert result.equals(expected)
```

### `tests/test_validation.py`

```text
import pandas as pd
import pytest

from packages.data.validation import ValidationError, assert_unique_key, require_columns


def test_require_columns_passes_when_columns_exist() -> None:
    df = pd.DataFrame({"a": [1], "b": [2]})
    require_columns(df, ["a", "b"])


def test_require_columns_raises_when_missing_columns() -> None:
    df = pd.DataFrame({"a": [1]})
    with pytest.raises(ValidationError):
        require_columns(df, ["a", "b"])


def test_assert_unique_key_raises_on_duplicates() -> None:
    df = pd.DataFrame({"season": [2024, 2024], "player": ["x", "x"]})
    with pytest.raises(ValidationError):
        assert_unique_key(df, ["season", "player"])
```

### `packages/data/ingest/__init__.py`

```text
"""Data ingestion modules."""
```

### `packages/modeling/__init__.py`

```text
"""Modeling package."""
```

### `apps/draft-room/package.json`

```text
{
  "name": "@fdi/draft-room",
  "version": "0.2.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build:vite": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@fdi/draft-engine": "0.1.0",
    "@fdi/recommendation-engine": "0.1.0",
    "@fdi/shared-types": "0.1.0",
    "fflate": "0.8.3",
    "react": "19.2.7",
    "react-dom": "19.2.7"
  },
  "devDependencies": {
    "@types/react": "19.2.17",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "6.0.3",
    "vite": "8.1.4"
  }
}
```

### `apps/draft-room/src/App.tsx`

```text
import { useEffect, useMemo, useState } from "react";
import {
  correctPick,
  getPlayerById,
  makePick,
  serializeDraftState,
  undoLastPick,
} from "@fdi/draft-engine";
import type { DraftState } from "@fdi/shared-types";
import { DraftWorkspace } from "./components/DraftWorkspace.js";
import { LeagueDraftBoard } from "./components/LeagueDraftBoard.js";
import { RecoverySetupScreen } from "./components/RecoverySetupScreen.js";
import {
  DEFAULT_DRAFT_SETUP,
  createDraftFromSetup,
  createScoringSettings,
  type DraftSetup,
} from "./draft-factory.js";
import {
  clearDraftRecovery,
  importDraftFile,
  loadDraftRecovery,
  saveDraftRecovery,
} from "./draft-storage.js";
import {
  BUNDLED_NFLVERSE_HISTORY_LABEL,
  loadBundledNflverseHistory,
} from "./bundled-nflverse-history.js";
import {
  enrichPlayerDataReleaseWithNflverse,
  importNflverseHistoryFile,
  type NflverseHistoryRelease,
} from "./nflverse-history.js";
import {
  buildUdkPlayerDataRelease,
  parseUdkZip,
  type UdkImportPackage,
} from "./udk-importer.js";

export function App() {
  const [initialRecovery] = useState<DraftState | null>(() => loadDraftRecovery());
  const [setup, setSetup] = useState<DraftSetup>(DEFAULT_DRAFT_SETUP);
  const [draftState, setDraftState] = useState<DraftState | null>(initialRecovery);
  const [recoveredDraft, setRecoveredDraft] = useState<DraftState | null>(initialRecovery);
  const [udkPackage, setUdkPackage] = useState<UdkImportPackage | null>(null);
  const [udkFilename, setUdkFilename] = useState<string | null>(null);
  const [bundledHistory, setBundledHistory] = useState<NflverseHistoryRelease | null>(null);
  const [historyRelease, setHistoryRelease] = useState<NflverseHistoryRelease | null>(null);
  const [historyFilename, setHistoryFilename] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    initialRecovery === null ? null : "Autosaved draft restored on this device.",
  );

  const udkBuild = useMemo(() => {
    if (udkPackage === null) {
      return null;
    }
    return buildUdkPlayerDataRelease(udkPackage, {
      scoring: createScoringSettings(setup.scoringPreset),
      adpTeamCount: setup.teamCount,
      adpSource: setup.adpSource,
      generatedAt: new Date().toISOString(),
    });
  }, [setup.adpSource, setup.scoringPreset, setup.teamCount, udkPackage]);

  const historyBuild = useMemo(() => {
    if (udkBuild === null || historyRelease === null) {
      return null;
    }
    return enrichPlayerDataReleaseWithNflverse(udkBuild.release, historyRelease);
  }, [historyRelease, udkBuild]);

  const activePlayersById = useMemo(
    () =>
      new Map(
        (draftState?.playerDataRelease.players ?? []).map((player) => [
          player.canonical_player_id,
          player,
        ]),
      ),
    [draftState],
  );

  useEffect(() => {
    let cancelled = false;
    void loadBundledNflverseHistory()
      .then((release) => {
        if (cancelled) return;
        setBundledHistory(release);
        setHistoryRelease((current) => current ?? release);
        setHistoryFilename((current) => current ?? BUNDLED_NFLVERSE_HISTORY_LABEL);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage((current) =>
          current ?? `Bundled NFLverse history failed to load: ${toErrorMessage(error)}`,
        );
      });
    return () => {
      cancelled = true;
    };

[TRUNCATED]
```

### `apps/draft-room/src/bundled-nflverse-history.ts`

```text
import { strFromU8, unzipSync } from "fflate";
import {
  parseNflverseHistoryJson,
  type NflverseHistoryRelease,
} from "./nflverse-history.js";

export const BUNDLED_NFLVERSE_HISTORY_ARCHIVE = "nflverse-history-2025-2026.zip";
export const BUNDLED_NFLVERSE_HISTORY_LABEL = "Bundled NFLverse 2025/2026";

export async function loadBundledNflverseHistory(
  fetcher: typeof fetch = fetch,
  url = defaultBundledUrl(),
): Promise<NflverseHistoryRelease> {
  const response = await fetcher(url);
  if (!response.ok) {
    throw new TypeError(
      `Bundled NFLverse history could not be loaded (${response.status} ${response.statusText}).`,
    );
  }

  let archive: Record<string, Uint8Array>;
  try {
    archive = unzipSync(new Uint8Array(await response.arrayBuffer()));
  } catch (error) {
    throw new TypeError(`Bundled NFLverse history is not a readable ZIP archive: ${messageOf(error)}`);
  }

  const jsonEntries = Object.entries(archive).filter(
    ([path, bytes]) => /\.json$/i.test(path) && bytes.length > 0,
  );
  if (jsonEntries.length !== 1) {
    throw new TypeError(
      `Bundled NFLverse history must contain exactly one JSON release; found ${jsonEntries.length}.`,
    );
  }

  return parseNflverseHistoryJson(strFromU8(jsonEntries[0]![1]));
}

function defaultBundledUrl(): string {
  const baseUrl = typeof document === "undefined" ? "http://localhost/" : document.baseURI;
  return new URL(`data/${BUNDLED_NFLVERSE_HISTORY_ARCHIVE}`, baseUrl).toString();
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
```

### `apps/draft-room/src/components/CorrectionDialog.tsx`

```text
import { useEffect, useMemo, useRef, useState } from "react";
import type { DraftPick, DraftState, PlayerDataRecord, PlayerPosition } from "@fdi/shared-types";

interface CorrectionDialogProps {
  state: DraftState;
  pick: DraftPick;
  onClose: () => void;
  onCorrect: (overallPick: number, playerId: string) => boolean;
}

type PositionFilter = "ALL" | PlayerPosition;

const POSITION_FILTERS: PositionFilter[] = ["ALL", "QB", "RB", "WR", "TE", "K", "DST"];

export function CorrectionDialog({ state, pick, onClose, onCorrect }: CorrectionDialogProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const currentPlayer = state.playerDataRelease.players.find(
    (player) => player.canonical_player_id === pick.playerId,
  );
  const team = state.teams.find((candidate) => candidate.teamId === pick.teamId);

  const candidates = useMemo(() => {
    const eligibleIds = new Set([...state.availablePlayerIds, pick.playerId]);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return state.playerDataRelease.players
      .filter((player) => eligibleIds.has(player.canonical_player_id))
      .filter((player) => positionFilter === "ALL" || player.position === positionFilter)
      .filter((player) => {
        if (normalizedQuery.length === 0) {
          return true;
        }
        return [player.display_name, player.position, player.nfl_team ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort(comparePlayers)
      .slice(0, 60);
  }, [pick.playerId, positionFilter, searchQuery, state.availablePlayerIds, state.playerDataRelease]);

  useEffect(() => {
    searchInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function selectReplacement(playerId: string): void {
    if (onCorrect(pick.overallPick, playerId)) {
      onClose();
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="correction-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="correction-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-heading">
          <div>
            <p className="eyebrow">Correct recorded selection</p>
            <h2 id="correction-title">Pick #{pick.overallPick}</h2>
            <p>
              {team?.name ?? pick.teamId} currently has {currentPlayer?.display_name ?? pick.playerId}.
            </p>
          </div>
          <button className="ghost-button" type="button" onClick={onClose} aria-label="Close correction dialog">
            Close
          </button>
        </div>

        <label className="search-field correction-search">
          <span className="sr-only">Search replacement players</span>
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search replacement player…"
          />
        </label>

        <div className="position-filters" aria-label="Filter repl

[TRUNCATED]
```

### `apps/draft-room/src/components/DraftRoom.tsx`

```text
import { useMemo, useState } from "react";
import { buildRosterAssignments, getCurrentOrderSlot } from "@fdi/draft-engine";
import { recommendPlayers } from "@fdi/recommendation-engine";
import type {
  DraftPick,
  DraftState,
  PlayerDataRecord,
  PlayerPosition,
  RosterSlotType,
} from "@fdi/shared-types";

interface DraftRoomProps {
  state: DraftState;
  notice: string | null;
  onDraftPlayer: (playerId: string) => void;
  onUndo: () => void;
  onExport: () => void;
  onExit: () => void;
}

type PositionFilter = "ALL" | PlayerPosition;

const POSITION_FILTERS: PositionFilter[] = ["ALL", "QB", "RB", "WR", "TE", "K", "DST"];

const ROSTER_SLOT_ORDER: RosterSlotType[] = [
  "QB",
  "RB",
  "WR",
  "TE",
  "FLEX",
  "SUPERFLEX",
  "K",
  "DST",
  "BENCH",
];

export function DraftRoom({
  state,
  notice,
  onDraftPlayer,
  onUndo,
  onExport,
  onExit,
}: DraftRoomProps) {
  const userTeam = state.teams.find((team) => team.isUser) ?? state.teams[0]!;
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const [selectedTeamId, setSelectedTeamId] = useState(userTeam.teamId);

  const currentSlot = getCurrentOrderSlot(state);
  const currentTeam =
    currentSlot === null
      ? null
      : state.teams.find((team) => team.teamId === currentSlot.teamId) ?? null;
  const isUserOnClock = currentTeam?.isUser ?? false;
  const rosters = useMemo(() => buildRosterAssignments(state), [state]);
  const playersById = useMemo(
    () =>
      new Map(
        state.playerDataRelease.players.map((player) => [player.canonical_player_id, player]),
      ),
    [state.playerDataRelease],
  );

  const recommendationResult = useMemo(() => {
    if (state.availablePlayerIds.length === 0) {
      return null;
    }
    return recommendPlayers(state, { teamId: userTeam.teamId, limit: 5 });
  }, [state, userTeam.teamId]);

  const filteredPlayers = useMemo(() => {
    const available = new Set(state.availablePlayerIds);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return state.playerDataRelease.players
      .filter((player) => available.has(player.canonical_player_id))
      .filter((player) => positionFilter === "ALL" || player.position === positionFilter)
      .filter((player) => {
        if (normalizedQuery.length === 0) {
          return true;
        }
        return [player.display_name, player.position, player.nfl_team ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort(compareAvailablePlayers)
      .slice(0, 80);
  }, [positionFilter, searchQuery, state.availablePlayerIds, state.playerDataRelease.players]);

  const selectedTeam =
    state.teams.find((team) => team.teamId === selectedTeamId) ?? userTeam;
  const selectedRoster = [...(rosters[selectedTeam.teamId] ?? [])].sort(compareRosterPicks);
  const recentPicks = [...state.picks].slice(-12).reverse();
  const completedPicks = state.picks.length;
  const totalPicks = state.order.length;
  const completionPercent = Math.round((completedPicks / totalPicks) * 100);

  return (
    <main className="draft-room-shell">
      <header className="draft-header">
        <div className="draft-brand">
          <div className="brand-mark brand-mark-small" aria-hidden="true">
            FDI
          </div>
          <div>
            <p className="eyebrow">Fantasy Draft Intelligence</p>
            <h1>{state.settings.leagueName}</h1>

[TRUNCATED]
```

### `apps/draft-room/src/components/DraftWorkspace.tsx`

```text
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { buildRosterAssignments, getCurrentOrderSlot } from "@fdi/draft-engine";
import { recommendPlayers } from "@fdi/recommendation-engine";
import type {
  DraftPick,
  DraftState,
  PlayerDataRecord,
  PlayerPosition,
  RosterSlotType,
} from "@fdi/shared-types";
import { CorrectionDialog } from "./CorrectionDialog.js";

interface DraftWorkspaceProps {
  state: DraftState;
  notice: string | null;
  onDraftPlayer: (playerId: string) => void;
  onUndo: () => void;
  onExport: () => void;
  onExit: () => void;
  onCorrectPick: (overallPick: number, playerId: string) => boolean;
  onImportDraft: (file: File) => Promise<boolean>;
}

type PositionFilter = "ALL" | PlayerPosition;

const POSITION_FILTERS: PositionFilter[] = ["ALL", "QB", "RB", "WR", "TE", "K", "DST"];
const ROSTER_SLOT_ORDER: RosterSlotType[] = [
  "QB",
  "RB",
  "WR",
  "TE",
  "FLEX",
  "SUPERFLEX",
  "K",
  "DST",
  "BENCH",
];

export function DraftWorkspace({
  state,
  notice,
  onDraftPlayer,
  onUndo,
  onExport,
  onExit,
  onCorrectPick,
  onImportDraft,
}: DraftWorkspaceProps) {
  const userTeam = state.teams.find((team) => team.isUser) ?? state.teams[0]!;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const [selectedTeamId, setSelectedTeamId] = useState(userTeam.teamId);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [correctionPickNumber, setCorrectionPickNumber] = useState<number | null>(null);

  const currentSlot = getCurrentOrderSlot(state);
  const currentTeam =
    currentSlot === null
      ? null
      : state.teams.find((team) => team.teamId === currentSlot.teamId) ?? null;
  const isUserOnClock = currentTeam?.isUser ?? false;
  const rosters = useMemo(() => buildRosterAssignments(state), [state]);
  const playersById = useMemo(
    () =>
      new Map(
        state.playerDataRelease.players.map((player) => [player.canonical_player_id, player]),
      ),
    [state.playerDataRelease],
  );

  const recommendationResult = useMemo(() => {
    if (state.availablePlayerIds.length === 0) {
      return null;
    }
    return recommendPlayers(state, { teamId: userTeam.teamId, limit: 5 });
  }, [state, userTeam.teamId]);

  const filteredPlayers = useMemo(() => {
    const available = new Set(state.availablePlayerIds);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return state.playerDataRelease.players
      .filter((player) => available.has(player.canonical_player_id))
      .filter((player) => positionFilter === "ALL" || player.position === positionFilter)
      .filter((player) => {
        if (normalizedQuery.length === 0) {
          return true;
        }
        return [player.display_name, player.position, player.nfl_team ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort(compareAvailablePlayers)
      .slice(0, 100);
  }, [positionFilter, searchQuery, state.availablePlayerIds, state.playerDataRelease.players]);

  useEffect(() => {
    if (!filteredPlayers.some((player) => player.canonical_player_id === selectedPlayerId)) {
      setSelectedPlayerId(filteredPlayers[0]?.canonical_player_id ?? null);
    }
  }, [filteredPlayers, selectedPlayerId]);

[TRUNCATED]
```

### `apps/draft-room/src/components/LeagueDraftBoard.tsx`

```text
import type { DraftPick, DraftState, PlayerDataRecord, PlayerPosition } from "@fdi/shared-types";

interface LeagueDraftBoardProps {
  state: DraftState;
  playersById: Map<string, PlayerDataRecord>;
}

interface PositionNeed {
  position: PlayerPosition | "FLEX";
  count: number;
}

const NEED_POSITIONS: PlayerPosition[] = ["QB", "RB", "WR", "TE", "K", "DST"];

export function LeagueDraftBoard({ state, playersById }: LeagueDraftBoardProps) {
  const teams = [...state.teams].sort((left, right) => left.draftSlot - right.draftSlot);
  const picksByOverall = new Map(state.picks.map((pick) => [pick.overallPick, pick]));
  const orderByRoundAndTeam = new Map(
    state.order.map((slot) => [`${slot.round}:${slot.teamId}`, slot]),
  );

  return (
    <section className="panel league-board-panel" aria-labelledby="league-board-title">
      <div className="panel-heading league-board-heading">
        <div>
          <p className="eyebrow">Draft board</p>
          <h2 id="league-board-title">League-wide grid</h2>
        </div>
        <div className="position-color-legend" aria-label="Position color legend">
          {NEED_POSITIONS.map((position) => (
            <span className={`position-legend position-bg-${position.toLowerCase()}`} key={position}>
              {position}
            </span>
          ))}
        </div>
      </div>

      <p className="panel-intro">
        Scan every roster by round. Team headers show remaining starter needs as position-colored pills,
        and completed picks use the same position colors as the player board. Hover a pick for ADP,
        tier, bye week, and projected points.
      </p>

      <div className="league-board-scroll">
        <div
          className="league-board-grid"
          style={{ gridTemplateColumns: `4.25rem repeat(${teams.length}, minmax(8.6rem, 1fr))` }}
        >
          <div className="league-board-corner">Round</div>
          {teams.map((team) => {
            const teamPicks = state.picks.filter((pick) => pick.teamId === team.teamId);
            const needs = getRemainingNeeds(state, teamPicks, playersById);
            return (
              <div
                className={`league-board-team-header ${team.isUser ? "league-board-user-team" : ""}`}
                key={team.teamId}
              >
                <span>{team.isUser ? "YOU" : `Slot ${team.draftSlot}`}</span>
                <strong>{team.name}</strong>
                {needs.length === 0 ? (
                  <small>Starters filled</small>
                ) : (
                  <div className="team-needs" aria-label={`Needs ${formatNeeds(needs)}`}>
                    {needs.map((need) => (
                      <span
                        className={`team-need-pill ${
                          need.position === "FLEX"
                            ? "position-bg-flex"
                            : `position-bg-${need.position.toLowerCase()}`
                        }`}
                        key={need.position}
                      >
                        {need.position}
                        {need.count > 1 ? ` ${need.count}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {Array.from({ length: state.settings.rounds }, (_, index) => index + 1).flatMap((round) => [
            <div className="league-board-round" key={`round-${round}`}>
              <strong>{round}</strong>

[TRUNCATED]
```

### `apps/draft-room/src/components/NflverseHistoryCard.tsx`

```text
import { useRef, type ChangeEvent } from "react";
import { BUNDLED_NFLVERSE_HISTORY_LABEL } from "../bundled-nflverse-history.js";
import type {
  NflverseEnrichmentReport,
  NflverseHistoryRelease,
} from "../nflverse-history.js";

interface NflverseHistoryCardProps {
  history: NflverseHistoryRelease | null;
  report: NflverseEnrichmentReport | null;
  filename: string | null;
  onImport: (file: File) => Promise<void>;
  onClear: () => void;
}

export function NflverseHistoryCard({
  history,
  report,
  filename,
  onImport,
  onClear,
}: NflverseHistoryCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isBundled = filename === BUNDLED_NFLVERSE_HISTORY_LABEL;

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (file !== undefined) {
      await onImport(file);
    }
    event.target.value = "";
  }

  return (
    <section className="history-import-card field-wide" aria-labelledby="history-import-title">
      <div className="history-import-heading">
        <div>
          <p className="eyebrow">Historical context</p>
          <h3 id="history-import-title">NFLverse identity and prior-year stats</h3>
          <p>
            The app loads a validated NFLverse release automatically. Import a newer JSON release
            only when you want to replace the bundled identities and prior-season production.
          </p>
        </div>
        <div className="history-import-actions">
          <button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}>
            Import newer history
          </button>
          {history === null || isBundled ? null : (
            <button className="ghost-button" type="button" onClick={onClear}>
              Use bundled release
            </button>
          )}
          <input
            ref={inputRef}
            data-testid="nflverse-history-input"
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleImport(event)}
          />
        </div>
      </div>

      {history === null ? (
        <div className="history-empty-state">
          <strong>Loading bundled NFLverse history.</strong>
          <span>The validated local release will be ready before you start the draft.</span>
        </div>
      ) : report === null ? (
        <div className="history-ready-state" role="status">
          <strong>NFLverse {history.prior_season} history is ready.</strong>
          <span>{filename} · Import a UDK ZIP to match {history.players.length} identity records.</span>
        </div>
      ) : (
        <div className="history-preview" role="status">
          <div className="history-ready-row">
            <span className="history-ready-badge">NFLverse {report.priorSeason} matched</span>
            <span>{filename}</span>
          </div>
          <div className="history-metrics">
            <Metric label="UDK matched" value={report.matchedPlayerCount} />
            <Metric label="With prior stats" value={report.matchedWithHistoryCount} />
            <Metric label="Exact names" value={report.exactMatchCount} />
            <Metric label="Team resolved" value={report.teamDisambiguatedCount} />
            <Metric
              label="Needs review"
              value={report.unmatchedPlayers.length + report.ambiguousPlayers.length}
            />
          </div>

[TRUNCATED]
```

### `apps/draft-room/src/components/RecoverySetupScreen.tsx`

```text
import { useRef, type ChangeEvent, type FormEvent } from "react";
import type { DraftState } from "@fdi/shared-types";
import {
  SCORING_OPTIONS,
  TEAM_COUNT_OPTIONS,
  getStarterCapacity,
  type DraftSetup,
  type SupportedScoringPreset,
} from "../draft-factory.js";
import type {
  NflverseEnrichmentReport,
  NflverseHistoryRelease,
} from "../nflverse-history.js";
import {
  UDK_ADP_SOURCES,
  type UdkAdpSource,
  type UdkBuildReport,
} from "../udk-importer.js";
import { NflverseHistoryCard } from "./NflverseHistoryCard.js";
import { RosterConfigurator } from "./RosterConfigurator.js";
import { UdkImportCard } from "./UdkImportCard.js";

interface RecoverySetupScreenProps {
  setup: DraftSetup;
  recoveredDraft: DraftState | null;
  udkReport: UdkBuildReport | null;
  udkFilename: string | null;
  history: NflverseHistoryRelease | null;
  historyReport: NflverseEnrichmentReport | null;
  historyFilename: string | null;
  errorMessage: string | null;
  onSetupChange: (setup: DraftSetup) => void;
  onStartDraft: () => void;
  onResumeDraft: () => void;
  onDiscardRecovery: () => void;
  onImportDraft: (file: File) => Promise<boolean>;
  onImportUdk: (file: File) => Promise<void>;
  onClearUdk: () => void;
  onImportHistory: (file: File) => Promise<void>;
  onClearHistory: () => void;
}

const ADP_SOURCE_LABELS: Record<UdkAdpSource, string> = {
  average: "Average market",
  sleeper: "Sleeper",
  espn: "ESPN",
  yahoo: "Yahoo",
  underdog: "Underdog",
};

export function RecoverySetupScreen({
  setup,
  recoveredDraft,
  udkReport,
  udkFilename,
  history,
  historyReport,
  historyFilename,
  errorMessage,
  onSetupChange,
  onStartDraft,
  onResumeDraft,
  onDiscardRecovery,
  onImportDraft,
  onImportUdk,
  onClearUdk,
  onImportHistory,
  onClearHistory,
}: RecoverySetupScreenProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const draftSlots = Array.from({ length: setup.teamCount }, (_, index) => index + 1);
  const starterCount = getStarterCapacity(setup.rosterCounts);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onStartDraft();
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (file !== undefined) {
      await onImportDraft(file);
    }
    event.target.value = "";
  }

  const sourceLabel =
    udkReport === null
      ? "Demonstration release"
      : historyReport === null
        ? `UDK ${udkReport.season}`
        : `UDK ${udkReport.season} + NFLverse ${historyReport.priorSeason}`;

  return (
    <main className="setup-shell">
      <section className="setup-hero">
        <div className="brand-mark" aria-hidden="true">
          FDI
        </div>
        <p className="eyebrow">Local-first draft intelligence</p>
        <h1>Build your draft room.</h1>
        <p className="setup-lede">
          Configure the league and roster, load fresh UDK projections and NFLverse history, restore
          a saved draft, and run the entire snake draft from one laptop.
        </p>

        <div className="feature-strip" aria-label="Draft room capabilities">
          <span>UDK projections</span>
          <span>NFLverse history</span>
          <span>Custom rosters</span>
          <span>Automatic recovery</span>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="section-heading">
          <div>

[TRUNCATED]
```

### `apps/draft-room/src/components/RosterConfigurator.tsx`

```text
import type { RosterSlotType } from "@fdi/shared-types";
import {
  ROSTER_SLOT_OPTIONS,
  getRosterCapacity,
  getStarterCapacity,
  resetRosterCounts,
  setRosterCount,
  type DraftSetup,
} from "../draft-factory.js";

interface RosterConfiguratorProps {
  setup: DraftSetup;
  onSetupChange: (setup: DraftSetup) => void;
}

export function RosterConfigurator({ setup, onSetupChange }: RosterConfiguratorProps) {
  const totalSlots = getRosterCapacity(setup.rosterCounts);
  const starterSlots = getStarterCapacity(setup.rosterCounts);
  const isCapacityValid = totalSlots >= 8 && totalSlots <= 24 && starterSlots > 0;

  function changeCount(slot: RosterSlotType, nextCount: number): void {
    const option = ROSTER_SLOT_OPTIONS.find((candidate) => candidate.slot === slot);
    if (option === undefined) {
      return;
    }
    const boundedCount = Math.max(option.min, Math.min(option.max, nextCount));
    onSetupChange(setRosterCount(setup, slot, boundedCount));
  }

  return (
    <fieldset className="roster-fieldset field-wide">
      <legend className="sr-only">Roster configuration</legend>
      <div className="roster-heading">
        <div>
          <h3>Roster configuration</h3>
          <p>Draft rounds update automatically from the total number of roster slots.</p>
        </div>
        <button
          className="ghost-button roster-reset-button"
          type="button"
          onClick={() => onSetupChange(resetRosterCounts(setup))}
        >
          Reset standard
        </button>
      </div>

      <div className="roster-grid">
        {ROSTER_SLOT_OPTIONS.map((option) => {
          const count = setup.rosterCounts[option.slot];
          return (
            <div className="roster-slot-card" key={option.slot}>
              <div className="roster-slot-copy">
                <strong>{option.slot}</strong>
                <span>{option.label}</span>
                <small>{option.description}</small>
              </div>
              <div className="roster-stepper">
                <button
                  type="button"
                  aria-label={`Decrease ${option.label}`}
                  disabled={count <= option.min}
                  onClick={() => changeCount(option.slot, count - 1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min={option.min}
                  max={option.max}
                  step="1"
                  value={count}
                  aria-label={`${option.label} roster slots`}
                  onChange={(event) => changeCount(option.slot, Number(event.target.value))}
                />
                <button
                  type="button"
                  aria-label={`Increase ${option.label}`}
                  disabled={count >= option.max}
                  onClick={() => changeCount(option.slot, count + 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`roster-capacity ${isCapacityValid ? "" : "roster-capacity-invalid"}`}>
        <span>
          <strong>{starterSlots}</strong> starters
        </span>
        <span>
          <strong>{setup.rosterCounts.BENCH}</strong> bench
        </span>
        <span>
          <strong>{totalSlots}</strong> rounds
        </span>
        <small>
          {isCapacityValid
            ? `${setup.teamCount * totalSlots} total selections

[TRUNCATED]
```

## Fantasy Domain Logic Files

### `apps/draft-room/src/components/RosterConfigurator.tsx`

```text
import type { RosterSlotType } from "@fdi/shared-types";
import {
  ROSTER_SLOT_OPTIONS,
  getRosterCapacity,
  getStarterCapacity,
  resetRosterCounts,
  setRosterCount,
  type DraftSetup,
} from "../draft-factory.js";

interface RosterConfiguratorProps {
  setup: DraftSetup;
  onSetupChange: (setup: DraftSetup) => void;
}

export function RosterConfigurator({ setup, onSetupChange }: RosterConfiguratorProps) {
  const totalSlots = getRosterCapacity(setup.rosterCounts);
  const starterSlots = getStarterCapacity(setup.rosterCounts);
  const isCapacityValid = totalSlots >= 8 && totalSlots <= 24 && starterSlots > 0;

  function changeCount(slot: RosterSlotType, nextCount: number): void {
    const option = ROSTER_SLOT_OPTIONS.find((candidate) => candidate.slot === slot);
    if (option === undefined) {
      return;
    }
    const boundedCount = Math.max(option.min, Math.min(option.max, nextCount));
    onSetupChange(setRosterCount(setup, slot, boundedCount));
  }

  return (
    <fieldset className="roster-fieldset field-wide">
      <legend className="sr-only">Roster configuration</legend>
      <div className="roster-heading">
        <div>
          <h3>Roster configuration</h3>
          <p>Draft rounds update automatically from the total number of roster slots.</p>
        </div>
        <button
          className="ghost-button roster-reset-button"
          type="button"
          onClick={() => onSetupChange(resetRosterCounts(setup))}
        >
          Reset standard
        </button>
      </div>

      <div className="roster-grid">
        {ROSTER_SLOT_OPTIONS.map((option) => {
          const count = setup.rosterCounts[option.slot];
          return (
            <div className="roster-slot-card" key={option.slot}>
              <div className="roster-slot-copy">
                <strong>{option.slot}</strong>
                <span>{option.label}</span>
                <small>{option.description}</small>
              </div>
              <div className="roster-stepper">
                <button
                  type="button"
                  aria-label={`Decrease ${option.label}`}
                  disabled={count <= option.min}
                  onClick={() => changeCount(option.slot, count - 1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min={option.min}
                  max={option.max}
                  step="1"
                  value={count}
                  aria-label={`${option.label} roster slots`}
                  onChange={(event) => changeCount(option.slot, Number(event.target.value))}
                />
                <button
                  type="button"
                  aria-label={`Increase ${option.label}`}
                  disabled={count >= option.max}
                  onClick={() => changeCount(option.slot, count + 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`roster-capacity ${isCapacityValid ? "" : "roster-capacity-invalid"}`}>
        <span>
          <strong>{starterSlots}</strong> starters
        </span>
        <span>
          <strong>{setup.rosterCounts.BENCH}</strong> bench
        </span>
        <span>
          <strong>{totalSlots}</strong> rounds
        </span>
        <small>
          {isCapacityValid
            ? `${setup.teamCount * totalSlots} total selections

[TRUNCATED]
```

### `apps/draft-room/package.json`

```text
{
  "name": "@fdi/draft-room",
  "version": "0.2.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build:vite": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@fdi/draft-engine": "0.1.0",
    "@fdi/recommendation-engine": "0.1.0",
    "@fdi/shared-types": "0.1.0",
    "fflate": "0.8.3",
    "react": "19.2.7",
    "react-dom": "19.2.7"
  },
  "devDependencies": {
    "@types/react": "19.2.17",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "6.0.3",
    "vite": "8.1.4"
  }
}
```

### `apps/draft-room/src/App.tsx`

```text
import { useEffect, useMemo, useState } from "react";
import {
  correctPick,
  getPlayerById,
  makePick,
  serializeDraftState,
  undoLastPick,
} from "@fdi/draft-engine";
import type { DraftState } from "@fdi/shared-types";
import { DraftWorkspace } from "./components/DraftWorkspace.js";
import { LeagueDraftBoard } from "./components/LeagueDraftBoard.js";
import { RecoverySetupScreen } from "./components/RecoverySetupScreen.js";
import {
  DEFAULT_DRAFT_SETUP,
  createDraftFromSetup,
  createScoringSettings,
  type DraftSetup,
} from "./draft-factory.js";
import {
  clearDraftRecovery,
  importDraftFile,
  loadDraftRecovery,
  saveDraftRecovery,
} from "./draft-storage.js";
import {
  BUNDLED_NFLVERSE_HISTORY_LABEL,
  loadBundledNflverseHistory,
} from "./bundled-nflverse-history.js";
import {
  enrichPlayerDataReleaseWithNflverse,
  importNflverseHistoryFile,
  type NflverseHistoryRelease,
} from "./nflverse-history.js";
import {
  buildUdkPlayerDataRelease,
  parseUdkZip,
  type UdkImportPackage,
} from "./udk-importer.js";

export function App() {
  const [initialRecovery] = useState<DraftState | null>(() => loadDraftRecovery());
  const [setup, setSetup] = useState<DraftSetup>(DEFAULT_DRAFT_SETUP);
  const [draftState, setDraftState] = useState<DraftState | null>(initialRecovery);
  const [recoveredDraft, setRecoveredDraft] = useState<DraftState | null>(initialRecovery);
  const [udkPackage, setUdkPackage] = useState<UdkImportPackage | null>(null);
  const [udkFilename, setUdkFilename] = useState<string | null>(null);
  const [bundledHistory, setBundledHistory] = useState<NflverseHistoryRelease | null>(null);
  const [historyRelease, setHistoryRelease] = useState<NflverseHistoryRelease | null>(null);
  const [historyFilename, setHistoryFilename] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    initialRecovery === null ? null : "Autosaved draft restored on this device.",
  );

  const udkBuild = useMemo(() => {
    if (udkPackage === null) {
      return null;
    }
    return buildUdkPlayerDataRelease(udkPackage, {
      scoring: createScoringSettings(setup.scoringPreset),
      adpTeamCount: setup.teamCount,
      adpSource: setup.adpSource,
      generatedAt: new Date().toISOString(),
    });
  }, [setup.adpSource, setup.scoringPreset, setup.teamCount, udkPackage]);

  const historyBuild = useMemo(() => {
    if (udkBuild === null || historyRelease === null) {
      return null;
    }
    return enrichPlayerDataReleaseWithNflverse(udkBuild.release, historyRelease);
  }, [historyRelease, udkBuild]);

  const activePlayersById = useMemo(
    () =>
      new Map(
        (draftState?.playerDataRelease.players ?? []).map((player) => [
          player.canonical_player_id,
          player,
        ]),
      ),
    [draftState],
  );

  useEffect(() => {
    let cancelled = false;
    void loadBundledNflverseHistory()
      .then((release) => {
        if (cancelled) return;
        setBundledHistory(release);
        setHistoryRelease((current) => current ?? release);
        setHistoryFilename((current) => current ?? BUNDLED_NFLVERSE_HISTORY_LABEL);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage((current) =>
          current ?? `Bundled NFLverse history failed to load: ${toErrorMessage(error)}`,
        );
      });
    return () => {
      cancelled = true;
    };

[TRUNCATED]
```

### `apps/draft-room/src/bundled-nflverse-history.ts`

```text
import { strFromU8, unzipSync } from "fflate";
import {
  parseNflverseHistoryJson,
  type NflverseHistoryRelease,
} from "./nflverse-history.js";

export const BUNDLED_NFLVERSE_HISTORY_ARCHIVE = "nflverse-history-2025-2026.zip";
export const BUNDLED_NFLVERSE_HISTORY_LABEL = "Bundled NFLverse 2025/2026";

export async function loadBundledNflverseHistory(
  fetcher: typeof fetch = fetch,
  url = defaultBundledUrl(),
): Promise<NflverseHistoryRelease> {
  const response = await fetcher(url);
  if (!response.ok) {
    throw new TypeError(
      `Bundled NFLverse history could not be loaded (${response.status} ${response.statusText}).`,
    );
  }

  let archive: Record<string, Uint8Array>;
  try {
    archive = unzipSync(new Uint8Array(await response.arrayBuffer()));
  } catch (error) {
    throw new TypeError(`Bundled NFLverse history is not a readable ZIP archive: ${messageOf(error)}`);
  }

  const jsonEntries = Object.entries(archive).filter(
    ([path, bytes]) => /\.json$/i.test(path) && bytes.length > 0,
  );
  if (jsonEntries.length !== 1) {
    throw new TypeError(
      `Bundled NFLverse history must contain exactly one JSON release; found ${jsonEntries.length}.`,
    );
  }

  return parseNflverseHistoryJson(strFromU8(jsonEntries[0]![1]));
}

function defaultBundledUrl(): string {
  const baseUrl = typeof document === "undefined" ? "http://localhost/" : document.baseURI;
  return new URL(`data/${BUNDLED_NFLVERSE_HISTORY_ARCHIVE}`, baseUrl).toString();
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
```

### `apps/draft-room/src/components/CorrectionDialog.tsx`

```text
import { useEffect, useMemo, useRef, useState } from "react";
import type { DraftPick, DraftState, PlayerDataRecord, PlayerPosition } from "@fdi/shared-types";

interface CorrectionDialogProps {
  state: DraftState;
  pick: DraftPick;
  onClose: () => void;
  onCorrect: (overallPick: number, playerId: string) => boolean;
}

type PositionFilter = "ALL" | PlayerPosition;

const POSITION_FILTERS: PositionFilter[] = ["ALL", "QB", "RB", "WR", "TE", "K", "DST"];

export function CorrectionDialog({ state, pick, onClose, onCorrect }: CorrectionDialogProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const currentPlayer = state.playerDataRelease.players.find(
    (player) => player.canonical_player_id === pick.playerId,
  );
  const team = state.teams.find((candidate) => candidate.teamId === pick.teamId);

  const candidates = useMemo(() => {
    const eligibleIds = new Set([...state.availablePlayerIds, pick.playerId]);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return state.playerDataRelease.players
      .filter((player) => eligibleIds.has(player.canonical_player_id))
      .filter((player) => positionFilter === "ALL" || player.position === positionFilter)
      .filter((player) => {
        if (normalizedQuery.length === 0) {
          return true;
        }
        return [player.display_name, player.position, player.nfl_team ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort(comparePlayers)
      .slice(0, 60);
  }, [pick.playerId, positionFilter, searchQuery, state.availablePlayerIds, state.playerDataRelease]);

  useEffect(() => {
    searchInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function selectReplacement(playerId: string): void {
    if (onCorrect(pick.overallPick, playerId)) {
      onClose();
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="correction-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="correction-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-heading">
          <div>
            <p className="eyebrow">Correct recorded selection</p>
            <h2 id="correction-title">Pick #{pick.overallPick}</h2>
            <p>
              {team?.name ?? pick.teamId} currently has {currentPlayer?.display_name ?? pick.playerId}.
            </p>
          </div>
          <button className="ghost-button" type="button" onClick={onClose} aria-label="Close correction dialog">
            Close
          </button>
        </div>

        <label className="search-field correction-search">
          <span className="sr-only">Search replacement players</span>
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search replacement player…"
          />
        </label>

        <div className="position-filters" aria-label="Filter repl

[TRUNCATED]
```

### `apps/draft-room/src/components/DraftRoom.tsx`

```text
import { useMemo, useState } from "react";
import { buildRosterAssignments, getCurrentOrderSlot } from "@fdi/draft-engine";
import { recommendPlayers } from "@fdi/recommendation-engine";
import type {
  DraftPick,
  DraftState,
  PlayerDataRecord,
  PlayerPosition,
  RosterSlotType,
} from "@fdi/shared-types";

interface DraftRoomProps {
  state: DraftState;
  notice: string | null;
  onDraftPlayer: (playerId: string) => void;
  onUndo: () => void;
  onExport: () => void;
  onExit: () => void;
}

type PositionFilter = "ALL" | PlayerPosition;

const POSITION_FILTERS: PositionFilter[] = ["ALL", "QB", "RB", "WR", "TE", "K", "DST"];

const ROSTER_SLOT_ORDER: RosterSlotType[] = [
  "QB",
  "RB",
  "WR",
  "TE",
  "FLEX",
  "SUPERFLEX",
  "K",
  "DST",
  "BENCH",
];

export function DraftRoom({
  state,
  notice,
  onDraftPlayer,
  onUndo,
  onExport,
  onExit,
}: DraftRoomProps) {
  const userTeam = state.teams.find((team) => team.isUser) ?? state.teams[0]!;
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const [selectedTeamId, setSelectedTeamId] = useState(userTeam.teamId);

  const currentSlot = getCurrentOrderSlot(state);
  const currentTeam =
    currentSlot === null
      ? null
      : state.teams.find((team) => team.teamId === currentSlot.teamId) ?? null;
  const isUserOnClock = currentTeam?.isUser ?? false;
  const rosters = useMemo(() => buildRosterAssignments(state), [state]);
  const playersById = useMemo(
    () =>
      new Map(
        state.playerDataRelease.players.map((player) => [player.canonical_player_id, player]),
      ),
    [state.playerDataRelease],
  );

  const recommendationResult = useMemo(() => {
    if (state.availablePlayerIds.length === 0) {
      return null;
    }
    return recommendPlayers(state, { teamId: userTeam.teamId, limit: 5 });
  }, [state, userTeam.teamId]);

  const filteredPlayers = useMemo(() => {
    const available = new Set(state.availablePlayerIds);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return state.playerDataRelease.players
      .filter((player) => available.has(player.canonical_player_id))
      .filter((player) => positionFilter === "ALL" || player.position === positionFilter)
      .filter((player) => {
        if (normalizedQuery.length === 0) {
          return true;
        }
        return [player.display_name, player.position, player.nfl_team ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort(compareAvailablePlayers)
      .slice(0, 80);
  }, [positionFilter, searchQuery, state.availablePlayerIds, state.playerDataRelease.players]);

  const selectedTeam =
    state.teams.find((team) => team.teamId === selectedTeamId) ?? userTeam;
  const selectedRoster = [...(rosters[selectedTeam.teamId] ?? [])].sort(compareRosterPicks);
  const recentPicks = [...state.picks].slice(-12).reverse();
  const completedPicks = state.picks.length;
  const totalPicks = state.order.length;
  const completionPercent = Math.round((completedPicks / totalPicks) * 100);

  return (
    <main className="draft-room-shell">
      <header className="draft-header">
        <div className="draft-brand">
          <div className="brand-mark brand-mark-small" aria-hidden="true">
            FDI
          </div>
          <div>
            <p className="eyebrow">Fantasy Draft Intelligence</p>
            <h1>{state.settings.leagueName}</h1>

[TRUNCATED]
```

### `apps/draft-room/src/components/DraftWorkspace.tsx`

```text
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { buildRosterAssignments, getCurrentOrderSlot } from "@fdi/draft-engine";
import { recommendPlayers } from "@fdi/recommendation-engine";
import type {
  DraftPick,
  DraftState,
  PlayerDataRecord,
  PlayerPosition,
  RosterSlotType,
} from "@fdi/shared-types";
import { CorrectionDialog } from "./CorrectionDialog.js";

interface DraftWorkspaceProps {
  state: DraftState;
  notice: string | null;
  onDraftPlayer: (playerId: string) => void;
  onUndo: () => void;
  onExport: () => void;
  onExit: () => void;
  onCorrectPick: (overallPick: number, playerId: string) => boolean;
  onImportDraft: (file: File) => Promise<boolean>;
}

type PositionFilter = "ALL" | PlayerPosition;

const POSITION_FILTERS: PositionFilter[] = ["ALL", "QB", "RB", "WR", "TE", "K", "DST"];
const ROSTER_SLOT_ORDER: RosterSlotType[] = [
  "QB",
  "RB",
  "WR",
  "TE",
  "FLEX",
  "SUPERFLEX",
  "K",
  "DST",
  "BENCH",
];

export function DraftWorkspace({
  state,
  notice,
  onDraftPlayer,
  onUndo,
  onExport,
  onExit,
  onCorrectPick,
  onImportDraft,
}: DraftWorkspaceProps) {
  const userTeam = state.teams.find((team) => team.isUser) ?? state.teams[0]!;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const [selectedTeamId, setSelectedTeamId] = useState(userTeam.teamId);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [correctionPickNumber, setCorrectionPickNumber] = useState<number | null>(null);

  const currentSlot = getCurrentOrderSlot(state);
  const currentTeam =
    currentSlot === null
      ? null
      : state.teams.find((team) => team.teamId === currentSlot.teamId) ?? null;
  const isUserOnClock = currentTeam?.isUser ?? false;
  const rosters = useMemo(() => buildRosterAssignments(state), [state]);
  const playersById = useMemo(
    () =>
      new Map(
        state.playerDataRelease.players.map((player) => [player.canonical_player_id, player]),
      ),
    [state.playerDataRelease],
  );

  const recommendationResult = useMemo(() => {
    if (state.availablePlayerIds.length === 0) {
      return null;
    }
    return recommendPlayers(state, { teamId: userTeam.teamId, limit: 5 });
  }, [state, userTeam.teamId]);

  const filteredPlayers = useMemo(() => {
    const available = new Set(state.availablePlayerIds);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return state.playerDataRelease.players
      .filter((player) => available.has(player.canonical_player_id))
      .filter((player) => positionFilter === "ALL" || player.position === positionFilter)
      .filter((player) => {
        if (normalizedQuery.length === 0) {
          return true;
        }
        return [player.display_name, player.position, player.nfl_team ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort(compareAvailablePlayers)
      .slice(0, 100);
  }, [positionFilter, searchQuery, state.availablePlayerIds, state.playerDataRelease.players]);

  useEffect(() => {
    if (!filteredPlayers.some((player) => player.canonical_player_id === selectedPlayerId)) {
      setSelectedPlayerId(filteredPlayers[0]?.canonical_player_id ?? null);
    }
  }, [filteredPlayers, selectedPlayerId]);

[TRUNCATED]
```

### `apps/draft-room/src/components/LeagueDraftBoard.tsx`

```text
import type { DraftPick, DraftState, PlayerDataRecord, PlayerPosition } from "@fdi/shared-types";

interface LeagueDraftBoardProps {
  state: DraftState;
  playersById: Map<string, PlayerDataRecord>;
}

interface PositionNeed {
  position: PlayerPosition | "FLEX";
  count: number;
}

const NEED_POSITIONS: PlayerPosition[] = ["QB", "RB", "WR", "TE", "K", "DST"];

export function LeagueDraftBoard({ state, playersById }: LeagueDraftBoardProps) {
  const teams = [...state.teams].sort((left, right) => left.draftSlot - right.draftSlot);
  const picksByOverall = new Map(state.picks.map((pick) => [pick.overallPick, pick]));
  const orderByRoundAndTeam = new Map(
    state.order.map((slot) => [`${slot.round}:${slot.teamId}`, slot]),
  );

  return (
    <section className="panel league-board-panel" aria-labelledby="league-board-title">
      <div className="panel-heading league-board-heading">
        <div>
          <p className="eyebrow">Draft board</p>
          <h2 id="league-board-title">League-wide grid</h2>
        </div>
        <div className="position-color-legend" aria-label="Position color legend">
          {NEED_POSITIONS.map((position) => (
            <span className={`position-legend position-bg-${position.toLowerCase()}`} key={position}>
              {position}
            </span>
          ))}
        </div>
      </div>

      <p className="panel-intro">
        Scan every roster by round. Team headers show remaining starter needs as position-colored pills,
        and completed picks use the same position colors as the player board. Hover a pick for ADP,
        tier, bye week, and projected points.
      </p>

      <div className="league-board-scroll">
        <div
          className="league-board-grid"
          style={{ gridTemplateColumns: `4.25rem repeat(${teams.length}, minmax(8.6rem, 1fr))` }}
        >
          <div className="league-board-corner">Round</div>
          {teams.map((team) => {
            const teamPicks = state.picks.filter((pick) => pick.teamId === team.teamId);
            const needs = getRemainingNeeds(state, teamPicks, playersById);
            return (
              <div
                className={`league-board-team-header ${team.isUser ? "league-board-user-team" : ""}`}
                key={team.teamId}
              >
                <span>{team.isUser ? "YOU" : `Slot ${team.draftSlot}`}</span>
                <strong>{team.name}</strong>
                {needs.length === 0 ? (
                  <small>Starters filled</small>
                ) : (
                  <div className="team-needs" aria-label={`Needs ${formatNeeds(needs)}`}>
                    {needs.map((need) => (
                      <span
                        className={`team-need-pill ${
                          need.position === "FLEX"
                            ? "position-bg-flex"
                            : `position-bg-${need.position.toLowerCase()}`
                        }`}
                        key={need.position}
                      >
                        {need.position}
                        {need.count > 1 ? ` ${need.count}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {Array.from({ length: state.settings.rounds }, (_, index) => index + 1).flatMap((round) => [
            <div className="league-board-round" key={`round-${round}`}>
              <strong>{round}</strong>

[TRUNCATED]
```

### `apps/draft-room/src/components/NflverseHistoryCard.tsx`

```text
import { useRef, type ChangeEvent } from "react";
import { BUNDLED_NFLVERSE_HISTORY_LABEL } from "../bundled-nflverse-history.js";
import type {
  NflverseEnrichmentReport,
  NflverseHistoryRelease,
} from "../nflverse-history.js";

interface NflverseHistoryCardProps {
  history: NflverseHistoryRelease | null;
  report: NflverseEnrichmentReport | null;
  filename: string | null;
  onImport: (file: File) => Promise<void>;
  onClear: () => void;
}

export function NflverseHistoryCard({
  history,
  report,
  filename,
  onImport,
  onClear,
}: NflverseHistoryCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isBundled = filename === BUNDLED_NFLVERSE_HISTORY_LABEL;

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (file !== undefined) {
      await onImport(file);
    }
    event.target.value = "";
  }

  return (
    <section className="history-import-card field-wide" aria-labelledby="history-import-title">
      <div className="history-import-heading">
        <div>
          <p className="eyebrow">Historical context</p>
          <h3 id="history-import-title">NFLverse identity and prior-year stats</h3>
          <p>
            The app loads a validated NFLverse release automatically. Import a newer JSON release
            only when you want to replace the bundled identities and prior-season production.
          </p>
        </div>
        <div className="history-import-actions">
          <button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}>
            Import newer history
          </button>
          {history === null || isBundled ? null : (
            <button className="ghost-button" type="button" onClick={onClear}>
              Use bundled release
            </button>
          )}
          <input
            ref={inputRef}
            data-testid="nflverse-history-input"
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleImport(event)}
          />
        </div>
      </div>

      {history === null ? (
        <div className="history-empty-state">
          <strong>Loading bundled NFLverse history.</strong>
          <span>The validated local release will be ready before you start the draft.</span>
        </div>
      ) : report === null ? (
        <div className="history-ready-state" role="status">
          <strong>NFLverse {history.prior_season} history is ready.</strong>
          <span>{filename} · Import a UDK ZIP to match {history.players.length} identity records.</span>
        </div>
      ) : (
        <div className="history-preview" role="status">
          <div className="history-ready-row">
            <span className="history-ready-badge">NFLverse {report.priorSeason} matched</span>
            <span>{filename}</span>
          </div>
          <div className="history-metrics">
            <Metric label="UDK matched" value={report.matchedPlayerCount} />
            <Metric label="With prior stats" value={report.matchedWithHistoryCount} />
            <Metric label="Exact names" value={report.exactMatchCount} />
            <Metric label="Team resolved" value={report.teamDisambiguatedCount} />
            <Metric
              label="Needs review"
              value={report.unmatchedPlayers.length + report.ambiguousPlayers.length}
            />
          </div>

[TRUNCATED]
```

### `apps/draft-room/src/components/RecoverySetupScreen.tsx`

```text
import { useRef, type ChangeEvent, type FormEvent } from "react";
import type { DraftState } from "@fdi/shared-types";
import {
  SCORING_OPTIONS,
  TEAM_COUNT_OPTIONS,
  getStarterCapacity,
  type DraftSetup,
  type SupportedScoringPreset,
} from "../draft-factory.js";
import type {
  NflverseEnrichmentReport,
  NflverseHistoryRelease,
} from "../nflverse-history.js";
import {
  UDK_ADP_SOURCES,
  type UdkAdpSource,
  type UdkBuildReport,
} from "../udk-importer.js";
import { NflverseHistoryCard } from "./NflverseHistoryCard.js";
import { RosterConfigurator } from "./RosterConfigurator.js";
import { UdkImportCard } from "./UdkImportCard.js";

interface RecoverySetupScreenProps {
  setup: DraftSetup;
  recoveredDraft: DraftState | null;
  udkReport: UdkBuildReport | null;
  udkFilename: string | null;
  history: NflverseHistoryRelease | null;
  historyReport: NflverseEnrichmentReport | null;
  historyFilename: string | null;
  errorMessage: string | null;
  onSetupChange: (setup: DraftSetup) => void;
  onStartDraft: () => void;
  onResumeDraft: () => void;
  onDiscardRecovery: () => void;
  onImportDraft: (file: File) => Promise<boolean>;
  onImportUdk: (file: File) => Promise<void>;
  onClearUdk: () => void;
  onImportHistory: (file: File) => Promise<void>;
  onClearHistory: () => void;
}

const ADP_SOURCE_LABELS: Record<UdkAdpSource, string> = {
  average: "Average market",
  sleeper: "Sleeper",
  espn: "ESPN",
  yahoo: "Yahoo",
  underdog: "Underdog",
};

export function RecoverySetupScreen({
  setup,
  recoveredDraft,
  udkReport,
  udkFilename,
  history,
  historyReport,
  historyFilename,
  errorMessage,
  onSetupChange,
  onStartDraft,
  onResumeDraft,
  onDiscardRecovery,
  onImportDraft,
  onImportUdk,
  onClearUdk,
  onImportHistory,
  onClearHistory,
}: RecoverySetupScreenProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const draftSlots = Array.from({ length: setup.teamCount }, (_, index) => index + 1);
  const starterCount = getStarterCapacity(setup.rosterCounts);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onStartDraft();
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (file !== undefined) {
      await onImportDraft(file);
    }
    event.target.value = "";
  }

  const sourceLabel =
    udkReport === null
      ? "Demonstration release"
      : historyReport === null
        ? `UDK ${udkReport.season}`
        : `UDK ${udkReport.season} + NFLverse ${historyReport.priorSeason}`;

  return (
    <main className="setup-shell">
      <section className="setup-hero">
        <div className="brand-mark" aria-hidden="true">
          FDI
        </div>
        <p className="eyebrow">Local-first draft intelligence</p>
        <h1>Build your draft room.</h1>
        <p className="setup-lede">
          Configure the league and roster, load fresh UDK projections and NFLverse history, restore
          a saved draft, and run the entire snake draft from one laptop.
        </p>

        <div className="feature-strip" aria-label="Draft room capabilities">
          <span>UDK projections</span>
          <span>NFLverse history</span>
          <span>Custom rosters</span>
          <span>Automatic recovery</span>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="section-heading">
          <div>

[TRUNCATED]
```

### `apps/draft-room/src/components/SetupScreen.tsx`

```text
import type { FormEvent } from "react";
import {
  ROUND_OPTIONS,
  SCORING_OPTIONS,
  TEAM_COUNT_OPTIONS,
  type DraftSetup,
  type SupportedScoringPreset,
} from "../draft-factory.js";

interface SetupScreenProps {
  setup: DraftSetup;
  errorMessage: string | null;
  onSetupChange: (setup: DraftSetup) => void;
  onStartDraft: () => void;
}

export function SetupScreen({
  setup,
  errorMessage,
  onSetupChange,
  onStartDraft,
}: SetupScreenProps) {
  const draftSlots = Array.from({ length: setup.teamCount }, (_, index) => index + 1);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onStartDraft();
  }

  return (
    <main className="setup-shell">
      <section className="setup-hero">
        <div className="brand-mark" aria-hidden="true">
          FDI
        </div>
        <p className="eyebrow">Local-first draft intelligence</p>
        <h1>Build your draft room.</h1>
        <p className="setup-lede">
          Configure the league, load an offline player pool, and run the entire snake draft from
          one laptop. No platform login. No live sync dependency.
        </p>

        <div className="feature-strip" aria-label="Draft room capabilities">
          <span>Manual pick entry</span>
          <span>Live recommendations</span>
          <span>Every roster tracked</span>
          <span>Offline-safe engine</span>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">New draft</p>
            <h2 id="setup-title">League setup</h2>
          </div>
          <span className="alpha-badge">Interface alpha</span>
        </div>

        <form className="setup-form" onSubmit={handleSubmit}>
          <label className="field field-wide">
            <span>League name</span>
            <input
              value={setup.leagueName}
              onChange={(event) =>
                onSetupChange({
                  ...setup,
                  leagueName: event.target.value,
                })
              }
              placeholder="Friday Night League"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>Teams</span>
            <select
              value={setup.teamCount}
              onChange={(event) => {
                const teamCount = Number(event.target.value);
                onSetupChange({
                  ...setup,
                  teamCount,
                  userDraftSlot: Math.min(setup.userDraftSlot, teamCount),
                });
              }}
            >
              {TEAM_COUNT_OPTIONS.map((teamCount) => (
                <option key={teamCount} value={teamCount}>
                  {teamCount} teams
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Your draft slot</span>
            <select
              value={setup.userDraftSlot}
              onChange={(event) =>
                onSetupChange({
                  ...setup,
                  userDraftSlot: Number(event.target.value),
                })
              }
            >
              {draftSlots.map((slot) => (
                <option key={slot} value={slot}>
                  Pick {slot}
                </option>
              ))}
            </select>
          </label>

          <label

[TRUNCATED]
```

### `apps/draft-room/src/components/UdkImportCard.tsx`

```text
import { useRef, type ChangeEvent } from "react";
import { zipSync } from "fflate";
import type { UdkBuildReport } from "../udk-importer.js";

interface UdkImportCardProps {
  report: UdkBuildReport | null;
  filename: string | null;
  onImport: (file: File) => Promise<void>;
  onClear: () => void;
}

export function UdkImportCard({ report, filename, onImport, onClear }: UdkImportCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 1 && /\.zip$/i.test(files[0]!.name)) {
      await onImport(files[0]!);
    } else if (files.length > 0) {
      const archive: Record<string, Uint8Array> = {};
      for (const [index, file] of files.entries()) {
        const originalPath = (file.webkitRelativePath || file.name).replaceAll("\\", "/");
        const path = archive[originalPath] === undefined ? originalPath : `selected-${index + 1}/${file.name}`;
        archive[path] = new Uint8Array(await file.arrayBuffer());
      }
      const bundled = new File([zipSync(archive, { level: 0 })], `udk-${files.length}-files.zip`, {
        type: "application/zip",
      });
      await onImport(bundled);
    }
    event.target.value = "";
  }

  return (
    <section className="udk-import-card field-wide" aria-labelledby="udk-import-title">
      <div className="udk-import-heading">
        <div>
          <p className="eyebrow">Player data</p>
          <h3 id="udk-import-title">Fantasy Footballers UDK package</h3>
          <p>
            Choose the UDK ZIP, or select all exported CSV and PDF files together. The files are
            recognized locally, combined in memory when needed, and never sent to a server.
          </p>
        </div>
        <div className="udk-import-actions">
          <button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}>
            {report === null ? "Import UDK files" : "Replace UDK files"}
          </button>
          {report === null ? null : (
            <button className="ghost-button" type="button" onClick={onClear}>
              Use demo data
            </button>
          )}
          <input
            ref={inputRef}
            data-testid="udk-file-input"
            className="sr-only"
            type="file"
            accept="application/zip,.zip,text/csv,.csv,application/pdf,.pdf"
            multiple
            onChange={(event) => void handleImport(event)}
          />
        </div>
      </div>

      {report === null ? (
        <div className="udk-empty-state">
          <strong>Demo player data is active.</strong>
          <span>Import a ZIP or select the loose UDK exports to replace the fictional pool.</span>
        </div>
      ) : (
        <div className="udk-preview" role="status">
          <div className="udk-ready-row">
            <span className="udk-ready-badge">UDK {report.season} ready</span>
            <span>{filename}</span>
          </div>
          <div className="udk-metrics">
            <Metric label="Players" value={report.playerCount} />
            <Metric label="Projected" value={report.projectedPlayerCount} />
            <Metric label="All 3 analysts" value={report.allAnalystProjectionCount} />
            <Metric label="Selected ADP" value={report.selectedAdpPlayerCount} />
            <Metric label="Files recognized" value={report.recognizedFileCount} /

[TRUNCATED]
```

## Data Pipeline and Ingestion Files

### `packages/data/ingest/__init__.py`

```text
"""Data ingestion modules."""
```

### `packages/data/ingest/adp.py`

```text
from __future__ import annotations

import re
from dataclasses import dataclass
from io import StringIO
from pathlib import Path
from typing import Final
from urllib.request import Request, urlopen

import pandas as pd

from packages.data.constants import (
    DEFAULT_PILOT_YEARS,
    INTERMEDIATE_DATA_DIR,
    RAW_DATA_DIR,
)
from packages.data.io import write_parquet
from packages.data.player_ids import attach_canonical_ids_pandas
from packages.data.validation import assert_unique_key, require_columns

REQUIRED_OUTPUT_COLUMNS: Final[list[str]] = [
    "season",
    "player_name",
    "normalized_player_name",
    "entity_type",
    "canonical_player_id",
    "position",
    "adp_overall",
    "source_name",
]

UNIQUE_KEY_COLUMNS: Final[list[str]] = [
    "season",
    "canonical_player_id",
    "source_name",
]

SOURCE_NAME: Final[str] = "fantasypros"

DEFAULT_SOURCE_URLS: Final[dict[int, str]] = {
    2023: "https://www.fantasypros.com/nfl/adp/overall.php?year=2023",
    2024: "https://www.fantasypros.com/nfl/adp/overall.php?year=2024",
}

REQUEST_HEADERS: Final[dict[str, str]] = {
    "User-Agent": "fantasy-draft-intelligence/0.1 (+historical-adp-ingestion)"
}


@dataclass(frozen=True)
class AdpIngestConfig:
    years: list[int]
    raw_dir: Path
    intermediate_dir: Path
    source_urls: dict[int, str]


def default_config() -> AdpIngestConfig:
    return AdpIngestConfig(
        years=list(DEFAULT_PILOT_YEARS),
        raw_dir=Path(RAW_DATA_DIR),
        intermediate_dir=Path(INTERMEDIATE_DATA_DIR),
        source_urls=dict(DEFAULT_SOURCE_URLS),
    )


def _fetch_html(url: str) -> str:
    request = Request(url, headers=REQUEST_HEADERS)
    with urlopen(request) as response:  # noqa: S310
        return response.read().decode("utf-8")


def _extract_raw_table_from_html(html: str, season: int) -> pd.DataFrame:
    tables = pd.read_html(StringIO(html))
    if not tables:
        raise ValueError(f"No HTML tables found for season {season}")

    raw = tables[0].copy()
    raw.columns = [str(col).strip() for col in raw.columns]

    expected_columns = {"Player Team (Bye)", "POS", "AVG"}
    missing_columns = expected_columns.difference(raw.columns)
    if missing_columns:
        raise ValueError(
            f"Missing expected FantasyPros columns for season {season}: "
            f"{sorted(missing_columns)}"
        )

    raw["season"] = season
    raw["source_name"] = SOURCE_NAME
    return raw


def _split_player_name(value: object) -> str:
    text = str(value).strip()
    if not text:
        return text

    text = re.sub(r"\s+[A-Z]{2,3}\s+\(\d+\)$", "", text)
    return text.strip()


def _extract_position(value: object) -> str:
    text = str(value).strip().upper()
    if not text:
        return text

    for valid_position in ("QB", "RB", "WR", "TE", "DST", "K"):
        if text.startswith(valid_position):
            return valid_position

    return text


def normalize_historical_adp(raw_df: pd.DataFrame) -> pd.DataFrame:
    normalized = pd.DataFrame(
        {
            "season": pd.to_numeric(raw_df["season"], errors="coerce").astype("Int64"),
            "player_name": raw_df["Player Team (Bye)"].map(_split_player_name),
            "position": raw_df["POS"].map(_extract_position),
            "adp_overall": pd.to_numeric(raw_df["AVG"], errors="coerce"),
            "source_name": raw_df["source_name"].astype("string").str.strip(),
        }
    )

    normalized["player_name"] = normalized["player_name"].astyp

[TRUNCATED]
```

### `packages/data/ingest/coaching.py`

```text
from __future__ import annotations

import pandas as pd


def fetch_coaching_history() -> pd.DataFrame:
    """
    Placeholder coaching history extractor.

    MVP may begin with a manually maintained table.
    """
    return pd.DataFrame(
        [
            {
                "season": 2024,
                "team": "EX",
                "head_coach": "Example HC",
                "offensive_coordinator": "Example OC",
            }
        ]
    )
```

### `packages/data/ingest/nflverse.py`

```text
from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from pathlib import Path

import nflreadpy as nfl
import polars as pl

from packages.data.player_ids import attach_canonical_ids_polars

REQUIRED_OUTPUT_COLUMNS = [
    "season",
    "week",
    "player_name",
    "normalized_player_name",
    "entity_type",
    "canonical_player_id",
    "team",
    "position",
    "fantasy_points",
    "source_name",
]

TEAM_COLUMN_CANDIDATES = [
    "recent_team",
    "team",
    "team_abbr",
    "posteam",
]

PLAYER_NAME_CANDIDATES = [
    "player_display_name",
    "player_name",
]

FANTASY_POINTS_CANDIDATES = [
    "fantasy_points",
    "fantasy_points_ppr",
]

SOURCE_NAME = "nflverse"


@dataclass(frozen=True)
class NflverseIngestConfig:
    years: Sequence[int]
    raw_dir: Path
    intermediate_dir: Path


def _first_existing_column(df: pl.DataFrame, candidates: Sequence[str]) -> str:
    for column in candidates:
        if column in df.columns:
            return column
    raise ValueError(f"None of the candidate columns exist: {candidates}")


def _normalize_weekly_player_stats(df: pl.DataFrame) -> pl.DataFrame:
    player_name_col = _first_existing_column(df, PLAYER_NAME_CANDIDATES)
    team_col = _first_existing_column(df, TEAM_COLUMN_CANDIDATES)
    fantasy_points_col = _first_existing_column(df, FANTASY_POINTS_CANDIDATES)

    required_source_columns = {
        "season",
        "week",
        player_name_col,
        team_col,
        "position",
        fantasy_points_col,
    }
    missing = required_source_columns.difference(df.columns)
    if missing:
        raise ValueError(f"Missing required source columns: {sorted(missing)}")

    normalized = (
        df.select(
            [
                pl.col("season").cast(pl.Int64),
                pl.col("week").cast(pl.Int64),
                pl.col(player_name_col).alias("player_name").cast(pl.Utf8),
                pl.col(team_col).alias("team").cast(pl.Utf8),
                pl.col("position").cast(pl.Utf8),
                pl.col(fantasy_points_col).alias("fantasy_points").cast(pl.Float64),
            ]
        )
        .filter(
            pl.col("season").is_not_null()
            & pl.col("week").is_not_null()
            & pl.col("player_name").is_not_null()
        )
        .with_columns(
            [
                pl.col("player_name").str.strip_chars(),
                pl.col("team").str.strip_chars(),
                pl.col("position").str.strip_chars(),
                pl.lit(SOURCE_NAME).alias("source_name"),
            ]
        )
    )

    normalized = attach_canonical_ids_polars(normalized)
    normalized = normalized.select(REQUIRED_OUTPUT_COLUMNS)
    normalized = normalized.sort(["season", "week", "canonical_player_id"])

    missing_output = [col for col in REQUIRED_OUTPUT_COLUMNS if col not in normalized.columns]
    if missing_output:
        raise ValueError(f"Normalized output missing required columns: {missing_output}")

    return normalized


def fetch_weekly_player_data(years: Iterable[int]) -> pl.DataFrame:
    return load_weekly_player_stats(years)


def load_weekly_player_stats(years: Iterable[int]) -> pl.DataFrame:
    years = sorted({int(year) for year in years})
    if not years:
        raise ValueError("At least one year must be provided")

    raw = nfl.load_player_stats(seasons=years, summary_level="week")
    if not isinstance(raw, pl.DataFrame):
        raw = pl.from_

[TRUNCATED]
```

### `tests/data/ingest/test_adp.py`

```text
from __future__ import annotations

from pathlib import Path

import pandas as pd
import pytest

from packages.data.ingest.adp import (
    REQUIRED_OUTPUT_COLUMNS,
    UNIQUE_KEY_COLUMNS,
    AdpIngestConfig,
    ingest_historical_adp,
    normalize_historical_adp,
)
from packages.data.validation import ValidationError


@pytest.fixture
def fantasypros_html_2023() -> str:
    return """
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Team (Bye)</th>
              <th>POS</th>
              <th>AVG</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Christian McCaffrey SF (9)</td><td>RB1</td><td>1.2</td></tr>
            <tr><td>2</td><td>Tyreek Hill MIA (10)</td><td>WR1</td><td>4.8</td></tr>
          </tbody>
        </table>
      </body>
    </html>
    """


@pytest.fixture
def fantasypros_html_2024() -> str:
    return """
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Team (Bye)</th>
              <th>POS</th>
              <th>AVG</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>CeeDee Lamb DAL (7)</td><td>WR1</td><td>2.1</td></tr>
            <tr><td>2</td><td>Breece Hall NYJ (12)</td><td>RB2</td><td>5.0</td></tr>
          </tbody>
        </table>
      </body>
    </html>
    """


def test_normalize_historical_adp_requires_expected_columns() -> None:
    raw = pd.DataFrame(
        {
            "season": [2024],
            "Player Team (Bye)": ["CeeDee Lamb DAL (7)"],
            "POS": ["WR1"],
            "AVG": [2.1],
            "source_name": ["fantasypros"],
        }
    )

    normalized = normalize_historical_adp(raw)

    assert list(normalized.columns) == REQUIRED_OUTPUT_COLUMNS
    assert normalized.iloc[0]["player_name"] == "CeeDee Lamb"
    assert normalized.iloc[0]["position"] == "WR"


def test_normalize_historical_adp_rejects_duplicate_keys() -> None:
    raw = pd.DataFrame(
        {
            "season": [2024, 2024],
            "Player Team (Bye)": ["CeeDee Lamb DAL (7)", "CeeDee Lamb DAL (7)"],
            "POS": ["WR1", "WR1"],
            "AVG": [2.1, 2.1],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    with pytest.raises(ValidationError, match="duplicate rows"):
        normalize_historical_adp(raw)


def test_ingest_historical_adp_writes_raw_and_intermediate_outputs(
    monkeypatch,
    tmp_path: Path,
    fantasypros_html_2023: str,
    fantasypros_html_2024: str,
) -> None:
    from packages.data.ingest import adp as adp_module

    html_by_url = {
        "https://example.test/2023": fantasypros_html_2023,
        "https://example.test/2024": fantasypros_html_2024,
    }

    def fake_fetch_html(url: str) -> str:
        return html_by_url[url]

    monkeypatch.setattr(adp_module, "_fetch_html", fake_fetch_html)

    config = AdpIngestConfig(
        years=[2023, 2024],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
        source_urls={
            2023: "https://example.test/2023",
            2024: "https://example.test/2024",
        },
    )

    df = ingest_historical_adp(config)

    assert list(df.columns) == REQUIRED_OUTPUT_COLUMNS
    assert sorted(df["season"].unique().tolist()) == [2023, 2024]
    assert UNIQUE_KEY_COLUMNS == ["season", "canonical_player_id", "source_name"]

[TRUNCATED]
```

### `tests/data/ingest/test_nflverse.py`

```text
from __future__ import annotations

from pathlib import Path

import polars as pl
import pytest

from packages.data.ingest.nflverse import (
    REQUIRED_OUTPUT_COLUMNS,
    NflverseIngestConfig,
    ingest_nflverse_weekly_players,
)


@pytest.fixture
def sample_raw_df() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "season": [2023, 2023, 2024],
            "week": [1, 2, 1],
            "player_display_name": ["Christian McCaffrey", "Tyreek Hill", "Josh Allen"],
            "recent_team": ["SF", "MIA", "BUF"],
            "position": ["RB", "WR", "QB"],
            "fantasy_points": [24.6, 31.2, 27.8],
            "extra_col": [1, 2, 3],
        }
    )


def test_ingest_nflverse_weekly_players_writes_outputs(
    monkeypatch,
    tmp_path: Path,
    sample_raw_df: pl.DataFrame,
) -> None:

    from packages.data.ingest import nflverse as nflverse_module

    def fake_load_player_stats(seasons, summary_level):
        assert seasons == [2023, 2024]
        assert summary_level == "week"
        return sample_raw_df

    monkeypatch.setattr(nflverse_module.nfl, "load_player_stats", fake_load_player_stats)

    config = NflverseIngestConfig(
        years=[2023, 2024],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
    )

    df = ingest_nflverse_weekly_players(config)

    assert df.height == 3
    assert df.columns == REQUIRED_OUTPUT_COLUMNS
    assert sorted(df["season"].unique().to_list()) == [2023, 2024]

    raw_files = list((tmp_path / "raw").glob("*.parquet"))
    intermediate_files = list((tmp_path / "intermediate").glob("*.parquet"))

    assert len(raw_files) == 1
    assert len(intermediate_files) == 1


def test_ingest_requires_expected_columns(monkeypatch, tmp_path: Path) -> None:
    from packages.data.ingest import nflverse as nflverse_module

    bad_df = pl.DataFrame(
        {
            "season": [2023],
            "week": [1],
            "position": ["RB"],
        }
    )

    def fake_load_player_stats(seasons, summary_level):
        return bad_df

    monkeypatch.setattr(nflverse_module.nfl, "load_player_stats", fake_load_player_stats)

    config = NflverseIngestConfig(
        years=[2023],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
    )

    with pytest.raises(ValueError):
        ingest_nflverse_weekly_players(config)
```

### `apps/draft-room/src/components/UdkImportCard.tsx`

```text
import { useRef, type ChangeEvent } from "react";
import { zipSync } from "fflate";
import type { UdkBuildReport } from "../udk-importer.js";

interface UdkImportCardProps {
  report: UdkBuildReport | null;
  filename: string | null;
  onImport: (file: File) => Promise<void>;
  onClear: () => void;
}

export function UdkImportCard({ report, filename, onImport, onClear }: UdkImportCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 1 && /\.zip$/i.test(files[0]!.name)) {
      await onImport(files[0]!);
    } else if (files.length > 0) {
      const archive: Record<string, Uint8Array> = {};
      for (const [index, file] of files.entries()) {
        const originalPath = (file.webkitRelativePath || file.name).replaceAll("\\", "/");
        const path = archive[originalPath] === undefined ? originalPath : `selected-${index + 1}/${file.name}`;
        archive[path] = new Uint8Array(await file.arrayBuffer());
      }
      const bundled = new File([zipSync(archive, { level: 0 })], `udk-${files.length}-files.zip`, {
        type: "application/zip",
      });
      await onImport(bundled);
    }
    event.target.value = "";
  }

  return (
    <section className="udk-import-card field-wide" aria-labelledby="udk-import-title">
      <div className="udk-import-heading">
        <div>
          <p className="eyebrow">Player data</p>
          <h3 id="udk-import-title">Fantasy Footballers UDK package</h3>
          <p>
            Choose the UDK ZIP, or select all exported CSV and PDF files together. The files are
            recognized locally, combined in memory when needed, and never sent to a server.
          </p>
        </div>
        <div className="udk-import-actions">
          <button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}>
            {report === null ? "Import UDK files" : "Replace UDK files"}
          </button>
          {report === null ? null : (
            <button className="ghost-button" type="button" onClick={onClear}>
              Use demo data
            </button>
          )}
          <input
            ref={inputRef}
            data-testid="udk-file-input"
            className="sr-only"
            type="file"
            accept="application/zip,.zip,text/csv,.csv,application/pdf,.pdf"
            multiple
            onChange={(event) => void handleImport(event)}
          />
        </div>
      </div>

      {report === null ? (
        <div className="udk-empty-state">
          <strong>Demo player data is active.</strong>
          <span>Import a ZIP or select the loose UDK exports to replace the fictional pool.</span>
        </div>
      ) : (
        <div className="udk-preview" role="status">
          <div className="udk-ready-row">
            <span className="udk-ready-badge">UDK {report.season} ready</span>
            <span>{filename}</span>
          </div>
          <div className="udk-metrics">
            <Metric label="Players" value={report.playerCount} />
            <Metric label="Projected" value={report.projectedPlayerCount} />
            <Metric label="All 3 analysts" value={report.allAnalystProjectionCount} />
            <Metric label="Selected ADP" value={report.selectedAdpPlayerCount} />
            <Metric label="Files recognized" value={report.recognizedFileCount} /

[TRUNCATED]
```

### `apps/draft-room/src/demo-data.ts`

```text
import type {
  PlayerDataRecord,
  PlayerDataRelease,
  PlayerPosition,
} from "@fdi/shared-types";

interface GeneratedPlayer extends PlayerDataRecord {
  marketScore: number;
}

interface PositionProfile {
  position: PlayerPosition;
  count: number;
  projectionStart: number;
  projectionStep: number;
  marketStart: number;
  marketStep: number;
  tierSize: number;
}

const FIRST_NAMES = [
  "Avery",
  "Blake",
  "Cameron",
  "Drew",
  "Eli",
  "Finn",
  "Grant",
  "Hayden",
  "Isaiah",
  "Jordan",
  "Kai",
  "Logan",
  "Micah",
  "Nolan",
  "Owen",
  "Parker",
  "Quinn",
  "Riley",
  "Sawyer",
  "Theo",
  "Victor",
  "Wesley",
  "Xavier",
  "Zane",
] as const;

const LAST_NAMES = [
  "Adams",
  "Bennett",
  "Carter",
  "Davis",
  "Ellis",
  "Foster",
  "Gibson",
  "Hayes",
  "Irving",
  "Jackson",
  "King",
  "Lewis",
  "Mitchell",
  "Nelson",
  "Owens",
  "Porter",
  "Reed",
  "Simmons",
  "Turner",
  "Vaughn",
  "Walker",
  "Young",
] as const;

const NFL_TEAMS = [
  "ARI",
  "ATL",
  "BAL",
  "BUF",
  "CAR",
  "CHI",
  "CIN",
  "CLE",
  "DAL",
  "DEN",
  "DET",
  "GB",
  "HOU",
  "IND",
  "JAX",
  "KC",
  "LAC",
  "LAR",
  "LV",
  "MIA",
  "MIN",
  "NE",
  "NO",
  "NYG",
  "NYJ",
  "PHI",
  "PIT",
  "SEA",
  "SF",
  "TB",
  "TEN",
  "WAS",
] as const;

const POSITION_PROFILES: PositionProfile[] = [
  {
    position: "QB",
    count: 48,
    projectionStart: 310,
    projectionStep: 3.1,
    marketStart: 84,
    marketStep: 1.1,
    tierSize: 6,
  },
  {
    position: "RB",
    count: 96,
    projectionStart: 265,
    projectionStep: 1.65,
    marketStart: 100,
    marketStep: 1.15,
    tierSize: 8,
  },
  {
    position: "WR",
    count: 110,
    projectionStart: 258,
    projectionStep: 1.35,
    marketStart: 98,
    marketStep: 1,
    tierSize: 10,
  },
  {
    position: "TE",
    count: 48,
    projectionStart: 215,
    projectionStep: 2.05,
    marketStart: 88,
    marketStep: 1.4,
    tierSize: 6,
  },
  {
    position: "K",
    count: 14,
    projectionStart: 150,
    projectionStep: 2,
    marketStart: 25,
    marketStep: 1.3,
    tierSize: 7,
  },
  {
    position: "DST",
    count: 14,
    projectionStart: 160,
    projectionStep: 2.2,
    marketStart: 28,
    marketStep: 1.35,
    tierSize: 7,
  },
];

export function createDemoPlayerDataRelease(requiredPlayerCount = 252): PlayerDataRelease {
  const generated: GeneratedPlayer[] = [];

  POSITION_PROFILES.forEach((profile, profileIndex) => {
    for (let positionIndex = 0; positionIndex < profile.count; positionIndex += 1) {
      const globalIndex = generated.length;
      const team = NFL_TEAMS[(globalIndex + profileIndex * 3) % NFL_TEAMS.length]!;
      const displayName = buildDisplayName(profile.position, positionIndex, globalIndex);
      const marketScore =
        profile.marketStart - profile.marketStep * positionIndex + ((positionIndex % 5) - 2) * 0.18;

      generated.push({
        canonical_player_id: `demo-${profile.position.toLowerCase()}-${positionIndex + 1}`,
        display_name: displayName,
        position: profile.position,
        nfl_team: team,
        bye_week: 5 + ((globalIndex + profileIndex) % 10),
        overall_rank: null,
        position_rank: positionIndex + 1,
        adp: null,
        projected_points: round(
          Math.max(65, profile.projectionStart - profile.projectionStep * positionIndex),
        ),
        tier: Math.floor(positionIndex / profile.tierSize) + 1,
        risk_score: 18 + ((globalIndex * 17 + profileIndex *

[TRUNCATED]
```

### `apps/draft-room/src/udk-importer.ts`

```text
import { strFromU8, unzipSync } from "fflate";
import type {
  PlayerDataRecord,
  PlayerDataRelease,
  PlayerPosition,
  ScoringSettings,
} from "@fdi/shared-types";

export const UDK_ADP_SOURCES = ["average", "sleeper", "espn", "yahoo", "underdog"] as const;
export type UdkAdpSource = (typeof UDK_ADP_SOURCES)[number];
export type UdkAnalyst = "Andy" | "Jason" | "Mike";

type ProjectionStat =
  | "passingYards"
  | "passingTouchdowns"
  | "interceptions"
  | "rushingAttempts"
  | "rushingYards"
  | "rushingTouchdowns"
  | "receptions"
  | "receivingYards"
  | "receivingTouchdowns"
  | "fumbles";

type ProjectionStats = Partial<Record<ProjectionStat, number>>;

interface UdkRankingRow {
  name: string;
  position: PlayerPosition;
  team: string | null;
  byeWeek: number | null;
  positionRank: number;
  projectedPoints: number | null;
  risk: number | null;
  upside: number | null;
  tier: number | null;
}

interface UdkProjectionRow {
  analyst: UdkAnalyst;
  name: string;
  position: PlayerPosition;
  stats: ProjectionStats;
}

interface UdkAdpRow {
  name: string;
  position: PlayerPosition;
  values: Record<UdkAdpSource, string | null>;
}

export interface UdkRecognizedFile {
  path: string;
  kind: "rankings" | "projections" | "adp" | "career" | "value-scout";
  rowCount: number;
}

export interface UdkImportPackage {
  season: number;
  recognizedFiles: UdkRecognizedFile[];
  ignoredFiles: string[];
  rankings: UdkRankingRow[];
  projections: UdkProjectionRow[];
  adpRows: UdkAdpRow[];
  warnings: string[];
}

export interface UdkBuildOptions {
  scoring: ScoringSettings;
  adpTeamCount: number;
  adpSource: UdkAdpSource;
  generatedAt?: string;
}

export interface UdkBuildReport {
  season: number;
  recognizedFileCount: number;
  ignoredFileCount: number;
  playerCount: number;
  projectedPlayerCount: number;
  allAnalystProjectionCount: number;
  adpPlayerCount: number;
  selectedAdpPlayerCount: number;
  unmatchedProjectionRows: string[];
  unmatchedAdpRows: string[];
  warnings: string[];
}

export interface UdkBuildResult {
  release: PlayerDataRelease;
  report: UdkBuildReport;
}

export function parseUdkZip(
  bytes: Uint8Array,
  fallbackSeason = new Date().getFullYear(),
): UdkImportPackage {
  let archive: Record<string, Uint8Array>;
  try {
    archive = unzipSync(bytes);
  } catch (error) {
    throw new TypeError(`The selected file is not a readable ZIP archive: ${messageOf(error)}`);
  }

  const recognizedFiles: UdkRecognizedFile[] = [];
  const ignoredFiles: string[] = [];
  const rankings: UdkRankingRow[] = [];
  const projections: UdkProjectionRow[] = [];
  const adpRows: UdkAdpRow[] = [];
  const warnings: string[] = [];
  const careerYears: number[] = [];

  for (const [rawPath, bytesForFile] of Object.entries(archive)) {
    const path = rawPath.replaceAll("\\", "/");
    if (path.endsWith("/") || bytesForFile.length === 0) continue;
    const filename = path.split("/").at(-1) ?? path;

    if (/\.pdf$/i.test(filename) || !/\.csv$/i.test(filename)) {
      ignoredFiles.push(path);
      continue;
    }

    const rows = parseCsv(strFromU8(bytesForFile));
    if (rows.length === 0) {
      warnings.push(`${path} was empty and was ignored.`);
      continue;
    }

    const rankingMatch = filename.match(/UDK Position Rankings - (QB|RB|WR|TE|K|DST)\.csv$/i);
    if (rankingMatch !== null) {
      const position = normalizePosition(rankingMatch[1]);
      if (position === null) {
        warnings.push(`${path} u

[TRUNCATED]
```

### `apps/draft-room/tests/udk-importer.test.ts`

```text
import { strToU8, zipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { createScoringSettings } from "../src/draft-factory.js";
import {
  buildUdkPlayerDataRelease,
  parseCsv,
  parseUdkZip,
} from "../src/udk-importer.js";

function createFixtureZip(): Uint8Array {
  const files: Record<string, Uint8Array> = {
    "Position Rankings/UDK Position Rankings - QB.csv": strToU8(
      [
        "Name,Position,Team,Bye Week,Rank,Points,Risk,Upside,ADP,Tier,Outlook,Dynasty,Markers",
        'Josh Allen,QB,BUF,7,1,419.7,2.6,9.7,2.12,1,"Line one, with comma\nand line two",Dynasty,Markers',
      ].join("\n"),
    ),
    "Position Rankings/UDK Position Rankings - RB.csv": strToU8(
      [
        "Name,Position,Team,Bye Week,Rank,Points,Risk,Upside,ADP,Tier,Outlook,Dynasty,Markers",
        "Bijan Robinson,RB,ATL,11,1,356.4,1.3,10,1.02,1,Outlook,Dynasty,Markers",
      ].join("\n"),
    ),
    "Position Rankings/UDK Position Rankings - K.csv": strToU8(
      "Name,Position,Team,Bye Week,Rank,Andy,Jason,Mike,Markers\nBrandon Aubrey,K,DAL,14,1,1,1,1,Markers",
    ),
    "Position Rankings/UDK Position Rankings - DST.csv": strToU8(
      "Name,Position,Team,Bye Week,Rank,Andy,Jason,Mike,Markers\nHouston Texans,D,HOU,8,1,1,2,1,Markers",
    ),
    "Projections/Andy/UDK - Andys Projections - QB.csv": strToU8(
      [
        "Name,Team,Bye Week,Rank,PPG,YDS,TDS,YDS,TDS,INT,FUM",
        "Josh Allen,BUF,7,1,25.2,4000,30,500,8,10,3",
        "Ghost Quarterback,FA,1,99,1,100,1,0,0,0,0",
      ].join("\n"),
    ),
    "Projections/Jason/UDK - Jasons Projections - QB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,YDS,TDS,YDS,TDS,INT,FUM\nJosh Allen,BUF,7,1,25.8,4100,32,600,7,9,4",
    ),
    "Projections/Mike/UDK - Mikes Projections - QB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,YDS,TDS,YDS,TDS,INT,FUM\nJosh Allen,BUF,7,1,23,3900,28,550,9,12,5",
    ),
    "Projections/Andy/UDK - Andys Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nBijan Robinson,ATL,11,1,20,250,1200,10,60,500,4,2",
    ),
    "Projections/Jason/UDK - Jasons Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nBijan Robinson,ATL,11,1,21,275,1300,12,70,550,5,1",
    ),
    "Projections/Mike/UDK - Mikes Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nBijan Robinson,ATL,11,1,19,230,1100,8,50,450,3,3",
    ),
    "ADP Analysis/UDK - ADP Comparison - Fantasy Footballers Podcast.csv": strToU8(
      [
        "Rank,Name,Team,Pos,Pos,Avg,Sleeper,ESPN,Yahoo,Underdog",
        "[object Object],Bijan Robinson,ATL,RB,RB,1.03,1.05,1.02,1.04,1.01",
        "[object Object],Josh Allen,BUF,QB,QB,2.01,2.03,,2.02,2.04",
      ].join("\n"),
    ),
    "Career Snapshot Tool/UDK - Consistency Charts - QB.csv": strToU8(
      "Player,Rank,Total Points,Team,2025,2024,2023\nJosh Allen,1,1000,BUF,1,4,1",
    ),
    "Value Scout Tool/UDK - Value Scout - Fantasy Footballers Podcast.csv": strToU8(
      "Name,Team,Pos,Pos,TrueValue,Diff,Sleeper ADP,Markers\nBijan Robinson,ATL,RB,RB,1.03,-2Pick,1.05,Markers",
    ),
    "Cheat Sheet/Cheat Sheet.pdf": new Uint8Array([37, 80, 68, 70]),
  };
  return zipSync(files);
}

describe("UDK ZIP importer", () => {
  it("recognizes the package and builds a scored player release", () => {
    const parsed = parseUdkZip(createFixtureZip(), 2024);
    const result = buildUdkPlayerDataRelease(parsed, {

[TRUNCATED]
```

### `packages/data/__init__.py`

```text
"""Data package for ingestion, normalization, and validation."""
```

### `packages/data/constants.py`

```text
"""Project-wide constants."""

RAW_DATA_DIR = "data/raw"
INTERMEDIATE_DATA_DIR = "data/intermediate"
PROCESSED_DATA_DIR = "data/processed"

DEFAULT_PILOT_YEARS = [2023, 2024]
VALID_POSITIONS = {"QB", "RB", "WR", "TE", "K", "DST"}
```

## Testing and Quality Signals

### `tests/test_nflverse_history.py`

```text
from __future__ import annotations

import json
from pathlib import Path

import polars as pl
import pytest

from packages.data.nflverse_history import (
    build_nflverse_history_release,
    write_nflverse_history_release,
)


def _players() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "gsis_id": ["00-0039001", "00-0042002"],
            "display_name": ["Amon-Ra St. Brown", "Rookie Runner Jr."],
            "position": ["WR", "RB"],
        }
    )


def _rosters() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "season": [2026, 2026],
            "gsis_id": ["00-0039001", "00-0042002"],
            "full_name": ["Amon-Ra St. Brown", "Rookie Runner"],
            "position": ["WR", "RB"],
            "team": ["DET", "NYG"],
            "status": ["ACT", "ACT"],
        }
    )


def _stats() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "season": [2025, 2025, 2024],
            "season_type": ["REG", "REG", "REG"],
            "week": [1, 2, 1],
            "player_id": ["00-0039001", "00-0039001", "00-0039001"],
            "fantasy_points": [10.0, 20.0, 99.0],
            "fantasy_points_ppr": [15.0, 24.0, 109.0],
            "attempts": [0.0, 0.0, 0.0],
            "passing_yards": [0.0, 0.0, 0.0],
            "passing_tds": [0.0, 0.0, 0.0],
            "interceptions": [0.0, 0.0, 0.0],
            "carries": [1.0, 2.0, 0.0],
            "rushing_yards": [6.0, 12.0, 0.0],
            "rushing_tds": [0.0, 0.0, 0.0],
            "targets": [8.0, 7.0, 20.0],
            "receptions": [5.0, 4.0, 10.0],
            "receiving_yards": [70.0, 110.0, 200.0],
            "receiving_tds": [0.0, 1.0, 2.0],
            "passing_fumbles_lost": [0.0, 0.0, 0.0],
            "rushing_fumbles_lost": [0.0, 1.0, 0.0],
            "receiving_fumbles_lost": [0.0, 0.0, 0.0],
        }
    )


def test_builds_stable_identity_and_prior_season_summaries() -> None:
    release = build_nflverse_history_release(
        players=_players(),
        rosters=_rosters(),
        stats=_stats(),
        prior_season=2025,
        roster_season=2026,
        generated_at="2026-07-17T12:00:00+00:00",
    )

    assert release["schema_version"] == "1.0"
    assert release["source"] == "nflverse"
    assert release["prior_season"] == 2025
    assert release["roster_season"] == 2026
    assert len(release["players"]) == 2

    veteran = next(
        player for player in release["players"] if player["nflverse_player_id"] == "00-003900

[TRUNCATED]
```

### `tests/test_nflverse_release_filter.py`

```text
from __future__ import annotations

import polars as pl
import pytest

from packages.data.nflverse_release_filter import (
    filter_to_draft_relevant_players,
    repair_current_roster_identities,
)


def test_keeps_current_roster_and_prior_season_contributors() -> None:
    release = {
        "schema_version": "1.0",
        "players": [
            {
                "nflverse_player_id": "current-rookie",
                "current_team": "NYG",
                "prior_season_stats": None,
            },
            {
                "nflverse_player_id": "veteran-free-agent",
                "current_team": None,
                "prior_season_stats": {"games": 12},
            },
            {
                "nflverse_player_id": "college-only",
                "current_team": None,
                "prior_season_stats": None,
            },
        ],
    }

    filtered = filter_to_draft_relevant_players(release)

    assert [player["nflverse_player_id"] for player in filtered["players"]] == [
        "current-rookie",
        "veteran-free-agent",
    ]
    assert len(release["players"]) == 3


def test_deduplicates_stable_ids_without_name_guessing() -> None:
    player = {
        "nflverse_player_id": "00-001",
        "current_team": "DET",
        "prior_season_stats": None,
    }
    filtered = filter_to_draft_relevant_players({"players": [player, dict(player)]})

    assert filtered["players"] == [player]


def test_repairs_missing_roster_ids_positions_and_aliases() -> None:
    release = {
        "schema_version": "1.0",
        "prior_season": 2025,
        "roster_season": 2026,
        "players": [
            _release_player("BEC122142", "Carson Beck", "QB"),
            _release_player("00-0035662", "Marquise Brown", "WR", team="PHI"),
        ],
    }
    players = pl.DataFrame(
        {
            "gsis_id": ["BEC122142", "00-0040718", "00-0035662"],
            "display_name": ["Carson Beck", "Travis Hunter", "Marquise Brown"],
            "position": ["QB", "CB", "WR"],
        }
    )
    rosters = pl.DataFrame(
        {
            "season": [2026, 2026, 2026],
            "gsis_id": [None, "00-0040718", "00-0035662"],
            "full_name": ["Carson Beck", "Travis Hunter", "Marquise Brown"],
            "position": ["QB", "WR", "WR"],
            "team": ["ARI", "JAX", "PHI"],
            "status": ["RES", "ACT", "ACT"],
        }
    )
    stats = pl.DataFrame(
        {
            "season": [2025],
            "season_type

[TRUNCATED]
```

### `tests/test_smoke.py`

```text
import pandas as pd
import polars as pl

from packages.data.ingest import adp as adp_module
from packages.data.ingest import nflverse as nflverse_module


def test_fetch_historical_adp_returns_dataframe(monkeypatch) -> None:
    expected = pd.DataFrame({"season": [2024], "player_name": ["Test Player"]})

    monkeypatch.setattr(
        adp_module,
        "ingest_historical_adp",
        lambda config: expected,
    )

    result = adp_module.fetch_historical_adp()

    assert isinstance(result, pd.DataFrame)
    assert result.equals(expected)


def test_fetch_weekly_player_data_returns_dataframe(monkeypatch) -> None:
    expected = pl.DataFrame({"season": [2024], "week": [1]})

    monkeypatch.setattr(
        nflverse_module,
        "load_weekly_player_stats",
        lambda years: expected,
    )

    result = nflverse_module.fetch_weekly_player_data([2024])

    assert isinstance(result, pl.DataFrame)
    assert result.equals(expected)
```

### `tests/test_validation.py`

```text
import pandas as pd
import pytest

from packages.data.validation import ValidationError, assert_unique_key, require_columns


def test_require_columns_passes_when_columns_exist() -> None:
    df = pd.DataFrame({"a": [1], "b": [2]})
    require_columns(df, ["a", "b"])


def test_require_columns_raises_when_missing_columns() -> None:
    df = pd.DataFrame({"a": [1]})
    with pytest.raises(ValidationError):
        require_columns(df, ["a", "b"])


def test_assert_unique_key_raises_on_duplicates() -> None:
    df = pd.DataFrame({"season": [2024, 2024], "player": ["x", "x"]})
    with pytest.raises(ValidationError):
        assert_unique_key(df, ["season", "player"])
```

### `apps/draft-room/tests/app.test.tsx`

```text
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makePick } from "@fdi/draft-engine";
import { recommendPlayers } from "@fdi/recommendation-engine";
import { App } from "../src/App.js";
import {
  DEFAULT_DRAFT_SETUP,
  DEFAULT_ROSTER_COUNTS,
  createDraftFromSetup,
  createRosterSlots,
  getRosterCapacity,
  setRosterCount,
} from "../src/draft-factory.js";

describe("draft room application shell", () => {
  it("renders league, UDK, NFLverse, recovery, and custom roster controls", () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain("Build your draft room.");
    expect(html).toContain("Start new draft");
    expect(html).toContain("Import backup");
    expect(html).toContain("Import UDK files");
    expect(html).toContain("Import newer history");
    expect(html).toContain("ADP market");
    expect(html).toContain("Roster configuration");
    expect(html).toContain("Superflex");
    expect(html).toContain("Demonstration release");
  });

  it("creates a complete engine-backed snake draft from setup", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "ui-test-draft");
    const userTeam = state.teams.find((team) => team.isUser);

    expect(state.order).toHaveLength(DEFAULT_DRAFT_SETUP.teamCount * DEFAULT_DRAFT_SETUP.rounds);
    expect(state.playerPoolIds.length).toBeGreaterThan(state.order.length);
    expect(userTeam?.draftSlot).toBe(DEFAULT_DRAFT_SETUP.userDraftSlot);
    expect(state.status).toBe("not_started");
  });

  it("derives draft rounds from custom roster capacity", () => {
    let setup = setRosterCount(DEFAULT_DRAFT_SETUP, "SUPERFLEX", 1);
    setup = setRosterCount(setup, "K", 0);
    setup = setRosterCount(setup, "BENCH", 8);

    const state = createDraftFromSetup(setup, "custom-roster-test");

    expect(setup.rounds).toBe(17);
    expect(state.settings.rounds).toBe(17);
    expect(state.order).toHaveLength(204);
    expect(state.settings.rosterSlots.find((rule) => rule.slot === "SUPERFLEX")?.count).toBe(1);
    expect(state.settings.rosterSlots.find((rule) => rule.slot === "K")?.count).toBe(0);
    expect(state.settings.rosterSlots.find((rule) => rule.slot === "BENCH")?.count).toBe(8);
  });

  it("maps every configurable roster slot to engine eligibility", () => {
    const rosterCounts = {
      ...DEFAULT_ROSTER_COUNTS,
      SUPERFLEX: 1,
      K: 0,
      DST: 0,
    };
    const rosterSlots = createRosterSlots(rosterC

[TRUNCATED]
```

### `apps/draft-room/tests/bundled-nflverse-history.test.ts`

```text
import { strToU8, zipSync } from "fflate";
import { describe, expect, it, vi } from "vitest";
import { loadBundledNflverseHistory } from "../src/bundled-nflverse-history.js";

const RELEASE = {
  schema_version: "1.0",
  source: "nflverse",
  prior_season: 2025,
  roster_season: 2026,
  generated_at: "2026-07-18T00:23:54.397Z",
  players: [],
};

describe("bundled NFLverse history", () => {
  it("downloads, decompresses, and validates the bundled release", async () => {
    const archive = zipSync({
      "nflverse_history_2025_2026.json": strToU8(JSON.stringify(RELEASE)),
    });
    const fetcher = vi.fn(async () => new Response(archive, { status: 200 }));

    const result = await loadBundledNflverseHistory(fetcher, "https://example.test/history.zip");

    expect(fetcher).toHaveBeenCalledWith("https://example.test/history.zip");
    expect(result.prior_season).toBe(2025);
    expect(result.roster_season).toBe(2026);
  });

  it("rejects archives without exactly one JSON release", async () => {
    const archive = zipSync({ "readme.txt": strToU8("missing") });
    const fetcher = vi.fn(async () => new Response(archive, { status: 200 }));

    await expect(loadBundledNflverseHistory(fetcher, "https://example.test/history.zip")).rejects.toThrow(
      "exactly one JSON release",
    );
  });
});
```

### `apps/draft-room/tests/league-draft-board.test.tsx`

```text
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makePick } from "@fdi/draft-engine";
import { LeagueDraftBoard } from "../src/components/LeagueDraftBoard.js";
import { DEFAULT_DRAFT_SETUP, createDraftFromSetup } from "../src/draft-factory.js";

describe("league draft board", () => {
  it("renders all team columns, colored roster needs, and detailed pick metadata", () => {
    const initial = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "board-test");
    const draftedPlayerId = initial.availablePlayerIds[0]!;
    const draftedPlayer = initial.playerDataRelease.players.find(
      (player) => player.canonical_player_id === draftedPlayerId,
    )!;
    const state = makePick(initial, draftedPlayerId);
    const playersById = new Map(
      state.playerDataRelease.players.map((player) => [player.canonical_player_id, player]),
    );

    const html = renderToStaticMarkup(
      <LeagueDraftBoard state={state} playersById={playersById} />,
    );

    expect(html).toContain("League-wide grid");
    expect(html).toContain("Hover a pick");
    expect(html).toContain('class="team-needs"');
    expect(html).toContain("position-bg-qb");
    expect(html).toContain("position-bg-rb");
    expect(html).toContain("position-bg-wr");
    expect(html).toContain("position-bg-te");
    expect(html).toContain("position-bg-k");
    expect(html).toContain("position-bg-dst");
    expect(html).toContain(draftedPlayer.display_name);
    expect(html).toContain(`position-bg-${draftedPlayer.position.toLowerCase()}`);
    expect(html).toContain("Overall pick:");
    expect(html).toContain("Projected points:");
    expect(html.match(/league-board-team-header/g)).toHaveLength(DEFAULT_DRAFT_SETUP.teamCount);
    expect(html).toContain("On clock");
  });
});
```

### `apps/draft-room/tests/nflverse-history.test.ts`

```text
import { describe, expect, it } from "vitest";
import type { PlayerDataRecord, PlayerDataRelease, PlayerSeasonHistory } from "@fdi/shared-types";
import {
  enrichPlayerDataReleaseWithNflverse,
  parseNflverseHistoryJson,
  type NflverseHistoryPlayer,
  type NflverseHistoryRelease,
} from "../src/nflverse-history.js";

const HISTORY: PlayerSeasonHistory = {
  season: 2025,
  games: 17,
  fantasy_points_standard: 220,
  fantasy_points_half_ppr: 270,
  fantasy_points_ppr: 320,
  points_per_game_standard: 12.941,
  points_per_game_half_ppr: 15.882,
  points_per_game_ppr: 18.824,
  weekly_points_stddev_half_ppr: 5.2,
  attempts: 0,
  passing_yards: 0,
  passing_tds: 0,
  interceptions: 0,
  carries: 15,
  rushing_yards: 90,
  rushing_tds: 1,
  targets: 140,
  receptions: 100,
  receiving_yards: 1250,
  receiving_tds: 8,
  fumbles_lost: 1,
};

function udkPlayer(
  id: string,
  name: string,
  position: PlayerDataRecord["position"],
  team: string | null,
): PlayerDataRecord {
  return {
    canonical_player_id: id,
    display_name: name,
    position,
    nfl_team: team,
    bye_week: 8,
    overall_rank: 1,
    position_rank: 1,
    adp: 2,
    projected_points: 300,
    tier: 1,
    risk_score: 20,
    upside_score: 80,
    availability_status: "active",
  };
}

function historyPlayer(
  id: string,
  name: string,
  position: Exclude<PlayerDataRecord["position"], "DST">,
  team: string | null,
  aliases: string[] = [],
  stats: PlayerSeasonHistory | null = HISTORY,
): NflverseHistoryPlayer {
  return {
    nflverse_player_id: id,
    canonical_player_id: `nflverse:${id}`,
    display_name: name,
    normalized_name: name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
    aliases: [name, ...aliases],
    position,
    current_team: team,
    roster_status: "ACT",
    prior_season_stats: stats,
  };
}

function release(players: PlayerDataRecord[]): PlayerDataRelease {
  return {
    schema_version: "1.0",
    season: 2026,
    release_id: "udk-test",
    generated_at: "2026-07-17T12:00:00.000Z",
    sources: ["UDK"],
    players,
  };
}

function historyRelease(players: NflverseHistoryPlayer[]): NflverseHistoryRelease {
  return {
    schema_version: "1.0",
    source: "nflverse",
    prior_season: 2025,
    roster_season: 2026,
    generated_at: "2026-07-17T12:00:00.000Z",
    players,
  };
}

describe("NFLverse history enrichment", () => {
  it("replaces temporary UDK IDs and attaches prior-season history", () => {
    const source = release([
      udkPlayer(

[TRUNCATED]
```

### `apps/draft-room/tests/recovery.test.ts`

```text
import { describe, expect, it } from "vitest";
import { makePick, serializeDraftState } from "@fdi/draft-engine";
import { DEFAULT_DRAFT_SETUP, createDraftFromSetup } from "../src/draft-factory.js";
import {
  DRAFT_RECOVERY_STORAGE_KEY,
  clearDraftRecovery,
  importDraftFile,
  loadDraftRecovery,
  saveDraftRecovery,
} from "../src/draft-storage.js";

interface MemoryStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  has: (key: string) => boolean;
}

describe("draft recovery storage", () => {
  it("round-trips an autosaved draft", () => {
    const storage = createMemoryStorage();
    const initial = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "recovery-test");
    const state = makePick(initial, initial.availablePlayerIds[0]!);

    saveDraftRecovery(state, storage);
    const restored = loadDraftRecovery(storage);

    expect(restored?.draftId).toBe("recovery-test");
    expect(restored?.picks).toHaveLength(1);
    expect(restored?.picks[0]?.playerId).toBe(state.picks[0]?.playerId);
    expect(restored?.revision).toBe(state.revision);
  });

  it("removes a corrupted autosave instead of loading it", () => {
    const storage = createMemoryStorage();
    storage.setItem(DRAFT_RECOVERY_STORAGE_KEY, "not json");

    expect(loadDraftRecovery(storage)).toBeNull();
    expect(storage.has(DRAFT_RECOVERY_STORAGE_KEY)).toBe(false);
  });

  it("clears the saved draft on request", () => {
    const storage = createMemoryStorage();
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "clear-test");
    saveDraftRecovery(state, storage);

    clearDraftRecovery(storage);

    expect(storage.has(DRAFT_RECOVERY_STORAGE_KEY)).toBe(false);
  });

  it("imports a versioned JSON backup through the file adapter", async () => {
    const initial = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "import-test");
    const state = makePick(initial, initial.availablePlayerIds[0]!);
    const file = {
      text: async () => serializeDraftState(state, "2026-07-17T16:00:00.000Z"),
    } satisfies Pick<File, "text">;

    const restored = await importDraftFile(file);

    expect(restored.draftId).toBe("import-test");
    expect(restored.picks).toHaveLength(1);
    expect(restored.nextOverallPick).toBe(2);
  });
});

function createMemoryStorage(): MemoryStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) =

[TRUNCATED]
```

### `apps/draft-room/tests/udk-importer.test.ts`

```text
import { strToU8, zipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { createScoringSettings } from "../src/draft-factory.js";
import {
  buildUdkPlayerDataRelease,
  parseCsv,
  parseUdkZip,
} from "../src/udk-importer.js";

function createFixtureZip(): Uint8Array {
  const files: Record<string, Uint8Array> = {
    "Position Rankings/UDK Position Rankings - QB.csv": strToU8(
      [
        "Name,Position,Team,Bye Week,Rank,Points,Risk,Upside,ADP,Tier,Outlook,Dynasty,Markers",
        'Josh Allen,QB,BUF,7,1,419.7,2.6,9.7,2.12,1,"Line one, with comma\nand line two",Dynasty,Markers',
      ].join("\n"),
    ),
    "Position Rankings/UDK Position Rankings - RB.csv": strToU8(
      [
        "Name,Position,Team,Bye Week,Rank,Points,Risk,Upside,ADP,Tier,Outlook,Dynasty,Markers",
        "Bijan Robinson,RB,ATL,11,1,356.4,1.3,10,1.02,1,Outlook,Dynasty,Markers",
      ].join("\n"),
    ),
    "Position Rankings/UDK Position Rankings - K.csv": strToU8(
      "Name,Position,Team,Bye Week,Rank,Andy,Jason,Mike,Markers\nBrandon Aubrey,K,DAL,14,1,1,1,1,Markers",
    ),
    "Position Rankings/UDK Position Rankings - DST.csv": strToU8(
      "Name,Position,Team,Bye Week,Rank,Andy,Jason,Mike,Markers\nHouston Texans,D,HOU,8,1,1,2,1,Markers",
    ),
    "Projections/Andy/UDK - Andys Projections - QB.csv": strToU8(
      [
        "Name,Team,Bye Week,Rank,PPG,YDS,TDS,YDS,TDS,INT,FUM",
        "Josh Allen,BUF,7,1,25.2,4000,30,500,8,10,3",
        "Ghost Quarterback,FA,1,99,1,100,1,0,0,0,0",
      ].join("\n"),
    ),
    "Projections/Jason/UDK - Jasons Projections - QB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,YDS,TDS,YDS,TDS,INT,FUM\nJosh Allen,BUF,7,1,25.8,4100,32,600,7,9,4",
    ),
    "Projections/Mike/UDK - Mikes Projections - QB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,YDS,TDS,YDS,TDS,INT,FUM\nJosh Allen,BUF,7,1,23,3900,28,550,9,12,5",
    ),
    "Projections/Andy/UDK - Andys Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nBijan Robinson,ATL,11,1,20,250,1200,10,60,500,4,2",
    ),
    "Projections/Jason/UDK - Jasons Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nBijan Robinson,ATL,11,1,21,275,1300,12,70,550,5,1",
    ),
    "Projections/Mike/UDK - Mikes Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nBijan Robinson,ATL,11,1,19,230,1100,8,50,450,3,3",
    ),
    "ADP Analysis/UDK -

[TRUNCATED]
```

### `packages/draft-engine/tests/fixtures.ts`

```text
import type {
  LeagueSettings,
  PlayerDataRecord,
  PlayerDataRelease,
  PlayerPosition,
  RosterSlotRule,
} from "@fdi/shared-types";

const ALL_POSITIONS: PlayerPosition[] = ["QB", "RB", "WR", "TE", "K", "DST"];

export function leagueSettings(overrides: Partial<LeagueSettings> = {}): LeagueSettings {
  const rounds = overrides.rounds ?? 16;
  const rosterSlots = overrides.rosterSlots ?? defaultRosterSlots(rounds);

  return {
    leagueName: "Test League",
    teamCount: 12,
    userDraftSlot: 6,
    rounds,
    scoring: {
      preset: "half_ppr",
      passingYardsPerPoint: 25,
      passingTouchdown: 4,
      interception: -2,
      rushingYardsPerPoint: 10,
      rushingTouchdown: 6,
      receivingYardsPerPoint: 10,
      receivingTouchdown: 6,
      reception: 0.5,
      fumbleLost: -2,
    },
    rosterSlots,
    ...overrides,
  };
}

export function playerRecord(
  canonicalPlayerId: string,
  position: PlayerPosition,
  displayName: string = canonicalPlayerId,
): PlayerDataRecord {
  return {
    canonical_player_id: canonicalPlayerId,
    display_name: displayName,
    position,
    nfl_team: "TST",
    bye_week: 7,
    overall_rank: null,
    position_rank: null,
    adp: null,
    projected_points: null,
    tier: null,
    risk_score: null,
    upside_score: null,
    availability_status: "active",
  };
}

export function playerDataRelease(players: PlayerDataRecord[]): PlayerDataRelease {
  return {
    schema_version: "1.0",
    season: 2026,
    release_id: "test-release-v1",
    generated_at: "2026-07-16T12:00:00Z",
    sources: ["test-fixture"],
    players,
  };
}

export function generatedPlayerRelease(
  count: number,
  positions: PlayerPosition[] = ALL_POSITIONS,
): PlayerDataRelease {
  return playerDataRelease(
    Array.from({ length: count }, (_, index) =>
      playerRecord(`player-${index + 1}`, positions[index % positions.length]!),
    ),
  );
}

export function fullDraftPlayerRelease(settings: LeagueSettings): PlayerDataRelease {
  const standardRoundPositions: PlayerPosition[] = [
    "QB",
    "RB",
    "RB",
    "WR",
    "WR",
    "TE",
    "RB",
    "K",
    "DST",
    "QB",
    "RB",
    "WR",
    "WR",
    "TE",
    "RB",
    "WR",
  ];

  const requiredPlayers = settings.teamCount * settings.rounds;
  const players = Array.from({ length: requiredPlayers + 20 }, (_, index) => {
    const round = Math.floor(index / settings.teamCount);
    const position = standardRoundPositions[round] ?? ALL_POSITIONS[index % ALL_

[TRUNCATED]
```

### `packages/draft-engine/tests/order.test.ts`

```text
import { describe, expect, it } from "vitest";
import { createDraftTeams, generateSnakeDraftOrder, validateLeagueSettings } from "@fdi/draft-engine";
import { leagueSettings } from "./fixtures.js";

describe("snake draft order", () => {
  it("reverses team order in even rounds", () => {
    const settings = leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 3 });
    const order = generateSnakeDraftOrder(settings);

    expect(order.map((slot) => slot.draftSlot)).toEqual([1, 2, 3, 4, 4, 3, 2, 1, 1, 2, 3, 4]);
    expect(order.map((slot) => slot.overallPick)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("identifies the configured user team", () => {
    const settings = leagueSettings({ teamCount: 4, userDraftSlot: 3, rounds: 2 });
    const teams = createDraftTeams(settings, ["A", "B", "Ryan", "D"]);

    expect(teams.filter((team) => team.isUser)).toEqual([
      { teamId: "team-3", name: "Ryan", draftSlot: 3, isUser: true },
    ]);
  });

  it("rejects a user draft slot outside the league", () => {
    const settings = leagueSettings({ teamCount: 10, userDraftSlot: 11 });

    expect(() => validateLeagueSettings(settings)).toThrow(/userDraftSlot/);
  });

  it("requires roster capacity to equal the configured rounds", () => {
    const settings = leagueSettings({
      rounds: 3,
      rosterSlots: [{ slot: "BENCH", count: 2, eligiblePositions: ["QB", "RB"] }],
    });

    expect(() => validateLeagueSettings(settings)).toThrow(/Roster capacity/);
  });
});
```

## Open Implementation Notes

Use this file as the primary project snapshot for ChatGPT. Prefer relying on:
1. project summary and docs for intent
2. root config files for setup and tooling
3. fantasy domain logic files for business rules
4. data pipeline files for source-of-truth data flow

If responses start feeling stale, regenerate this file and re-upload it to the Project.
