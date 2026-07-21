import type { DraftPick, DraftState, PlayerDataRecord, PlayerPosition } from "@fdi/shared-types";

interface LeagueDraftBoardProps {
  state: DraftState;
  playersById: Map<string, PlayerDataRecord>;
}

interface PositionNeed {
  position: PlayerPosition | "FLEX";
  count: number;
}

const NEED_POSITIONS: PlayerPosition[] = ["QB", "RB", "WR", "TE", "K", "DST"];

export function LeagueDraftBoard({ state, playersById }: LeagueDraftBoardProps) {
  const teams = [...state.teams].sort((left, right) => left.draftSlot - right.draftSlot);
  const picksByOverall = new Map(state.picks.map((pick) => [pick.overallPick, pick]));
  const orderByRoundAndTeam = new Map(
    state.order.map((slot) => [`${slot.round}:${slot.teamId}`, slot]),
  );

  return (
    <section className="panel league-board-panel" aria-labelledby="league-board-title">
      <div className="panel-heading league-board-heading">
        <div>
          <p className="eyebrow">Draft board</p>
          <h2 id="league-board-title">League-wide grid</h2>
        </div>
        <div className="position-color-legend" aria-label="Position color legend">
          {NEED_POSITIONS.map((position) => (
            <span className={`position-legend position-bg-${position.toLowerCase()}`} key={position}>
              {position}
            </span>
          ))}
        </div>
      </div>

      <p className="panel-intro">
        Scan every roster by round. Team headers show remaining starter needs as position-colored pills,
        while completed picks use the same position colors as the rest of the draft room.
      </p>

      <div className="league-board-scroll">
        <div
          className="league-board-grid"
          style={{ gridTemplateColumns: `4.25rem repeat(${teams.length}, minmax(8.6rem, 1fr))` }}
        >
          <div className="league-board-corner">Round</div>
          {teams.map((team) => {
            const teamPicks = state.picks.filter((pick) => pick.teamId === team.teamId);
            const needs = getRemainingNeeds(state, teamPicks, playersById);
            return (
              <div
                className={`league-board-team-header ${team.isUser ? "league-board-user-team" : ""}`}
                key={team.teamId}
              >
                <span>{team.isUser ? "YOU" : `Slot ${team.draftSlot}`}</span>
                <strong>{team.name}</strong>
                {needs.length === 0 ? (
                  <small>Starters filled</small>
                ) : (
                  <div className="team-needs" aria-label={`Needs ${formatNeeds(needs)}`}>
                    {needs.map((need) => (
                      <span
                        className={`team-need-pill ${
                          need.position === "FLEX"
                            ? "position-bg-flex"
                            : `position-bg-${need.position.toLowerCase()}`
                        }`}
                        key={need.position}
                      >
                        {need.position}
                        {need.count > 1 ? ` ${need.count}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {Array.from({ length: state.settings.rounds }, (_, index) => index + 1).flatMap((round) => [
            <div className="league-board-round" key={`round-${round}`}>
              <strong>{round}</strong>
            </div>,
            ...teams.map((team) => {
              const slot = orderByRoundAndTeam.get(`${round}:${team.teamId}`);
              const pick = slot === undefined ? undefined : picksByOverall.get(slot.overallPick);
              const player = pick === undefined ? undefined : playersById.get(pick.playerId);
              const isOnClock = state.nextOverallPick === slot?.overallPick;
              return (
                <DraftBoardCell
                  key={`${round}-${team.teamId}`}
                  pick={pick}
                  player={player}
                  overallPick={slot?.overallPick ?? 0}
                  isOnClock={isOnClock}
                />
              );
            }),
          ])}
        </div>
      </div>
    </section>
  );
}

function DraftBoardCell({
  pick,
  player,
  overallPick,
  isOnClock,
}: {
  pick: DraftPick | undefined;
  player: PlayerDataRecord | undefined;
  overallPick: number;
  isOnClock: boolean;
}) {
  if (pick === undefined || player === undefined) {
    return (
      <div className={`league-board-cell league-board-empty ${isOnClock ? "league-board-on-clock" : ""}`}>
        <span>#{overallPick}</span>
        <strong>{isOnClock ? "On clock" : "—"}</strong>
      </div>
    );
  }

  const tooltip = [
    `${player.display_name} (${player.position})`,
    `Overall pick: ${pick.overallPick}`,
    `NFL team: ${player.nfl_team ?? "FA"}`,
    `Bye: ${player.bye_week ?? "—"}`,
    `ADP: ${player.adp?.toFixed(1) ?? "—"}`,
    `Tier: ${player.tier ?? "—"}`,
    `Projected points: ${player.projected_points?.toFixed(1) ?? "—"}`,
  ].join("\n");

  return (
    <div
      className={`league-board-cell league-board-pick position-bg-${player.position.toLowerCase()}`}
      title={tooltip}
    >
      <span>#{pick.overallPick} · {player.position}</span>
      <strong>{player.display_name}</strong>
      <small>{player.nfl_team ?? "FA"}</small>
    </div>
  );
}

function getRemainingNeeds(
  state: DraftState,
  picks: DraftPick[],
  playersById: Map<string, PlayerDataRecord>,
): PositionNeed[] {
  const counts = new Map<PlayerPosition, number>();
  for (const pick of picks) {
    const position = playersById.get(pick.playerId)?.position;
    if (position !== undefined) counts.set(position, (counts.get(position) ?? 0) + 1);
  }

  const needs: PositionNeed[] = [];
  for (const position of NEED_POSITIONS) {
    const required = state.settings.rosterSlots
      .filter((rule) => rule.eligiblePositions.length === 1 && rule.eligiblePositions[0] === position)
      .reduce((sum, rule) => sum + rule.count, 0);
    const remaining = Math.max(0, required - (counts.get(position) ?? 0));
    if (remaining > 0) needs.push({ position, count: remaining });
  }

  const flexRequired = state.settings.rosterSlots
    .filter((rule) => rule.slot === "FLEX" || rule.slot === "SUPERFLEX")
    .reduce((sum, rule) => sum + rule.count, 0);
  const offensiveStarters = picks.filter((pick) => {
    const position = playersById.get(pick.playerId)?.position;
    return position === "QB" || position === "RB" || position === "WR" || position === "TE";
  }).length;
  const dedicatedOffense = state.settings.rosterSlots
    .filter(
      (rule) =>
        rule.eligiblePositions.length === 1 &&
        (rule.eligiblePositions[0] === "QB" ||
          rule.eligiblePositions[0] === "RB" ||
          rule.eligiblePositions[0] === "WR" ||
          rule.eligiblePositions[0] === "TE"),
    )
    .reduce((sum, rule) => sum + rule.count, 0);
  const flexRemaining = Math.max(0, dedicatedOffense + flexRequired - offensiveStarters);
  if (
    flexRemaining > 0 &&
    !needs.some(
      (need) =>
        need.position === "QB" ||
        need.position === "RB" ||
        need.position === "WR" ||
        need.position === "TE",
    )
  ) {
    needs.push({ position: "FLEX", count: flexRemaining });
  }

  return needs;
}

function formatNeeds(needs: PositionNeed[]): string {
  return needs.map((need) => `${need.position}${need.count > 1 ? ` ${need.count}` : ""}`).join(", ");
}
