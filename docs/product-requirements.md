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
