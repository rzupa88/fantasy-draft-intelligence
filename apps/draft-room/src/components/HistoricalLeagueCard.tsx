import { useRef, useState, type ChangeEvent } from "react";
import type { DraftSetup } from "../draft-factory.js";
import {
  clearHistoricalLeagueStorage,
  getHistoricalTeamMatchCount,
  loadHistoricalLeaguePreference,
  saveHistoricalLeaguePreference,
} from "../historical-league-storage.js";
import {
  parseHistoricalDraftWorkbook,
  type HistoricalLeagueData,
} from "../historical-league.js";

interface HistoricalLeagueCardProps {
  setup: DraftSetup;
}

export function HistoricalLeagueCard({ setup }: HistoricalLeagueCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [initial] = useState(() => loadHistoricalLeaguePreference());
  const [history, setHistory] = useState<HistoricalLeagueData | null>(initial.history);
  const [filename, setFilename] = useState<string | null>(initial.filename);
  const [enabled, setEnabled] = useState(initial.enabled && initial.history !== null);
  const [error, setError] = useState<string | null>(null);
  const matchCount = history === null ? 0 : getHistoricalTeamMatchCount(history, setup.teamNames);

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file === undefined) return;

    try {
      const parsed = parseHistoricalDraftWorkbook(new Uint8Array(await file.arrayBuffer()));
      setHistory(parsed);
      setFilename(file.name);
      setEnabled(true);
      setError(null);
      saveHistoricalLeaguePreference({ history: parsed, filename: file.name, enabled: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The historical workbook could not be imported.");
    }
  }

  function toggleEnabled(nextEnabled: boolean): void {
    setEnabled(nextEnabled);
    saveHistoricalLeaguePreference({ history, filename, enabled: nextEnabled });
  }

  function clearHistory(): void {
    setHistory(null);
    setFilename(null);
    setEnabled(false);
    setError(null);
    clearHistoricalLeagueStorage();
  }

  return (
    <section className="historical-league-card field-wide" aria-labelledby="historical-league-title">
      <div className="historical-league-heading">
        <div>
          <p className="eyebrow">Your league&apos;s behavior</p>
          <h3 id="historical-league-title">Historical League Intelligence</h3>
          <p>
            Import the Fantasy Football Draft Analysis workbook built from your pasted Yahoo draft
            results. This first version supports that workbook layout directly.
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}>
          {history === null ? "Import history" : "Replace workbook"}
        </button>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx"
          onChange={(event) => void handleImport(event)}
        />
      </div>

      {history === null ? (
        <div className="historical-league-empty">
          <strong>No historical workbook loaded.</strong>
          <span>Expected worksheet: Draft Results · Supported years are detected automatically.</span>
        </div>
      ) : (
        <>
          <div className="historical-league-file-row">
            <div>
              <span>Workbook</span>
              <strong>{filename ?? "Historical draft workbook"}</strong>
            </div>
            <button className="ghost-button" type="button" onClick={clearHistory}>Remove</button>
          </div>

          <div className="historical-league-stats">
            <HistoryStat label="Seasons" value={String(history.years.length)} detail={history.years.join("–")} />
            <HistoryStat label="Draft picks" value={String(history.picks.length)} detail="Parsed from Draft Results" />
            <HistoryStat label="Historical teams" value={String(history.teams.length)} detail={`${history.teamCount}-team draft`} />
            <HistoryStat label="Current matches" value={`${matchCount}/${setup.teamCount}`} detail="Based on team names above" />
          </div>

          <label className={`historical-league-toggle ${enabled ? "historical-league-toggle-active" : ""}`}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => toggleEnabled(event.target.checked)}
            />
            <span className="historical-toggle-control" aria-hidden="true" />
            <span>
              <strong>Use historical draft knowledge</strong>
              <small>
                Adds a conservative league-specific signal to availability and position-pressure decisions.
              </small>
            </span>
          </label>

          {history.warnings.map((warning) => <p className="historical-league-warning" key={warning}>{warning}</p>)}
        </>
      )}

      {error === null ? null : <p className="form-error" role="alert">{error}</p>}
    </section>
  );
}

function HistoryStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="historical-league-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}
