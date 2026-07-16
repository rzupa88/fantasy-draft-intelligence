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
