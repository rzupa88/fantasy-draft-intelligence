import { describe, expect, it } from "vitest";
import {
  buildRosterAssignments,
  buildRosters,
  correctPick,
  createDraftState,
  getCurrentOrderSlot,
  getPlayerById,
  makePick,
  undoLastPick,
} from "@fdi/draft-engine";
import {
  fullDraftPlayerRelease,
  generatedPlayerRelease,
  leagueSettings,
  playerDataRelease,
  playerRecord,
} from "./fixtures.js";

describe("draft state transitions", () => {
  it("creates a deterministic initial state", () => {
    const state = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 3 }),
      playerDataRelease: generatedPlayerRelease(20),
    });

    expect(state.status).toBe("not_started");
    expect(state.nextOverallPick).toBe(1);
    expect(state.picks).toEqual([]);
    expect(getCurrentOrderSlot(state)?.teamId).toBe("team-1");
    expect(getPlayerById(state, "player-1")?.canonical_player_id).toBe("player-1");
  });

  it("records picks, advances the clock, and updates rosters", () => {
    const initial = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
      playerDataRelease: generatedPlayerRelease(12),
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
      playerDataRelease: generatedPlayerRelease(12),
    });
    const afterOne = makePick(initial, "player-1");

    expect(() => makePick(afterOne, "player-1")).toThrow(/not available/);
  });

  it("undoes the most recent pick and restores availability", () => {
    const initial = createDraftState({
      draftId: "draft-1",
      settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
      playerDataRelease: generatedPlayerRelease(12),
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
      playerDataRelease: generatedPlayerRelease(12),
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

  it("uses maximum matching so flexible players do not block constrained players", () => {
    const settings = leagueSettings({
      teamCount: 2,
      userDraftSlot: 1,
      rounds: 2,
      rosterSlots: [
        { slot: "RB", count: 1, eligiblePositions: ["RB"] },
        { slot: "FLEX", count: 1, eligiblePositions: ["RB", "WR", "TE"] },
      ],
    });
    const release = playerDataRelease([
      playerRecord("wr-1", "WR", "Wide Receiver 1"),
      playerRecord("rb-2", "RB", "Running Back 2"),
      playerRecord("wr-2", "WR", "Wide Receiver 2"),
      playerRecord("rb-1", "RB", "Running Back 1"),
    ]);
    let state = createDraftState({ draftId: "matching", settings, playerDataRelease: release });
    for (const playerId of ["wr-1", "rb-2", "wr-2", "rb-1"]) {
      state = makePick(state, playerId);
    }

    expect(buildRosterAssignments(state)["team-1"]).toEqual([
      expect.objectContaining({ playerId: "wr-1", rosterSlot: "FLEX", rosterSlotIndex: 1 }),
      expect.objectContaining({ playerId: "rb-1", rosterSlot: "RB", rosterSlotIndex: 1 }),
    ]);
  });

  it("rejects a pick when a team has no legal roster slot remaining", () => {
    const settings = leagueSettings({
      teamCount: 2,
      userDraftSlot: 1,
      rounds: 2,
      rosterSlots: [
        { slot: "QB", count: 1, eligiblePositions: ["QB"] },
        { slot: "RB", count: 1, eligiblePositions: ["RB"] },
      ],
    });
    const release = playerDataRelease([
      playerRecord("qb-1", "QB"),
      playerRecord("qb-2", "QB"),
      playerRecord("rb-2", "RB"),
      playerRecord("qb-3", "QB"),
      playerRecord("rb-1", "RB"),
    ]);
    let state = createDraftState({ draftId: "invalid-roster", settings, playerDataRelease: release });
    state = makePick(state, "qb-1");
    state = makePick(state, "qb-2");
    state = makePick(state, "rb-2");

    expect(() => makePick(state, "qb-3")).toThrow(/no legal roster slot/i);
  });

  it("runs a complete twelve-team, sixteen-round draft", () => {
    const settings = leagueSettings();
    const release = fullDraftPlayerRelease(settings);
    let state = createDraftState({
      draftId: "full-simulation",
      settings,
      playerDataRelease: release,
    });

    const draftedPlayers = release.players.slice(0, settings.teamCount * settings.rounds);
    for (const player of draftedPlayers) {
      state = makePick(state, player.canonical_player_id);
    }

    expect(state.status).toBe("complete");
    expect(state.nextOverallPick).toBeNull();
    expect(state.picks).toHaveLength(192);
    expect(new Set(state.picks.map((pick) => pick.playerId)).size).toBe(192);
    expect(Object.values(buildRosters(state)).every((roster) => roster.length === 16)).toBe(true);
    expect(() => makePick(state, release.players[192]!.canonical_player_id)).toThrow(
      /already complete/,
    );
  });
});
