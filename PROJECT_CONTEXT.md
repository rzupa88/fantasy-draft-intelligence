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
- a React/Vite live draft room with local recovery
- Vitest and Playwright regression coverage

## Current draft-room capabilities

The React interface currently supports:

- league name, team count, draft slot, rounds, and scoring setup
- an offline deterministic demo player release
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
- browser-tested recovery and backup workflows

The next primary increments are broader roster customization, production preseason player-data releases, SQLite persistence, and Tauri desktop packaging.

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
npm run build
npm run evaluate:recommendations
npx playwright install chromium
npm run test:e2e
```

## Current project structure

```text
apps/
  draft-room/            # React/Vite live draft interface
e2e/                     # Playwright browser workflows
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
- **M4 — Local draft-room interface:** functional and recoverable; customization remains
- **M5 — Desktop packaging and release**

## Quickstart and Useful Commands

Potentially useful commands and setup hints found in project files:

```text
A local-first fantasy football draft assistant designed to run on a laptop without relying on Sleeper, Yahoo, ESPN, or another live draft platform.
- Draft state, recommendation logic, and the user interface remain independently testable.
- Vitest and Playwright regression coverage
- browser-tested recovery and backup workflows
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
Run the existing data pipeline and tests:
python scripts/build_player_reference.py
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
│   │   ├── src
│   │   │   ├── components
│   │   │   ├── App.tsx
│   │   │   ├── demo-data.ts
│   │   │   ├── draft-factory.ts
│   │   │   ├── draft-storage.ts
│   │   │   ├── main.tsx
│   │   │   ├── recovery.css
│   │   │   └── styles.css
│   │   ├── tests
│   │   │   ├── app.test.tsx
│   │   │   └── recovery.test.ts
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
│   ├── product-requirements.md
│   ├── recommendation-engine.md
│   ├── recommendation-evaluation.md
│   ├── release-criteria.md
│   ├── repository-audit.md
│   ├── roadmap.md
│   ├── SOURCE_INVENTORY.md
│   └── testing-strategy.md
├── e2e
│   └── draft-room.spec.ts
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
│   ├── build_player_reference.py
│   ├── build_player_season_warehouse.py
│   ├── evaluate_recommendations.mjs
│   ├── ingest_adp.py
│   ├── ingest_nflverse.py
│   └── validate_data.py
├── tests
│   ├── data
│   │   ├── ingest
│   │   │   ├── test_adp.py
│   │   │   └── test_nflverse.py
│   │   ├── test_player_ids.py
│   │   ├── test_player_season_warehouse.py
│   │   └── test_player_season_warehouse.py:146:5
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
- a React/Vite live draft room with local recovery
- Vitest and Playwright regression coverage

## Current draft-room capabilities

The React interface currently supports:

- league name, team count, draft slot, rounds, and scoring setup
- an offline deterministic demo player release
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
- browser-tested recovery and backup workflows

The next primary increments are broader roster customization, production preseason player-data releases, SQLite persistence, and Tauri desktop packaging.

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
npm run build
npm run evaluate:recommendations
npx playwright install chromium
npm run test:e2e
```

## Current project structure

```text
apps/
  draft-room/            # React/Vite live draft interface
e2e/                     # Playwright browser workflows
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

-

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

**Status:** Functional recoverable browser application implemented

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
12. Custom roster editor — pending
13. Production player-data release import — pending

### Current behavior

- Setup creates a real deterministic draft state rather than mocked UI state.
- Every manual selection advances the snake order through the draft engine.
- Position-aware roster assignments are shown for every fantasy team.
- Recommendations recalculate from the current user roster and remaining player pool.
- Picks can be corrected by replaying the authoritative selection history.
- The interface autosaves after every state change and restores the latest valid draft after a reload.
- Versioned JSON backups can be exported, cleared from local recovery, and imported again.
- Keyboard shortcuts support search, player navigation, drafting, undo, export, and latest-pick correction.
- Playwright validates keyboard drafting, recovery, correction, undo, export, and import in Chromium.
- A deterministic fictional player release allows the app to run without network access while the production preseason data pipeline is completed.

### Exit criteria

- A user can complete a draft without developer assistance.
- Common pick entry requires minimal interaction.
- Errors are recoverable and clearly explained.
- A browser-level test completes a representative draft workflow.

The baseline exit criteria are now covered. Remaining M4 work is customization and replacing demonstration data with a production preseason release.

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

- superflex and two-quarterback formats
- tight-end premium
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
8. Add custom roster editing and versioned preseason player-data releases.
9. Expand evaluation with full mock drafts and historical player releases.
10. Add SQLite autosave and Tauri desktop packaging.
```

### `docs/testing-strategy.md`

```text
# Testing Strategy

## Python data layer

- ingestion fixtures
- canonical identity edge cases
- required-column validation
- uniqueness constraints
- app-ready release schema validation

## TypeScript draft engine

- snake-order boundaries
- pick sequencing
- duplicate rejection
- roster assignment
- FLEX eligibility
- undo and correction
- serialization round trips
- unsupported schema versions

## Recommendation engine

- deterministic scores for fixed inputs
- roster-need response
- tier-drop response
- positional-run response
- ADP value response
- explanation completeness

## Interface

- new-draft setup
- keyboard player search
- pick entry
- undo and correction
- roster and board updates
- save and restore
- import and export

## Desktop release

- clean installation
- launch without development tools
- airplane-mode complete draft
- forced close and recovery
- corrupted import handling
- player-data schema incompatibility

## Required fixture

A stable twelve-team, multi-round draft fixture will serve as the primary regression scenario across the draft engine, recommendation engine, interface, persistence, and desktop package.
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
  "version": "0.1.0",
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
import { useEffect, useState } from "react";
import {
  correctPick,
  getPlayerById,
  makePick,
  serializeDraftState,
  undoLastPick,
} from "@fdi/draft-engine";
import type { DraftState } from "@fdi/shared-types";
import { DraftWorkspace } from "./components/DraftWorkspace.js";
import { RecoverySetupScreen } from "./components/RecoverySetupScreen.js";
import {
  DEFAULT_DRAFT_SETUP,
  createDraftFromSetup,
  type DraftSetup,
} from "./draft-factory.js";
import {
  clearDraftRecovery,
  importDraftFile,
  loadDraftRecovery,
  saveDraftRecovery,
} from "./draft-storage.js";

export function App() {
  const [initialRecovery] = useState<DraftState | null>(() => loadDraftRecovery());
  const [setup, setSetup] = useState<DraftSetup>(DEFAULT_DRAFT_SETUP);
  const [draftState, setDraftState] = useState<DraftState | null>(initialRecovery);
  const [recoveredDraft, setRecoveredDraft] = useState<DraftState | null>(initialRecovery);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    initialRecovery === null ? null : "Autosaved draft restored on this device.",
  );

  useEffect(() => {
    if (draftState === null) {
      return;
    }
    saveDraftRecovery(draftState);
    setRecoveredDraft(draftState);
  }, [draftState]);

  function startDraft(): void {
    try {
      const nextState = createDraftFromSetup(setup);
      clearDraftRecovery();
      setRecoveredDraft(null);
      setDraftState(nextState);
      setErrorMessage(null);
      setNotice("Draft created. Record the first selection from the player board.");
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  }

  function resumeDraft(): void {
    if (recoveredDraft === null) {
      return;
    }
    setDraftState(recoveredDraft);
    setErrorMessage(null);
    setNotice("Autosaved draft resumed.");
  }

  function discardRecovery(): void {
    clearDraftRecovery();
    setRecoveredDraft(null);
    setErrorMessage(null);
  }

  function draftPlayer(playerId: string): void {
    if (draftState === null) {
      return;
    }

    try {
      const player = getPlayerById(draftState, playerId);
      const currentPick = draftState.nextOverallPick;
      const nextState = makePick(draftState, playerId);
      setDraftState(nextState);
      setNotice(
        `${player?.display_name ?? playerId} selected at pick ${currentPick ?? "—"}.`,
      );
    } catch (error) {
      setNotice(toErrorMessage(error));
    }
  }

  function undoPick(): void {
    if (draftState === null || draftState.picks.length === 0) {
      return;
    }

    try {
      const lastPick = draftState.picks[draftState.picks.length - 1]!;
      const player = getPlayerById(draftState, lastPick.playerId);
      const nextState = undoLastPick(draftState);
      setDraftState(nextState);
      setNotice(`${player?.display_name ?? lastPick.playerId} returned to the player pool.`);
    } catch (error) {
      setNotice(toErrorMessage(error));
    }
  }

  function correctDraftPick(overallPick: number, replacementPlayerId: string): boolean {
    if (draftState === null) {
      return false;
    }

    try {
      const previousPick = draftState.picks[overallPick - 1];
      const previousPlayer =
        previousPick === undefined ? null : getPlayerById(draftState, previousPick.playerId);
      const replacementPlayer = getPlayerById(draftState, replacementPlayerId);
      const nextState = correctPick(draftState, ove

[TRUNCATED]
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

### `apps/draft-room/src/components/RecoverySetupScreen.tsx`

```text
import { useRef, type ChangeEvent, type FormEvent } from "react";
import type { DraftState } from "@fdi/shared-types";
import {
  ROUND_OPTIONS,
  SCORING_OPTIONS,
  TEAM_COUNT_OPTIONS,
  type DraftSetup,
  type SupportedScoringPreset,
} from "../draft-factory.js";

interface RecoverySetupScreenProps {
  setup: DraftSetup;
  recoveredDraft: DraftState | null;
  errorMessage: string | null;
  onSetupChange: (setup: DraftSetup) => void;
  onStartDraft: () => void;
  onResumeDraft: () => void;
  onDiscardRecovery: () => void;
  onImportDraft: (file: File) => Promise<boolean>;
}

export function RecoverySetupScreen({
  setup,
  recoveredDraft,
  errorMessage,
  onSetupChange,
  onStartDraft,
  onResumeDraft,
  onDiscardRecovery,
  onImportDraft,
}: RecoverySetupScreenProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const draftSlots = Array.from({ length: setup.teamCount }, (_, index) => index + 1);

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

  return (
    <main className="setup-shell">
      <section className="setup-hero">
        <div className="brand-mark" aria-hidden="true">
          FDI
        </div>
        <p className="eyebrow">Local-first draft intelligence</p>
        <h1>Build your draft room.</h1>
        <p className="setup-lede">
          Configure the league, restore a saved draft, and run the entire snake draft from one
          laptop. No platform login. No live sync dependency.
        </p>

        <div className="feature-strip" aria-label="Draft room capabilities">
          <span>Manual pick entry</span>
          <span>Automatic recovery</span>
          <span>Live recommendations</span>
          <span>Every roster tracked</span>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Draft control</p>
            <h2 id="setup-title">League setup</h2>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={() => importInputRef.current?.click()}
          >
            Import backup
          </button>
          <input
            ref={importInputRef}
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleImport(event)}
          />
        </div>

        {recoveredDraft === null ? null : (
          <section className="recovery-card" aria-labelledby="recovery-title">
            <div>
              <p className="eyebrow">Autosaved draft found</p>
              <h3 id="recovery-title">{recoveredDraft.settings.leagueName}</h3>
              <p>
                {recoveredDraft.picks.length} of {recoveredDraft.order.length} picks recorded ·
                revision {recoveredDraft.revision}
              </p>
            </div>
            <div className="recovery-actions">
              <button className="primary-button" type="button" onClick={onResumeDraft}>
                Resume draft
              </button>
              <button className="ghost-button" type="button" onClick={onDiscardRecovery}>

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

### `apps/draft-room/src/draft-factory.ts`

```text
import { createDraftState } from "@fdi/draft-engine";
import type {
  DraftState,
  LeagueSettings,
  RosterSlotRule,
  ScoringPreset,
  ScoringSettings,
} from "@fdi/shared-types";
import { createDemoPlayerDataRelease } from "./demo-data.js";

export type SupportedScoringPreset = Exclude<ScoringPreset, "custom">;

export interface DraftSetup {
  leagueName: string;
  teamCount: number;
  userDraftSlot: number;
  rounds: number;
  scoringPreset: SupportedScoringPreset;
}

export const DEFAULT_DRAFT_SETUP: DraftSetup = {
  leagueName: "Friday Night League",
  teamCount: 12,
  userDraftSlot: 6,
  rounds: 16,
  scoringPreset: "half_ppr",
};

export const TEAM_COUNT_OPTIONS = [8, 10, 12, 14] as const;
export const ROUND_OPTIONS = [14, 15, 16, 17, 18] as const;

export const SCORING_OPTIONS: Array<{
  value: SupportedScoringPreset;
  label: string;
  description: string;
}> = [
  {
    value: "standard",
    label: "Standard",
    description: "No points per reception",
  },
  {
    value: "half_ppr",
    label: "Half PPR",
    description: "0.5 points per reception",
  },
  {
    value: "ppr",
    label: "Full PPR",
    description: "1 point per reception",
  },
];

export function createDraftFromSetup(
  setup: DraftSetup,
  draftId = createDraftId(setup.leagueName),
): DraftState {
  validateDraftSetup(setup);
  const settings = createLeagueSettings(setup);
  const teamNames = Array.from({ length: setup.teamCount }, (_, index) =>
    index + 1 === setup.userDraftSlot ? "My Team" : `Team ${index + 1}`,
  );

  return createDraftState({
    draftId,
    settings,
    teamNames,
    playerDataRelease: createDemoPlayerDataRelease(setup.teamCount * setup.rounds + 40),
  });
}

export function createLeagueSettings(setup: DraftSetup): LeagueSettings {
  validateDraftSetup(setup);

  return {
    leagueName: setup.leagueName.trim(),
    teamCount: setup.teamCount,
    userDraftSlot: setup.userDraftSlot,
    rounds: setup.rounds,
    scoring: createScoringSettings(setup.scoringPreset),
    rosterSlots: createRosterSlots(setup.rounds),
  };
}

export function createRosterSlots(rounds: number): RosterSlotRule[] {
  const requiredStarterSlots = 9;
  if (!Number.isInteger(rounds) || rounds < requiredStarterSlots) {
    throw new RangeError(`Draft rounds must be at least ${requiredStarterSlots}.`);
  }

  return [
    { slot: "QB", count: 1, eligiblePositions: ["QB"] },
    { slot: "RB", count: 2, eligiblePositions: ["RB"] },
    { slot: "WR", count: 2, eligiblePositions: ["WR"] },
    { slot: "TE", count: 1, eligiblePositions: ["TE"] },
    { slot: "FLEX", count: 1, eligiblePositions: ["RB", "WR", "TE"] },
    { slot: "K", count: 1, eligiblePositions: ["K"] },
    { slot: "DST", count: 1, eligiblePositions: ["DST"] },
    {
      slot: "BENCH",
      count: rounds - requiredStarterSlots,
      eligiblePositions: ["QB", "RB", "WR", "TE", "K", "DST"],
    },
  ];
}

function createScoringSettings(preset: SupportedScoringPreset): ScoringSettings {
  const reception = preset === "ppr" ? 1 : preset === "half_ppr" ? 0.5 : 0;

  return {
    preset,
    passingYardsPerPoint: 25,
    passingTouchdown: 4,
    interception: -2,
    rushingYardsPerPoint: 10,
    rushingTouchdown: 6,
    receivingYardsPerPoint: 10,
    receivingTouchdown: 6,
    reception,
    fumbleLost: -2,
  };
}

function validateDraftSetup(setup: DraftSetup): void {
  if (setup.leagueName.trim().length === 0) {
    throw new RangeError("League name is required.");
  }
  if (!TEAM_COUNT_OPTIO

[TRUNCATED]
```

### `apps/draft-room/src/draft-storage.ts`

```text
import { deserializeDraftState, serializeDraftState } from "@fdi/draft-engine";
import type { DraftState } from "@fdi/shared-types";

export const DRAFT_RECOVERY_STORAGE_KEY = "fdi.draft-room.recovery.v1";

type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadDraftRecovery(storage: DraftStorage | null = getBrowserStorage()): DraftState | null {
  if (storage === null) {
    return null;
  }

  const serialized = storage.getItem(DRAFT_RECOVERY_STORAGE_KEY);
  if (serialized === null) {
    return null;
  }

  try {
    return deserializeDraftState(serialized);
  } catch {
    storage.removeItem(DRAFT_RECOVERY_STORAGE_KEY);
    return null;
  }
}

export function saveDraftRecovery(
  state: DraftState,
  storage: DraftStorage | null = getBrowserStorage(),
): void {
  if (storage === null) {
    return;
  }
  storage.setItem(DRAFT_RECOVERY_STORAGE_KEY, serializeDraftState(state));
}

export function clearDraftRecovery(storage: DraftStorage | null = getBrowserStorage()): void {
  storage?.removeItem(DRAFT_RECOVERY_STORAGE_KEY);
}

export async function importDraftFile(file: Pick<File, "text">): Promise<DraftState> {
  return deserializeDraftState(await file.text());
}

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
}
```

### `apps/draft-room/src/main.tsx`

```text
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./styles.css";
import "./recovery.css";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("Draft room root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
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
  createDraftFromSetup,
  createRosterSlots,
} from "../src/draft-factory.js";

describe("draft room application shell", () => {
  it("renders the league setup and recovery experience", () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain("Build your draft room.");
    expect(html).toContain("Start new draft");
    expect(html).toContain("Import backup");
    expect(html).toContain("Autosaved after every change");
  });

  it("creates a complete engine-backed snake draft from setup", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "ui-test-draft");
    const userTeam = state.teams.find((team) => team.isUser);

    expect(state.order).toHaveLength(DEFAULT_DRAFT_SETUP.teamCount * DEFAULT_DRAFT_SETUP.rounds);
    expect(state.playerPoolIds.length).toBeGreaterThan(state.order.length);
    expect(userTeam?.draftSlot).toBe(DEFAULT_DRAFT_SETUP.userDraftSlot);
    expect(state.status).toBe("not_started");
  });

  it("keeps roster capacity aligned with the selected round count", () => {
    const rosterSlots = createRosterSlots(18);
    const capacity = rosterSlots.reduce((sum, rule) => sum + rule.count, 0);
    const bench = rosterSlots.find((rule) => rule.slot === "BENCH");

    expect(capacity).toBe(18);
    expect(bench?.count).toBe(9);
  });

  it("connects manual selections to live recommendations", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "recommendation-ui-test");
    const draftedPlayerId = state.availablePlayerIds[0]!;
    const nextState = makePick(state, draftedPlayerId);
    const result = recommendPlayers(nextState, { limit: 5 });

    expect(nextState.picks).toHaveLength(1);
    expect(nextState.availablePlayerIds).not.toContain(draftedPlayerId);
    expect(result.recommendations.map((item) => item.playerId)).not.toContain(draftedPlayerId);
    expect(result.recommendations).toHaveLength(5);
  });
});
```

## Fantasy Domain Logic Files

### `apps/draft-room/package.json`

```text
{
  "name": "@fdi/draft-room",
  "version": "0.1.0",
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
import { useEffect, useState } from "react";
import {
  correctPick,
  getPlayerById,
  makePick,
  serializeDraftState,
  undoLastPick,
} from "@fdi/draft-engine";
import type { DraftState } from "@fdi/shared-types";
import { DraftWorkspace } from "./components/DraftWorkspace.js";
import { RecoverySetupScreen } from "./components/RecoverySetupScreen.js";
import {
  DEFAULT_DRAFT_SETUP,
  createDraftFromSetup,
  type DraftSetup,
} from "./draft-factory.js";
import {
  clearDraftRecovery,
  importDraftFile,
  loadDraftRecovery,
  saveDraftRecovery,
} from "./draft-storage.js";

export function App() {
  const [initialRecovery] = useState<DraftState | null>(() => loadDraftRecovery());
  const [setup, setSetup] = useState<DraftSetup>(DEFAULT_DRAFT_SETUP);
  const [draftState, setDraftState] = useState<DraftState | null>(initialRecovery);
  const [recoveredDraft, setRecoveredDraft] = useState<DraftState | null>(initialRecovery);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    initialRecovery === null ? null : "Autosaved draft restored on this device.",
  );

  useEffect(() => {
    if (draftState === null) {
      return;
    }
    saveDraftRecovery(draftState);
    setRecoveredDraft(draftState);
  }, [draftState]);

  function startDraft(): void {
    try {
      const nextState = createDraftFromSetup(setup);
      clearDraftRecovery();
      setRecoveredDraft(null);
      setDraftState(nextState);
      setErrorMessage(null);
      setNotice("Draft created. Record the first selection from the player board.");
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  }

  function resumeDraft(): void {
    if (recoveredDraft === null) {
      return;
    }
    setDraftState(recoveredDraft);
    setErrorMessage(null);
    setNotice("Autosaved draft resumed.");
  }

  function discardRecovery(): void {
    clearDraftRecovery();
    setRecoveredDraft(null);
    setErrorMessage(null);
  }

  function draftPlayer(playerId: string): void {
    if (draftState === null) {
      return;
    }

    try {
      const player = getPlayerById(draftState, playerId);
      const currentPick = draftState.nextOverallPick;
      const nextState = makePick(draftState, playerId);
      setDraftState(nextState);
      setNotice(
        `${player?.display_name ?? playerId} selected at pick ${currentPick ?? "—"}.`,
      );
    } catch (error) {
      setNotice(toErrorMessage(error));
    }
  }

  function undoPick(): void {
    if (draftState === null || draftState.picks.length === 0) {
      return;
    }

    try {
      const lastPick = draftState.picks[draftState.picks.length - 1]!;
      const player = getPlayerById(draftState, lastPick.playerId);
      const nextState = undoLastPick(draftState);
      setDraftState(nextState);
      setNotice(`${player?.display_name ?? lastPick.playerId} returned to the player pool.`);
    } catch (error) {
      setNotice(toErrorMessage(error));
    }
  }

  function correctDraftPick(overallPick: number, replacementPlayerId: string): boolean {
    if (draftState === null) {
      return false;
    }

    try {
      const previousPick = draftState.picks[overallPick - 1];
      const previousPlayer =
        previousPick === undefined ? null : getPlayerById(draftState, previousPick.playerId);
      const replacementPlayer = getPlayerById(draftState, replacementPlayerId);
      const nextState = correctPick(draftState, ove

[TRUNCATED]
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

### `apps/draft-room/src/components/RecoverySetupScreen.tsx`

```text
import { useRef, type ChangeEvent, type FormEvent } from "react";
import type { DraftState } from "@fdi/shared-types";
import {
  ROUND_OPTIONS,
  SCORING_OPTIONS,
  TEAM_COUNT_OPTIONS,
  type DraftSetup,
  type SupportedScoringPreset,
} from "../draft-factory.js";

interface RecoverySetupScreenProps {
  setup: DraftSetup;
  recoveredDraft: DraftState | null;
  errorMessage: string | null;
  onSetupChange: (setup: DraftSetup) => void;
  onStartDraft: () => void;
  onResumeDraft: () => void;
  onDiscardRecovery: () => void;
  onImportDraft: (file: File) => Promise<boolean>;
}

export function RecoverySetupScreen({
  setup,
  recoveredDraft,
  errorMessage,
  onSetupChange,
  onStartDraft,
  onResumeDraft,
  onDiscardRecovery,
  onImportDraft,
}: RecoverySetupScreenProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const draftSlots = Array.from({ length: setup.teamCount }, (_, index) => index + 1);

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

  return (
    <main className="setup-shell">
      <section className="setup-hero">
        <div className="brand-mark" aria-hidden="true">
          FDI
        </div>
        <p className="eyebrow">Local-first draft intelligence</p>
        <h1>Build your draft room.</h1>
        <p className="setup-lede">
          Configure the league, restore a saved draft, and run the entire snake draft from one
          laptop. No platform login. No live sync dependency.
        </p>

        <div className="feature-strip" aria-label="Draft room capabilities">
          <span>Manual pick entry</span>
          <span>Automatic recovery</span>
          <span>Live recommendations</span>
          <span>Every roster tracked</span>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Draft control</p>
            <h2 id="setup-title">League setup</h2>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={() => importInputRef.current?.click()}
          >
            Import backup
          </button>
          <input
            ref={importInputRef}
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleImport(event)}
          />
        </div>

        {recoveredDraft === null ? null : (
          <section className="recovery-card" aria-labelledby="recovery-title">
            <div>
              <p className="eyebrow">Autosaved draft found</p>
              <h3 id="recovery-title">{recoveredDraft.settings.leagueName}</h3>
              <p>
                {recoveredDraft.picks.length} of {recoveredDraft.order.length} picks recorded ·
                revision {recoveredDraft.revision}
              </p>
            </div>
            <div className="recovery-actions">
              <button className="primary-button" type="button" onClick={onResumeDraft}>
                Resume draft
              </button>
              <button className="ghost-button" type="button" onClick={onDiscardRecovery}>

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

### `apps/draft-room/src/draft-factory.ts`

```text
import { createDraftState } from "@fdi/draft-engine";
import type {
  DraftState,
  LeagueSettings,
  RosterSlotRule,
  ScoringPreset,
  ScoringSettings,
} from "@fdi/shared-types";
import { createDemoPlayerDataRelease } from "./demo-data.js";

export type SupportedScoringPreset = Exclude<ScoringPreset, "custom">;

export interface DraftSetup {
  leagueName: string;
  teamCount: number;
  userDraftSlot: number;
  rounds: number;
  scoringPreset: SupportedScoringPreset;
}

export const DEFAULT_DRAFT_SETUP: DraftSetup = {
  leagueName: "Friday Night League",
  teamCount: 12,
  userDraftSlot: 6,
  rounds: 16,
  scoringPreset: "half_ppr",
};

export const TEAM_COUNT_OPTIONS = [8, 10, 12, 14] as const;
export const ROUND_OPTIONS = [14, 15, 16, 17, 18] as const;

export const SCORING_OPTIONS: Array<{
  value: SupportedScoringPreset;
  label: string;
  description: string;
}> = [
  {
    value: "standard",
    label: "Standard",
    description: "No points per reception",
  },
  {
    value: "half_ppr",
    label: "Half PPR",
    description: "0.5 points per reception",
  },
  {
    value: "ppr",
    label: "Full PPR",
    description: "1 point per reception",
  },
];

export function createDraftFromSetup(
  setup: DraftSetup,
  draftId = createDraftId(setup.leagueName),
): DraftState {
  validateDraftSetup(setup);
  const settings = createLeagueSettings(setup);
  const teamNames = Array.from({ length: setup.teamCount }, (_, index) =>
    index + 1 === setup.userDraftSlot ? "My Team" : `Team ${index + 1}`,
  );

  return createDraftState({
    draftId,
    settings,
    teamNames,
    playerDataRelease: createDemoPlayerDataRelease(setup.teamCount * setup.rounds + 40),
  });
}

export function createLeagueSettings(setup: DraftSetup): LeagueSettings {
  validateDraftSetup(setup);

  return {
    leagueName: setup.leagueName.trim(),
    teamCount: setup.teamCount,
    userDraftSlot: setup.userDraftSlot,
    rounds: setup.rounds,
    scoring: createScoringSettings(setup.scoringPreset),
    rosterSlots: createRosterSlots(setup.rounds),
  };
}

export function createRosterSlots(rounds: number): RosterSlotRule[] {
  const requiredStarterSlots = 9;
  if (!Number.isInteger(rounds) || rounds < requiredStarterSlots) {
    throw new RangeError(`Draft rounds must be at least ${requiredStarterSlots}.`);
  }

  return [
    { slot: "QB", count: 1, eligiblePositions: ["QB"] },
    { slot: "RB", count: 2, eligiblePositions: ["RB"] },
    { slot: "WR", count: 2, eligiblePositions: ["WR"] },
    { slot: "TE", count: 1, eligiblePositions: ["TE"] },
    { slot: "FLEX", count: 1, eligiblePositions: ["RB", "WR", "TE"] },
    { slot: "K", count: 1, eligiblePositions: ["K"] },
    { slot: "DST", count: 1, eligiblePositions: ["DST"] },
    {
      slot: "BENCH",
      count: rounds - requiredStarterSlots,
      eligiblePositions: ["QB", "RB", "WR", "TE", "K", "DST"],
    },
  ];
}

function createScoringSettings(preset: SupportedScoringPreset): ScoringSettings {
  const reception = preset === "ppr" ? 1 : preset === "half_ppr" ? 0.5 : 0;

  return {
    preset,
    passingYardsPerPoint: 25,
    passingTouchdown: 4,
    interception: -2,
    rushingYardsPerPoint: 10,
    rushingTouchdown: 6,
    receivingYardsPerPoint: 10,
    receivingTouchdown: 6,
    reception,
    fumbleLost: -2,
  };
}

function validateDraftSetup(setup: DraftSetup): void {
  if (setup.leagueName.trim().length === 0) {
    throw new RangeError("League name is required.");
  }
  if (!TEAM_COUNT_OPTIO

[TRUNCATED]
```

### `apps/draft-room/src/draft-storage.ts`

```text
import { deserializeDraftState, serializeDraftState } from "@fdi/draft-engine";
import type { DraftState } from "@fdi/shared-types";

export const DRAFT_RECOVERY_STORAGE_KEY = "fdi.draft-room.recovery.v1";

type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadDraftRecovery(storage: DraftStorage | null = getBrowserStorage()): DraftState | null {
  if (storage === null) {
    return null;
  }

  const serialized = storage.getItem(DRAFT_RECOVERY_STORAGE_KEY);
  if (serialized === null) {
    return null;
  }

  try {
    return deserializeDraftState(serialized);
  } catch {
    storage.removeItem(DRAFT_RECOVERY_STORAGE_KEY);
    return null;
  }
}

export function saveDraftRecovery(
  state: DraftState,
  storage: DraftStorage | null = getBrowserStorage(),
): void {
  if (storage === null) {
    return;
  }
  storage.setItem(DRAFT_RECOVERY_STORAGE_KEY, serializeDraftState(state));
}

export function clearDraftRecovery(storage: DraftStorage | null = getBrowserStorage()): void {
  storage?.removeItem(DRAFT_RECOVERY_STORAGE_KEY);
}

export async function importDraftFile(file: Pick<File, "text">): Promise<DraftState> {
  return deserializeDraftState(await file.text());
}

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
}
```

### `apps/draft-room/src/main.tsx`

```text
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./styles.css";
import "./recovery.css";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("Draft room root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
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
  createDraftFromSetup,
  createRosterSlots,
} from "../src/draft-factory.js";

describe("draft room application shell", () => {
  it("renders the league setup and recovery experience", () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain("Build your draft room.");
    expect(html).toContain("Start new draft");
    expect(html).toContain("Import backup");
    expect(html).toContain("Autosaved after every change");
  });

  it("creates a complete engine-backed snake draft from setup", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "ui-test-draft");
    const userTeam = state.teams.find((team) => team.isUser);

    expect(state.order).toHaveLength(DEFAULT_DRAFT_SETUP.teamCount * DEFAULT_DRAFT_SETUP.rounds);
    expect(state.playerPoolIds.length).toBeGreaterThan(state.order.length);
    expect(userTeam?.draftSlot).toBe(DEFAULT_DRAFT_SETUP.userDraftSlot);
    expect(state.status).toBe("not_started");
  });

  it("keeps roster capacity aligned with the selected round count", () => {
    const rosterSlots = createRosterSlots(18);
    const capacity = rosterSlots.reduce((sum, rule) => sum + rule.count, 0);
    const bench = rosterSlots.find((rule) => rule.slot === "BENCH");

    expect(capacity).toBe(18);
    expect(bench?.count).toBe(9);
  });

  it("connects manual selections to live recommendations", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "recommendation-ui-test");
    const draftedPlayerId = state.availablePlayerIds[0]!;
    const nextState = makePick(state, draftedPlayerId);
    const result = recommendPlayers(nextState, { limit: 5 });

    expect(nextState.picks).toHaveLength(1);
    expect(nextState.availablePlayerIds).not.toContain(draftedPlayerId);
    expect(result.recommendations.map((item) => item.playerId)).not.toContain(draftedPlayerId);
    expect(result.recommendations).toHaveLength(5);
  });
});
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

### `packages/data/io.py`

```text
from pathlib import Path

import pandas as pd


def ensure_parent_dir(path: str | Path) -> Path:
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    return output_path


def write_parquet(df: pd.DataFrame, path: str | Path) -> None:
    output_path = ensure_parent_dir(path)
    df.to_parquet(output_path, index=False)


def read_parquet(path: str | Path) -> pd.DataFrame:
    return pd.read_parquet(path)
```

### `packages/data/player_ids.py`

```text
from __future__ import annotations

import re
import unicodedata
from collections.abc import Iterable

import pandas as pd
import polars as pl

from packages.data.validation import assert_unique_key, require_columns

CANONICAL_ID_COLUMN = "canonical_player_id"
NORMALIZED_NAME_COLUMN = "normalized_player_name"
ENTITY_TYPE_COLUMN = "entity_type"

PLAYER_ENTITY = "player"
DST_ENTITY = "dst"

POSITION_NORMALIZATION_MAP: dict[str, str] = {
    "QB": "QB",
    "RB": "RB",
    "WR": "WR",
    "TE": "TE",
    "K": "K",
    "DST": "DST",
    "DEF": "DST",
    "D/ST": "DST",
}

_SUFFIX_PATTERN = re.compile(r"\b(jr|sr|ii|iii|iv|v)\b", flags=re.IGNORECASE)
_MULTI_SPACE_PATTERN = re.compile(r"\s+")
_NON_WORD_SPACE_HYPHEN_SLASH_PATTERN = re.compile(r"[^a-z0-9\s\-/]")
_DST_TOKEN_PATTERN = re.compile(r"\b(?:d\s*/\s*st|dst|defense|def)\b", flags=re.IGNORECASE)

DST_ALIAS_MAP: dict[str, str] = {
    "arizona cardinals": "arizona_cardinals",
    "atlanta falcons": "atlanta_falcons",
    "baltimore ravens": "baltimore_ravens",
    "buffalo bills": "buffalo_bills",
    "carolina panthers": "carolina_panthers",
    "chicago bears": "chicago_bears",
    "cincinnati bengals": "cincinnati_bengals",
    "cleveland browns": "cleveland_browns",
    "dallas cowboys": "dallas_cowboys",
    "denver broncos": "denver_broncos",
    "detroit lions": "detroit_lions",
    "green bay packers": "green_bay_packers",
    "houston texans": "houston_texans",
    "indianapolis colts": "indianapolis_colts",
    "jacksonville jaguars": "jacksonville_jaguars",
    "kansas city chiefs": "kansas_city_chiefs",
    "las vegas raiders": "las_vegas_raiders",
    "los angeles chargers": "los_angeles_chargers",
    "los angeles rams": "los_angeles_rams",
    "miami dolphins": "miami_dolphins",
    "minnesota vikings": "minnesota_vikings",
    "new england patriots": "new_england_patriots",
    "new orleans saints": "new_orleans_saints",
    "new york giants": "new_york_giants",
    "new york jets": "new_york_jets",
    "philadelphia eagles": "philadelphia_eagles",
    "pittsburgh steelers": "pittsburgh_steelers",
    "san francisco 49ers": "san_francisco_49ers",
    "seattle seahawks": "seattle_seahawks",
    "tampa bay buccaneers": "tampa_bay_buccaneers",
    "tennessee titans": "tennessee_titans",
    "washington commanders": "washington_commanders",
}

DST_ABBR_MAP: dict[str, str] = {
    "ARI": "arizona_cardinals",
    "ATL": "atlanta_falcons",
    "BAL": "baltimore_ravens",
    "BUF": "buffalo_bills",
    "CAR": "carolina_panthers",
    "CHI": "chicago_bears",
    "CIN": "cincinnati_bengals",
    "CLE": "cleveland_browns",
    "DAL": "dallas_cowboys",
    "DEN": "denver_broncos",
    "DET": "detroit_lions",
    "GB": "green_bay_packers",
    "HOU": "houston_texans",
    "IND": "indianapolis_colts",
    "JAX": "jacksonville_jaguars",
    "KC": "kansas_city_chiefs",
    "LV": "las_vegas_raiders",
    "LAC": "los_angeles_chargers",
    "LAR": "los_angeles_rams",
    "MIA": "miami_dolphins",
    "MIN": "minnesota_vikings",
    "NE": "new_england_patriots",
    "NO": "new_orleans_saints",
    "NYG": "new_york_giants",
    "NYJ": "new_york_jets",
    "PHI": "philadelphia_eagles",
    "PIT": "pittsburgh_steelers",
    "SF": "san_francisco_49ers",
    "SEA": "seattle_seahawks",
    "TB": "tampa_bay_buccaneers",
    "TEN": "tennessee_titans",
    "WAS": "washington_commanders",
}


def normalize_position(value: object) -> str:
    text = str(value).strip().upper()
    return POSITION_NORMALIZA

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

## Testing and Quality Signals

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
  createDraftFromSetup,
  createRosterSlots,
} from "../src/draft-factory.js";

describe("draft room application shell", () => {
  it("renders the league setup and recovery experience", () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain("Build your draft room.");
    expect(html).toContain("Start new draft");
    expect(html).toContain("Import backup");
    expect(html).toContain("Autosaved after every change");
  });

  it("creates a complete engine-backed snake draft from setup", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "ui-test-draft");
    const userTeam = state.teams.find((team) => team.isUser);

    expect(state.order).toHaveLength(DEFAULT_DRAFT_SETUP.teamCount * DEFAULT_DRAFT_SETUP.rounds);
    expect(state.playerPoolIds.length).toBeGreaterThan(state.order.length);
    expect(userTeam?.draftSlot).toBe(DEFAULT_DRAFT_SETUP.userDraftSlot);
    expect(state.status).toBe("not_started");
  });

  it("keeps roster capacity aligned with the selected round count", () => {
    const rosterSlots = createRosterSlots(18);
    const capacity = rosterSlots.reduce((sum, rule) => sum + rule.count, 0);
    const bench = rosterSlots.find((rule) => rule.slot === "BENCH");

    expect(capacity).toBe(18);
    expect(bench?.count).toBe(9);
  });

  it("connects manual selections to live recommendations", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "recommendation-ui-test");
    const draftedPlayerId = state.availablePlayerIds[0]!;
    const nextState = makePick(state, draftedPlayerId);
    const result = recommendPlayers(nextState, { limit: 5 });

    expect(nextState.picks).toHaveLength(1);
    expect(nextState.availablePlayerIds).not.toContain(draftedPlayerId);
    expect(result.recommendations.map((item) => item.playerId)).not.toContain(draftedPlayerId);
    expect(result.recommendations).toHaveLength(5);
  });
});
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

### `packages/draft-engine/tests/serialization.test.ts`

```text
import { describe, expect, it } from "vitest";
import {
  correctPick,
  createDraftState,
  deserializeDraftState,
  makePick,
  serializeDraftState,
  undoLastPick,
} from "@fdi/draft-engine";
import { generatedPlayerRelease, leagueSettings } from "./fixtures.js";

function draftWithHistory() {
  let state = createDraftState({
    draftId: "export-test",
    settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
    playerDataRelease: generatedPlayerRelease(12),
  });
  state = makePick(state, "player-1");
  state = makePick(state, "player-2");
  state = makePick(state, "player-3");
  state = correctPick(state, 1, "player-4");
  return undoLastPick(state);
}

describe("draft export and import", () => {
  it("round-trips a draft through a versioned JSON export", () => {
    const state = draftWithHistory();
    const serialized = serializeDraftState(state, "2026-07-16T15:30:00Z");
    const restored = deserializeDraftState(serialized);

    expect(restored).toEqual(state);
    expect(restored.revision).toBeGreaterThan(restored.picks.length);
  });

  it("stores only source inputs and pick IDs in the export payload", () => {
    const serialized = serializeDraftState(draftWithHistory(), "2026-07-16T15:30:00Z");
    const envelope = JSON.parse(serialized) as Record<string, unknown>;
    const draft = envelope.draft as Record<string, unknown>;

    expect(envelope.schema_version).toBe("1.0");
    expect(draft.pickPlayerIds).toEqual(["player-4", "player-2"]);
    expect(draft).not.toHaveProperty("availablePlayerIds");
    expect(draft).not.toHaveProperty("order");
    expect(draft).not.toHaveProperty("status");
  });

  it("rejects malformed JSON", () => {
    expect(() => deserializeDraftState("{broken-json")).toThrow(/not valid JSON/);
  });

  it("rejects unsupported schema versions", () => {
    const serialized = serializeDraftState(draftWithHistory(), "2026-07-16T15:30:00Z");
    const envelope = JSON.parse(serialized) as Record<string, unknown>;
    envelope.schema_version = "2.0";

    expect(() => deserializeDraftState(JSON.stringify(envelope))).toThrow(/Unsupported/);
  });

  it("rejects a tampered export containing duplicate picks", () => {
    const serialized = serializeDraftState(draftWithHistory(), "2026-07-16T15:30:00Z");
    const envelope = JSON.parse(serialized) as { draft: { pickPlayerIds: string[] } };
    envelope.draft.pickPlayerIds = ["player-4", "player-4"];

    expect(() => deserializeDraftState(JSON.stringify(env

[TRUNCATED]
```

### `packages/draft-engine/tests/state.test.ts`

```text
import { describe, expect, it } from "vitest";
import {
  buildRosterAssignments,
  buildRosters,
  correctPick,
  createDraftState,
  getCurrentOrderSlot,
  getPlayerById,
  makePick,
  undoLastPick,
} from "@fdi/draft-engine";
import {
  fullDraftPlayerRelease,
  generatedPlayerRelease,
  leagueSettings,
  playerDataRelease,
  playerRecord,
} from "./fixtures.js";

describe("draft state transitions", () => {
  it("creates a deterministic initial state", () => {
    const state = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 3 }),
      playerDataRelease: generatedPlayerRelease(20),
    });

    expect(state.status).toBe("not_started");
    expect(state.nextOverallPick).toBe(1);
    expect(state.picks).toEqual([]);
    expect(getCurrentOrderSlot(state)?.teamId).toBe("team-1");
    expect(getPlayerById(state, "player-1")?.canonical_player_id).toBe("player-1");
  });

  it("records picks, advances the clock, and updates rosters", () => {
    const initial = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
      playerDataRelease: generatedPlayerRelease(12),
    });

    const afterOne = makePick(initial, "player-1");
    const afterTwo = makePick(afterOne, "player-2");

    expect(initial.picks).toHaveLength(0);
    expect(afterTwo.status).toBe("in_progress");
    expect(afterTwo.nextOverallPick).toBe(3);
    expect(afterTwo.availablePlayerIds).not.toContain("player-1");
    expect(buildRosters(afterTwo)).toEqual({
      "team-1": ["player-1"],
      "team-2": ["player-2"],
      "team-3": [],
      "team-4": [],
    });
  });

  it("prevents a player from being selected twice", () => {
    const initial = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
      playerDataRelease: generatedPlayerRelease(12),
    });
    const afterOne = makePick(initial, "player-1");

    expect(() => makePick(afterOne, "player-1")).toThrow(/not available/);
  });

  it("undoes the most recent pick and restores availability", () => {
    const initial = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
      playerDataRelease: generatedPlayerRelease(12),
    });
    const afterTwo = makePick(makePick(initial, "player-1"), "player-2");
    const undone = undoLastPick(afterTwo);

    exp

[TRUNCATED]
```

### `packages/recommendation-engine/tests/evaluation.test.ts`

```text
import { describe, expect, it } from "vitest";
import type { DraftState, PlayerPosition } from "@fdi/shared-types";
import type {
  PlayerRecommendation,
  RecommendationComponent,
  RecommendationMetrics,
  RecommendationOptions,
  RecommendationResult,
} from "../src/index.js";
import {
  createRecommendationSnapshotManifest,
  formatRecommendationEvaluationReport,
  runRecommendationEvaluation,
  type RecommendationRunner,
  type RecommendationScenario,
  type RecommendationWeightProfile,
} from "../src/evaluation.js";

const components: RecommendationComponent[] = [
  "baseValue",
  "valueOverReplacement",
  "tierUrgency",
  "rosterNeed",
  "adpValue",
  "expectedAvailability",
  "upside",
  "riskSafety",
];

function metrics(overrides: Partial<RecommendationMetrics> = {}): RecommendationMetrics {
  return {
    baseValue: 50,
    valueOverReplacement: 50,
    tierUrgency: 50,
    rosterNeed: 50,
    adpValue: 50,
    expectedAvailability: 50,
    upside: 50,
    riskSafety: 50,
    ...overrides,
  };
}

function recommendation(
  rank: number,
  playerId: string,
  score: number,
  position: PlayerPosition = "RB",
  metricOverrides: Partial<RecommendationMetrics> = {},
  reasons: string[] = ["Balanced recommendation."],
): PlayerRecommendation {
  return {
    rank,
    playerId,
    displayName: playerId,
    position,
    score,
    metrics: metrics(metricOverrides),
    context: {
      currentOverallPick: 1,
      nextUserPick: 8,
      picksUntilNextUserPick: 7,
      replacementRank: 4,
      replacementProjectedPoints: 150,
      projectedPointsAboveReplacement: 30,
      sameTierRemaining: 1,
    },
    primaryReason: reasons[0]!,
    reasons,
  };
}

const fakeRunner: RecommendationRunner = (
  _state: DraftState,
  options: RecommendationOptions = {},
): RecommendationResult => {
  const riskWeight = options.weights?.riskSafety ?? 0.05;
  const upsideWeight = options.weights?.upside ?? 0.05;
  const rosterWeight = options.weights?.rosterNeed ?? 0.18;
  let recommendations: PlayerRecommendation[];

  if (riskWeight > 0.5) {
    recommendations = [
      recommendation(1, "safe", 82, "RB", { riskSafety: 100 }, ["Safer than the pool."]),
      recommendation(2, "boom", 61, "RB", { riskSafety: 0, upside: 100 }),
    ];
  } else if (upsideWeight > 0.5) {
    recommendations = [
      recommendation(1, "boom", 88, "RB", { upside: 100 }, ["Above-average upside."]),
      recommendation(2, "safe", 60, "RB", { riskSafety: 100 }),
    ];
  } else if (

[TRUNCATED]
```

### `packages/recommendation-engine/tests/fixtures.ts`

```text
import type {
  DraftOrderSlot,
  DraftPick,
  DraftState,
  PlayerDataRecord,
  PlayerPosition,
} from "@fdi/shared-types";

export function player(
  id: string,
  position: PlayerPosition,
  overrides: Partial<PlayerDataRecord> = {},
): PlayerDataRecord {
  return {
    canonical_player_id: id,
    display_name: id.toUpperCase(),
    position,
    nfl_team: "NYJ",
    bye_week: 9,
    overall_rank: 50,
    position_rank: 10,
    adp: 50,
    projected_points: 150,
    tier: 3,
    risk_score: 50,
    upside_score: 50,
    availability_status: null,
    ...overrides,
  };
}

export function draftState(
  players: PlayerDataRecord[],
  options: {
    picks?: DraftPick[];
    nextOverallPick?: number;
    teamCount?: number;
    rounds?: number;
  } = {},
): DraftState {
  const teamCount = options.teamCount ?? 4;
  const rounds = options.rounds ?? 6;
  const teams = Array.from({ length: teamCount }, (_, index) => ({
    teamId: `team-${index + 1}`,
    name: `Team ${index + 1}`,
    draftSlot: index + 1,
    isUser: index === 0,
  }));
  const order: DraftOrderSlot[] = [];

  for (let round = 1; round <= rounds; round += 1) {
    const slots = Array.from({ length: teamCount }, (_, index) => index + 1);
    if (round % 2 === 0) {
      slots.reverse();
    }
    slots.forEach((draftSlot, index) => {
      order.push({
        overallPick: order.length + 1,
        round,
        pickInRound: index + 1,
        teamId: `team-${draftSlot}`,
        draftSlot,
      });
    });
  }

  const picks = options.picks ?? [];
  const availablePlayerIds = players
    .map((item) => item.canonical_player_id)
    .filter((id) => !picks.some((draftPick) => draftPick.playerId === id));

  return {
    draftId: "test-draft",
    settings: {
      leagueName: "Test League",
      teamCount,
      userDraftSlot: 1,
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
      rosterSlots: [
        { slot: "QB", count: 1, eligiblePositions: ["QB"] },
        { slot: "RB", count: 1, eligiblePositions: ["RB"] },
        { slot: "WR", count: 1, eligiblePositions: ["WR"] },
        { slot: "FLEX", count: 1, eligiblePositions: ["RB", "WR", "TE"] },
        {
          slot: "BENCH",
          count: 2,

[TRUNCATED]
```

### `packages/recommendation-engine/tests/recommendation.test.ts`

```text
import { describe, expect, it } from "vitest";
import {
  DEFAULT_RECOMMENDATION_WEIGHTS,
  getReplacementLevels,
  recommendPlayers,
  scorePlayer,
  type RecommendationWeights,
} from "@fdi/recommendation-engine";
import { draftState, pick, player } from "./fixtures.js";

function isolatedWeight(component: keyof RecommendationWeights): RecommendationWeights {
  return {
    baseValue: 0,
    valueOverReplacement: 0,
    tierUrgency: 0,
    rosterNeed: 0,
    adpValue: 0,
    expectedAvailability: 0,
    upside: 0,
    riskSafety: 0,
    [component]: 1,
  };
}

describe("recommendation engine v1", () => {
  it("ranks stronger projected and replacement value first", () => {
    const players = [
      player("rb-elite", "RB", {
        projected_points: 260,
        overall_rank: 4,
        adp: 5,
        tier: 1,
      }),
      player("rb-good", "RB", {
        projected_points: 210,
        overall_rank: 18,
        adp: 20,
        tier: 2,
      }),
      player("rb-replacement", "RB", {
        projected_points: 150,
        overall_rank: 45,
        adp: 48,
        tier: 4,
      }),
      player("wr-good", "WR", {
        projected_points: 205,
        overall_rank: 20,
        adp: 21,
        tier: 2,
      }),
      player("qb-one", "QB", {
        projected_points: 280,
        overall_rank: 35,
        adp: 38,
        tier: 3,
      }),
      player("te-one", "TE", {
        projected_points: 145,
        overall_rank: 55,
        adp: 58,
        tier: 4,
      }),
    ];

    const result = recommendPlayers(draftState(players), { limit: 3 });

    expect(result.recommendations[0]?.playerId).toBe("rb-elite");
    expect(result.recommendations[0]?.context.projectedPointsAboveReplacement).toBeGreaterThan(0);
  });

  it("boosts a position with an unfilled dedicated starter slot", () => {
    const existingRb = player("rb-rostered", "RB", { projected_points: 180 });
    const wrCandidate = player("wr-candidate", "WR", { projected_points: 170 });
    const rbCandidate = player("rb-candidate", "RB", { projected_points: 170 });
    const state = draftState([existingRb, wrCandidate, rbCandidate], {
      picks: [pick(1, existingRb.canonical_player_id, "team-1", "RB")],
      nextOverallPick: 2,
    });

    const result = recommendPlayers(state, {
      limit: 2,
      weights: isolatedWeight("rosterNeed"),
    });

    expect(result.recommendations.map((item) => item.playerId)).toEqual([
      "wr-candidate",
      "rb-candidate",
    ]);
    ex

[TRUNCATED]
```

### `packages/shared-types/tests/player-data-release.test.ts`

```text
import { describe, expect, it } from "vitest";
import { assertPlayerDataRelease, type PlayerDataRelease } from "@fdi/shared-types";

function validRelease(): PlayerDataRelease {
  return {
    schema_version: "1.0",
    season: 2026,
    release_id: "2026-preseason-v1",
    generated_at: "2026-07-16T12:00:00Z",
    sources: ["nflverse"],
    players: [
      {
        canonical_player_id: "josh-allen-qb",
        display_name: "Josh Allen",
        position: "QB",
        nfl_team: "BUF",
        bye_week: 7,
        overall_rank: 24,
        position_rank: 1,
        adp: 27.4,
        projected_points: 372.2,
        tier: 1,
        risk_score: 0.2,
        upside_score: 0.9,
        availability_status: "active",
      },
    ],
  };
}

describe("assertPlayerDataRelease", () => {
  it("accepts a release matching the versioned player contract", () => {
    const release: unknown = validRelease();

    expect(() => assertPlayerDataRelease(release)).not.toThrow();
  });

  it("rejects duplicate canonical player IDs", () => {
    const release = validRelease();
    release.players.push({ ...release.players[0]! });

    expect(() => assertPlayerDataRelease(release)).toThrow(/Duplicate canonical_player_id/);
  });

  it("rejects unsupported positions", () => {
    const release = validRelease() as unknown as Record<string, unknown>;
    const players = release.players as Array<Record<string, unknown>>;
    players[0]!.position = "IDP";

    expect(() => assertPlayerDataRelease(release)).toThrow(/position is unsupported/);
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
