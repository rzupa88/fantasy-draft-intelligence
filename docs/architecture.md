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
