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
