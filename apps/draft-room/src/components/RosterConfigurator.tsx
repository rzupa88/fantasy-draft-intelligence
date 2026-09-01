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
    if (option === undefined) return;
    const boundedCount = Math.max(option.min, Math.min(option.max, nextCount));
    onSetupChange(setRosterCount(setup, slot, boundedCount));
  }

  function changeTeamName(index: number, value: string): void {
    const teamNames = [...setup.teamNames];
    teamNames[index] = value;
    onSetupChange({ ...setup, teamNames });
  }

  function moveTeam(index: number, direction: -1 | 1): void {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= setup.teamCount) return;

    const teamNames = [...setup.teamNames];
    [teamNames[index], teamNames[targetIndex]] = [teamNames[targetIndex]!, teamNames[index]!];

    let userDraftSlot = setup.userDraftSlot;
    const currentSlot = index + 1;
    const targetSlot = targetIndex + 1;
    if (userDraftSlot === currentSlot) userDraftSlot = targetSlot;
    else if (userDraftSlot === targetSlot) userDraftSlot = currentSlot;

    onSetupChange({ ...setup, teamNames, userDraftSlot });
  }

  return (
    <>
      <fieldset className="team-order-fieldset field-wide">
        <legend className="sr-only">Team names and draft order</legend>
        <div className="roster-heading">
          <div>
            <h3>Team names & draft order</h3>
            <p>Enter each manager or team name in draft-slot order. Mark your team so the app knows when you are on the clock.</p>
          </div>
        </div>

        <div className="team-order-list">
          {Array.from({ length: setup.teamCount }, (_, index) => {
            const slot = index + 1;
            const isUser = setup.userDraftSlot === slot;
            return (
              <div className={`team-order-row ${isUser ? "team-order-row-user" : ""}`} key={slot}>
                <div className="draft-slot-badge">
                  <span>Pick</span>
                  <strong>{slot}</strong>
                </div>
                <label className="team-name-field">
                  <span className="sr-only">Team name for draft slot {slot}</span>
                  <input
                    type="text"
                    value={setup.teamNames[index] ?? `Team ${slot}`}
                    onChange={(event) => changeTeamName(index, event.target.value)}
                    placeholder={`Team ${slot}`}
                    autoComplete="off"
                  />
                </label>
                <label className="my-team-control">
                  <input
                    type="radio"
                    name="user-draft-team"
                    checked={isUser}
                    onChange={() => onSetupChange({ ...setup, userDraftSlot: slot })}
                  />
                  <span>My team</span>
                </label>
                <div className="team-order-actions" aria-label={`Move ${setup.teamNames[index] ?? `Team ${slot}`} in draft order`}>
                  <button type="button" disabled={index === 0} onClick={() => moveTeam(index, -1)} aria-label={`Move draft slot ${slot} up`}>↑</button>
                  <button type="button" disabled={index === setup.teamCount - 1} onClick={() => moveTeam(index, 1)} aria-label={`Move draft slot ${slot} down`}>↓</button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="team-order-note">Snake order is generated automatically from this first-round order.</p>
      </fieldset>

      <fieldset className="roster-fieldset field-wide">
        <legend className="sr-only">Roster configuration</legend>
        <div className="roster-heading">
          <div>
            <h3>Roster configuration</h3>
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
                  <button type="button" aria-label={`Decrease ${option.label}`} disabled={count <= option.min} onClick={() => changeCount(option.slot, count - 1)}>−</button>
                  <input type="number" min={option.min} max={option.max} step="1" value={count} aria-label={`${option.label} roster slots`} onChange={(event) => changeCount(option.slot, Number(event.target.value))} />
                  <button type="button" aria-label={`Increase ${option.label}`} disabled={count >= option.max} onClick={() => changeCount(option.slot, count + 1)}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`roster-capacity ${isCapacityValid ? "" : "roster-capacity-invalid"}`}>
          <span><strong>{starterSlots}</strong> starters</span>
          <span><strong>{setup.rosterCounts.BENCH}</strong> bench</span>
          <span><strong>{totalSlots}</strong> rounds</span>
          <small>{isCapacityValid ? `${setup.teamCount * totalSlots} total selections in this league.` : "Use between 8 and 24 total slots with at least one starter."}</small>
        </div>
      </fieldset>
    </>
  );
}
