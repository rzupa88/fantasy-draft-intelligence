import type { FormEvent } from "react";
import {
  ROUND_OPTIONS,
  SCORING_OPTIONS,
  TEAM_COUNT_OPTIONS,
  type DraftSetup,
  type SupportedScoringPreset,
} from "../draft-factory.js";

interface SetupScreenProps {
  setup: DraftSetup;
  errorMessage: string | null;
  onSetupChange: (setup: DraftSetup) => void;
  onStartDraft: () => void;
}

export function SetupScreen({
  setup,
  errorMessage,
  onSetupChange,
  onStartDraft,
}: SetupScreenProps) {
  const draftSlots = Array.from({ length: setup.teamCount }, (_, index) => index + 1);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onStartDraft();
  }

  return (
    <main className="setup-shell">
      <section className="setup-hero">
        <div className="brand-mark" aria-hidden="true">
          FDI
        </div>
        <p className="eyebrow">Local-first draft intelligence</p>
        <h1>Build your draft room.</h1>
        <p className="setup-lede">
          Configure the league, load an offline player pool, and run the entire snake draft from
          one laptop. No platform login. No live sync dependency.
        </p>

        <div className="feature-strip" aria-label="Draft room capabilities">
          <span>Manual pick entry</span>
          <span>Live recommendations</span>
          <span>Every roster tracked</span>
          <span>Offline-safe engine</span>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">New draft</p>
            <h2 id="setup-title">League setup</h2>
          </div>
          <span className="alpha-badge">Interface alpha</span>
        </div>

        <form className="setup-form" onSubmit={handleSubmit}>
          <label className="field field-wide">
            <span>League name</span>
            <input
              value={setup.leagueName}
              onChange={(event) =>
                onSetupChange({
                  ...setup,
                  leagueName: event.target.value,
                })
              }
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
                onSetupChange({
                  ...setup,
                  teamCount,
                  userDraftSlot: Math.min(setup.userDraftSlot, teamCount),
                });
              }}
            >
              {TEAM_COUNT_OPTIONS.map((teamCount) => (
                <option key={teamCount} value={teamCount}>
                  {teamCount} teams
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Your draft slot</span>
            <select
              value={setup.userDraftSlot}
              onChange={(event) =>
                onSetupChange({
                  ...setup,
                  userDraftSlot: Number(event.target.value),
                })
              }
            >
              {draftSlots.map((slot) => (
                <option key={slot} value={slot}>
                  Pick {slot}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Rounds</span>
            <select
              value={setup.rounds}
              onChange={(event) =>
                onSetupChange({
                  ...setup,
                  rounds: Number(event.target.value),
                })
              }
            >
              {ROUND_OPTIONS.map((rounds) => (
                <option key={rounds} value={rounds}>
                  {rounds} rounds
                </option>
              ))}
            </select>
          </label>

          <fieldset className="scoring-fieldset field-wide">
            <legend>Scoring</legend>
            <div className="scoring-grid">
              {SCORING_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`scoring-option ${
                    setup.scoringPreset === option.value ? "scoring-option-active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="scoring"
                    value={option.value}
                    checked={setup.scoringPreset === option.value}
                    onChange={(event) =>
                      onSetupChange({
                        ...setup,
                        scoringPreset: event.target.value as SupportedScoringPreset,
                      })
                    }
                  />
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="setup-summary field-wide">
            <div>
              <span>Default roster</span>
              <strong>1 QB · 2 RB · 2 WR · 1 TE · FLEX · K · DST</strong>
            </div>
            <div>
              <span>Bench</span>
              <strong>{setup.rounds - 9} spots</strong>
            </div>
            <div>
              <span>Player data</span>
              <strong>Offline fictional demo release</strong>
            </div>
          </div>

          {errorMessage === null ? null : (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button className="primary-button field-wide" type="submit">
            Start live draft
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}
