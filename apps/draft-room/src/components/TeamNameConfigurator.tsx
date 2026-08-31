import {
  createDefaultTeamNames,
  normalizeTeamNames,
  type DraftSetup,
} from "../draft-factory.js";

interface TeamNameConfiguratorProps {
  setup: DraftSetup;
  onSetupChange: (setup: DraftSetup) => void;
}

export function TeamNameConfigurator({ setup, onSetupChange }: TeamNameConfiguratorProps) {
  const names = normalizeTeamNames(setup.teamNames, setup.teamCount, setup.userDraftSlot);

  function updateTeamName(index: number, value: string): void {
    const teamNames = [...names];
    teamNames[index] = value;
    onSetupChange({ ...setup, teamNames });
  }

  return (
    <fieldset className="team-name-fieldset field-wide">
      <div className="team-name-heading">
        <div>
          <legend>Draft board team names</legend>
          <p>Name each draft slot so the board and roster tracker match your live league.</p>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={() =>
            onSetupChange({
              ...setup,
              teamNames: createDefaultTeamNames(setup.teamCount, setup.userDraftSlot),
            })
          }
        >
          Reset names
        </button>
      </div>

      <div className="team-name-grid">
        {names.map((name, index) => {
          const slot = index + 1;
          const isUser = slot === setup.userDraftSlot;
          return (
            <label className={`team-name-field ${isUser ? "team-name-field-user" : ""}`} key={slot}>
              <span>
                Draft slot {slot}
                {isUser ? <strong>You</strong> : null}
              </span>
              <input
                value={name}
                onChange={(event) => updateTeamName(index, event.target.value)}
                placeholder={isUser ? "My Team" : `Team ${slot}`}
                maxLength={40}
                autoComplete="off"
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
