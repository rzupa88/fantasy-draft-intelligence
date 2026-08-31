import { describe, expect, it } from "vitest";
import {
  DEFAULT_DRAFT_SETUP,
  createDraftFromSetup,
  normalizeTeamNames,
} from "../src/draft-factory.js";

describe("draft team names", () => {
  it("carries setup names into draft teams by slot", () => {
    const teamNames = Array.from({ length: 12 }, (_, index) => `Manager ${index + 1}`);
    const state = createDraftFromSetup(
      { ...DEFAULT_DRAFT_SETUP, teamNames },
      "named-league",
    );

    expect(state.teams.map((team) => team.name)).toEqual(teamNames);
    expect(state.teams[DEFAULT_DRAFT_SETUP.userDraftSlot - 1]?.isUser).toBe(true);
  });

  it("fills blank or missing entries with readable slot defaults", () => {
    const names = normalizeTeamNames(["Ryan", "", "Nicole"], 4, 2);

    expect(names).toEqual(["Ryan", "My Team", "Nicole", "Team 4"]);
  });
});
