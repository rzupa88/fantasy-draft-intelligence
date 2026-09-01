import { useMemo, useState } from "react";
import { recommendPlayers } from "@fdi/recommendation-engine";
import {
  BUILT_IN_RECOMMENDATION_PROFILES,
  BUILT_IN_RECOMMENDATION_SCENARIOS,
} from "@fdi/recommendation-engine/benchmarks";

const PERCENT_CONTEXT_KEYS = new Set(["returnProbability"]);

export function DraftLab() {
  const [scenarioId, setScenarioId] = useState(BUILT_IN_RECOMMENDATION_SCENARIOS[0]!.id);
  const [profileId, setProfileId] = useState("default");

  const scenario =
    BUILT_IN_RECOMMENDATION_SCENARIOS.find((candidate) => candidate.id === scenarioId) ??
    BUILT_IN_RECOMMENDATION_SCENARIOS[0]!;
  const profile =
    BUILT_IN_RECOMMENDATION_PROFILES.find((candidate) => candidate.id === profileId) ??
    BUILT_IN_RECOMMENDATION_PROFILES[0]!;

  const result = useMemo(
    () =>
      recommendPlayers(scenario.state, {
        ...(scenario.teamId === undefined ? {} : { teamId: scenario.teamId }),
        limit: scenario.limit ?? 10,
        ...(profile.weights === undefined ? {} : { weights: profile.weights }),
      }),
    [profile, scenario],
  );

  return (
    <main className="draft-lab-shell">
      <header className="draft-lab-header">
        <div>
          <p className="draft-lab-eyebrow">Decision Engine Validation</p>
          <h1>Draft Lab</h1>
          <p>
            Inspect deterministic draft scenarios and see exactly why the recommendation engine ranks
            one player above another.
          </p>
        </div>
        <a className="draft-lab-exit" href={window.location.pathname}>
          Exit lab
        </a>
      </header>

      <section className="draft-lab-controls" aria-label="Draft Lab controls">
        <label>
          Scenario
          <select value={scenario.id} onChange={(event) => setScenarioId(event.target.value)}>
            {BUILT_IN_RECOMMENDATION_SCENARIOS.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Weight profile
          <select value={profile.id} onChange={(event) => setProfileId(event.target.value)}>
            {BUILT_IN_RECOMMENDATION_PROFILES.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.label}
              </option>
            ))}
          </select>
        </label>
        <div className="draft-lab-state-summary">
          <span>Current pick</span>
          <strong>{result.currentOverallPick}</strong>
          <span>Next user pick</span>
          <strong>{result.nextUserPick ?? "—"}</strong>
        </div>
      </section>

      <section className="draft-lab-scenario-card">
        <div>
          <h2>{scenario.name}</h2>
          <p>{scenario.description}</p>
        </div>
        <div>
          <span>{scenario.expectations.length}</span>
          <small>regression checks</small>
        </div>
      </section>

      <section className="draft-lab-ranking" aria-label="Recommendation breakdown">
        {result.recommendations.map((recommendation) => (
          <article className="draft-lab-player-card" key={recommendation.playerId}>
            <div className="draft-lab-player-heading">
              <div className="draft-lab-rank">#{recommendation.rank}</div>
              <div>
                <h3>{recommendation.displayName}</h3>
                <p>
                  {recommendation.position} · {recommendation.playerId}
                </p>
              </div>
              <div className="draft-lab-score">
                <strong>{recommendation.score}</strong>
                <span>final score</span>
              </div>
            </div>

            <div className="draft-lab-grid">
              <BreakdownGroup
                title="Scoring components"
                rows={Object.entries(recommendation.metrics).map(([label, value]) => ({
                  label: humanize(label),
                  value: formatNumber(value),
                }))}
              />
              <BreakdownGroup
                title="Take-now / wait context"
                rows={[
                  { label: "Return probability", value: formatContext("returnProbability", recommendation.context.returnProbability) },
                  { label: "Take-now urgency", value: formatNumber(recommendation.context.takeNowUrgency) },
                  { label: "Opportunity cost", value: formatNumber(recommendation.context.opportunityCost) },
                  {
                    label: "Expected next-pick position value",
                    value: formatNullable(recommendation.context.expectedNextPickPositionValue),
                  },
                  {
                    label: "Value lost by waiting",
                    value: formatNullable(recommendation.context.valueLostByWaiting),
                  },
                  {
                    label: "Adjusted market pick",
                    value: formatNullable(recommendation.context.adjustedMarketPick),
                  },
                  { label: "Market shift", value: formatNumber(recommendation.context.marketShift) },
                  { label: "Recent position run", value: formatNumber(recommendation.context.recentPositionRun) },
                  { label: "Position demand", value: formatNumber(recommendation.context.positionDemand) },
                  { label: "Same tier remaining", value: formatNullable(recommendation.context.sameTierRemaining) },
                ]}
              />
              <BreakdownGroup
                title="Replacement context"
                rows={[
                  { label: "Replacement rank", value: String(recommendation.context.replacementRank) },
                  {
                    label: "Replacement projected points",
                    value: formatNullable(recommendation.context.replacementProjectedPoints),
                  },
                  {
                    label: "Points above replacement",
                    value: formatNullable(recommendation.context.projectedPointsAboveReplacement),
                  },
                  {
                    label: "Picks until next user pick",
                    value: formatNullable(recommendation.context.picksUntilNextUserPick),
                  },
                ]}
              />
            </div>

            <div className="draft-lab-reasons">
              <strong>{recommendation.primaryReason}</strong>
              <ul>
                {recommendation.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function BreakdownGroup({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="draft-lab-breakdown-group">
      <h4>{title}</h4>
      <dl>
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function humanize(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

function formatContext(key: string, value: number): string {
  return PERCENT_CONTEXT_KEYS.has(key) ? `${Math.round(value * 100)}%` : formatNumber(value);
}

function formatNullable(value: number | null): string {
  return value === null ? "—" : formatNumber(value);
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
