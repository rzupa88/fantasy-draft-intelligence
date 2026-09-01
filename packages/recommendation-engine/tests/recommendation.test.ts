import { describe, expect, it } from "vitest";
import {
  DEFAULT_RECOMMENDATION_WEIGHTS,
  getReplacementLevels,
  recommendPlayers,
  scorePlayer,
  type RecommendationWeights,
} from "@fdi/recommendation-engine";
import { draftState, pick, player } from "./fixtures.js";

function isolatedWeight(component: keyof RecommendationWeights): RecommendationWeights {
  return {
    baseValue: 0,
    valueOverReplacement: 0,
    tierUrgency: 0,
    rosterNeed: 0,
    adpValue: 0,
    expectedAvailability: 0,
    upside: 0,
    riskSafety: 0,
    [component]: 1,
  };
}

describe("recommendation engine v1", () => {
  it("ranks stronger projected and replacement value first", () => {
    const players = [
      player("rb-elite", "RB", {
        projected_points: 260,
        overall_rank: 4,
        adp: 5,
        tier: 1,
      }),
      player("rb-good", "RB", {
        projected_points: 210,
        overall_rank: 18,
        adp: 20,
        tier: 2,
      }),
      player("rb-replacement", "RB", {
        projected_points: 150,
        overall_rank: 45,
        adp: 48,
        tier: 4,
      }),
      player("wr-good", "WR", {
        projected_points: 205,
        overall_rank: 20,
        adp: 21,
        tier: 2,
      }),
      player("qb-one", "QB", {
        projected_points: 280,
        overall_rank: 35,
        adp: 38,
        tier: 3,
      }),
      player("te-one", "TE", {
        projected_points: 145,
        overall_rank: 55,
        adp: 58,
        tier: 4,
      }),
    ];

    const result = recommendPlayers(draftState(players), { limit: 3 });

    expect(result.recommendations[0]?.playerId).toBe("rb-elite");
    expect(result.recommendations[0]?.context.projectedPointsAboveReplacement).toBeGreaterThan(0);
  });

  it("boosts a position with an unfilled dedicated starter slot", () => {
    const existingRb = player("rb-rostered", "RB", { projected_points: 180 });
    const wrCandidate = player("wr-candidate", "WR", { projected_points: 170 });
    const rbCandidate = player("rb-candidate", "RB", { projected_points: 170 });
    const state = draftState([existingRb, wrCandidate, rbCandidate], {
      picks: [pick(1, existingRb.canonical_player_id, "team-1", "RB")],
      nextOverallPick: 2,
    });

    const result = recommendPlayers(state, {
      limit: 2,
      weights: isolatedWeight("rosterNeed"),
    });

    expect(result.recommendations.map((item) => item.playerId)).toEqual([
      "wr-candidate",
      "rb-candidate",
    ]);
    expect(result.recommendations[0]?.primaryReason).toMatch(/WR starting need/);
  });

  it("identifies the last player in a positional tier", () => {
    const players = [
      player("wr-tier-one", "WR", { tier: 1, projected_points: 210 }),
      player("wr-tier-two-a", "WR", { tier: 2, projected_points: 200 }),
      player("wr-tier-two-b", "WR", { tier: 2, projected_points: 198 }),
    ];

    const result = recommendPlayers(draftState(players), {
      limit: 3,
      weights: isolatedWeight("tierUrgency"),
    });

    expect(result.recommendations[0]?.playerId).toBe("wr-tier-one");
    expect(result.recommendations[0]?.metrics.tierUrgency).toBe(100);
    expect(result.recommendations[0]?.primaryReason).toMatch(/Only 1 WR/);
  });

  it("rewards players who have fallen past market ADP", () => {
    const players = [
      player("fallen", "RB", { adp: 45, projected_points: 180 }),
      player("reach", "RB", { adp: 5, projected_points: 180 }),
    ];
    const state = draftState(players, { nextOverallPick: 25 });
    const result = recommendPlayers(state, {
      limit: 2,
      weights: isolatedWeight("adpValue"),
    });

    expect(result.recommendations[0]?.playerId).toBe("fallen");
    expect(result.recommendations[0]?.metrics.adpValue).toBeGreaterThan(50);
    expect(result.recommendations[1]?.metrics.adpValue).toBeLessThan(50);
  });

  it("uses the next user selection to estimate availability urgency", () => {
    const players = [
      player("unlikely-return", "WR", { adp: 3 }),
      player("likely-return", "WR", { adp: 18 }),
    ];
    const state = draftState(players, { nextOverallPick: 1 });
    const result = recommendPlayers(state, {
      limit: 2,
      weights: isolatedWeight("expectedAvailability"),
    });

    expect(result.nextUserPick).toBe(8);
    expect(result.recommendations[0]?.playerId).toBe("unlikely-return");
    expect(result.recommendations[0]?.primaryReason).toMatch(/pick 8/);
  });

  it("favors a shallow RB pool over an early QB when comparable QB value can wait", () => {
    const players = [
      player("qb-elite", "QB", {
        projected_points: 330,
        overall_rank: 8,
        adp: 7,
        tier: 1,
      }),
      player("qb-later-a", "QB", {
        projected_points: 315,
        overall_rank: 35,
        adp: 24,
        tier: 2,
      }),
      player("qb-later-b", "QB", {
        projected_points: 305,
        overall_rank: 50,
        adp: 38,
        tier: 2,
      }),
      player("rb-elite", "RB", {
        projected_points: 255,
        overall_rank: 9,
        adp: 8,
        tier: 1,
      }),
      player("rb-later-a", "RB", {
        projected_points: 190,
        overall_rank: 25,
        adp: 18,
        tier: 3,
      }),
      player("rb-later-b", "RB", {
        projected_points: 175,
        overall_rank: 40,
        adp: 30,
        tier: 4,
      }),
    ];

    const result = recommendPlayers(draftState(players, { nextOverallPick: 1 }), { limit: 6 });
    const qb = result.recommendations.find((item) => item.playerId === "qb-elite");
    const rb = result.recommendations.find((item) => item.playerId === "rb-elite");

    expect(result.recommendations[0]?.playerId).toBe("rb-elite");
    expect(rb?.context.opportunityCost).toBeGreaterThan(qb?.context.opportunityCost ?? 0);
    expect(qb?.context.expectedNextPickPositionValue).toBeGreaterThan(0);
  });

  it("reports a larger wait penalty when same-position alternatives are unlikely to survive", () => {
    const players = [
      player("wr-now", "WR", { projected_points: 230, adp: 5, tier: 1 }),
      player("wr-soon", "WR", { projected_points: 210, adp: 6, tier: 2 }),
      player("wr-late", "WR", { projected_points: 170, adp: 30, tier: 4 }),
      player("qb-now", "QB", { projected_points: 320, adp: 5, tier: 1 }),
      player("qb-late", "QB", { projected_points: 305, adp: 30, tier: 2 }),
    ];

    const result = recommendPlayers(draftState(players, { nextOverallPick: 1 }), { limit: 5 });
    const wr = result.recommendations.find((item) => item.playerId === "wr-now");
    const qb = result.recommendations.find((item) => item.playerId === "qb-now");

    expect(wr?.context.valueLostByWaiting).toBeGreaterThan(qb?.context.valueLostByWaiting ?? 0);
    expect(wr?.context.opportunityCost).toBeGreaterThan(qb?.context.opportunityCost ?? 0);
  });

  it("never recommends a drafted player and remains deterministic", () => {
    const drafted = player("already-drafted", "RB", { projected_points: 300 });
    const available = player("available", "WR", { projected_points: 180 });
    const state = draftState([drafted, available], {
      picks: [pick(1, drafted.canonical_player_id, "team-1", "RB")],
      nextOverallPick: 2,
    });

    const first = recommendPlayers(state);
    const second = recommendPlayers(state);

    expect(first).toEqual(second);
    expect(first.recommendations.map((item) => item.playerId)).toEqual(["available"]);
  });

  it("returns bounded component scores and explanations", () => {
    const players = [
      player("option-a", "RB", {
        projected_points: 220,
        risk_score: 10,
        upside_score: 90,
      }),
      player("option-b", "WR", {
        projected_points: 180,
        risk_score: 90,
        upside_score: 10,
      }),
    ];
    const recommendation = scorePlayer(draftState(players), "option-a");

    expect(recommendation.score).toBeGreaterThanOrEqual(0);
    expect(recommendation.score).toBeLessThanOrEqual(100);
    expect(
      Object.values(recommendation.metrics).every((value) => value >= 0 && value <= 100),
    ).toBe(true);
    expect(recommendation.reasons.length).toBeGreaterThan(0);
  });

  it("calculates starter-based replacement levels by position", () => {
    const players = [
      ...Array.from({ length: 8 }, (_, index) =>
        player(`rb-${index + 1}`, "RB", { projected_points: 220 - index * 10 }),
      ),
      ...Array.from({ length: 4 }, (_, index) =>
        player(`qb-${index + 1}`, "QB", { projected_points: 280 - index * 10 }),
      ),
    ];
    const levels = getReplacementLevels(draftState(players));
    const rb = levels.find((level) => level.position === "RB");
    const qb = levels.find((level) => level.position === "QB");

    expect(qb?.replacementRank).toBe(4);
    expect(rb?.replacementRank).toBe(6);
    expect(rb?.playerId).toBe("rb-6");
  });

  it("supports explicit weight overrides without mutating defaults", () => {
    const players = [
      player("safe", "RB", { risk_score: 1, projected_points: 170 }),
      player("risky", "RB", { risk_score: 99, projected_points: 200 }),
    ];
    const result = recommendPlayers(draftState(players), {
      limit: 2,
      weights: isolatedWeight("riskSafety"),
    });

    expect(result.recommendations[0]?.playerId).toBe("safe");
    expect(DEFAULT_RECOMMENDATION_WEIGHTS.baseValue).toBe(0.22);
  });

  it("rejects invalid limits and empty weight configurations", () => {
    const state = draftState([player("one", "RB")]);

    expect(() => recommendPlayers(state, { limit: 0 })).toThrow(/limit/);
    expect(() =>
      recommendPlayers(state, {
        weights: {
          baseValue: 0,
          valueOverReplacement: 0,
          tierUrgency: 0,
          rosterNeed: 0,
          adpValue: 0,
          expectedAvailability: 0,
          upside: 0,
          riskSafety: 0,
        },
      }),
    ).toThrow(/At least one/);
  });
});
