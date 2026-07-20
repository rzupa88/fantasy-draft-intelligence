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
