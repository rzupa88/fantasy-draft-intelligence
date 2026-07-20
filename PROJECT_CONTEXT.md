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

## Quickstart and Useful Commands

Potentially useful commands and setup hints found in project files:

```text
A local-first fantasy football draft assistant designed to run on a laptop without relying on Sleeper, Yahoo, ESPN, or another live draft platform.
- Draft state, recommendation logic, and the user interface remain independently testable.
- validation and unit tests
The completed product will be a locally installed desktop application with:
The initial tested format is a 12-team redraft snake league with configurable scoring and roster settings.
- **Testing:** pytest, Vitest, Playwright
pip install -e ".[dev]"
python scripts/build_player_reference.py
pytest
build_player_reference.py
tests/
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
│   ├── local-development.md
│   ├── m2-backlog.md
│   ├── MASTER_PROJECT_PLAN.md
│   ├── product-requirements.md
│   ├── release-criteria.md
│   ├── repository-audit.md
│   ├── roadmap.md
│   ├── SOURCE_INVENTORY.md
│   └── testing-strategy.md
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
│   ├── modeling
│   │   ├── __init__.py
│   │   └── baseline.py
│   └── shared
│       ├── __init__.py
│       └── logging.py
├── scripts
│   ├── bootstrap.py
│   ├── build_player_reference.py
│   ├── build_player_season_warehouse.py
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
├── PROJECT_CONTEXT.md
├── pyproject.toml
└── README.md
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

## M3 — Recommendation engine v1

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
11. Historical and simulated evaluation harness

### Exit criteria

- Recommendations change logically with roster and draft state.
- Every recommendation has a structured explanation.
- Engine output is deterministic for fixed inputs.

## M4 — Local draft-room interface

**Goal:** Make the engine practical during a real draft.

### Deliverables

1. React and Vite application
2. New-draft setup flow
3. Player search and filters
4. Manual pick entry
5. Live draft board
6. Team roster views
7. Recommendation panel
8. Undo and correction interface
9. Keyboard-first workflow
10. Playwright end-to-end tests

### Exit criteria

- A user can complete a draft without developer assistance.
- Common pick entry requires minimal interaction.
- Errors are recoverable and clearly explained.

## M5 — Local persistence and desktop release

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

## Deferred roadmap

After v1.0:

- superflex and two-quarterback formats
- tight-end premium
- auction drafts
- dynasty and keeper logic
- best ball
- automated mock opponents
- Monte Carlo availability modeling
- strategy profiles
- draft replay and post-draft grading

## Implementation order

The next build sequence is:

1. Define TypeScript domain schemas.
2. Implement snake-order generation.
3. Implement immutable draft-state transitions.
4. Add roster validation.
5. Add undo and correction.
6. Add full-draft fixtures and tests.
7. Define the app-ready player-data contract.
8. Begin recommendation engine v1.

No interface implementation should begin until the draft engine can complete deterministic simulated drafts.
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
from packages.data.ingest.adp import fetch_historical_adp
from packages.data.ingest.nflverse import fetch_weekly_player_data


def test_fetch_historical_adp_returns_dataframe() -> None:
    df = fetch_historical_adp()
    assert not df.empty


def test_fetch_weekly_player_data_returns_dataframe() -> None:
    df = fetch_weekly_player_data([2024])
    assert not df.is_empty()
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

### `packages/data/warehouse/player_season.py`

```text
# packages/data/warehouse/player_season.py
from __future__ import annotations

from pathlib import Path

import pandas as pd

from packages.data.constants import INTERMEDIATE_DATA_DIR
from packages.data.io import write_parquet
from packages.data.validation import assert_unique_key, require_columns

PROCESSED_DATA_DIR = Path("data/processed")

FANTASY_POSITIONS = {"QB", "RB", "WR", "TE"}


def _safe_mode(series: pd.Series):
    non_null = series.dropna()
    if non_null.empty:
        return None
    mode = non_null.mode()
    if mode.empty:
        return non_null.iloc[0]
    return mode.iloc[0]


def _build_adp_position_rank(adp_df: pd.DataFrame) -> pd.DataFrame:
    adp_df = adp_df.copy()

    require_columns(
        adp_df,
        [
            "season",
            "canonical_player_id",
            "position",
            "adp_overall",
        ],
    )

    adp_df = adp_df.sort_values(
        ["season", "position", "adp_overall", "canonical_player_id"]
    ).reset_index(drop=True)

    adp_df["adp_pos_rank"] = adp_df.groupby(["season", "position"]).cumcount() + 1

    return adp_df


def aggregate_nflverse_to_player_season(nflverse_df: pd.DataFrame) -> pd.DataFrame:
    required = [
        "season",
        "canonical_player_id",
        "player_name",
        "normalized_player_name",
        "position",
        "team",
    ]
    require_columns(nflverse_df, required)

    df = nflverse_df.copy()

    # Expected weekly fantasy/stat columns may vary slightly across source versions.
    # We only aggregate columns that actually exist.
    sum_candidates = [
        "fantasy_points_ppr",
        "fantasy_points",
        "completions",
        "attempts",
        "passing_yards",
        "passing_tds",
        "interceptions",
        "carries",
        "rushing_yards",
        "rushing_tds",
        "targets",
        "receptions",
        "receiving_yards",
        "receiving_tds",
    ]
    sum_cols = [c for c in sum_candidates if c in df.columns]

    if "week" in df.columns:
        games_played_series = (
            df.groupby(["season", "canonical_player_id"])["week"].nunique().rename("games_played")
        )
    else:
        games_played_series = (
            df.groupby(["season", "canonical_player_id"]).size().rename("games_played")
        )

    grouped = df.groupby(["season", "canonical_player_id"], dropna=False)

    agg_dict: dict[str, str] = {col: "sum" for col in sum_cols}

    season_df = grouped.agg(agg_dict).reset_index()

    identity_df = grouped.agg(
        player_name=("player_name", _safe_mode),
        normalized_player_name=("normalized_player_name", _safe_mode),
        position=("position", _safe_mode),
        team=("team", _safe_mode),
    ).reset_index()

    season_df = season_df.merge(
        identity_df,
        on=["season", "canonical_player_id"],
        how="left",
        validate="one_to_one",
    )

    season_df = season_df.merge(
        games_played_series.reset_index(),
        on=["season", "canonical_player_id"],
        how="left",
        validate="one_to_one",
    )

    if "fantasy_points_ppr" in season_df.columns:
        season_df["fantasy_points_per_game"] = (
            season_df["fantasy_points_ppr"] / season_df["games_played"]
        ).round(2)
    elif "fantasy_points" in season_df.columns:
        season_df["fantasy_points_per_game"] = (
            season_df["fantasy_points"] / season_df["games_played"]
        ).round(2)
    else:
        season_df["fantasy_poi

[TRUNCATED]
```

### `packages/shared/logging.py`

```text
import logging


def get_logger(name: str) -> logging.Logger:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )
    return logging.getLogger(name)
```

### `scripts/bootstrap.py`

```text
from pathlib import Path

DIRECTORIES = [
    "data/raw",
    "data/intermediate",
    "data/processed",
    "artifacts/figures",
    "artifacts/reports",
    "artifacts/model_cards",
]

for directory in DIRECTORIES:
    Path(directory).mkdir(parents=True, exist_ok=True)

print("Bootstrap complete.")
```

### `scripts/build_player_reference.py`

```text
from __future__ import annotations

from pathlib import Path

import pandas as pd

from packages.data.constants import DEFAULT_PILOT_YEARS, INTERMEDIATE_DATA_DIR
from packages.data.io import read_parquet, write_parquet
from packages.data.player_ids import build_player_reference_table

INTERMEDIATE_DIR = Path(INTERMEDIATE_DATA_DIR)


def _adp_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"adp_historical_{min(years)}_{max(years)}.parquet"


def _nflverse_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"nflverse_player_weekly_{min(years)}_{max(years)}.parquet"


def _reference_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"player_reference_{min(years)}_{max(years)}.parquet"


def main() -> None:
    years = list(DEFAULT_PILOT_YEARS)

    adp = read_parquet(_adp_path(years))
    nflverse = pd.read_parquet(_nflverse_path(years))

    reference = build_player_reference_table([adp, nflverse])
    write_parquet(reference, _reference_path(years))

    print(
        f"Player reference build complete: rows={len(reference)}, "
        f"cols={len(reference.columns)}, years={min(years)}-{max(years)}"
    )


if __name__ == "__main__":
    main()
```

### `scripts/build_player_season_warehouse.py`

```text
# scripts/build_player_season_warehouse.py
from __future__ import annotations

import logging

from packages.data.warehouse.player_season import (
    build_and_write_player_season_warehouse,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


def main() -> None:
    seasons_label = "2023_2024"
    logger.info("Building player-season warehouse for %s", seasons_label)
    df = build_and_write_player_season_warehouse(seasons_label=seasons_label)
    logger.info(
        "Player-season warehouse complete: rows=%s cols=%s",
        len(df),
        len(df.columns),
    )


if __name__ == "__main__":
    main()
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

### `tests/data/test_player_ids.py`

```text
from __future__ import annotations

import pandas as pd
import polars as pl

from packages.data.player_ids import (
    attach_canonical_ids_pandas,
    attach_canonical_ids_polars,
    build_canonical_player_id,
    build_player_reference_table,
    normalize_dst_name,
    normalize_player_name,
)


def test_normalize_player_name_removes_punctuation_and_suffix() -> None:
    assert normalize_player_name("D.J. Moore") == "dj_moore"
    assert normalize_player_name("Kenneth Walker III") == "kenneth_walker"
    assert normalize_player_name("Brian Thomas Jr.") == "brian_thomas"


def test_normalize_dst_name_handles_abbreviation_and_tokens() -> None:
    assert normalize_dst_name("DAL") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys DST") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys D/ST") == "dallas_cowboys"


def test_build_canonical_player_id_is_stable() -> None:
    assert build_canonical_player_id("D.J. Moore", "WR") == "player:dj_moore:WR"
    assert build_canonical_player_id("Kenneth Walker III", "RB") == "player:kenneth_walker:RB"
    assert build_canonical_player_id("Dallas Cowboys DST", "DST") == "dst:dallas_cowboys:DST"


def test_attach_canonical_ids_pandas() -> None:
    df = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    out = attach_canonical_ids_pandas(df)

    assert "canonical_player_id" in out.columns
    assert out.loc[0, "canonical_player_id"] == "player:dj_moore:WR"
    assert out.loc[1, "canonical_player_id"] == "player:kenneth_walker:RB"


def test_attach_canonical_ids_polars() -> None:
    df = pl.DataFrame(
        {
            "player_name": ["Dallas Cowboys DST"],
            "position": ["DST"],
            "source_name": ["fantasypros"],
        }
    )

    out = attach_canonical_ids_polars(df)

    assert "canonical_player_id" in out.columns
    assert out["canonical_player_id"].to_list() == ["dst:dallas_cowboys:DST"]


def test_build_player_reference_table_unifies_cross_source_names() -> None:
    adp = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    nflverse = pd.DataFrame(
        {
            "player_name": ["DJ Moore", "Kenneth Walker"],
            "position": ["WR", "RB"],
            "source_name": ["nflverse", "nflverse"],
        }
    )

    reference = build_player_reference_table([adp, nflverse])

    dj_rows = reference.loc[reference["canonical_player_id"] == "player:dj_moore:WR"]
    kw_rows = reference.loc[reference["canonical_player_id"] == "player:kenneth_walker:RB"]

    assert len(dj_rows) == 2
    assert len(kw_rows) == 2
```

### `tests/data/test_player_season_warehouse.py`

```text
from __future__ import annotations

import pandas as pd

from packages.data.warehouse.player_season import (
    aggregate_nflverse_to_player_season,
    build_player_season_warehouse,
    prepare_adp_player_season,
)


def test_aggregate_nflverse_to_player_season_rolls_up_weekly_rows():
    nflverse_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "week": 1,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 10.0,
                "receiving_yards": 50,
            },
            {
                "season": 2024,
                "week": 2,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 20.0,
                "receiving_yards": 100,
            },
        ]
    )

    result = aggregate_nflverse_to_player_season(nflverse_df)

    assert len(result) == 1
    assert result.loc[0, "games_played"] == 2
    assert result.loc[0, "fantasy_points_ppr"] == 30.0
    assert result.loc[0, "receiving_yards"] == 150
    assert result.loc[0, "fantasy_points_per_game"] == 15.0


def test_prepare_adp_player_season_adds_position_rank():
    adp_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "canonical_player_id": "rb_1",
                "player_name": "RB One",
                "normalized_player_name": "rb one",
                "position": "RB",
                "adp_overall": 5.0,
                "source_name": "fantasypros",
            },
            {
                "season": 2024,
                "canonical_player_id": "rb_2",
                "player_name": "RB Two",
                "normalized_player_name": "rb two",
                "position": "RB",
                "adp_overall": 10.0,
                "source_name": "fantasypros",
            },
        ]
    )

    result = prepare_adp_player_season(adp_df)

    assert len(result) == 2
    assert result.loc[result["canonical_player_id"] == "rb_1", "adp_pos_rank"].iloc[0] == 1
    assert result.loc[result["canonical_player_id"] == "rb_2", "adp_pos_rank"].iloc[0] == 2


def test_build_player_season_warehouse_merges_stats_and_adp():
    nflverse_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "week": 1,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 10.0,
            },
            {
                "season": 2024,
                "week": 2,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 20.0,
            },
        ]
    )

    adp_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position":

[TRUNCATED]
```

## Fantasy Domain Logic Files

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

### `packages/data/warehouse/player_season.py`

```text
# packages/data/warehouse/player_season.py
from __future__ import annotations

from pathlib import Path

import pandas as pd

from packages.data.constants import INTERMEDIATE_DATA_DIR
from packages.data.io import write_parquet
from packages.data.validation import assert_unique_key, require_columns

PROCESSED_DATA_DIR = Path("data/processed")

FANTASY_POSITIONS = {"QB", "RB", "WR", "TE"}


def _safe_mode(series: pd.Series):
    non_null = series.dropna()
    if non_null.empty:
        return None
    mode = non_null.mode()
    if mode.empty:
        return non_null.iloc[0]
    return mode.iloc[0]


def _build_adp_position_rank(adp_df: pd.DataFrame) -> pd.DataFrame:
    adp_df = adp_df.copy()

    require_columns(
        adp_df,
        [
            "season",
            "canonical_player_id",
            "position",
            "adp_overall",
        ],
    )

    adp_df = adp_df.sort_values(
        ["season", "position", "adp_overall", "canonical_player_id"]
    ).reset_index(drop=True)

    adp_df["adp_pos_rank"] = adp_df.groupby(["season", "position"]).cumcount() + 1

    return adp_df


def aggregate_nflverse_to_player_season(nflverse_df: pd.DataFrame) -> pd.DataFrame:
    required = [
        "season",
        "canonical_player_id",
        "player_name",
        "normalized_player_name",
        "position",
        "team",
    ]
    require_columns(nflverse_df, required)

    df = nflverse_df.copy()

    # Expected weekly fantasy/stat columns may vary slightly across source versions.
    # We only aggregate columns that actually exist.
    sum_candidates = [
        "fantasy_points_ppr",
        "fantasy_points",
        "completions",
        "attempts",
        "passing_yards",
        "passing_tds",
        "interceptions",
        "carries",
        "rushing_yards",
        "rushing_tds",
        "targets",
        "receptions",
        "receiving_yards",
        "receiving_tds",
    ]
    sum_cols = [c for c in sum_candidates if c in df.columns]

    if "week" in df.columns:
        games_played_series = (
            df.groupby(["season", "canonical_player_id"])["week"].nunique().rename("games_played")
        )
    else:
        games_played_series = (
            df.groupby(["season", "canonical_player_id"]).size().rename("games_played")
        )

    grouped = df.groupby(["season", "canonical_player_id"], dropna=False)

    agg_dict: dict[str, str] = {col: "sum" for col in sum_cols}

    season_df = grouped.agg(agg_dict).reset_index()

    identity_df = grouped.agg(
        player_name=("player_name", _safe_mode),
        normalized_player_name=("normalized_player_name", _safe_mode),
        position=("position", _safe_mode),
        team=("team", _safe_mode),
    ).reset_index()

    season_df = season_df.merge(
        identity_df,
        on=["season", "canonical_player_id"],
        how="left",
        validate="one_to_one",
    )

    season_df = season_df.merge(
        games_played_series.reset_index(),
        on=["season", "canonical_player_id"],
        how="left",
        validate="one_to_one",
    )

    if "fantasy_points_ppr" in season_df.columns:
        season_df["fantasy_points_per_game"] = (
            season_df["fantasy_points_ppr"] / season_df["games_played"]
        ).round(2)
    elif "fantasy_points" in season_df.columns:
        season_df["fantasy_points_per_game"] = (
            season_df["fantasy_points"] / season_df["games_played"]
        ).round(2)
    else:
        season_df["fantasy_poi

[TRUNCATED]
```

### `scripts/build_player_reference.py`

```text
from __future__ import annotations

from pathlib import Path

import pandas as pd

from packages.data.constants import DEFAULT_PILOT_YEARS, INTERMEDIATE_DATA_DIR
from packages.data.io import read_parquet, write_parquet
from packages.data.player_ids import build_player_reference_table

INTERMEDIATE_DIR = Path(INTERMEDIATE_DATA_DIR)


def _adp_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"adp_historical_{min(years)}_{max(years)}.parquet"


def _nflverse_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"nflverse_player_weekly_{min(years)}_{max(years)}.parquet"


def _reference_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"player_reference_{min(years)}_{max(years)}.parquet"


def main() -> None:
    years = list(DEFAULT_PILOT_YEARS)

    adp = read_parquet(_adp_path(years))
    nflverse = pd.read_parquet(_nflverse_path(years))

    reference = build_player_reference_table([adp, nflverse])
    write_parquet(reference, _reference_path(years))

    print(
        f"Player reference build complete: rows={len(reference)}, "
        f"cols={len(reference.columns)}, years={min(years)}-{max(years)}"
    )


if __name__ == "__main__":
    main()
```

### `scripts/build_player_season_warehouse.py`

```text
# scripts/build_player_season_warehouse.py
from __future__ import annotations

import logging

from packages.data.warehouse.player_season import (
    build_and_write_player_season_warehouse,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


def main() -> None:
    seasons_label = "2023_2024"
    logger.info("Building player-season warehouse for %s", seasons_label)
    df = build_and_write_player_season_warehouse(seasons_label=seasons_label)
    logger.info(
        "Player-season warehouse complete: rows=%s cols=%s",
        len(df),
        len(df.columns),
    )


if __name__ == "__main__":
    main()
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

### `tests/data/test_player_ids.py`

```text
from __future__ import annotations

import pandas as pd
import polars as pl

from packages.data.player_ids import (
    attach_canonical_ids_pandas,
    attach_canonical_ids_polars,
    build_canonical_player_id,
    build_player_reference_table,
    normalize_dst_name,
    normalize_player_name,
)


def test_normalize_player_name_removes_punctuation_and_suffix() -> None:
    assert normalize_player_name("D.J. Moore") == "dj_moore"
    assert normalize_player_name("Kenneth Walker III") == "kenneth_walker"
    assert normalize_player_name("Brian Thomas Jr.") == "brian_thomas"


def test_normalize_dst_name_handles_abbreviation_and_tokens() -> None:
    assert normalize_dst_name("DAL") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys DST") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys D/ST") == "dallas_cowboys"


def test_build_canonical_player_id_is_stable() -> None:
    assert build_canonical_player_id("D.J. Moore", "WR") == "player:dj_moore:WR"
    assert build_canonical_player_id("Kenneth Walker III", "RB") == "player:kenneth_walker:RB"
    assert build_canonical_player_id("Dallas Cowboys DST", "DST") == "dst:dallas_cowboys:DST"


def test_attach_canonical_ids_pandas() -> None:
    df = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    out = attach_canonical_ids_pandas(df)

    assert "canonical_player_id" in out.columns
    assert out.loc[0, "canonical_player_id"] == "player:dj_moore:WR"
    assert out.loc[1, "canonical_player_id"] == "player:kenneth_walker:RB"


def test_attach_canonical_ids_polars() -> None:
    df = pl.DataFrame(
        {
            "player_name": ["Dallas Cowboys DST"],
            "position": ["DST"],
            "source_name": ["fantasypros"],
        }
    )

    out = attach_canonical_ids_polars(df)

    assert "canonical_player_id" in out.columns
    assert out["canonical_player_id"].to_list() == ["dst:dallas_cowboys:DST"]


def test_build_player_reference_table_unifies_cross_source_names() -> None:
    adp = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    nflverse = pd.DataFrame(
        {
            "player_name": ["DJ Moore", "Kenneth Walker"],
            "position": ["WR", "RB"],
            "source_name": ["nflverse", "nflverse"],
        }
    )

    reference = build_player_reference_table([adp, nflverse])

    dj_rows = reference.loc[reference["canonical_player_id"] == "player:dj_moore:WR"]
    kw_rows = reference.loc[reference["canonical_player_id"] == "player:kenneth_walker:RB"]

    assert len(dj_rows) == 2
    assert len(kw_rows) == 2
```

### `tests/data/test_player_season_warehouse.py`

```text
from __future__ import annotations

import pandas as pd

from packages.data.warehouse.player_season import (
    aggregate_nflverse_to_player_season,
    build_player_season_warehouse,
    prepare_adp_player_season,
)


def test_aggregate_nflverse_to_player_season_rolls_up_weekly_rows():
    nflverse_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "week": 1,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 10.0,
                "receiving_yards": 50,
            },
            {
                "season": 2024,
                "week": 2,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 20.0,
                "receiving_yards": 100,
            },
        ]
    )

    result = aggregate_nflverse_to_player_season(nflverse_df)

    assert len(result) == 1
    assert result.loc[0, "games_played"] == 2
    assert result.loc[0, "fantasy_points_ppr"] == 30.0
    assert result.loc[0, "receiving_yards"] == 150
    assert result.loc[0, "fantasy_points_per_game"] == 15.0


def test_prepare_adp_player_season_adds_position_rank():
    adp_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "canonical_player_id": "rb_1",
                "player_name": "RB One",
                "normalized_player_name": "rb one",
                "position": "RB",
                "adp_overall": 5.0,
                "source_name": "fantasypros",
            },
            {
                "season": 2024,
                "canonical_player_id": "rb_2",
                "player_name": "RB Two",
                "normalized_player_name": "rb two",
                "position": "RB",
                "adp_overall": 10.0,
                "source_name": "fantasypros",
            },
        ]
    )

    result = prepare_adp_player_season(adp_df)

    assert len(result) == 2
    assert result.loc[result["canonical_player_id"] == "rb_1", "adp_pos_rank"].iloc[0] == 1
    assert result.loc[result["canonical_player_id"] == "rb_2", "adp_pos_rank"].iloc[0] == 2


def test_build_player_season_warehouse_merges_stats_and_adp():
    nflverse_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "week": 1,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 10.0,
            },
            {
                "season": 2024,
                "week": 2,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 20.0,
            },
        ]
    )

    adp_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position":

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

### `packages/data/warehouse/player_season.py`

```text
# packages/data/warehouse/player_season.py
from __future__ import annotations

from pathlib import Path

import pandas as pd

from packages.data.constants import INTERMEDIATE_DATA_DIR
from packages.data.io import write_parquet
from packages.data.validation import assert_unique_key, require_columns

PROCESSED_DATA_DIR = Path("data/processed")

FANTASY_POSITIONS = {"QB", "RB", "WR", "TE"}


def _safe_mode(series: pd.Series):
    non_null = series.dropna()
    if non_null.empty:
        return None
    mode = non_null.mode()
    if mode.empty:
        return non_null.iloc[0]
    return mode.iloc[0]


def _build_adp_position_rank(adp_df: pd.DataFrame) -> pd.DataFrame:
    adp_df = adp_df.copy()

    require_columns(
        adp_df,
        [
            "season",
            "canonical_player_id",
            "position",
            "adp_overall",
        ],
    )

    adp_df = adp_df.sort_values(
        ["season", "position", "adp_overall", "canonical_player_id"]
    ).reset_index(drop=True)

    adp_df["adp_pos_rank"] = adp_df.groupby(["season", "position"]).cumcount() + 1

    return adp_df


def aggregate_nflverse_to_player_season(nflverse_df: pd.DataFrame) -> pd.DataFrame:
    required = [
        "season",
        "canonical_player_id",
        "player_name",
        "normalized_player_name",
        "position",
        "team",
    ]
    require_columns(nflverse_df, required)

    df = nflverse_df.copy()

    # Expected weekly fantasy/stat columns may vary slightly across source versions.
    # We only aggregate columns that actually exist.
    sum_candidates = [
        "fantasy_points_ppr",
        "fantasy_points",
        "completions",
        "attempts",
        "passing_yards",
        "passing_tds",
        "interceptions",
        "carries",
        "rushing_yards",
        "rushing_tds",
        "targets",
        "receptions",
        "receiving_yards",
        "receiving_tds",
    ]
    sum_cols = [c for c in sum_candidates if c in df.columns]

    if "week" in df.columns:
        games_played_series = (
            df.groupby(["season", "canonical_player_id"])["week"].nunique().rename("games_played")
        )
    else:
        games_played_series = (
            df.groupby(["season", "canonical_player_id"]).size().rename("games_played")
        )

    grouped = df.groupby(["season", "canonical_player_id"], dropna=False)

    agg_dict: dict[str, str] = {col: "sum" for col in sum_cols}

    season_df = grouped.agg(agg_dict).reset_index()

    identity_df = grouped.agg(
        player_name=("player_name", _safe_mode),
        normalized_player_name=("normalized_player_name", _safe_mode),
        position=("position", _safe_mode),
        team=("team", _safe_mode),
    ).reset_index()

    season_df = season_df.merge(
        identity_df,
        on=["season", "canonical_player_id"],
        how="left",
        validate="one_to_one",
    )

    season_df = season_df.merge(
        games_played_series.reset_index(),
        on=["season", "canonical_player_id"],
        how="left",
        validate="one_to_one",
    )

    if "fantasy_points_ppr" in season_df.columns:
        season_df["fantasy_points_per_game"] = (
            season_df["fantasy_points_ppr"] / season_df["games_played"]
        ).round(2)
    elif "fantasy_points" in season_df.columns:
        season_df["fantasy_points_per_game"] = (
            season_df["fantasy_points"] / season_df["games_played"]
        ).round(2)
    else:
        season_df["fantasy_poi

[TRUNCATED]
```

## Testing and Quality Signals

### `tests/test_smoke.py`

```text
from packages.data.ingest.adp import fetch_historical_adp
from packages.data.ingest.nflverse import fetch_weekly_player_data


def test_fetch_historical_adp_returns_dataframe() -> None:
    df = fetch_historical_adp()
    assert not df.empty


def test_fetch_weekly_player_data_returns_dataframe() -> None:
    df = fetch_weekly_player_data([2024])
    assert not df.is_empty()
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


def test_ingest_historical_adp_writes_raw_and_in

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

### `tests/data/test_player_ids.py`

```text
from __future__ import annotations

import pandas as pd
import polars as pl

from packages.data.player_ids import (
    attach_canonical_ids_pandas,
    attach_canonical_ids_polars,
    build_canonical_player_id,
    build_player_reference_table,
    normalize_dst_name,
    normalize_player_name,
)


def test_normalize_player_name_removes_punctuation_and_suffix() -> None:
    assert normalize_player_name("D.J. Moore") == "dj_moore"
    assert normalize_player_name("Kenneth Walker III") == "kenneth_walker"
    assert normalize_player_name("Brian Thomas Jr.") == "brian_thomas"


def test_normalize_dst_name_handles_abbreviation_and_tokens() -> None:
    assert normalize_dst_name("DAL") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys DST") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys D/ST") == "dallas_cowboys"


def test_build_canonical_player_id_is_stable() -> None:
    assert build_canonical_player_id("D.J. Moore", "WR") == "player:dj_moore:WR"
    assert build_canonical_player_id("Kenneth Walker III", "RB") == "player:kenneth_walker:RB"
    assert build_canonical_player_id("Dallas Cowboys DST", "DST") == "dst:dallas_cowboys:DST"


def test_attach_canonical_ids_pandas() -> None:
    df = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    out = attach_canonical_ids_pandas(df)

    assert "canonical_player_id" in out.columns
    assert out.loc[0, "canonical_player_id"] == "player:dj_moore:WR"
    assert out.loc[1, "canonical_player_id"] == "player:kenneth_walker:RB"


def test_attach_canonical_ids_polars() -> None:
    df = pl.DataFrame(
        {
            "player_name": ["Dallas Cowboys DST"],
            "position": ["DST"],
            "source_name": ["fantasypros"],
        }
    )

    out = attach_canonical_ids_polars(df)

    assert "canonical_player_id" in out.columns
    assert out["canonical_player_id"].to_list() == ["dst:dallas_cowboys:DST"]


def test_build_player_reference_table_unifies_cross_source_names() -> None:
    adp = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    nflverse = pd.DataFrame(
        {
            "player_name": ["DJ Moore", "Kenneth Walker"],
            "position": ["WR", "

[TRUNCATED]
```

### `tests/data/test_player_season_warehouse.py`

```text
from __future__ import annotations

import pandas as pd

from packages.data.warehouse.player_season import (
    aggregate_nflverse_to_player_season,
    build_player_season_warehouse,
    prepare_adp_player_season,
)


def test_aggregate_nflverse_to_player_season_rolls_up_weekly_rows():
    nflverse_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "week": 1,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 10.0,
                "receiving_yards": 50,
            },
            {
                "season": 2024,
                "week": 2,
                "canonical_player_id": "player_1",
                "player_name": "A Player",
                "normalized_player_name": "a player",
                "position": "WR",
                "team": "BUF",
                "fantasy_points_ppr": 20.0,
                "receiving_yards": 100,
            },
        ]
    )

    result = aggregate_nflverse_to_player_season(nflverse_df)

    assert len(result) == 1
    assert result.loc[0, "games_played"] == 2
    assert result.loc[0, "fantasy_points_ppr"] == 30.0
    assert result.loc[0, "receiving_yards"] == 150
    assert result.loc[0, "fantasy_points_per_game"] == 15.0


def test_prepare_adp_player_season_adds_position_rank():
    adp_df = pd.DataFrame(
        [
            {
                "season": 2024,
                "canonical_player_id": "rb_1",
                "player_name": "RB One",
                "normalized_player_name": "rb one",
                "position": "RB",
                "adp_overall": 5.0,
                "source_name": "fantasypros",
            },
            {
                "season": 2024,
                "canonical_player_id": "rb_2",
                "player_name": "RB Two",
                "normalized_player_name": "rb two",
                "position": "RB",
                "adp_overall": 10.0,
                "source_name": "fantasypros",
            },
        ]
    )

    result = prepare_adp_player_season(adp_df)

    assert len(result) == 2
    assert result.loc[result["canonical_player_id"] == "rb_1", "adp_pos_rank"].iloc[0] == 1
    assert result.loc[result["canonical_player_id"] == "rb_2", "adp_pos_rank"].iloc[0] == 2


def test_build_player_season_warehouse_merges_stats_and_adp():
    nfl

[TRUNCATED]
```

## Open Implementation Notes

Use this file as the primary project snapshot for ChatGPT. Prefer relying on:
1. project summary and docs for intent
2. root config files for setup and tooling
3. fantasy domain logic files for business rules
4. data pipeline files for source-of-truth data flow

If responses start feeling stale, regenerate this file and re-upload it to the Project.
