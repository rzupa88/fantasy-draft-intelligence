import { describe, expect, it } from "vitest";
import { estimateReturnProbability, recommendPlayers, type RecommendationWeights } from "@fdi/recommendation-engine";
import { draftState, pick, player } from "./fixtures.js";

function availabilityOnly(): RecommendationWeights {
  return {
    baseValue: 0,
    valueOverReplacement: 0,
    tierUrgency: 0,
    rosterNeed: 0,
    adpValue: 0,
    expectedAvailability: 1,
    upside: 0,
    riskSafety: 0,
  };
}

describe("probability of return", () => {
  it("makes a player drafted well before the next user pick highly urgent", () => {
    const target = player("target", "WR", { adp: 4, tier: 2 });
    const state = draftState([target, player("other", "RB", { adp: 20 })], { nextOverallPick: 1 });

    const estimate = estimateReturnProbability(state, target.canonical_player_id);

    expect(estimate.returnProbability).toBeLessThan(0.35);
    expect(estimate.takeNowUrgency).toBeGreaterThan(65);
  });

  it("lets a player with a much later market price remain likely to return", () => {
    const target = player("target", "WR", { adp: 30, tier: 3 });
    const state = draftState([target, player("other", "RB", { adp: 5 })], { nextOverallPick: 1 });

    const estimate = estimateReturnProbability(state, target.canonical_player_id);

    expect(estimate.returnProbability).toBeGreaterThan(0.7);
    expect(estimate.takeNowUrgency).toBeLessThan(30);
  });

  it("reacts to a live positional run", () => {
    const target = player("target", "WR", { adp: 14, tier: 3 });
    const wr1 = player("wr-1", "WR", { adp: 1 });
    const wr2 = player("wr-2", "WR", { adp: 2 });
    const wr3 = player("wr-3", "WR", { adp: 3 });
    const rb = player("rb-1", "RB", { adp: 4 });
    const players = [target, wr1, wr2, wr3, rb];
    const runState = draftState(players, {
      picks: [
        pick(1, wr1.canonical_player_id, "team-1", "WR"),
        pick(2, wr2.canonical_player_id, "team-2", "WR"),
        pick(3, wr3.canonical_player_id, "team-3", "WR"),
        pick(4, rb.canonical_player_id, "team-4", "RB"),
      ],
      nextOverallPick: 5,
    });
    const quietState = draftState([
      target,
      player("qb-1", "QB", { adp: 1 }),
      player("rb-2", "RB", { adp: 2 }),
      player("te-1", "TE", { adp: 3 }),
      rb,
    ], {
      picks: [
        pick(1, "qb-1", "team-1", "QB"),
        pick(2, "rb-2", "team-2", "RB"),
        pick(3, "te-1", "team-3", "TE"),
        pick(4, rb.canonical_player_id, "team-4", "RB"),
      ],
      nextOverallPick: 5,
    });

    const duringRun = estimateReturnProbability(runState, target.canonical_player_id);
    const withoutRun = estimateReturnProbability(quietState, target.canonical_player_id);

    expect(duringRun.recentPositionRun).toBeGreaterThan(withoutRun.recentPositionRun);
    expect(duringRun.returnProbability).toBeLessThan(withoutRun.returnProbability);
  });

  it("learns when the room is drafting earlier than ADP", () => {
    const target = player("target", "RB", { adp: 18, tier: 4 });
    const earlyA = player("early-a", "WR", { adp: 8 });
    const earlyB = player("early-b", "QB", { adp: 10 });
    const earlyC = player("early-c", "TE", { adp: 12 });
    const state = draftState([target, earlyA, earlyB, earlyC], {
      picks: [
        pick(1, earlyA.canonical_player_id, "team-1", "WR"),
        pick(2, earlyB.canonical_player_id, "team-2", "QB"),
        pick(3, earlyC.canonical_player_id, "team-3", "TE"),
      ],
      nextOverallPick: 4,
    });

    const estimate = estimateReturnProbability(state, target.canonical_player_id);

    expect(estimate.marketShift).toBeLessThan(0);
    expect(estimate.adjustedMarketPick).toBeLessThan(target.adp!);
  });

  it("uses return probability as the expected-availability recommendation component", () => {
    const unlikely = player("unlikely", "WR", { adp: 3, tier: 1 });
    const likely = player("likely", "WR", { adp: 25, tier: 4 });
    const result = recommendPlayers(draftState([unlikely, likely], { nextOverallPick: 1 }), {
      limit: 2,
      weights: availabilityOnly(),
    });

    expect(result.recommendations[0]?.playerId).toBe("unlikely");
    expect(result.recommendations[0]?.context.returnProbability).toBeLessThan(
      result.recommendations[1]!.context.returnProbability,
    );
    expect(result.recommendations[0]?.primaryReason).toMatch(/estimated chance/);
  });
});
