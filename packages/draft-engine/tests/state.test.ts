import { describe, expect, it } from "vitest";
import {
  buildRosters,
  correctPick,
  createDraftState,
  getCurrentOrderSlot,
  makePick,
  undoLastPick,
} from "@fdi/draft-engine";
import { leagueSettings, playerPool } from "./fixtures.js";

describe("draft state transitions", () => {
  it("creates a deterministic initial state", () => {
    const state = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 3 }),
      playerPoolIds: playerPool(20),
    });

    expect(state.status).toBe("not_started");
    expect(state.nextOverallPick).toBe(1);
    expect(state.picks).toEqual([]);
    expect(getCurrentOrderSlot(state)?.teamId).toBe("team-1");
  });

  it("records picks, advances the clock, and updates rosters", () => {
    const initial = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
      playerPoolIds: playerPool(12),
    });

    const afterOne = makePick(initial, "player-1");
    const afterTwo = makePick(afterOne, "player-2");

    expect(initial.picks).toHaveLength(0);
    expect(afterTwo.status).toBe("in_progress");
    expect(afterTwo.nextOverallPick).toBe(3);
    expect(afterTwo.availablePlayerIds).not.toContain("player-1");
    expect(buildRosters(afterTwo)).toEqual({
      "team-1": ["player-1"],
      "team-2": ["player-2"],
      "team-3": [],
      "team-4": [],
    });
  });

  it("prevents a player from being selected twice", () => {
    const initial = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
      playerPoolIds: playerPool(12),
    });
    const afterOne = makePick(initial, "player-1");

    expect(() => makePick(afterOne, "player-1")).toThrow(/not available/);
  });

  it("undoes the most recent pick and restores availability", () => {
    const initial = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
      playerPoolIds: playerPool(12),
    });
    const afterTwo = makePick(makePick(initial, "player-1"), "player-2");
    const undone = undoLastPick(afterTwo);

    expect(undone.picks.map((pick) => pick.playerId)).toEqual(["player-1"]);
    expect(undone.availablePlayerIds).toContain("player-2");
    expect(undone.nextOverallPick).toBe(2);
  });

  it("corrects an earlier pick without changing its board position", () => {
    const initial = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
      playerPoolIds: playerPool(12),
    });
    const afterThree = makePick(
      makePick(makePick(initial, "player-1"), "player-2"),
      "player-3",
    );
    const corrected = correctPick(afterThree, 1, "player-4");

    expect(corrected.picks[0]).toMatchObject({
      overallPick: 1,
      teamId: "team-1",
      playerId: "player-4",
    });
    expect(corrected.availablePlayerIds).toContain("player-1");
    expect(corrected.availablePlayerIds).not.toContain("player-4");
    expect(corrected.nextOverallPick).toBe(4);
  });

  it("runs a complete twelve-team, sixteen-round draft", () => {
    const settings = leagueSettings();
    const players = playerPool(settings.teamCount * settings.rounds + 20);
    let state = createDraftState({
      draftId: "full-simulation",
      settings,
      playerPoolIds: players,
    });

    for (let index = 0; index < settings.teamCount * settings.rounds; index += 1) {
      state = makePick(state, players[index]!);
    }

    expect(state.status).toBe("complete");
    expect(state.nextOverallPick).toBeNull();
    expect(state.picks).toHaveLength(192);
    expect(new Set(state.picks.map((pick) => pick.playerId)).size).toBe(192);
    expect(Object.values(buildRosters(state)).every((roster) => roster.length === 16)).toBe(true);
    expect(() => makePick(state, players[192]!)).toThrow(/already complete/);
  });
});
