import { useRef, type ChangeEvent } from "react";
import type {
  NflverseEnrichmentReport,
  NflverseHistoryRelease,
} from "../nflverse-history.js";

interface NflverseHistoryCardProps {
  history: NflverseHistoryRelease | null;
  report: NflverseEnrichmentReport | null;
  filename: string | null;
  onImport: (file: File) => Promise<void>;
  onClear: () => void;
}

export function NflverseHistoryCard({
  history,
  report,
  filename,
  onImport,
  onClear,
}: NflverseHistoryCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (file !== undefined) {
      await onImport(file);
    }
    event.target.value = "";
  }

  return (
    <section className="history-import-card field-wide" aria-labelledby="history-import-title">
      <div className="history-import-heading">
        <div>
          <p className="eyebrow">Historical context</p>
          <h3 id="history-import-title">NFLverse identity and prior-year stats</h3>
          <p>
            Load the compact JSON release generated from NFLverse. It supplies stable player IDs,
            current teams, and prior-season production while UDK remains the projection source.
          </p>
        </div>
        <div className="history-import-actions">
          <button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}>
            {history === null ? "Import NFLverse history" : "Replace history file"}
          </button>
          {history === null ? null : (
            <button className="ghost-button" type="button" onClick={onClear}>
              Clear history
            </button>
          )}
          <input
            ref={inputRef}
            data-testid="nflverse-history-input"
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleImport(event)}
          />
        </div>
      </div>

      {history === null ? (
        <div className="history-empty-state">
          <strong>Historical enrichment is optional.</strong>
          <span>The UDK release can still run without it, but player IDs and prior-year context will be limited.</span>
        </div>
      ) : report === null ? (
        <div className="history-ready-state" role="status">
          <strong>NFLverse {history.prior_season} history is ready.</strong>
          <span>{filename} · Import a UDK ZIP to match {history.players.length} identity records.</span>
        </div>
      ) : (
        <div className="history-preview" role="status">
          <div className="history-ready-row">
            <span className="history-ready-badge">NFLverse {report.priorSeason} matched</span>
            <span>{filename}</span>
          </div>
          <div className="history-metrics">
            <Metric label="UDK matched" value={report.matchedPlayerCount} />
            <Metric label="With prior stats" value={report.matchedWithHistoryCount} />
            <Metric label="Exact names" value={report.exactMatchCount} />
            <Metric label="Team resolved" value={report.teamDisambiguatedCount} />
            <Metric
              label="Needs review"
              value={report.unmatchedPlayers.length + report.ambiguousPlayers.length}
            />
          </div>
          <p className="history-preview-note">
            {report.matchedPlayerCount} of {report.udkPlayerCount} UDK players now use stable NFLverse IDs.
            Defenses remain team-based UDK records.
          </p>
          {report.unmatchedPlayers.length + report.ambiguousPlayers.length === 0 ? null : (
            <details className="history-review-list">
              <summary>
                {report.unmatchedPlayers.length + report.ambiguousPlayers.length} player
                {report.unmatchedPlayers.length + report.ambiguousPlayers.length === 1 ? "" : "s"} need review
              </summary>
              <ul>
                {report.ambiguousPlayers.slice(0, 8).map((item) => (
                  <li key={item.playerId}>
                    <strong>{item.displayName}</strong> — candidates: {item.candidates
                      .map((candidate) => `${candidate.displayName} (${candidate.currentTeam ?? "FA"})`)
                      .join(", ")}
                  </li>
                ))}
                {report.unmatchedPlayers.slice(0, 8).map((item) => (
                  <li key={item}>{item} — no close NFLverse candidate</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
