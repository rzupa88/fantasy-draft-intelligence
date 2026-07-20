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
