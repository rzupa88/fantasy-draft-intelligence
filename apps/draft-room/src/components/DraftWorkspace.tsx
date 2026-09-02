import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { buildRosterAssignments, getCurrentOrderSlot } from "@fdi/draft-engine";
import { recommendPlayers } from "@fdi/recommendation-engine";
import type {
  DraftPick,
  DraftState,
  PlayerDataRecord,
  PlayerPosition,
  RosterSlotType,
} from "@fdi/shared-types";
import { CorrectionDialog } from "./CorrectionDialog.js";
import { RosterLineup } from "./RosterLineup.js";

interface DraftWorkspaceProps {
  state: DraftState;
  notice: string | null;
  onDraftPlayer: (playerId: string) => void;
  onUndo: () => void;
  onExport: () => void;
  onExit: () => void;
  onCorrectPick: (overallPick: number, playerId: string) => boolean;
  onImportDraft: (file: File) => Promise<boolean>;
}

type PositionFilter = "ALL" | PlayerPosition;

const POSITION_FILTERS: PositionFilter[] = ["ALL", "QB", "RB", "WR", "TE", "K", "DST"];
const BEST_AVAILABLE_POSITIONS: PlayerPosition[] = ["QB", "RB", "WR", "TE", "K", "DST"];
const ROSTER_SLOT_ORDER: RosterSlotType[] = [
  "QB",
  "RB",
  "WR",
  "TE",
  "FLEX",
  "SUPERFLEX",
  "K",
  "DST",
  "BENCH",
];

export function DraftWorkspace({
  state,
  notice,
  onDraftPlayer,
  onUndo,
  onExport,
  onExit,
  onCorrectPick,
  onImportDraft,
}: DraftWorkspaceProps) {
  const userTeam = state.teams.find((team) => team.isUser) ?? state.teams[0]!;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const [selectedTeamId, setSelectedTeamId] = useState(userTeam.teamId);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [correctionPickNumber, setCorrectionPickNumber] = useState<number | null>(null);

  const currentSlot = getCurrentOrderSlot(state);
  const currentTeam =
    currentSlot === null
      ? null
      : state.teams.find((team) => team.teamId === currentSlot.teamId) ?? null;
  const isUserOnClock = currentTeam?.isUser ?? false;
  const rosters = useMemo(() => buildRosterAssignments(state), [state]);
  const playersById = useMemo(
    () =>
      new Map(
        state.playerDataRelease.players.map((player) => [player.canonical_player_id, player]),
      ),
    [state.playerDataRelease],
  );

  const recommendationResult = useMemo(() => {
    if (state.availablePlayerIds.length === 0) {
      return null;
    }
    return recommendPlayers(state, {
      teamId: userTeam.teamId,
      limit: state.availablePlayerIds.length,
    });
  }, [state, userTeam.teamId]);

  const bestAvailableByPosition = useMemo(() => {
    if (recommendationResult === null) {
      return [];
    }

    return BEST_AVAILABLE_POSITIONS.flatMap((position) => {
      const recommendation = recommendationResult.recommendations.find(
        (candidate) => candidate.position === position,
      );
      if (recommendation === undefined) {
        return [];
      }
      const player = playersById.get(recommendation.playerId);
      return player === undefined ? [] : [{ position, recommendation, player }];
    });
  }, [playersById, recommendationResult]);

  const filteredPlayers = useMemo(() => {
    const available = new Set(state.availablePlayerIds);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return state.playerDataRelease.players
      .filter((player) => available.has(player.canonical_player_id))
      .filter((player) => positionFilter === "ALL" || player.position === positionFilter)
      .filter((player) => {
        if (normalizedQuery.length === 0) {
          return true;
        }
        return [player.display_name, player.position, player.nfl_team ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort(compareAvailablePlayers)
      .slice(0, 100);
  }, [positionFilter, searchQuery, state.availablePlayerIds, state.playerDataRelease.players]);

  useEffect(() => {
    if (!filteredPlayers.some((player) => player.canonical_player_id === selectedPlayerId)) {
      setSelectedPlayerId(filteredPlayers[0]?.canonical_player_id ?? null);
    }
  }, [filteredPlayers, selectedPlayerId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const editableTarget = isEditableTarget(target);
      const key = event.key.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && key === "z") {
        event.preventDefault();
        onUndo();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && key === "s") {
        event.preventDefault();
        onExport();
        return;
      }
      if (correctionPickNumber !== null) {
        return;
      }
      if (event.key === "/" && !editableTarget) {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
      if (key === "c" && !editableTarget && state.picks.length > 0) {
        event.preventDefault();
        setCorrectionPickNumber(state.picks[state.picks.length - 1]!.overallPick);
        return;
      }

      const canNavigate = !editableTarget || target === searchInputRef.current;
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && canNavigate) {
        event.preventDefault();
        if (filteredPlayers.length === 0) {
          return;
        }
        const currentIndex = Math.max(
          0,
          filteredPlayers.findIndex(
            (player) => player.canonical_player_id === selectedPlayerId,
          ),
        );
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex =
          (currentIndex + direction + filteredPlayers.length) % filteredPlayers.length;
        setSelectedPlayerId(filteredPlayers[nextIndex]!.canonical_player_id);
        return;
      }

      if (
        event.key === "Enter" &&
        selectedPlayerId !== null &&
        currentSlot !== null &&
        canNavigate
      ) {
        event.preventDefault();
        onDraftPlayer(selectedPlayerId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    correctionPickNumber,
    currentSlot,
    filteredPlayers,
    onDraftPlayer,
    onExport,
    onUndo,
    selectedPlayerId,
    state.picks,
  ]);

  const selectedTeam = state.teams.find((team) => team.teamId === selectedTeamId) ?? userTeam;
  const selectedRoster = [...(rosters[selectedTeam.teamId] ?? [])].sort(compareRosterPicks);
  const recentPicks = [...state.picks].slice(-12).reverse();
  const completedPicks = state.picks.length;
  const totalPicks = state.order.length;
  const completionPercent = Math.round((completedPicks / totalPicks) * 100);
  const correctionPick =
    correctionPickNumber === null ? null : state.picks[correctionPickNumber - 1] ?? null;

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (file !== undefined) {
      await onImportDraft(file);
    }
    event.target.value = "";
  }

  return (
    <main className="draft-room-shell">
      <header className="draft-header">
        <div className="draft-brand">
          <div className="brand-mark brand-mark-small" aria-hidden="true">
            FDI
          </div>
          <div>
            <p className="eyebrow">Fantasy Draft Intelligence</p>
            <h1>{state.settings.leagueName}</h1>
          </div>
        </div>

        <div className="draft-progress" aria-label={`${completionPercent}% of draft completed`}>
          <div className="draft-progress-label">
            <span>{completedPicks} / {totalPicks} picks</span>
            <strong>{completionPercent}%</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${completionPercent}%` }} />
          </div>
        </div>

        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={onExport}>Export</button>
          <button className="secondary-button" type="button" onClick={() => importInputRef.current?.click()}>Import</button>
          <input ref={importInputRef} className="sr-only" type="file" accept="application/json,.json" onChange={(event) => void handleImport(event)} />
          <button className="secondary-button" type="button" onClick={onUndo} disabled={state.picks.length === 0}>Undo</button>
          <button className="ghost-button" type="button" onClick={onExit}>Exit</button>
        </div>
      </header>

      <section className={`on-clock-banner ${isUserOnClock ? "on-clock-user" : ""}`}>
        {currentSlot === null || currentTeam === null ? (
          <div>
            <p className="eyebrow">Draft complete</p>
            <h2>All {totalPicks} selections are locked in.</h2>
          </div>
        ) : (
          <>
            <div className="pick-orb"><span>Pick</span><strong>{currentSlot.overallPick}</strong></div>
            <div className="on-clock-copy">
              <p className="eyebrow">Round {currentSlot.round} · Pick {currentSlot.pickInRound}</p>
              <h2>{isUserOnClock ? "You are on the clock" : `${currentTeam.name} is on the clock`}</h2>
              <p>{isUserOnClock ? "Choose the position you want to attack, then take the best available player in that group." : "Record the pick from the live draft using the available-player board."}</p>
            </div>
            <div className="clock-team-chip"><span>Draft slot</span><strong>#{currentTeam.draftSlot}</strong></div>
          </>
        )}
      </section>

      <div className="shortcut-strip" aria-label="Keyboard shortcuts">
        <span><kbd>/</kbd> Search</span>
        <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
        <span><kbd>Enter</kbd> Draft</span>
        <span><kbd>Ctrl/⌘ Z</kbd> Undo</span>
        <span><kbd>C</kbd> Correct latest</span>
        <span className="autosave-status">Autosave active · revision {state.revision}</span>
      </div>

      {notice === null ? null : <div className="notice-banner" role="status">{notice}</div>}

      <section className="draft-workspace">
        <section className="panel player-board-panel" aria-labelledby="available-title">
          <div className="panel-heading">
            <div><p className="eyebrow">Player board</p><h2 id="available-title">Available players</h2></div>
            <span className="count-badge">{state.availablePlayerIds.length} left</span>
          </div>

          <div className="player-tools">
            <label className="search-field">
              <span className="sr-only">Search available players</span>
              <input ref={searchInputRef} type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search player, team, position…" />
            </label>
            <div className="position-filters" aria-label="Filter by position">
              {POSITION_FILTERS.map((position) => (
                <button key={position} type="button" className={positionFilter === position ? "filter-active" : ""} onClick={() => setPositionFilter(position)}>{position}</button>
              ))}
            </div>
          </div>

          <div className="player-list" aria-live="polite">
            {filteredPlayers.length === 0 ? (
              <div className="empty-state"><strong>No players found.</strong><span>Clear the search or select another position.</span></div>
            ) : filteredPlayers.map((player) => (
              <PlayerRow
                key={player.canonical_player_id}
                player={player}
                selected={selectedPlayerId === player.canonical_player_id}
                disabled={currentSlot === null}
                actionLabel={currentTeam === null ? "Complete" : `Draft for ${currentTeam.name}`}
                onSelect={() => setSelectedPlayerId(player.canonical_player_id)}
                onDraft={() => onDraftPlayer(player.canonical_player_id)}
              />
            ))}
          </div>
        </section>

        <section className="panel recommendation-panel" aria-labelledby="recommendations-title">
          <div className="panel-heading">
            <div><p className="eyebrow">Decision support</p><h2 id="recommendations-title">Best available by position</h2></div>
            <span className="live-badge">Live</span>
          </div>

          <p className="panel-intro">
            You choose the position. FDI identifies the best remaining player in each group. Tier is highlighted so you can see where talent cliffs are forming.
          </p>

          <div className="recommendation-list">
            {recommendationResult === null ? (
              <div className="empty-state"><strong>Draft complete.</strong><span>No remaining players to evaluate.</span></div>
            ) : bestAvailableByPosition.map(({ position, recommendation, player }) => (
              <article className="recommendation-card" key={position}>
                <div className="recommendation-rank">{position}</div>
                <div className="recommendation-main">
                  <div className="recommendation-title-row">
                    <div>
                      <h3>{recommendation.displayName}</h3>
                      <span>{player.nfl_team ?? "FA"} · ADP {player.adp?.toFixed(1) ?? "—"}</span>
                    </div>
                    <PositionPill position={position} />
                  </div>
                  <p><strong>Tier {player.tier ?? "—"}</strong> · {recommendation.primaryReason}</p>
                  <div className="metric-row">
                    <Metric label="Tier" value={player.tier ?? 0} />
                    <Metric label="Value" value={recommendation.metrics.baseValue} />
                    <Metric label="VOR" value={recommendation.metrics.valueOverReplacement} />
                    <Metric label="Urgency" value={recommendation.metrics.expectedAvailability} />
                  </div>
                  {isUserOnClock ? (
                    <button type="button" className="recommendation-draft-button" onClick={() => onDraftPlayer(recommendation.playerId)}>Draft {recommendation.displayName}</button>
                  ) : (
                    <span className="watch-label">Best {position} for your next selection</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel roster-panel" aria-labelledby="roster-title">
          <div className="panel-heading">
            <div><p className="eyebrow">League rosters</p><h2 id="roster-title">Team tracker</h2></div>
            <span className="count-badge">{selectedRoster.length} drafted</span>
          </div>

          <div className="team-selector" role="tablist" aria-label="Fantasy teams">
            {state.teams.map((team) => (
              <button key={team.teamId} type="button" role="tab" aria-selected={selectedTeam.teamId === team.teamId} className={selectedTeam.teamId === team.teamId ? "team-tab-active" : ""} onClick={() => setSelectedTeamId(team.teamId)}>
                <span>{team.isUser ? "YOU" : `#${team.draftSlot}`}</span><strong>{team.name}</strong>
              </button>
            ))}
          </div>

          <div className="selected-team-summary">
            <div><p className="eyebrow">Draft slot {selectedTeam.draftSlot}</p><h3>{selectedTeam.name}</h3></div>
            <div className="position-counts">
              {(["QB", "RB", "WR", "TE"] as PlayerPosition[]).map((position) => (
                <span key={position}>{position} {countPosition(selectedRoster, position, playersById)}</span>
              ))}
            </div>
          </div>

          <div className="roster-list">
            <RosterLineup rules={state.settings.rosterSlots} picks={selectedRoster} playersById={playersById} />
          </div>
        </section>
      </section>

      <section className="panel recent-picks-panel" aria-labelledby="recent-picks-title">
        <div className="panel-heading compact-heading">
          <div><p className="eyebrow">Draft feed</p><h2 id="recent-picks-title">Recent selections</h2></div>
          <span className="count-badge">Newest first</span>
        </div>

        <div className="recent-picks-grid">
          {recentPicks.length === 0 ? (
            <div className="empty-state recent-empty"><strong>The board is ready.</strong><span>The first selection will appear here.</span></div>
          ) : recentPicks.map((pick) => {
            const team = state.teams.find((candidate) => candidate.teamId === pick.teamId);
            const player = playersById.get(pick.playerId);
            return (
              <article className="recent-pick-card" key={`${pick.overallPick}-${pick.playerId}`}>
                <span className="recent-pick-number">#{pick.overallPick}</span>
                <PositionPill position={player?.position ?? "RB"} />
                <strong>{player?.display_name ?? pick.playerId}</strong>
                <span>{team?.name ?? pick.teamId}</span>
                <button type="button" className="correct-pick-button" onClick={() => setCorrectionPickNumber(pick.overallPick)} aria-label={`Correct pick ${pick.overallPick}`}>Correct</button>
              </article>
            );
          })}
        </div>
      </section>

      {correctionPick === null ? null : (
        <CorrectionDialog state={state} pick={correctionPick} onClose={() => setCorrectionPickNumber(null)} onCorrect={onCorrectPick} />
      )}
    </main>
  );
}

interface PlayerRowProps {
  player: PlayerDataRecord;
  actionLabel: string;
  disabled: boolean;
  selected: boolean;
  onSelect: () => void;
  onDraft: () => void;
}

function PlayerRow({ player, actionLabel, disabled, selected, onSelect, onDraft }: PlayerRowProps) {
  return (
    <article className={`player-row ${selected ? "player-row-selected" : ""}`} data-player-id={player.canonical_player_id} onClick={onSelect}>
      <span className="player-rank">{player.overall_rank ?? "—"}</span>
      <PositionPill position={player.position} />
      <div className="player-identity">
        <strong>{player.display_name}</strong>
        <span>{player.nfl_team ?? "FA"} · Bye {player.bye_week ?? "—"} · Tier {player.tier ?? "—"}</span>
      </div>
      <div className="player-market"><span>ADP</span><strong>{player.adp?.toFixed(1) ?? "—"}</strong></div>
      <div className="player-projection"><span>Proj</span><strong>{player.projected_points?.toFixed(1) ?? "—"}</strong></div>
      <button type="button" onClick={(event) => { event.stopPropagation(); onDraft(); }} disabled={disabled} aria-label={`${actionLabel}: ${player.display_name}`}>Draft</button>
    </article>
  );
}

function PositionPill({ position }: { position: PlayerPosition }) {
  return <span className={`position-pill position-${position.toLowerCase()}`}>{position}</span>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <span className="metric-chip"><span>{label}</span><strong>{Math.round(value)}</strong></span>;
}

function compareAvailablePlayers(left: PlayerDataRecord, right: PlayerDataRecord): number {
  const leftRank = left.overall_rank ?? Number.POSITIVE_INFINITY;
  const rightRank = right.overall_rank ?? Number.POSITIVE_INFINITY;
  if (leftRank !== rightRank) return leftRank - rightRank;
  return left.display_name.localeCompare(right.display_name);
}

function compareRosterPicks(left: DraftPick, right: DraftPick): number {
  const slotDifference = ROSTER_SLOT_ORDER.indexOf(left.rosterSlot) - ROSTER_SLOT_ORDER.indexOf(right.rosterSlot);
  if (slotDifference !== 0) return slotDifference;
  if (left.rosterSlotIndex !== right.rosterSlotIndex) return left.rosterSlotIndex - right.rosterSlotIndex;
  return left.overallPick - right.overallPick;
}

function countPosition(picks: DraftPick[], position: PlayerPosition, playersById: Map<string, PlayerDataRecord>): number {
  return picks.filter((pick) => playersById.get(pick.playerId)?.position === position).length;
}

function isEditableTarget(target: HTMLElement | null): boolean {
  if (target === null) return false;
  return target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";
}
