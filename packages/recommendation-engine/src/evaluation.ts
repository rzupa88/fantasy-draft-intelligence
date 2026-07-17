import type { DraftState } from "@fdi/shared-types";
import {
  recommendPlayers,
  type RecommendationComponent,
  type RecommendationOptions,
  type RecommendationResult,
  type RecommendationWeights,
} from "./index.js";

export const RECOMMENDATION_EVALUATION_SCHEMA_VERSION = "1.0" as const;

export interface RecommendationWeightProfile {
  id: string;
  label: string;
  description?: string;
  weights?: Partial<RecommendationWeights>;
}

interface RecommendationExpectationBase {
  profileId?: string;
  label?: string;
}

export type RecommendationExpectation =
  | (RecommendationExpectationBase & {
      kind: "top_player";
      playerId: string;
    })
  | (RecommendationExpectationBase & {
      kind: "ranking_starts_with";
      playerIds: string[];
    })
  | (RecommendationExpectationBase & {
      kind: "ranks_before";
      playerId: string;
      otherPlayerId: string;
    })
  | (RecommendationExpectationBase & {
      kind: "includes_player";
      playerId: string;
    })
  | (RecommendationExpectationBase & {
      kind: "excludes_player";
      playerId: string;
    })
  | (RecommendationExpectationBase & {
      kind: "reason_contains";
      playerId: string;
      text: string;
    })
  | (RecommendationExpectationBase & {
      kind: "metric_at_least";
      playerId: string;
      component: RecommendationComponent;
      minimum: number;
    })
  | (RecommendationExpectationBase & {
      kind: "metric_at_most";
      playerId: string;
      component: RecommendationComponent;
      maximum: number;
    })
  | (RecommendationExpectationBase & {
      kind: "score_between";
      playerId: string;
      minimum: number;
      maximum: number;
    });

export interface RecommendationScenario {
  id: string;
  name: string;
  description: string;
  state: DraftState;
  teamId?: string;
  limit?: number;
  expectations: RecommendationExpectation[];
}

export interface RecommendationSnapshotItem {
  rank: number;
  playerId: string;
  displayName: string;
  position: RecommendationResult["recommendations"][number]["position"];
  score: number;
  metrics: Record<RecommendationComponent, number>;
  context: RecommendationResult["recommendations"][number]["context"];
  primaryReason: string;
  reasons: string[];
}

export interface RecommendationSnapshot {
  teamId: string;
  currentOverallPick: number;
  nextUserPick: number | null;
  recommendations: RecommendationSnapshotItem[];
}

export interface RecommendationExpectationCheck {
  kind: RecommendationExpectation["kind"];
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
}

export interface RecommendationScenarioEvaluation {
  scenarioId: string;
  scenarioName: string;
  profileId: string;
  profileLabel: string;
  passed: boolean;
  checks: RecommendationExpectationCheck[];
  snapshot: RecommendationSnapshot;
}

export interface RecommendationWeightComparisonProfile {
  profileId: string;
  profileLabel: string;
  topPlayerId: string | null;
  topScore: number | null;
  ranking: string[];
}

export interface RecommendationWeightComparison {
  scenarioId: string;
  scenarioName: string;
  topPlayerChanged: boolean;
  profiles: RecommendationWeightComparisonProfile[];
}

export interface RecommendationEvaluationSummary {
  scenarioCount: number;
  profileCount: number;
  evaluationCount: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
}

export interface RecommendationEvaluationReport {
  schemaVersion: typeof RECOMMENDATION_EVALUATION_SCHEMA_VERSION;
  baselineProfileId: string;
  passed: boolean;
  summary: RecommendationEvaluationSummary;
  evaluations: RecommendationScenarioEvaluation[];
  comparisons: RecommendationWeightComparison[];
}

export interface RecommendationSnapshotManifest {
  schemaVersion: typeof RECOMMENDATION_EVALUATION_SCHEMA_VERSION;
  baselineProfileId: string;
  snapshots: Array<{
    scenarioId: string;
    profileId: string;
    snapshot: RecommendationSnapshot;
  }>;
}

export type RecommendationRunner = (
  state: DraftState,
  options?: RecommendationOptions,
) => RecommendationResult;

export interface RecommendationEvaluationOptions {
  profiles?: RecommendationWeightProfile[];
  baselineProfileId?: string;
  recommend?: RecommendationRunner;
}

export const DEFAULT_EVALUATION_PROFILE: RecommendationWeightProfile = {
  id: "default",
  label: "Default",
  description: "The production Recommendation Engine v1 weighting model.",
};

export function runRecommendationEvaluation(
  scenarios: RecommendationScenario[],
  options: RecommendationEvaluationOptions = {},
): RecommendationEvaluationReport {
  validateScenarios(scenarios);
  const profiles = options.profiles ?? [DEFAULT_EVALUATION_PROFILE];
  validateProfiles(profiles);
  validateExpectationProfiles(scenarios, profiles);
  const baselineProfileId = options.baselineProfileId ?? profiles[0]!.id;
  if (!profiles.some((profile) => profile.id === baselineProfileId)) {
    throw new RangeError(`Unknown baseline profile: ${baselineProfileId}`);
  }
  const runner = options.recommend ?? recommendPlayers;
  const evaluations: RecommendationScenarioEvaluation[] = [];

  for (const scenario of scenarios) {
    for (const profile of profiles) {
      const recommendationOptions: RecommendationOptions = {
        limit: scenario.limit ?? Math.min(10, scenario.state.availablePlayerIds.length),
      };
      if (scenario.teamId !== undefined) {
        recommendationOptions.teamId = scenario.teamId;
      }
      if (profile.weights !== undefined) {
        recommendationOptions.weights = profile.weights;
      }

      const result = runner(scenario.state, recommendationOptions);
      const applicableExpectations = scenario.expectations.filter((expectation) =>
        expectation.profileId === undefined
          ? profile.id === baselineProfileId
          : expectation.profileId === profile.id,
      );
      const checks = applicableExpectations.map((expectation) =>
        evaluateExpectation(expectation, result),
      );

      evaluations.push({
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        profileId: profile.id,
        profileLabel: profile.label,
        passed: checks.every((check) => check.passed),
        checks,
        snapshot: createRecommendationSnapshot(result),
      });
    }
  }

  const totalChecks = evaluations.reduce((sum, evaluation) => sum + evaluation.checks.length, 0);
  const passedChecks = evaluations.reduce(
    (sum, evaluation) => sum + evaluation.checks.filter((check) => check.passed).length,
    0,
  );
  const failedChecks = totalChecks - passedChecks;

  return {
    schemaVersion: RECOMMENDATION_EVALUATION_SCHEMA_VERSION,
    baselineProfileId,
    passed: failedChecks === 0,
    summary: {
      scenarioCount: scenarios.length,
      profileCount: profiles.length,
      evaluationCount: evaluations.length,
      totalChecks,
      passedChecks,
      failedChecks,
    },
    evaluations,
    comparisons: buildWeightComparisons(scenarios, profiles, evaluations),
  };
}

export function createRecommendationSnapshot(result: RecommendationResult): RecommendationSnapshot {
  return {
    teamId: result.teamId,
    currentOverallPick: result.currentOverallPick,
    nextUserPick: result.nextUserPick,
    recommendations: result.recommendations.map((recommendation) => ({
      rank: recommendation.rank,
      playerId: recommendation.playerId,
      displayName: recommendation.displayName,
      position: recommendation.position,
      score: recommendation.score,
      metrics: { ...recommendation.metrics },
      context: { ...recommendation.context },
      primaryReason: recommendation.primaryReason,
      reasons: [...recommendation.reasons],
    })),
  };
}

export function createRecommendationSnapshotManifest(
  report: RecommendationEvaluationReport,
): RecommendationSnapshotManifest {
  return {
    schemaVersion: RECOMMENDATION_EVALUATION_SCHEMA_VERSION,
    baselineProfileId: report.baselineProfileId,
    snapshots: report.evaluations.map((evaluation) => ({
      scenarioId: evaluation.scenarioId,
      profileId: evaluation.profileId,
      snapshot: evaluation.snapshot,
    })),
  };
}

export function formatRecommendationEvaluationReport(
  report: RecommendationEvaluationReport,
): string {
  const lines: string[] = [
    "# Recommendation Evaluation Report",
    "",
    `**Status:** ${report.passed ? "PASS" : "FAIL"}`,
    "",
    `- Scenarios: ${report.summary.scenarioCount}`,
    `- Weight profiles: ${report.summary.profileCount}`,
    `- Checks passed: ${report.summary.passedChecks}/${report.summary.totalChecks}`,
    "",
    "## Scenario results",
    "",
    "| Scenario | Profile | Result | Top recommendation | Score |",
    "|---|---|---:|---|---:|",
  ];

  for (const evaluation of report.evaluations) {
    const top = evaluation.snapshot.recommendations[0];
    lines.push(
      `| ${escapeTable(evaluation.scenarioName)} | ${escapeTable(evaluation.profileLabel)} | ${
        evaluation.passed ? "PASS" : "FAIL"
      } | ${escapeTable(top?.playerId ?? "none")} | ${top?.score ?? "-"} |`,
    );
  }

  const failedChecks = report.evaluations.flatMap((evaluation) =>
    evaluation.checks
      .filter((check) => !check.passed)
      .map((check) => ({ evaluation, check })),
  );
  if (failedChecks.length > 0) {
    lines.push("", "## Failed checks", "");
    for (const { evaluation, check } of failedChecks) {
      lines.push(
        `- **${evaluation.scenarioName} / ${evaluation.profileLabel}:** ${check.label}. Expected ${check.expected}; received ${check.actual}.`,
      );
    }
  }

  lines.push(
    "",
    "## Weight sensitivity",
    "",
    "| Scenario | Top player changed? | Profile leaders |",
    "|---|---:|---|",
  );
  for (const comparison of report.comparisons) {
    const leaders = comparison.profiles
      .map((profile) => `${profile.profileLabel}: ${profile.topPlayerId ?? "none"}`)
      .join("; ");
    lines.push(
      `| ${escapeTable(comparison.scenarioName)} | ${
        comparison.topPlayerChanged ? "YES" : "NO"
      } | ${escapeTable(leaders)} |`,
    );
  }

  return `${lines.join("\n")}\n`;
}

function evaluateExpectation(
  expectation: RecommendationExpectation,
  result: RecommendationResult,
): RecommendationExpectationCheck {
  const ranking = result.recommendations.map((recommendation) => recommendation.playerId);
  const recommendationById = new Map(
    result.recommendations.map((recommendation) => [recommendation.playerId, recommendation]),
  );
  const label = expectation.label ?? defaultExpectationLabel(expectation);

  switch (expectation.kind) {
    case "top_player": {
      const actual = ranking[0] ?? "none";
      return check(expectation.kind, label, actual === expectation.playerId, expectation.playerId, actual);
    }
    case "ranking_starts_with": {
      const actual = ranking.slice(0, expectation.playerIds.length);
      return check(
        expectation.kind,
        label,
        actual.join("|") === expectation.playerIds.join("|"),
        expectation.playerIds.join(", "),
        actual.join(", ") || "none",
      );
    }
    case "ranks_before": {
      const playerRank = ranking.indexOf(expectation.playerId);
      const otherRank = ranking.indexOf(expectation.otherPlayerId);
      return check(
        expectation.kind,
        label,
        playerRank >= 0 && otherRank >= 0 && playerRank < otherRank,
        `${expectation.playerId} before ${expectation.otherPlayerId}`,
        `${expectation.playerId}=${displayRank(playerRank)}, ${expectation.otherPlayerId}=${displayRank(otherRank)}`,
      );
    }
    case "includes_player": {
      const passed = recommendationById.has(expectation.playerId);
      return check(
        expectation.kind,
        label,
        passed,
        `${expectation.playerId} included`,
        passed ? "included" : "missing",
      );
    }
    case "excludes_player": {
      const passed = !recommendationById.has(expectation.playerId);
      return check(
        expectation.kind,
        label,
        passed,
        `${expectation.playerId} excluded`,
        passed ? "excluded" : "included",
      );
    }
    case "reason_contains": {
      const recommendation = recommendationById.get(expectation.playerId);
      const reasonText = recommendation?.reasons.join(" ") ?? "";
      const passed = reasonText.toLocaleLowerCase().includes(expectation.text.toLocaleLowerCase());
      return check(
        expectation.kind,
        label,
        passed,
        `reason containing “${expectation.text}”`,
        reasonText || "player not ranked",
      );
    }
    case "metric_at_least": {
      const actual = recommendationById.get(expectation.playerId)?.metrics[expectation.component];
      return check(
        expectation.kind,
        label,
        actual !== undefined && actual >= expectation.minimum,
        `${expectation.component} >= ${expectation.minimum}`,
        actual === undefined ? "player not ranked" : String(actual),
      );
    }
    case "metric_at_most": {
      const actual = recommendationById.get(expectation.playerId)?.metrics[expectation.component];
      return check(
        expectation.kind,
        label,
        actual !== undefined && actual <= expectation.maximum,
        `${expectation.component} <= ${expectation.maximum}`,
        actual === undefined ? "player not ranked" : String(actual),
      );
    }
    case "score_between": {
      const actual = recommendationById.get(expectation.playerId)?.score;
      return check(
        expectation.kind,
        label,
        actual !== undefined && actual >= expectation.minimum && actual <= expectation.maximum,
        `score ${expectation.minimum}-${expectation.maximum}`,
        actual === undefined ? "player not ranked" : String(actual),
      );
    }
  }
}

function buildWeightComparisons(
  scenarios: RecommendationScenario[],
  profiles: RecommendationWeightProfile[],
  evaluations: RecommendationScenarioEvaluation[],
): RecommendationWeightComparison[] {
  return scenarios.map((scenario) => {
    const profileResults = profiles.map((profile) => {
      const evaluation = evaluations.find(
        (candidate) =>
          candidate.scenarioId === scenario.id && candidate.profileId === profile.id,
      );
      const top = evaluation?.snapshot.recommendations[0];
      return {
        profileId: profile.id,
        profileLabel: profile.label,
        topPlayerId: top?.playerId ?? null,
        topScore: top?.score ?? null,
        ranking:
          evaluation?.snapshot.recommendations.map((recommendation) => recommendation.playerId) ?? [],
      };
    });
    const distinctLeaders = new Set(profileResults.map((profile) => profile.topPlayerId));
    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      topPlayerChanged: distinctLeaders.size > 1,
      profiles: profileResults,
    };
  });
}

function validateScenarios(scenarios: RecommendationScenario[]): void {
  if (scenarios.length === 0) {
    throw new RangeError("At least one recommendation scenario is required.");
  }
  const ids = new Set<string>();
  for (const scenario of scenarios) {
    assertNonEmptyId(scenario.id, "scenario");
    if (ids.has(scenario.id)) {
      throw new RangeError(`Duplicate recommendation scenario id: ${scenario.id}`);
    }
    ids.add(scenario.id);
    if (scenario.expectations.length === 0) {
      throw new RangeError(`Scenario ${scenario.id} must define at least one expectation.`);
    }
  }
}

function validateProfiles(profiles: RecommendationWeightProfile[]): void {
  if (profiles.length === 0) {
    throw new RangeError("At least one recommendation weight profile is required.");
  }
  const ids = new Set<string>();
  for (const profile of profiles) {
    assertNonEmptyId(profile.id, "profile");
    if (ids.has(profile.id)) {
      throw new RangeError(`Duplicate recommendation profile id: ${profile.id}`);
    }
    ids.add(profile.id);
  }
}

function validateExpectationProfiles(
  scenarios: RecommendationScenario[],
  profiles: RecommendationWeightProfile[],
): void {
  const profileIds = new Set(profiles.map((profile) => profile.id));
  for (const scenario of scenarios) {
    for (const expectation of scenario.expectations) {
      if (expectation.profileId !== undefined && !profileIds.has(expectation.profileId)) {
        throw new RangeError(
          `Scenario ${scenario.id} references unknown recommendation profile ${expectation.profileId}.`,
        );
      }
    }
  }
}

function assertNonEmptyId(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new RangeError(`Recommendation ${field} id must be non-empty.`);
  }
}

function defaultExpectationLabel(expectation: RecommendationExpectation): string {
  switch (expectation.kind) {
    case "top_player":
      return `${expectation.playerId} should be the top recommendation`;
    case "ranking_starts_with":
      return `ranking should start with ${expectation.playerIds.join(", ")}`;
    case "ranks_before":
      return `${expectation.playerId} should rank before ${expectation.otherPlayerId}`;
    case "includes_player":
      return `${expectation.playerId} should be included`;
    case "excludes_player":
      return `${expectation.playerId} should be excluded`;
    case "reason_contains":
      return `${expectation.playerId} should explain ${expectation.text}`;
    case "metric_at_least":
      return `${expectation.playerId} ${expectation.component} should meet its floor`;
    case "metric_at_most":
      return `${expectation.playerId} ${expectation.component} should stay below its ceiling`;
    case "score_between":
      return `${expectation.playerId} score should stay within range`;
  }
}

function check(
  kind: RecommendationExpectation["kind"],
  label: string,
  passed: boolean,
  expected: string,
  actual: string,
): RecommendationExpectationCheck {
  return { kind, label, passed, expected, actual };
}

function displayRank(index: number): string {
  return index < 0 ? "not ranked" : String(index + 1);
}

function escapeTable(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}
