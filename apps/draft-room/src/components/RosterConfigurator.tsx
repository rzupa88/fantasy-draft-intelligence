import type { RosterSlotType } from "@fdi/shared-types";
import {
  ROSTER_SLOT_OPTIONS,
  getRosterCapacity,
  getStarterCapacity,
  resetRosterCounts,
  setRosterCount,
  type DraftSetup,
} from "../draft-factory.js";

interface RosterConfiguratorProps {
  setup: DraftSetup;
  onSetupChange: (setup: DraftSetup) => void;
}

export function RosterConfigurator({ setup, onSetupChange }: RosterConfiguratorProps) {
  const totalSlots = getRosterCapacity(setup.rosterCounts);
  const starterSlots = getStarterCapacity(setup.rosterCounts);
  const isCapacityValid = totalSlots >= 8 && totalSlots <= 24 && starterSlots > 0;

  function changeCount(slot: RosterSlotType, nextCount: number): void {
    const option = ROSTER_SLOT_OPTIONS.find((candidate) => candidate.slot === slot);
    if (option === undefined) {
      return;
    }
    const boundedCount = Math.max(option.min, Math.min(option.max, nextCount));
    onSetupChange(setRosterCount(setup, slot, boundedCount));
  }

  return (
    <fieldset className="roster-fieldset field-wide">
      <div className="roster-heading">
        <div>
          <legend>Roster configuration</legend>
          <p>Draft rounds update automatically from the total number of roster slots.</p>
        </div>
        <button
          className="ghost-button roster-reset-button"
          type="button"
          onClick={() => onSetupChange(resetRosterCounts(setup))}
        >
          Reset standard
        </button>
      </div>

      <div className="roster-grid">
        {ROSTER_SLOT_OPTIONS.map((option) => {
          const count = setup.rosterCounts[option.slot];
          return (
            <div className="roster-slot-card" key={option.slot}>
              <div className="roster-slot-copy">
                <strong>{option.slot}</strong>
                <span>{option.label}</span>
                <small>{option.description}</small>
              </div>
              <div className="roster-stepper">
                <button
                  type="button"
                  aria-label={`Decrease ${option.label}`}
                  disabled={count <= option.min}
                  onClick={() => changeCount(option.slot, count - 1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min={option.min}
                  max={option.max}
                  step="1"
                  value={count}
                  aria-label={`${option.label} roster slots`}
                  onChange={(event) => changeCount(option.slot, Number(event.target.value))}
                />
                <button
                  type="button"
                  aria-label={`Increase ${option.label}`}
                  disabled={count >= option.max}
                  onClick={() => changeCount(option.slot, count + 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`roster-capacity ${isCapacityValid ? "" : "roster-capacity-invalid"}`}>
        <span>
          <strong>{starterSlots}</strong> starters
        </span>
        <span>
          <strong>{setup.rosterCounts.BENCH}</strong> bench
        </span>
        <span>
          <strong>{totalSlots}</strong> rounds
        </span>
        <small>
          {isCapacityValid
            ? `${setup.teamCount * totalSlots} total selections in this league.`
            : "Use between 8 and 24 total slots with at least one starter."}
        </small>
      </div>
    </fieldset>
  );
}
