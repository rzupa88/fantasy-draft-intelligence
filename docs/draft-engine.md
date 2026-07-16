# Draft Engine Core

## Scope

Milestone 2 begins with a deterministic TypeScript domain engine. It has no dependency on React, Tauri, SQLite, or a recommendation model.

## Packages

- `@fdi/shared-types` owns the versioned player-data contract and shared league/draft types.
- `@fdi/draft-engine` owns snake order, pick transitions, availability, roster assignment, undo, and correction.

## State invariants

1. Draft order contains exactly `teamCount * rounds` slots.
2. Every order slot has a unique overall pick.
3. Pick history is always a contiguous prefix of the generated order.
4. A player can appear in pick history at most once.
5. Available players are derived from the immutable initial player pool minus drafted players.
6. Undo and correction return a new state and do not mutate prior state.
7. `nextOverallPick` is `null` only when the draft is complete.
8. State transitions increment `revision`.

## Public operations

- `createDraftTeams`
- `generateSnakeDraftOrder`
- `createDraftState`
- `makePick`
- `undoLastPick`
- `correctPick`
- `getCurrentOrderSlot`
- `buildRosters`

## Error behavior

Expected domain failures use `DraftEngineError` with a stable code. Examples include invalid settings, duplicate or unavailable players, missing picks, and attempts to continue a completed draft.

## Current limits

This first core tracks players by canonical ID and roster by team. Position-slot legality and lineup allocation are intentionally deferred to the next draft-engine increment, when the engine consumes the full player catalog rather than IDs alone.

## Validation

The regression suite includes:

- odd/even snake order
- user-team identification
- invalid league settings
- pick sequencing
- duplicate prevention
- roster assignment
- undo
- earlier-pick correction
- a complete 12-team, 16-round, 192-pick simulation
- player-data release validation
