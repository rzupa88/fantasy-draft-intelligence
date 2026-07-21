import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makePick } from "@fdi/draft-engine";
import { recommendPlayers } from "@fdi/recommendation-engine";
import { App } from "../src/App.js";
import {
  DEFAULT_DRAFT_SETUP,
  DEFAULT_ROSTER_COUNTS,
  createDraftFromSetup,
  createRosterSlots,
  getRosterCapacity,
  setRosterCount,
} from "../src/draft-factory.js";

describe("draft room application shell", () => {
  it("renders league, UDK, NFLverse, recovery, and custom roster controls", () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain("Build your draft room.");
    expect(html).toContain("Start new draft");
    expect(html).toContain("Import backup");
    expect(html).toContain("Import UDK files");
    expect(html).toContain("Import newer history");
    expect(html).toContain("ADP market");
    expect(html).toContain("Roster configuration");
    expect(html).toContain("Superflex");
    expect(html).toContain("Demonstration release");
  });

  it("creates a complete engine-backed snake draft from setup", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "ui-test-draft");
    const userTeam = state.teams.find((team) => team.isUser);

    expect(state.order).toHaveLength(DEFAULT_DRAFT_SETUP.teamCount * DEFAULT_DRAFT_SETUP.rounds);
    expect(state.playerPoolIds.length).toBeGreaterThan(state.order.length);
    expect(userTeam?.draftSlot).toBe(DEFAULT_DRAFT_SETUP.userDraftSlot);
    expect(state.status).toBe("not_started");
  });

  it("derives draft rounds from custom roster capacity", () => {
    let setup = setRosterCount(DEFAULT_DRAFT_SETUP, "SUPERFLEX", 1);
    setup = setRosterCount(setup, "K", 0);
    setup = setRosterCount(setup, "BENCH", 8);

    const state = createDraftFromSetup(setup, "custom-roster-test");

    expect(setup.rounds).toBe(17);
    expect(state.settings.rounds).toBe(17);
    expect(state.order).toHaveLength(204);
    expect(state.settings.rosterSlots.find((rule) => rule.slot === "SUPERFLEX")?.count).toBe(1);
    expect(state.settings.rosterSlots.find((rule) => rule.slot === "K")?.count).toBe(0);
    expect(state.settings.rosterSlots.find((rule) => rule.slot === "BENCH")?.count).toBe(8);
  });

  it("maps every configurable roster slot to engine eligibility", () => {
    const rosterCounts = {
      ...DEFAULT_ROSTER_COUNTS,
      SUPERFLEX: 1,
      K: 0,
      DST: 0,
    };
    const rosterSlots = createRosterSlots(rosterCounts);
    const capacity = rosterSlots.reduce((sum, rule) => sum + rule.count, 0);
    const superflex = rosterSlots.find((rule) => rule.slot === "SUPERFLEX");

    expect(capacity).toBe(getRosterCapacity(rosterCounts));
    expect(superflex?.eligiblePositions).toEqual(["QB", "RB", "WR", "TE"]);
  });

  it("connects manual selections to live recommendations", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "recommendation-ui-test");
    const draftedPlayerId = state.availablePlayerIds[0]!;
    const nextState = makePick(state, draftedPlayerId);
    const result = recommendPlayers(nextState, { limit: 5 });

    expect(nextState.picks).toHaveLength(1);
    expect(nextState.availablePlayerIds).not.toContain(draftedPlayerId);
    expect(result.recommendations.map((item) => item.playerId)).not.toContain(draftedPlayerId);
    expect(result.recommendations).toHaveLength(5);
  });
});
