import { useRef, type ChangeEvent, type FormEvent } from "react";
import type { DraftState } from "@fdi/shared-types";
import {
  SCORING_OPTIONS,
  TEAM_COUNT_OPTIONS,
  getStarterCapacity,
  normalizeTeamNames,
  type DraftSetup,
  type SupportedScoringPreset,
} from "../draft-factory.js";
import type {
  NflverseEnrichmentReport,
  NflverseHistoryRelease,
} from "../nflverse-history.js";
import {
  UDK_ADP_SOURCES,
  type UdkAdpSource,
  type UdkBuildReport,
} from "../udk-importer.js";
import { HistoricalLeagueCard } from "./HistoricalLeagueCard.js";
import { NflverseHistoryCard } from "./NflverseHistoryCard.js";
import { RosterConfigurator } from "./RosterConfigurator.js";
import { TeamNameConfigurator } from "./TeamNameConfigurator.js";
import { UdkImportCard } from "./UdkImportCard.js";

interface RecoverySetupScreenProps {
  setup: DraftSetup;
  recoveredDraft: DraftState | null;
  udkReport: UdkBuildReport | null;
  udkFilename: string | null;
  history: NflverseHistoryRelease | null;
  historyReport: NflverseEnrichmentReport | null;
  historyFilename: string | null;
  errorMessage: string | null;
  onSetupChange: (setup: DraftSetup) => void;
  onStartDraft: () => void;
  onResumeDraft: () => void;
  onDiscardRecovery: () => void;
  onImportDraft: (file: File) => Promise<boolean>;
  onImportUdk: (file: File) => Promise<void>;
  onClearUdk: () => void;
  onImportHistory: (file: File) => Promise<void>;
  onClearHistory: () => void;
}

const ADP_SOURCE_LABELS: Record<UdkAdpSource, string> = {
  average: "Average market",
  sleeper: "Sleeper",
  espn: "ESPN",
  yahoo: "Yahoo",
  underdog: "Underdog",
};

export function RecoverySetupScreen({
  setup,
  recoveredDraft,
  udkReport,
  udkFilename,
  history,
  historyReport,
  historyFilename,
  errorMessage,
  onSetupChange,
  onStartDraft,
  onResumeDraft,
  onDiscardRecovery,
  onImportDraft,
  onImportUdk,
  onClearUdk,
  onImportHistory,
  onClearHistory,
}: RecoverySetupScreenProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const draftSlots = Array.from({ length: setup.teamCount }, (_, index) => index + 1);
  const starterCount = getStarterCapacity(setup.rosterCounts);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onStartDraft();
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (file !== undefined) await onImportDraft(file);
    event.target.value = "";
  }

  const sourceLabel =
    udkReport === null
      ? "Demonstration release"
      : historyReport === null
        ? `UDK ${udkReport.season}`
        : `UDK ${udkReport.season} + NFLverse ${historyReport.priorSeason}`;

  return (
    <main className="setup-shell">
      <section className="setup-hero">
        <div className="brand-mark" aria-hidden="true">FDI</div>
        <p className="eyebrow">Local-first draft intelligence</p>
        <h1>Build your draft room.</h1>
        <p className="setup-lede">
          Configure the league and roster, name every draft slot, load fresh UDK projections,
          NFLverse production, and your league&apos;s past Yahoo draft results, then run the entire
          snake draft from one laptop.
        </p>
        <div className="feature-strip" aria-label="Draft room capabilities">
          <span>UDK projections</span>
          <span>League history</span>
          <span>Named teams</span>
          <span>Automatic recovery</span>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Draft control</p>
            <h2 id="setup-title">League setup</h2>
          </div>
          <button className="secondary-button" type="button" onClick={() => importInputRef.current?.click()}>
            Import backup
          </button>
          <input
            ref={importInputRef}
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleImport(event)}
          />
        </div>

        {recoveredDraft === null ? null : (
          <section className="recovery-card" aria-labelledby="recovery-title">
            <div>
              <p className="eyebrow">Autosaved draft found</p>
              <h3 id="recovery-title">{recoveredDraft.settings.leagueName}</h3>
              <p>
                {recoveredDraft.picks.length} of {recoveredDraft.order.length} picks recorded · revision {recoveredDraft.revision}
              </p>
            </div>
            <div className="recovery-actions">
              <button className="primary-button" type="button" onClick={onResumeDraft}>Resume draft</button>
              <button className="ghost-button" type="button" onClick={onDiscardRecovery}>Discard save</button>
            </div>
          </section>
        )}

        <form className="setup-form" onSubmit={handleSubmit}>
          <label className="field field-wide">
            <span>League name</span>
            <input
              value={setup.leagueName}
              onChange={(event) => onSetupChange({ ...setup, leagueName: event.target.value })}
              placeholder="Friday Night League"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>Teams</span>
            <select
              value={setup.teamCount}
              onChange={(event) => {
                const teamCount = Number(event.target.value);
                const userDraftSlot = Math.min(setup.userDraftSlot, teamCount);
                onSetupChange({
                  ...setup,
                  teamCount,
                  userDraftSlot,
                  teamNames: normalizeTeamNames(setup.teamNames, teamCount, userDraftSlot),
                });
              }}
            >
              {TEAM_COUNT_OPTIONS.map((teamCount) => (
                <option key={teamCount} value={teamCount}>{teamCount} teams</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Your draft slot</span>
            <select
              value={setup.userDraftSlot}
              onChange={(event) => onSetupChange({ ...setup, userDraftSlot: Number(event.target.value) })}
            >
              {draftSlots.map((slot) => (
                <option key={slot} value={slot}>Pick {slot}</option>
              ))}
            </select>
          </label>

          <div className="field draft-length-field">
            <span>Draft length</span>
            <strong>{setup.rounds} rounds</strong>
            <small>{setup.teamCount * setup.rounds} total picks</small>
          </div>

          <TeamNameConfigurator setup={setup} onSetupChange={onSetupChange} />
          <HistoricalLeagueCard setup={setup} />

          <fieldset className="scoring-fieldset field-wide">
            <legend>Scoring</legend>
            <div className="scoring-grid">
              {SCORING_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`scoring-option ${setup.scoringPreset === option.value ? "scoring-option-active" : ""}`}
                >
                  <input
                    type="radio"
                    name="scoring"
                    value={option.value}
                    checked={setup.scoringPreset === option.value}
                    onChange={(event) =>
                      onSetupChange({ ...setup, scoringPreset: event.target.value as SupportedScoringPreset })
                    }
                  />
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field field-wide adp-market-field">
            <span>ADP market</span>
            <select
              value={setup.adpSource}
              onChange={(event) => onSetupChange({ ...setup, adpSource: event.target.value as UdkAdpSource })}
            >
              {UDK_ADP_SOURCES.map((source) => (
                <option key={source} value={source}>{ADP_SOURCE_LABELS[source]}</option>
              ))}
            </select>
            <small>
              UDK round-and-pick values are converted using this league&apos;s {setup.teamCount}-team size.
            </small>
          </label>

          <RosterConfigurator setup={setup} onSetupChange={onSetupChange} />
          <UdkImportCard report={udkReport} filename={udkFilename} onImport={onImportUdk} onClear={onClearUdk} />
          <NflverseHistoryCard
            history={history}
            report={historyReport}
            filename={historyFilename}
            onImport={onImportHistory}
            onClear={onClearHistory}
          />

          <div className="setup-summary field-wide">
            <div><span>Starting lineup</span><strong>{starterCount} active roster spots</strong></div>
            <div><span>Bench</span><strong>{setup.rosterCounts.BENCH} reserve spots</strong></div>
            <div>
              <span>Draft size</span>
              <strong>{setup.rounds} rounds · {setup.teamCount * setup.rounds} selections</strong>
            </div>
            <div><span>Player source</span><strong>{sourceLabel}</strong></div>
          </div>

          {errorMessage === null ? null : <p className="form-error" role="alert">{errorMessage}</p>}

          <button className="primary-button field-wide" type="submit">
            Start new draft <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}
