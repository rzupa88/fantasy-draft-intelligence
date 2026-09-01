import type {
  DraftState,
  PlayerDataRecord,
  PlayerPosition,
  RosterSlotRule,
} from "@fdi/shared-types";

export const RECOMMENDATION_COMPONENTS = [
  "baseValue",
  "valueOverReplacement",
  "tierUrgency",
  "rosterNeed",
  "adpValue",
  "expectedAvailability",
  "upside",
  "riskSafety",
] as const;

export type RecommendationComponent = (typeof RECOMMENDATION_COMPONENTS)[number];

export interface RecommendationWeights {
  baseValue: number;
  valueOverReplacement: number;
  tierUrgency: number;
  rosterNeed: number;
  adpValue: number;
  expectedAvailability: number;
  upside: number;
  riskSafety: number;
}

export const DEFAULT_RECOMMENDATION_WEIGHTS: RecommendationWeights = {
  baseValue: 0.22,
  valueOverReplacement: 0.2,
  tierUrgency: 0.12,
  rosterNeed: 0.18,
  adpValue: 0.1,
  expectedAvailability: 0.08,
  upside: 0.05,
  riskSafety: 0.05,
};

export interface RecommendationMetrics {
  baseValue: number;
  valueOverReplacement: number;
  tierUrgency: number;
  rosterNeed: number;
  adpValue: number;
  expectedAvailability: number;
  upside: number;
  riskSafety: number;
}

export interface ReturnProbabilityEstimate {
  returnProbability: number;
  takeNowUrgency: number;
  adjustedMarketPick: number | null;
  marketShift: number;
  recentPositionRun: number;
  positionDemand: number;
  sameTierRemaining: number | null;
}

export interface RecommendationContext extends ReturnProbabilityEstimate {
  currentOverallPick: number;
  nextUserPick: number | null;
  picksUntilNextUserPick: number | null;
  replacementRank: number;
  replacementProjectedPoints: number | null;
  projectedPointsAboveReplacement: number | null;
  expectedNextPickPositionValue: number | null;
  valueLostByWaiting: number | null;
  opportunityCost: number;
}

export interface PlayerRecommendation {
  rank: number;
  playerId: string;
  displayName: string;
  position: PlayerPosition;
  score: number;
  metrics: RecommendationMetrics;
  context: RecommendationContext;
  primaryReason: string;
  reasons: string[];
}

export interface RecommendationResult {
  teamId: string;
  currentOverallPick: number;
  nextUserPick: number | null;
  recommendations: PlayerRecommendation[];
}

export interface RecommendationOptions {
  teamId?: string;
  limit?: number;
  weights?: Partial<RecommendationWeights>;
}

export interface ReplacementLevel {
  position: PlayerPosition;
  replacementRank: number;
  playerId: string | null;
  projectedPoints: number | null;
}

interface CandidateScore {
  player: PlayerDataRecord;
  score: number;
  metrics: RecommendationMetrics;
  context: RecommendationContext;
  reasons: string[];
}

interface OpportunityCostEstimate {
  expectedNextPickPositionValue: number | null;
  valueLostByWaiting: number | null;
  opportunityCost: number;
}

interface ScoringContext {
  state: DraftState;
  teamId: string;
  availablePlayers: PlayerDataRecord[];
  currentOverallPick: number;
  nextUserPick: number | null;
  weights: RecommendationWeights;
  replacementLevels: Map<PlayerPosition, ReplacementLevel>;
  rawVorByPlayerId: Map<string, number | null>;
  overallRankValues: number[];
  adpValues: number[];
  upsideValues: number[];
  riskValues: number[];
  rawVorValues: number[];
}

export function recommendPlayers(
  state: DraftState,
  options: RecommendationOptions = {},
): RecommendationResult {
  assertDraftAvailable(state);
  const teamId = resolveTeamId(state, options.teamId);
  const limit = validateLimit(options.limit);
  const weights = normalizeWeights({ ...DEFAULT_RECOMMENDATION_WEIGHTS, ...options.weights });
  const availablePlayers = getAvailablePlayers(state);
  const currentOverallPick = state.nextOverallPick ?? state.order.length;
  const nextUserPick = findNextSelectionForTeam(state, teamId, currentOverallPick);
  const replacementLevels = new Map(
    getReplacementLevels(state).map((level) => [level.position, level]),
  );
  const rawVorByPlayerId = new Map<string, number | null>();

  for (const player of availablePlayers) {
    const replacement = replacementLevels.get(player.position);
    rawVorByPlayerId.set(
      player.canonical_player_id,
      player.projected_points !== null && replacement?.projectedPoints !== null && replacement !== undefined
        ? player.projected_points - replacement.projectedPoints
        : null,
    );
  }

  const context: ScoringContext = {
    state,
    teamId,
    availablePlayers,
    currentOverallPick,
    nextUserPick,
    weights,
    replacementLevels,
    rawVorByPlayerId,
    overallRankValues: compactNumbers(availablePlayers.map((player) => player.overall_rank)),
    adpValues: compactNumbers(availablePlayers.map((player) => player.adp)),
    upsideValues: compactNumbers(availablePlayers.map((player) => player.upside_score)),
    riskValues: compactNumbers(availablePlayers.map((player) => player.risk_score)),
    rawVorValues: compactNumbers([...rawVorByPlayerId.values()]),
  };

  const scored = availablePlayers.map((player) => scoreCandidate(player, context));
  scored.sort(compareCandidateScores);

  return {
    teamId,
    currentOverallPick,
    nextUserPick,
    recommendations: scored.slice(0, limit).map((candidate, index) => ({
      rank: index + 1,
      playerId: candidate.player.canonical_player_id,
      displayName: candidate.player.display_name,
      position: candidate.player.position,
      score: round(candidate.score),
      metrics: roundMetrics(candidate.metrics),
      context: candidate.context,
      primaryReason: candidate.reasons[0] ?? "Best blended value among available players.",
      reasons: candidate.reasons,
    })),
  };
}

export function scorePlayer(
  state: DraftState,
  playerId: string,
  options: Omit<RecommendationOptions, "limit"> = {},
): PlayerRecommendation {
  const result = recommendPlayers(state, { ...options, limit: state.availablePlayerIds.length });
  const recommendation = result.recommendations.find((item) => item.playerId === playerId);
  if (recommendation === undefined) {
    throw new RangeError(`Player ${playerId} is not available in this draft state.`);
  }
  return recommendation;
}

export function getReplacementLevels(state: DraftState): ReplacementLevel[] {
  const positions: PlayerPosition[] = ["QB", "RB", "WR", "TE", "K", "DST"];
  return positions.map((position) => {
    const replacementRank = calculateReplacementRank(position, state.settings.teamCount, state.settings.rosterSlots);
    const positionPlayers = [...state.playerDataRelease.players]
      .filter((player) => player.position === position)
      .sort(comparePlayerValue);
    const replacement = positionPlayers[Math.min(replacementRank - 1, positionPlayers.length - 1)];
    return {
      position,
      replacementRank,
      playerId: replacement?.canonical_player_id ?? null,
      projectedPoints: replacement?.projected_points ?? null,
    };
  });
}

export function estimateReturnProbability(
  state: DraftState,
  playerId: string,
  requestedTeamId?: string,
): ReturnProbabilityEstimate {
  const player = getPlayer(state, playerId);
  if (player === null || !state.availablePlayerIds.includes(playerId)) {
    throw new RangeError(`Player ${playerId} is not available in this draft state.`);
  }
  const teamId = resolveTeamId(state, requestedTeamId);
  const currentOverallPick = state.nextOverallPick ?? state.order.length;
  const nextUserPick = findNextSelectionForTeam(state, teamId, currentOverallPick);
  return calculateReturnProbability(player, state, teamId, currentOverallPick, nextUserPick);
}

function scoreCandidate(player: PlayerDataRecord, context: ScoringContext): CandidateScore {
  const baseValue = calculateBaseValue(player, context);
  const valueOverReplacement = normalizeSigned(
    context.rawVorByPlayerId.get(player.canonical_player_id) ?? null,
    context.rawVorValues,
  );
  const tier = calculateTierUrgency(player, context.availablePlayers);
  const rosterNeed = calculateRosterNeed(player.position, context.state, context.teamId);
  const adpValue = calculateAdpValue(player.adp, context.currentOverallPick);
  const returnEstimate = calculateReturnProbability(
    player,
    context.state,
    context.teamId,
    context.currentOverallPick,
    context.nextUserPick,
  );
  const opportunity = calculatePositionOpportunityCost(player, context);
  const urgencyAdjustedForDropoff = returnEstimate.takeNowUrgency * (0.55 + opportunity.opportunityCost * 0.0045);
  const upside = normalizeHigher(player.upside_score, context.upsideValues);
  const riskSafety = normalizeLower(player.risk_score, context.riskValues);
  const metrics: RecommendationMetrics = {
    baseValue,
    valueOverReplacement,
    tierUrgency: tier.score,
    rosterNeed,
    adpValue,
    expectedAvailability: clamp(urgencyAdjustedForDropoff, 0, 100),
    upside,
    riskSafety,
  };
  const blendedScore = weightedScore(metrics, context.weights);
  const score = clamp(blendedScore + (opportunity.opportunityCost - 50) * 0.18, 0, 100);
  const replacement = context.replacementLevels.get(player.position);
  const rawVor = context.rawVorByPlayerId.get(player.canonical_player_id) ?? null;
  const picksUntilNextUserPick = context.nextUserPick === null ? null : context.nextUserPick - context.currentOverallPick;
  const recommendationContext: RecommendationContext = {
    currentOverallPick: context.currentOverallPick,
    nextUserPick: context.nextUserPick,
    picksUntilNextUserPick,
    replacementRank: replacement?.replacementRank ?? 1,
    replacementProjectedPoints: replacement?.projectedPoints ?? null,
    projectedPointsAboveReplacement: rawVor === null ? null : round(rawVor),
    ...returnEstimate,
    sameTierRemaining: tier.sameTierRemaining,
    expectedNextPickPositionValue: opportunity.expectedNextPickPositionValue,
    valueLostByWaiting: opportunity.valueLostByWaiting,
    opportunityCost: round(opportunity.opportunityCost),
  };
  const reasons = buildReasons(player, metrics, recommendationContext, context.weights);
  return { player, score, metrics, context: recommendationContext, reasons };
}

function calculatePositionOpportunityCost(
  player: PlayerDataRecord,
  context: ScoringContext,
): OpportunityCostEstimate {
  if (player.projected_points === null || context.nextUserPick === null) {
    return {
      expectedNextPickPositionValue: player.projected_points,
      valueLostByWaiting: 0,
      opportunityCost: 50,
    };
  }

  const alternatives = context.availablePlayers
    .filter(
      (candidate) =>
        candidate.position === player.position &&
        candidate.canonical_player_id !== player.canonical_player_id &&
        candidate.projected_points !== null,
    )
    .map((candidate) => ({
      player: candidate,
      returnProbability: calculateReturnProbability(
        candidate,
        context.state,
        context.teamId,
        context.currentOverallPick,
        context.nextUserPick,
      ).returnProbability,
    }))
    .filter((candidate) => candidate.returnProbability >= 0.25)
    .sort((left, right) => {
      const leftExpected = (left.player.projected_points ?? 0) * left.returnProbability;
      const rightExpected = (right.player.projected_points ?? 0) * right.returnProbability;
      return rightExpected - leftExpected;
    });

  const bestAlternative = alternatives[0];
  if (bestAlternative === undefined || bestAlternative.player.projected_points === null) {
    return {
      expectedNextPickPositionValue: null,
      valueLostByWaiting: player.projected_points,
      opportunityCost: 100,
    };
  }

  const expectedNextPickPositionValue =
    bestAlternative.player.projected_points * bestAlternative.returnProbability;
  const valueLostByWaiting = Math.max(0, player.projected_points - expectedNextPickPositionValue);
  const relativeDrop = valueLostByWaiting / Math.max(1, player.projected_points);

  // A roughly 25% expected positional drop is treated as maximum urgency. Flat positions stay patient.
  const opportunityCost = clamp(relativeDrop * 400, 0, 100);
  return {
    expectedNextPickPositionValue: round(expectedNextPickPositionValue),
    valueLostByWaiting: round(valueLostByWaiting),
    opportunityCost,
  };
}

function calculateReturnProbability(
  player: PlayerDataRecord,
  state: DraftState,
  teamId: string,
  currentOverallPick: number,
  nextUserPick: number | null,
): ReturnProbabilityEstimate {
  const availablePlayers = getAvailablePlayers(state);
  const sameTierRemaining = player.tier === null
    ? null
    : availablePlayers.filter((candidate) => candidate.position === player.position && candidate.tier === player.tier).length;
  const marketShift = calculateLiveMarketShift(state);
  const recentPositionRun = calculateRecentPositionRun(state, player.position);
  const positionDemand = calculatePositionDemand(state, teamId, player.position, currentOverallPick, nextUserPick);

  if (nextUserPick === null) {
    return {
      returnProbability: 0,
      takeNowUrgency: 100,
      adjustedMarketPick: player.adp === null ? null : round(player.adp + marketShift),
      marketShift: round(marketShift),
      recentPositionRun: round(recentPositionRun),
      positionDemand: round(positionDemand),
      sameTierRemaining,
    };
  }

  const picksUntilNext = Math.max(1, nextUserPick - currentOverallPick);
  const adjustedMarketPick = player.adp === null ? null : player.adp + marketShift;
  let probability = adjustedMarketPick === null
    ? 0.5
    : logistic((adjustedMarketPick - nextUserPick) / Math.max(3, picksUntilNext * 0.45));

  probability -= Math.max(0, recentPositionRun - 0.25) * 0.55;
  probability -= positionDemand * 0.15;

  if (sameTierRemaining === 1) probability -= 0.12;
  else if (sameTierRemaining === 2) probability -= 0.07;
  else if (sameTierRemaining === 3) probability -= 0.03;

  probability = clamp(probability, 0.02, 0.98);
  return {
    returnProbability: round(probability),
    takeNowUrgency: round((1 - probability) * 100),
    adjustedMarketPick: adjustedMarketPick === null ? null : round(adjustedMarketPick),
    marketShift: round(marketShift),
    recentPositionRun: round(recentPositionRun),
    positionDemand: round(positionDemand),
    sameTierRemaining,
  };
}

function calculateLiveMarketShift(state: DraftState): number {
  const deviations = state.picks
    .map((pick) => {
      const drafted = getPlayer(state, pick.playerId);
      return drafted?.adp === null || drafted === null ? null : pick.overallPick - drafted.adp;
    })
    .filter((value): value is number => value !== null && Number.isFinite(value));
  if (deviations.length === 0) return 0;
  const recent = deviations.slice(-12);
  return clamp(recent.reduce((sum, value) => sum + value, 0) / recent.length, -10, 10);
}

function calculateRecentPositionRun(state: DraftState, position: PlayerPosition): number {
  const recent = state.picks.slice(-8);
  if (recent.length === 0) return 0;
  const atPosition = recent.filter((pick) => getPlayer(state, pick.playerId)?.position === position).length;
  return atPosition / recent.length;
}

function calculatePositionDemand(
  state: DraftState,
  teamId: string,
  position: PlayerPosition,
  currentOverallPick: number,
  nextUserPick: number | null,
): number {
  if (nextUserPick === null) return 1;
  const upcomingTeams = new Set(
    state.order
      .filter((slot) => slot.overallPick > currentOverallPick && slot.overallPick < nextUserPick && slot.teamId !== teamId)
      .map((slot) => slot.teamId),
  );
  if (upcomingTeams.size === 0) return 0;
  let teamsWithNeed = 0;
  for (const upcomingTeamId of upcomingTeams) {
    if (hasOpenStartingNeed(state, upcomingTeamId, position)) teamsWithNeed += 1;
  }
  return teamsWithNeed / upcomingTeams.size;
}

function hasOpenStartingNeed(state: DraftState, teamId: string, position: PlayerPosition): boolean {
  const teamPicks = state.picks.filter((pick) => pick.teamId === teamId);
  const filled = new Set(teamPicks.map((pick) => `${pick.rosterSlot}:${pick.rosterSlotIndex}`));
  for (const rule of state.settings.rosterSlots) {
    if (rule.slot === "BENCH" || !rule.eligiblePositions.includes(position)) continue;
    for (let index = 1; index <= rule.count; index += 1) {
      if (!filled.has(`${rule.slot}:${index}`)) return true;
    }
  }
  return false;
}

function calculateBaseValue(player: PlayerDataRecord, context: ScoringContext): number {
  const weighted: Array<{ value: number; weight: number }> = [];
  if (player.projected_points !== null) {
    const positionProjectionValues = compactNumbers(
      context.availablePlayers
        .filter((candidate) => candidate.position === player.position)
        .map((candidate) => candidate.projected_points),
    );
    weighted.push({ value: normalizeHigher(player.projected_points, positionProjectionValues), weight: 0.7 });
  }
  if (player.overall_rank !== null) {
    weighted.push({ value: normalizeLower(player.overall_rank, context.overallRankValues), weight: 0.3 });
  }
  if (weighted.length === 0 && player.adp !== null) {
    weighted.push({ value: normalizeLower(player.adp, context.adpValues), weight: 1 });
  }
  if (weighted.length === 0) return 50;
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  return weighted.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight;
}

function calculateTierUrgency(
  player: PlayerDataRecord,
  availablePlayers: PlayerDataRecord[],
): { score: number; sameTierRemaining: number | null } {
  if (player.tier === null) return { score: 35, sameTierRemaining: null };
  const samePosition = availablePlayers.filter((candidate) => candidate.position === player.position).sort(comparePlayerValue);
  const sameTier = samePosition.filter((candidate) => candidate.tier === player.tier);
  const baseByRemaining: Record<number, number> = { 1: 100, 2: 75, 3: 50, 4: 30 };
  let score = baseByRemaining[sameTier.length] ?? 15;
  const nextTierPlayer = samePosition.find((candidate) => candidate.tier !== null && candidate.tier > player.tier!);
  if (
    player.projected_points !== null && nextTierPlayer?.projected_points !== null && nextTierPlayer !== undefined &&
    player.projected_points - nextTierPlayer.projected_points >= 15
  ) {
    score = Math.min(100, score + 15);
  }
  return { score, sameTierRemaining: sameTier.length };
}

function calculateRosterNeed(position: PlayerPosition, state: DraftState, teamId: string): number {
  const teamPicks = state.picks.filter((pick) => pick.teamId === teamId);
  const filledSlots = new Set(teamPicks.map((pick) => `${pick.rosterSlot}:${pick.rosterSlotIndex}`));
  let dedicatedOpen = 0;
  let flexibleOpen = 0;
  let benchOpen = 0;
  state.settings.rosterSlots.forEach((rule) => {
    for (let slotIndex = 1; slotIndex <= rule.count; slotIndex += 1) {
      if (filledSlots.has(`${rule.slot}:${slotIndex}`)) continue;
      if (rule.slot === "BENCH") {
        if (rule.eligiblePositions.includes(position)) benchOpen += 1;
      } else if (rule.eligiblePositions.includes(position)) {
        if (rule.eligiblePositions.length === 1) dedicatedOpen += 1;
        else flexibleOpen += 1;
      }
    }
  });
  if (dedicatedOpen > 0) {
    const alreadyRostered = teamPicks.some((pick) => getPlayer(state, pick.playerId)?.position === position);
    return Math.min(100, 88 + Math.min(8, (dedicatedOpen - 1) * 4) + (alreadyRostered ? 0 : 4));
  }
  if (flexibleOpen > 0) return 65;
  if (benchOpen > 0) return 25;
  return 0;
}

function calculateAdpValue(adp: number | null, currentOverallPick: number): number {
  if (adp === null) return 50;
  return clamp(50 + ((adp - currentOverallPick) / 25) * 50, 0, 100);
}

function calculateReplacementRank(position: PlayerPosition, teamCount: number, rosterSlots: RosterSlotRule[]): number {
  const perTeamDemand = rosterSlots
    .filter((rule) => rule.slot !== "BENCH" && rule.eligiblePositions.includes(position))
    .reduce((sum, rule) => sum + rule.count / rule.eligiblePositions.length, 0);
  return Math.max(1, Math.ceil(perTeamDemand * teamCount));
}

function findNextSelectionForTeam(state: DraftState, teamId: string, currentOverallPick: number): number | null {
  const currentSlot = state.order[currentOverallPick - 1];
  const minimumPick = currentSlot?.teamId === teamId ? currentOverallPick + 1 : currentOverallPick;
  return state.order.find((slot) => slot.overallPick >= minimumPick && slot.teamId === teamId)?.overallPick ?? null;
}

function buildReasons(
  player: PlayerDataRecord,
  metrics: RecommendationMetrics,
  context: RecommendationContext,
  weights: RecommendationWeights,
): string[] {
  const returnPercent = Math.round(context.returnProbability * 100);
  const reasonByComponent: Record<RecommendationComponent, string | null> = {
    rosterNeed: metrics.rosterNeed >= 85
      ? `Fills an open ${player.position} starting need.`
      : metrics.rosterNeed >= 60 ? `Fits an open flexible starting slot.` : null,
    tierUrgency: metrics.tierUrgency >= 85
      ? `Only ${context.sameTierRemaining ?? 1} ${player.position} remains in this tier.`
      : metrics.tierUrgency >= 65 ? `The current ${player.position} tier is thinning.` : null,
    valueOverReplacement: metrics.valueOverReplacement >= 70 && context.projectedPointsAboveReplacement !== null
      ? `Projects ${context.projectedPointsAboveReplacement} points above the ${player.position} replacement level.` : null,
    adpValue: metrics.adpValue >= 65 && player.adp !== null
      ? `Available ${round(player.adp - context.currentOverallPick)} picks later than market ADP.`
      : metrics.adpValue <= 30 && player.adp !== null ? `Costs more than current market ADP, which lowers the grade.` : null,
    expectedAvailability: metrics.expectedAvailability >= 70 && context.nextUserPick !== null
      ? `Only a ${returnPercent}% estimated chance to remain available through pick ${context.nextUserPick}.` : null,
    baseValue: metrics.baseValue >= 75 ? `One of the strongest projected players still available.` : null,
    upside: metrics.upside >= 70 ? `Carries above-average upside versus the remaining pool.` : null,
    riskSafety: metrics.riskSafety >= 70 ? `Profiles as safer than most remaining options.` : null,
  };
  const ordered = RECOMMENDATION_COMPONENTS
    .map((component) => ({ component, priority: metrics[component] * weights[component], reason: reasonByComponent[component] }))
    .filter((item): item is { component: RecommendationComponent; priority: number; reason: string } => item.reason !== null)
    .sort((left, right) => right.priority - left.priority)
    .map((item) => item.reason);

  if (context.opportunityCost >= 70 && context.valueLostByWaiting !== null) {
    ordered.unshift(`Waiting is expected to cost about ${round(context.valueLostByWaiting)} ${player.position} points before your next pick.`);
  } else if (context.opportunityCost <= 25 && context.expectedNextPickPositionValue !== null) {
    ordered.push(`Comparable ${player.position} value is likely to remain available at your next pick.`);
  }

  if (ordered.length === 0) ordered.push(`Offers balanced value across projection, roster fit, and draft cost.`);
  return [...new Set(ordered)].slice(0, 3);
}

function weightedScore(metrics: RecommendationMetrics, weights: RecommendationWeights): number {
  return RECOMMENDATION_COMPONENTS.reduce((sum, component) => sum + metrics[component] * weights[component], 0);
}

function normalizeWeights(weights: RecommendationWeights): RecommendationWeights {
  for (const component of RECOMMENDATION_COMPONENTS) {
    const value = weights[component];
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`Recommendation weight ${component} must be a non-negative number.`);
  }
  const total = RECOMMENDATION_COMPONENTS.reduce((sum, component) => sum + weights[component], 0);
  if (total <= 0) throw new RangeError("At least one recommendation weight must be greater than zero.");
  return Object.fromEntries(RECOMMENDATION_COMPONENTS.map((component) => [component, weights[component] / total])) as unknown as RecommendationWeights;
}

function normalizeHigher(value: number | null, values: number[]): number {
  if (value === null || values.length === 0) return 50;
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  if (minimum === maximum) return 50;
  return clamp(((value - minimum) / (maximum - minimum)) * 100, 0, 100);
}

function normalizeLower(value: number | null, values: number[]): number {
  if (value === null || values.length === 0) return 50;
  return 100 - normalizeHigher(value, values);
}

function normalizeSigned(value: number | null, values: number[]): number {
  if (value === null || values.length === 0) return 50;
  const positiveMaximum = Math.max(0, ...values);
  const negativeMinimum = Math.min(0, ...values);
  if (value >= 0) return positiveMaximum === 0 ? 50 : 50 + (value / positiveMaximum) * 50;
  return negativeMinimum === 0 ? 50 : 50 - (Math.abs(value) / Math.abs(negativeMinimum)) * 50;
}

function compareCandidateScores(left: CandidateScore, right: CandidateScore): number {
  if (right.score !== left.score) return right.score - left.score;
  return comparePlayerValue(left.player, right.player);
}

function comparePlayerValue(left: PlayerDataRecord, right: PlayerDataRecord): number {
  const leftProjection = left.projected_points ?? Number.NEGATIVE_INFINITY;
  const rightProjection = right.projected_points ?? Number.NEGATIVE_INFINITY;
  if (rightProjection !== leftProjection) return rightProjection - leftProjection;
  const leftRank = left.overall_rank ?? Number.POSITIVE_INFINITY;
  const rightRank = right.overall_rank ?? Number.POSITIVE_INFINITY;
  if (leftRank !== rightRank) return leftRank - rightRank;
  const leftAdp = left.adp ?? Number.POSITIVE_INFINITY;
  const rightAdp = right.adp ?? Number.POSITIVE_INFINITY;
  if (leftAdp !== rightAdp) return leftAdp - rightAdp;
  return left.canonical_player_id.localeCompare(right.canonical_player_id);
}

function getAvailablePlayers(state: DraftState): PlayerDataRecord[] {
  const available = new Set(state.availablePlayerIds);
  return state.playerDataRelease.players.filter((player) => available.has(player.canonical_player_id));
}

function getPlayer(state: DraftState, playerId: string): PlayerDataRecord | null {
  return state.playerDataRelease.players.find((player) => player.canonical_player_id === playerId) ?? null;
}

function resolveTeamId(state: DraftState, requestedTeamId: string | undefined): string {
  const teamId = requestedTeamId ?? state.teams.find((team) => team.isUser)?.teamId;
  if (teamId === undefined || !state.teams.some((team) => team.teamId === teamId)) {
    throw new RangeError("A valid recommendation team is required.");
  }
  return teamId;
}

function validateLimit(limit: number | undefined): number {
  const resolved = limit ?? 5;
  if (!Number.isInteger(resolved) || resolved < 1 || resolved > 100) {
    throw new RangeError("Recommendation limit must be an integer between 1 and 100.");
  }
  return resolved;
}

function assertDraftAvailable(state: DraftState): void {
  if (state.availablePlayerIds.length === 0) throw new RangeError("The draft has no available players to recommend.");
}

function compactNumbers(values: Array<number | null>): number[] {
  return values.filter((value): value is number => value !== null && Number.isFinite(value));
}

function roundMetrics(metrics: RecommendationMetrics): RecommendationMetrics {
  return Object.fromEntries(RECOMMENDATION_COMPONENTS.map((component) => [component, round(metrics[component])])) as unknown as RecommendationMetrics;
}

function logistic(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
