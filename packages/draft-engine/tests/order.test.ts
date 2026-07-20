import { describe, expect, it } from "vitest";
import { createDraftTeams, generateSnakeDraftOrder, validateLeagueSettings } from "@fdi/draft-engine";
import { leagueSettings } from "./fixtures.js";

describe("snake draft order", () => {
  it("reverses team order in even rounds", () => {
    const settings = leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 3 });
    const order = generateSnakeDraftOrder(settings);

    expect(order.map((slot) => slot.draftSlot)).toEqual([1, 2, 3, 4, 4, 3, 2, 1, 1, 2, 3, 4]);
    expect(order.map((slot) => slot.overallPick)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("identifies the configured user team", () => {
    const settings = leagueSettings({ teamCount: 4, userDraftSlot: 3, rounds: 2 });
    const teams = createDraftTeams(settings, ["A", "B", "Ryan", "D"]);

    expect(teams.filter((team) => team.isUser)).toEqual([
      { teamId: "team-3", name: "Ryan", draftSlot: 3, isUser: true },
    ]);
  });

  it("rejects a user draft slot outside the league", () => {
    const settings = leagueSettings({ teamCount: 10, userDraftSlot: 11 });

    expect(() => validateLeagueSettings(settings)).toThrow(/userDraftSlot/);
  });
});
