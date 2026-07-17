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
