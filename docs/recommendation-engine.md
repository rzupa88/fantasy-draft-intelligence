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
