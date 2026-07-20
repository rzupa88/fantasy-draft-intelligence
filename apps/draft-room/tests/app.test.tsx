import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makePick } from "@fdi/draft-engine";
import { recommendPlayers } from "@fdi/recommendation-engine";
import { App } from "../src/App.js";
import {
  DEFAULT_DRAFT_SETUP,
  createDraftFromSetup,
  createRosterSlots,
} from "../src/draft-factory.js";

describe("draft room application shell", () => {
  it("renders the league setup experience", () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain("Build your draft room.");
    expect(html).toContain("Start live draft");
    expect(html).toContain("Offline fictional demo release");
  });

  it("creates a complete engine-backed snake draft from setup", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "ui-test-draft");
    const userTeam = state.teams.find((team) => team.isUser);

    expect(state.order).toHaveLength(DEFAULT_DRAFT_SETUP.teamCount * DEFAULT_DRAFT_SETUP.rounds);
    expect(state.playerPoolIds.length).toBeGreaterThan(state.order.length);
    expect(userTeam?.draftSlot).toBe(DEFAULT_DRAFT_SETUP.userDraftSlot);
    expect(state.status).toBe("not_started");
  });

  it("keeps roster capacity aligned with the selected round count", () => {
    const rosterSlots = createRosterSlots(18);
    const capacity = rosterSlots.reduce((sum, rule) => sum + rule.count, 0);
    const bench = rosterSlots.find((rule) => rule.slot === "BENCH");

    expect(capacity).toBe(18);
    expect(bench?.count).toBe(9);
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
