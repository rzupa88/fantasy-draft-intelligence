import { describe, expect, it } from "vitest";
import type { DraftState, PlayerPosition } from "@fdi/shared-types";
import type {
  PlayerRecommendation,
  RecommendationComponent,
  RecommendationMetrics,
  RecommendationOptions,
  RecommendationResult,
} from "../src/index.js";
import {
  createRecommendationSnapshotManifest,
  formatRecommendationEvaluationReport,
  runRecommendationEvaluation,
  type RecommendationRunner,
  type RecommendationScenario,
  type RecommendationWeightProfile,
} from "../src/evaluation.js";

const components: RecommendationComponent[] = [
  "baseValue",
  "valueOverReplacement",
  "tierUrgency",
  "rosterNeed",
  "adpValue",
  "expectedAvailability",
  "upside",
  "riskSafety",
];

function metrics(overrides: Partial<RecommendationMetrics> = {}): RecommendationMetrics {
  return {
    baseValue: 50,
    valueOverReplacement: 50,
    tierUrgency: 50,
    rosterNeed: 50,
    adpValue: 50,
    expectedAvailability: 50,
    upside: 50,
    riskSafety: 50,
    ...overrides,
  };
}

function recommendation(
  rank: number,
  playerId: string,
  score: number,
  position: PlayerPosition = "RB",
  metricOverrides: Partial<RecommendationMetrics> = {},
  reasons: string[] = ["Balanced recommendation."],
): PlayerRecommendation {
  return {
    rank,
    playerId,
    displayName: playerId,
    position,
    score,
    metrics: metrics(metricOverrides),
    context: {
      currentOverallPick: 1,
      nextUserPick: 8,
      picksUntilNextUserPick: 7,
      replacementRank: 4,
      replacementProjectedPoints: 150,
      projectedPointsAboveReplacement: 30,
      sameTierRemaining: 1,
    },
    primaryReason: reasons[0]!,
    reasons,
  };
}

const fakeRunner: RecommendationRunner = (
  _state: DraftState,
  options: RecommendationOptions = {},
): RecommendationResult => {
  const riskWeight = options.weights?.riskSafety ?? 0.05;
  const upsideWeight = options.weights?.upside ?? 0.05;
  const rosterWeight = options.weights?.rosterNeed ?? 0.18;
  let recommendations: PlayerRecommendation[];

  if (riskWeight > 0.5) {
    recommendations = [
      recommendation(1, "safe", 82, "RB", { riskSafety: 100 }, ["Safer than the pool."]),
      recommendation(2, "boom", 61, "RB", { riskSafety: 0, upside: 100 }),
    ];
  } else if (upsideWeight > 0.5) {
    recommendations = [
      recommendation(1, "boom", 88, "RB", { upside: 100 }, ["Above-average upside."]),
      recommendation(2, "safe", 60, "RB", { riskSafety: 100 }),
    ];
  } else if (rosterWeight > 0.5) {
    recommendations = [
      recommendation(1, "need-wr", 84, "WR", { rosterNeed: 100 }, [
        "Fills an open WR starting need.",
      ]),
      recommendation(2, "depth-rb", 58, "RB", { rosterNeed: 25 }),
    ];
  } else {
    recommendations = [
      recommendation(1, "alpha", 90, "RB", { valueOverReplacement: 95 }, [
        "Projects above replacement level.",
      ]),
      recommendation(2, "beta", 75, "WR"),
    ];
  }

  const limit = options.limit ?? recommendations.length;
  return {
    teamId: options.teamId ?? "team-1",
    currentOverallPick: 1,
    nextUserPick: 8,
    recommendations: recommendations.slice(0, limit).map((item, index) => ({
      ...item,
      rank: index + 1,
    })),
  };
};

function state(): DraftState {
  return {
    draftId: "evaluation-test",
    settings: {
      leagueName: "Test",
      teamCount: 2,
      userDraftSlot: 1,
      rounds: 1,
      scoring: {
        preset: "half_ppr",
        passingYardsPerPoint: 25,
        passingTouchdown: 4,
        interception: -2,
        rushingYardsPerPoint: 10,
        rushingTouchdown: 6,
        receivingYardsPerPoint: 10,
        receivingTouchdown: 6,
        reception: 0.5,
        fumbleLost: -2,
      },
      rosterSlots: [
        {
          slot: "BENCH",
          count: 1,
          eligiblePositions: ["QB", "RB", "WR", "TE", "K", "DST"],
        },
      ],
    },
    teams: [
      { teamId: "team-1", name: "Team 1", draftSlot: 1, isUser: true },
      { teamId: "team-2", name: "Team 2", draftSlot: 2, isUser: false },
    ],
    order: [
      { overallPick: 1, round: 1, pickInRound: 1, teamId: "team-1", draftSlot: 1 },
      { overallPick: 2, round: 1, pickInRound: 2, teamId: "team-2", draftSlot: 2 },
    ],
    playerDataRelease: {
      schema_version: "1.0",
      season: 2026,
      release_id: "test",
      generated_at: "2026-07-17T12:00:00.000Z",
      sources: ["test"],
      players: [],
    },
    playerPoolIds: ["alpha", "beta", "safe", "boom", "need-wr", "depth-rb"],
    availablePlayerIds: ["alpha", "beta", "safe", "boom", "need-wr", "depth-rb"],
    picks: [],
    nextOverallPick: 1,
    status: "not_started",
    revision: 0,
  };
}

const profiles: RecommendationWeightProfile[] = [
  { id: "default", label: "Default" },
  { id: "roster", label: "Roster", weights: { rosterNeed: 1 } },
  { id: "upside", label: "Upside", weights: { upside: 1 } },
  { id: "safety", label: "Safety", weights: { riskSafety: 1 } },
];

describe("recommendation evaluation harness", () => {
  it("runs baseline and profile-specific expectations", () => {
    const scenario: RecommendationScenario = {
      id: "profile-behavior",
      name: "Profile behavior",
      description: "Different profiles should change the leader.",
      state: state(),
      limit: 2,
      expectations: [
        { kind: "top_player", playerId: "alpha" },
        {
          kind: "metric_at_least",
          playerId: "alpha",
          component: "valueOverReplacement",
          minimum: 90,
        },
        { kind: "top_player", profileId: "roster", playerId: "need-wr" },
        {
          kind: "reason_contains",
          profileId: "roster",
          playerId: "need-wr",
          text: "WR starting need",
        },
        { kind: "top_player", profileId: "upside", playerId: "boom" },
        { kind: "top_player", profileId: "safety", playerId: "safe" },
      ],
    };

    const report = runRecommendationEvaluation([scenario], {
      profiles,
      baselineProfileId: "default",
      recommend: fakeRunner,
    });

    expect(report.passed).toBe(true);
    expect(report.summary).toMatchObject({ totalChecks: 6, failedChecks: 0 });
    expect(report.comparisons[0]?.topPlayerChanged).toBe(true);
  });

  it("returns useful failure details instead of throwing on a regression", () => {
    const report = runRecommendationEvaluation(
      [
        {
          id: "failure",
          name: "Expected failure",
          description: "The expected player is intentionally wrong.",
          state: state(),
          expectations: [{ kind: "top_player", playerId: "wrong-player" }],
        },
      ],
      { recommend: fakeRunner },
    );

    expect(report.passed).toBe(false);
    expect(report.summary.failedChecks).toBe(1);
    expect(report.evaluations[0]?.checks[0]).toMatchObject({
      passed: false,
      expected: "wrong-player",
      actual: "alpha",
    });
  });

  it("creates deterministic score snapshots and manifests", () => {
    const scenario: RecommendationScenario = {
      id: "snapshot",
      name: "Snapshot",
      description: "Snapshot output should be stable.",
      state: state(),
      expectations: [{ kind: "ranking_starts_with", playerIds: ["alpha", "beta"] }],
    };
    const first = runRecommendationEvaluation([scenario], { recommend: fakeRunner });
    const second = runRecommendationEvaluation([scenario], { recommend: fakeRunner });

    expect(createRecommendationSnapshotManifest(first)).toEqual(
      createRecommendationSnapshotManifest(second),
    );
    expect(first.evaluations[0]?.snapshot.recommendations[0]).toMatchObject({
      playerId: "alpha",
      score: 90,
    });
  });

  it("formats a readable markdown report", () => {
    const report = runRecommendationEvaluation(
      [
        {
          id: "markdown",
          name: "Markdown report",
          description: "Produces a report.",
          state: state(),
          expectations: [{ kind: "includes_player", playerId: "alpha" }],
        },
      ],
      { recommend: fakeRunner },
    );
    const markdown = formatRecommendationEvaluationReport(report);

    expect(markdown).toContain("# Recommendation Evaluation Report");
    expect(markdown).toContain("Checks passed: 1/1");
    expect(markdown).toContain("Markdown report");
  });

  it("rejects duplicate scenario and profile identifiers", () => {
    const scenario: RecommendationScenario = {
      id: "duplicate",
      name: "Duplicate",
      description: "Duplicate validation.",
      state: state(),
      expectations: [{ kind: "includes_player", playerId: "alpha" }],
    };

    expect(() =>
      runRecommendationEvaluation([scenario, scenario], { recommend: fakeRunner }),
    ).toThrow(/Duplicate recommendation scenario/);
    expect(() =>
      runRecommendationEvaluation([scenario], {
        profiles: [profiles[0]!, profiles[0]!],
        recommend: fakeRunner,
      }),
    ).toThrow(/Duplicate recommendation profile/);
    expect(() =>
      runRecommendationEvaluation(
        [
          {
            ...scenario,
            id: "unknown-profile",
            expectations: [
              { kind: "top_player", profileId: "missing", playerId: "alpha" },
            ],
          },
        ],
        { profiles, recommend: fakeRunner },
      ),
    ).toThrow(/unknown recommendation profile/);
  });

  it("keeps all snapshot metrics present", () => {
    const report = runRecommendationEvaluation(
      [
        {
          id: "metric-shape",
          name: "Metric shape",
          description: "All components remain in snapshots.",
          state: state(),
          expectations: [
            { kind: "score_between", playerId: "alpha", minimum: 0, maximum: 100 },
          ],
        },
      ],
      { recommend: fakeRunner },
    );
    const metricKeys = Object.keys(
      report.evaluations[0]!.snapshot.recommendations[0]!.metrics,
    );

    expect(metricKeys.sort()).toEqual([...components].sort());
  });
});
