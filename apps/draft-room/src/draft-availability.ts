import type { DraftState } from "@fdi/shared-types";

/**
 * Recorded picks are the source of truth for player availability.
 *
 * Normal draft-engine actions already maintain availablePlayerIds, but this
 * boundary guard protects recommendation surfaces from stale recovery data,
 * imported drafts, or future callers that construct an inconsistent state.
 */
export function reconcileDraftAvailability(state: DraftState): DraftState {
  const draftedPlayerIds = new Set(state.picks.map((pick) => pick.playerId));
  const playerPoolIds = new Set(state.playerPoolIds);
  const reconciledAvailableIds = state.availablePlayerIds.filter(
    (playerId) => playerPoolIds.has(playerId) && !draftedPlayerIds.has(playerId),
  );

  const missingUndraftedIds = state.playerPoolIds.filter(
    (playerId) => !draftedPlayerIds.has(playerId) && !reconciledAvailableIds.includes(playerId),
  );
  const availablePlayerIds = [...reconciledAvailableIds, ...missingUndraftedIds];

  const unchanged =
    availablePlayerIds.length === state.availablePlayerIds.length &&
    availablePlayerIds.every((playerId, index) => playerId === state.availablePlayerIds[index]);

  return unchanged ? state : { ...state, availablePlayerIds };
}

export function assertRecommendationsAreAvailable(
  state: DraftState,
  recommendationPlayerIds: string[],
): void {
  const availablePlayerIds = new Set(state.availablePlayerIds);
  const draftedPlayerIds = new Set(state.picks.map((pick) => pick.playerId));
  const invalidPlayerId = recommendationPlayerIds.find(
    (playerId) => !availablePlayerIds.has(playerId) || draftedPlayerIds.has(playerId),
  );

  if (invalidPlayerId !== undefined) {
    throw new Error(`Recommendation invariant failed for unavailable player ${invalidPlayerId}.`);
  }
}
