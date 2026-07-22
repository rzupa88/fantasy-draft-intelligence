import { describe, expect, it } from "vitest";
import type { PlayerRecommendation } from "@fdi/recommendation-engine";
import { buildDraftDecisionExplanation } from "../src/decision-explanation.js";

const chase: PlayerRecommendation = {
  rank: 1,
  playerId: "jamar-chase",
  displayName: "Ja'Marr Chase",
  position: "WR",
  score: 91.5,
  metrics: {
    baseValue: 96,
    valueOverReplacement: 94,
    tierUrgency: 100,
    rosterNeed: 88,
    adpValue: 82,
    expectedAvailability: 90,
    upside: 95,
    riskSafety: 78,
  },
  context: {
    currentOverallPick: 4,
    nextUserPick: 21,
    picksUntilNextUserPick: 17,
    replacementRank: 31,
    replacementProjectedPoints: 141.2,
    projectedPointsAboveReplacement: 128.4,
    sameTierRemaining: 1,
  },
  primaryReason: "Last elite receiver available.",
  reasons: ["Last elite receiver available."],
};

const alternative: PlayerRecommendation = {
  ...chase,
  rank: 2,
  playerId: "bijan-robinson",
  displayName: "Bijan Robinson",
  position: "RB",
  score: 84.2,
  context: { ...chase.context, sameTierRemaining: 3 },
};

describe("draft decision explanation", () => {
  it("surfaces value, tier, next-pick, roster, replacement, and alternative signals", () => {
    const explanation = buildDraftDecisionExplanation(chase, [chase, alternative]);

    expect(explanation.summary).toContain("Ja'Marr Chase");
    expect(explanation.signals.map((signal) => signal.key)).toEqual([
      "value",
      "tier",
      "availability",
      "roster",
      "replacement",
      "alternative",
    ]);
    expect(explanation.signals.find((signal) => signal.key === "tier")?.headline).toBe(
      "Last player in the tier",
    );
    expect(explanation.signals.find((signal) => signal.key === "availability")?.headline).toBe(
      "Unlikely to reach your next pick",
    );
    expect(explanation.alternative?.playerId).toBe("bijan-robinson");
  });
});
