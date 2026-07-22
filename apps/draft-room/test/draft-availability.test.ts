import { describe, expect, it } from "vitest";
import { makePick } from "@fdi/draft-engine";
import { recommendPlayers } from "@fdi/recommendation-engine";
import { reconcileDraftAvailability } from "../src/draft-availability.js";
import { DEFAULT_DRAFT_SETUP, createDraftFromSetup } from "../src/draft-factory.js";

describe("draft recommendation availability", () => {
  it("never recommends a player already recorded in the draft picks", () => {
    const initial = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "availability-regression");
    const draftedPlayerId = initial.availablePlayerIds[0]!;
    const picked = makePick(initial, draftedPlayerId);

    // Simulate stale recovery/import data that incorrectly marks the pick available.
    const inconsistent = {
      ...picked,
      availablePlayerIds: [draftedPlayerId, ...picked.availablePlayerIds],
    };

    const reconciled = reconcileDraftAvailability(inconsistent);
    const recommendations = recommendPlayers(reconciled, { limit: 100 }).recommendations;

    expect(reconciled.availablePlayerIds).not.toContain(draftedPlayerId);
    expect(recommendations.map((recommendation) => recommendation.playerId)).not.toContain(
      draftedPlayerId,
    );
  });

  it("restores an undrafted player omitted from a stale available-player list", () => {
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "missing-availability-regression");
    const omittedPlayerId = state.availablePlayerIds[1]!;
    const inconsistent = {
      ...state,
      availablePlayerIds: state.availablePlayerIds.filter((playerId) => playerId !== omittedPlayerId),
    };

    expect(reconcileDraftAvailability(inconsistent).availablePlayerIds).toContain(omittedPlayerId);
  });
});
