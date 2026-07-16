import type {
  DraftOrderSlot,
  DraftPick,
  DraftState,
  DraftStatus,
  DraftTeam,
  LeagueSettings,
} from "@fdi/shared-types";
import { DraftEngineError } from "./errors.js";
import { createDraftTeams, generateSnakeDraftOrder } from "./order.js";

export interface CreateDraftStateInput {
  draftId: string;
  settings: LeagueSettings;
  playerPoolIds: string[];
  teamNames?: string[];
  teams?: DraftTeam[];
}

export function createDraftState(input: CreateDraftStateInput): DraftState {
  const draftId = input.draftId.trim();
  if (draftId.length === 0) {
    throw new DraftEngineError("INVALID_SETTINGS", "draftId must be a non-empty string.");
  }

  const playerPoolIds = normalizePlayerPool(input.playerPoolIds);
  const teams = input.teams ?? createDraftTeams(input.settings, input.teamNames);
  const order = generateSnakeDraftOrder(input.settings, teams);

  return {
    draftId,
    settings: structuredClone(input.settings),
    teams: structuredClone(teams),
    order,
    playerPoolIds,
    availablePlayerIds: [...playerPoolIds],
    picks: [],
    nextOverallPick: 1,
    status: "not_started",
    revision: 0,
  };
}

export function makePick(state: DraftState, playerId: string): DraftState {
  assertStateShape(state);

  if (state.nextOverallPick === null) {
    throw new DraftEngineError("DRAFT_COMPLETE", "The draft is already complete.");
  }

  const normalizedPlayerId = playerId.trim();
  if (!state.availablePlayerIds.includes(normalizedPlayerId)) {
    throw new DraftEngineError(
      "PLAYER_UNAVAILABLE",
      `Player ${normalizedPlayerId || "<empty>"} is not available.`,
    );
  }

  const orderSlot = state.order[state.nextOverallPick - 1];
  if (orderSlot === undefined) {
    throw new DraftEngineError("DRAFT_COMPLETE", "The draft order has no remaining picks.");
  }

  const pick: DraftPick = { ...orderSlot, playerId: normalizedPlayerId };
  return rebuildState(state, [...state.picks, pick]);
}

export function undoLastPick(state: DraftState): DraftState {
  assertStateShape(state);

  if (state.picks.length === 0) {
    throw new DraftEngineError("NO_PICKS_TO_UNDO", "There are no picks to undo.");
  }

  return rebuildState(state, state.picks.slice(0, -1));
}

export function correctPick(
  state: DraftState,
  overallPick: number,
  replacementPlayerId: string,
): DraftState {
  assertStateShape(state);

  if (!Number.isInteger(overallPick) || overallPick < 1 || overallPick > state.picks.length) {
    throw new DraftEngineError("PICK_NOT_FOUND", `Pick ${overallPick} has not been made.`);
  }

  const normalizedPlayerId = replacementPlayerId.trim();
  const existingPick = state.picks[overallPick - 1]!;

  if (normalizedPlayerId === existingPick.playerId) {
    return cloneState(state);
  }

  const draftedElsewhere = state.picks.some(
    (pick) => pick.overallPick !== overallPick && pick.playerId === normalizedPlayerId,
  );
  if (!state.playerPoolIds.includes(normalizedPlayerId) || draftedElsewhere) {
    throw new DraftEngineError(
      "PLAYER_UNAVAILABLE",
      `Player ${normalizedPlayerId || "<empty>"} is not available as a replacement.`,
    );
  }

  const correctedPicks = state.picks.map((pick) =>
    pick.overallPick === overallPick ? { ...pick, playerId: normalizedPlayerId } : { ...pick },
  );

  return rebuildState(state, correctedPicks);
}

export function getCurrentOrderSlot(state: DraftState): DraftOrderSlot | null {
  if (state.nextOverallPick === null) {
    return null;
  }
  return state.order[state.nextOverallPick - 1] ?? null;
}

export function buildRosters(state: DraftState): Record<string, string[]> {
  const rosters = Object.fromEntries(state.teams.map((team) => [team.teamId, [] as string[]]));

  for (const pick of state.picks) {
    const roster = rosters[pick.teamId];
    if (roster === undefined) {
      throw new DraftEngineError(
        "INVALID_SETTINGS",
        `Pick ${pick.overallPick} references unknown team ${pick.teamId}.`,
      );
    }
    roster.push(pick.playerId);
  }

  return rosters;
}

function rebuildState(state: DraftState, picks: DraftPick[]): DraftState {
  validatePickSequence(state.order, picks);

  const draftedPlayerIds = new Set(picks.map((pick) => pick.playerId));
  if (draftedPlayerIds.size !== picks.length) {
    throw new DraftEngineError("PLAYER_UNAVAILABLE", "A player cannot be drafted more than once.");
  }

  const availablePlayerIds = state.playerPoolIds.filter((playerId) => !draftedPlayerIds.has(playerId));
  const isComplete = picks.length === state.order.length;
  const status: DraftStatus = isComplete
    ? "complete"
    : picks.length === 0
      ? "not_started"
      : "in_progress";

  return {
    ...cloneState(state),
    availablePlayerIds,
    picks: picks.map((pick) => ({ ...pick })),
    nextOverallPick: isComplete ? null : picks.length + 1,
    status,
    revision: state.revision + 1,
  };
}

function validatePickSequence(order: DraftOrderSlot[], picks: DraftPick[]): void {
  if (picks.length > order.length) {
    throw new DraftEngineError("DRAFT_COMPLETE", "Pick history exceeds the draft order.");
  }

  picks.forEach((pick, index) => {
    const expected = order[index];
    if (
      expected === undefined ||
      pick.overallPick !== expected.overallPick ||
      pick.round !== expected.round ||
      pick.pickInRound !== expected.pickInRound ||
      pick.teamId !== expected.teamId ||
      pick.draftSlot !== expected.draftSlot
    ) {
      throw new DraftEngineError(
        "INVALID_SETTINGS",
        `Pick ${index + 1} does not match the generated draft order.`,
      );
    }
  });
}

function normalizePlayerPool(playerPoolIds: string[]): string[] {
  if (playerPoolIds.length === 0) {
    throw new DraftEngineError("INVALID_PLAYER_POOL", "The player pool cannot be empty.");
  }

  const normalized = playerPoolIds.map((playerId) => playerId.trim());
  if (normalized.some((playerId) => playerId.length === 0)) {
    throw new DraftEngineError("INVALID_PLAYER_POOL", "Player IDs must be non-empty strings.");
  }

  if (new Set(normalized).size !== normalized.length) {
    throw new DraftEngineError(
      "INVALID_PLAYER_POOL",
      "The player pool cannot contain duplicate player IDs.",
    );
  }

  return normalized;
}

function assertStateShape(state: DraftState): void {
  if (state.order.length !== state.settings.teamCount * state.settings.rounds) {
    throw new DraftEngineError(
      "INVALID_SETTINGS",
      "Draft order length does not match team count and rounds.",
    );
  }
}

function cloneState(state: DraftState): DraftState {
  return {
    ...state,
    settings: structuredClone(state.settings),
    teams: state.teams.map((team) => ({ ...team })),
    order: state.order.map((slot) => ({ ...slot })),
    playerPoolIds: [...state.playerPoolIds],
    availablePlayerIds: [...state.availablePlayerIds],
    picks: state.picks.map((pick) => ({ ...pick })),
  };
}
