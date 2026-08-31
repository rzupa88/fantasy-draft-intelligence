import type { PlayerRecommendation } from "@fdi/recommendation-engine";

export type DecisionSignalTone = "strong" | "positive" | "neutral" | "caution";

export interface DecisionSignal {
  key: "value" | "tier" | "availability" | "roster" | "replacement" | "alternative";
  label: string;
  headline: string;
  detail: string;
  tone: DecisionSignalTone;
}

export interface DraftDecisionExplanation {
  summary: string;
  signals: DecisionSignal[];
  alternative: PlayerRecommendation | null;
}

export function buildDraftDecisionExplanation(
  recommendation: PlayerRecommendation,
  recommendations: PlayerRecommendation[],
): DraftDecisionExplanation {
  const alternative =
    recommendations.find((candidate) => candidate.playerId !== recommendation.playerId) ?? null;
  const signals: DecisionSignal[] = [
    buildValueSignal(recommendation),
    buildTierSignal(recommendation),
    buildAvailabilitySignal(recommendation),
    buildRosterSignal(recommendation),
    buildReplacementSignal(recommendation),
  ];

  if (alternative !== null) {
    signals.push(buildAlternativeSignal(recommendation, alternative));
  }

  const strongest = [...signals]
    .filter((signal) => signal.tone === "strong" || signal.tone === "positive")
    .slice(0, 2)
    .map((signal) => signal.headline.toLowerCase());

  return {
    summary:
      strongest.length === 0
        ? `${recommendation.displayName} is the best balanced option at this pick.`
        : `${recommendation.displayName} stands out for ${joinReasons(strongest)}.`,
    signals,
    alternative,
  };
}

function buildValueSignal(recommendation: PlayerRecommendation): DecisionSignal {
  const score = recommendation.metrics.adpValue;
  const tone = score >= 75 ? "strong" : score >= 55 ? "positive" : score < 30 ? "caution" : "neutral";
  return {
    key: "value",
    label: "Draft value",
    headline:
      tone === "strong"
        ? "Clear value at this pick"
        : tone === "positive"
          ? "Reasonable value"
          : tone === "caution"
            ? "Market price is aggressive"
            : "Fairly priced",
    detail: `ADP value score ${Math.round(score)}/100 at pick ${recommendation.context.currentOverallPick}.`,
    tone,
  };
}

function buildTierSignal(recommendation: PlayerRecommendation): DecisionSignal {
  const remaining = recommendation.context.sameTierRemaining;
  const urgent = remaining !== null && remaining <= 2;
  return {
    key: "tier",
    label: "Tier pressure",
    headline:
      remaining === 1
        ? "Last player in the tier"
        : remaining === 2
          ? "Tier is almost gone"
          : remaining === null
            ? "Tier data unavailable"
            : `${remaining} players remain in the tier`,
    detail:
      remaining === null
        ? "The imported release does not include a usable tier for this player."
        : `There ${remaining === 1 ? "is" : "are"} ${remaining} available ${recommendation.position} player${remaining === 1 ? "" : "s"} in this tier.`,
    tone: urgent ? "strong" : recommendation.metrics.tierUrgency >= 55 ? "positive" : "neutral",
  };
}

function buildAvailabilitySignal(recommendation: PlayerRecommendation): DecisionSignal {
  const picks = recommendation.context.picksUntilNextUserPick;
  const urgency = recommendation.metrics.expectedAvailability;
  return {
    key: "availability",
    label: "Next-pick risk",
    headline:
      urgency >= 75
        ? "Unlikely to reach your next pick"
        : urgency >= 50
          ? "May not make it back"
          : "Could remain available",
    detail:
      picks === null
        ? "There is no later selection for this team in the current draft."
        : `Your next pick is ${picks} selections away; availability urgency is ${Math.round(urgency)}/100.`,
    tone: urgency >= 75 ? "strong" : urgency >= 50 ? "positive" : "neutral",
  };
}

function buildRosterSignal(recommendation: PlayerRecommendation): DecisionSignal {
  const need = recommendation.metrics.rosterNeed;
  return {
    key: "roster",
    label: "Roster fit",
    headline:
      need >= 80
        ? `Fills a major ${recommendation.position} need`
        : need >= 55
          ? "Fits an open starting slot"
          : need >= 20
            ? "Adds useful depth"
            : "Low roster priority",
    detail: `Roster-need score ${Math.round(need)}/100 for the team currently being evaluated.`,
    tone: need >= 80 ? "strong" : need >= 55 ? "positive" : need < 20 ? "caution" : "neutral",
  };
}

function buildReplacementSignal(recommendation: PlayerRecommendation): DecisionSignal {
  const points = recommendation.context.projectedPointsAboveReplacement;
  return {
    key: "replacement",
    label: "Replacement edge",
    headline:
      points === null
        ? "Replacement comparison unavailable"
        : points >= 30
          ? "Large edge over replacement"
          : points >= 10
            ? "Meaningful edge over replacement"
            : "Limited replacement edge",
    detail:
      points === null
        ? `Replacement level is currently ${recommendation.position}${recommendation.context.replacementRank}.`
        : `${points.toFixed(1)} projected points above the modeled ${recommendation.position}${recommendation.context.replacementRank} replacement level.`,
    tone: points === null ? "neutral" : points >= 30 ? "strong" : points >= 10 ? "positive" : "caution",
  };
}

function buildAlternativeSignal(
  recommendation: PlayerRecommendation,
  alternative: PlayerRecommendation,
): DecisionSignal {
  const difference = recommendation.score - alternative.score;
  return {
    key: "alternative",
    label: "Best alternative",
    headline: difference >= 8 ? `Preferred over ${alternative.displayName}` : `${alternative.displayName} is close`,
    detail: `${alternative.displayName} (${alternative.position}) scores ${alternative.score.toFixed(1)}, ${Math.abs(difference).toFixed(1)} points ${difference >= 0 ? "behind" : "ahead"}.`,
    tone: difference >= 8 ? "positive" : "neutral",
  };
}

function joinReasons(reasons: string[]): string {
  if (reasons.length === 1) return reasons[0]!;
  return `${reasons[0]} and ${reasons[1]}`;
}
