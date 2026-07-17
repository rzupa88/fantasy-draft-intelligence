import { useEffect, useMemo, useRef, useState } from "react";
import type { DraftPick, DraftState, PlayerDataRecord, PlayerPosition } from "@fdi/shared-types";

interface CorrectionDialogProps {
  state: DraftState;
  pick: DraftPick;
  onClose: () => void;
  onCorrect: (overallPick: number, playerId: string) => boolean;
}

type PositionFilter = "ALL" | PlayerPosition;

const POSITION_FILTERS: PositionFilter[] = ["ALL", "QB", "RB", "WR", "TE", "K", "DST"];

export function CorrectionDialog({ state, pick, onClose, onCorrect }: CorrectionDialogProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const currentPlayer = state.playerDataRelease.players.find(
    (player) => player.canonical_player_id === pick.playerId,
  );
  const team = state.teams.find((candidate) => candidate.teamId === pick.teamId);

  const candidates = useMemo(() => {
    const eligibleIds = new Set([...state.availablePlayerIds, pick.playerId]);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return state.playerDataRelease.players
      .filter((player) => eligibleIds.has(player.canonical_player_id))
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
      .sort(comparePlayers)
      .slice(0, 60);
  }, [pick.playerId, positionFilter, searchQuery, state.availablePlayerIds, state.playerDataRelease]);

  useEffect(() => {
    searchInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function selectReplacement(playerId: string): void {
    if (onCorrect(pick.overallPick, playerId)) {
      onClose();
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="correction-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="correction-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-heading">
          <div>
            <p className="eyebrow">Correct recorded selection</p>
            <h2 id="correction-title">Pick #{pick.overallPick}</h2>
            <p>
              {team?.name ?? pick.teamId} currently has {currentPlayer?.display_name ?? pick.playerId}.
            </p>
          </div>
          <button className="ghost-button" type="button" onClick={onClose} aria-label="Close correction dialog">
            Close
          </button>
        </div>

        <label className="search-field correction-search">
          <span className="sr-only">Search replacement players</span>
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search replacement player…"
          />
        </label>

        <div className="position-filters" aria-label="Filter replacement players by position">
          {POSITION_FILTERS.map((position) => (
            <button
              key={position}
              type="button"
              className={positionFilter === position ? "filter-active" : ""}
              onClick={() => setPositionFilter(position)}
            >
              {position}
            </button>
          ))}
        </div>

        <div className="correction-list">
          {candidates.map((player) => (
            <button
              key={player.canonical_player_id}
              className={`correction-option ${
                player.canonical_player_id === pick.playerId ? "correction-option-current" : ""
              }`}
              type="button"
              onClick={() => selectReplacement(player.canonical_player_id)}
              aria-label={`Replace pick ${pick.overallPick} with ${player.display_name}`}
            >
              <span className={`position-pill position-${player.position.toLowerCase()}`}>
                {player.position}
              </span>
              <span>
                <strong>{player.display_name}</strong>
                <small>
                  {player.nfl_team ?? "FA"} · ADP {player.adp?.toFixed(1) ?? "—"} · Tier {player.tier ?? "—"}
                </small>
              </span>
              <span>{player.canonical_player_id === pick.playerId ? "Current" : "Use player"}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function comparePlayers(left: PlayerDataRecord, right: PlayerDataRecord): number {
  return (
    (left.overall_rank ?? Number.POSITIVE_INFINITY) -
      (right.overall_rank ?? Number.POSITIVE_INFINITY) || left.display_name.localeCompare(right.display_name)
  );
}
