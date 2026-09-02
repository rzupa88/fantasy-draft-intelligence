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

  const teamId =
    scenario.teamId ??
    scenario.state.teams.find((team) => team.isUser)?.teamId ??
    scenario.state.teams[0]!.teamId;
  const userTeam = scenario.state.teams.find((team) => team.teamId === teamId);
  const nextOverallPick = scenario.state.nextOverallPick;
  const currentOrderSlot =
    nextOverallPick === null
      ? undefined
      : scenario.state.order.find((slot) => slot.overallPick === nextOverallPick);
  const nextUserOrderSlot =
    nextOverallPick === null
      ? null
      : scenario.state.order.find(
          (slot) => slot.overallPick > nextOverallPick && slot.teamId === teamId,
        ) ?? null;
  const playerById = new Map(
    scenario.state.playerDataRelease.players.map((player) => [player.canonical_player_id, player]),
  );
  const teamPicks = scenario.state.picks
    .filter((pick) => pick.teamId === teamId)
    .sort((a, b) => a.overallPick - b.overallPick);
  const recentPicks = [...scenario.state.picks]
    .sort((a, b) => b.overallPick - a.overallPick)
    .slice(0, 8)
    .reverse();
  const availablePlayers = scenario.state.availablePlayerIds
    .map((playerId) => playerById.get(playerId))
    .filter((player): player is NonNullable<typeof player> => player !== undefined)
    .sort((a, b) => (a.overall_rank ?? 999) - (b.overall_rank ?? 999))
    .slice(0, 14);

  const rosterSlots = scenario.state.settings.rosterSlots.flatMap((slot) =>
    Array.from({ length: slot.count }, (_, index) => {
      const rosterSlotIndex = index + 1;
      const pick = teamPicks.find(
        (candidate) =>
          candidate.rosterSlot === slot.slot && candidate.rosterSlotIndex === rosterSlotIndex,
      );
      return {
        key: `${slot.slot}-${rosterSlotIndex}`,
        label: slot.count === 1 ? slot.slot : `${slot.slot}${rosterSlotIndex}`,
        eligible: slot.eligiblePositions.join("/"),
        player: pick === undefined ? undefined : playerById.get(pick.playerId),
      };
    }),
  );

  return (
    <main className="draft-lab-shell">
      <header className="draft-lab-header">
        <div>
          <p className="draft-lab-eyebrow">Decision Engine Validation</p>
          <h1>Draft Lab</h1>
          <p>
            Judge the football decision first, then inspect the math. Each scenario now shows roster
            construction, draft position, recent room behavior, and the available player pool.
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
          <span>On the clock</span>
          <strong>
            {currentOrderSlot === undefined
              ? `Pick ${result.currentOverallPick}`
              : `R${currentOrderSlot.round} · ${currentOrderSlot.pickInRound} (${result.currentOverallPick})`}
          </strong>
          <span>Next user pick</span>
          <strong>
            {nextUserOrderSlot === null
              ? result.nextUserPick ?? "—"
              : `R${nextUserOrderSlot.round} · ${nextUserOrderSlot.pickInRound} (${nextUserOrderSlot.overallPick})`}
          </strong>
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

      <section className="draft-lab-context-grid" aria-label="Scenario football context">
        <article className="draft-lab-context-card draft-lab-league-card">
          <div className="draft-lab-section-heading">
            <div>
              <p className="draft-lab-eyebrow">League context</p>
              <h3>{scenario.state.settings.leagueName}</h3>
            </div>
            <span className="draft-lab-chip">
              {scenario.state.settings.scoring.preset.replaceAll("_", " ")}
            </span>
          </div>
          <dl className="draft-lab-facts">
            <div><dt>Teams</dt><dd>{scenario.state.settings.teamCount}</dd></div>
            <div><dt>Your team</dt><dd>{userTeam?.name ?? teamId}</dd></div>
            <div><dt>Draft slot</dt><dd>{userTeam?.draftSlot ?? "—"}</dd></div>
            <div><dt>Picks made</dt><dd>{scenario.state.picks.length}</dd></div>
          </dl>
        </article>

        <article className="draft-lab-context-card draft-lab-roster-card">
          <div className="draft-lab-section-heading">
            <div>
              <p className="draft-lab-eyebrow">Roster construction</p>
              <h3>{userTeam?.name ?? "User team"}</h3>
            </div>
            <span className="draft-lab-chip">{teamPicks.length} drafted</span>
          </div>
          <div className="draft-lab-roster-grid">
            {rosterSlots.map((slot) => (
              <div
                className={slot.player === undefined ? "draft-lab-roster-slot is-open" : "draft-lab-roster-slot"}
                key={slot.key}
              >
                <span>{slot.label}</span>
                {slot.player === undefined ? (
                  <div><strong>OPEN</strong><small>{slot.eligible}</small></div>
                ) : (
                  <div><strong>{slot.player.display_name}</strong><small>{slot.player.position} · {slot.player.nfl_team}</small></div>
                )}
              </div>
            ))}
          </div>
        </article>

        <article className="draft-lab-context-card draft-lab-room-card">
          <div className="draft-lab-section-heading">
            <div>
              <p className="draft-lab-eyebrow">Room behavior</p>
              <h3>Recent picks</h3>
            </div>
            <span className="draft-lab-chip">last {recentPicks.length}</span>
          </div>
          {recentPicks.length === 0 ? (
            <p className="draft-lab-empty-copy">No picks yet. This scenario begins at the opening pick.</p>
          ) : (
            <div className="draft-lab-recent-picks">
              {recentPicks.map((pick) => {
                const player = playerById.get(pick.playerId);
                return (
                  <div key={`${pick.overallPick}-${pick.playerId}`}>
                    <span>#{pick.overallPick}</span>
                    <strong>{player?.position ?? pick.rosterSlot}</strong>
                    <small>{player?.display_name ?? pick.playerId}</small>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </section>

      <section className="draft-lab-pool" aria-label="Available player pool">
        <div className="draft-lab-section-heading">
          <div>
            <p className="draft-lab-eyebrow">Decision set</p>
            <h2>Best available players</h2>
          </div>
          <span className="draft-lab-chip">{scenario.state.availablePlayerIds.length} available</span>
        </div>
        <div className="draft-lab-pool-grid">
          {availablePlayers.map((player) => {
            const recommendation = result.recommendations.find(
              (candidate) => candidate.playerId === player.canonical_player_id,
            );
            return (
              <div className="draft-lab-pool-player" key={player.canonical_player_id}>
                <span className="draft-lab-position-pill">{player.position}</span>
                <div>
                  <strong>{player.display_name}</strong>
                  <small>
                    Rank {player.overall_rank ?? "—"} · ADP {player.adp ?? "—"} · Tier {player.tier ?? "—"}
                  </small>
                </div>
                <div className="draft-lab-pool-score">
                  <strong>{recommendation?.score ?? "—"}</strong>
                  <small>{recommendation === undefined ? "not ranked" : `engine #${recommendation.rank}`}</small>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="draft-lab-ranking" aria-label="Recommendation breakdown">
        <div className="draft-lab-ranking-heading">
          <p className="draft-lab-eyebrow">Engine explanation</p>
          <h2>Recommendation ranking</h2>
          <p>Use this section after you decide what you think the correct football choice should be.</p>
        </div>
        {result.recommendations.map((recommendation) => (
          <article className="draft-lab-player-card" key={recommendation.playerId}>
            <div className="draft-lab-player-heading">
              <div className="draft-lab-rank">#{recommendation.rank}</div>
              <div>
                <h3>{recommendation.displayName}</h3>
                <p>{recommendation.position} · {recommendation.playerId}</p>
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
                  { label: "Expected next-pick position value", value: formatNullable(recommendation.context.expectedNextPickPositionValue) },
                  { label: "Value lost by waiting", value: formatNullable(recommendation.context.valueLostByWaiting) },
                  { label: "Adjusted market pick", value: formatNullable(recommendation.context.adjustedMarketPick) },
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
                  { label: "Replacement projected points", value: formatNullable(recommendation.context.replacementProjectedPoints) },
                  { label: "Points above replacement", value: formatNullable(recommendation.context.projectedPointsAboveReplacement) },
                  { label: "Picks until next user pick", value: formatNullable(recommendation.context.picksUntilNextUserPick) },
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
