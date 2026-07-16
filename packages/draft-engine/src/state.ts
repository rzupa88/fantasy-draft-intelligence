import {
  assertPlayerDataRelease,
  type DraftOrderSlot,
  type DraftPick,
  type DraftState,
  type DraftStatus,
  type DraftTeam,
  type LeagueSettings,
  type PlayerDataRecord,
  type PlayerDataRelease,
  type PlayerPosition,
  type RosterSlotRule,
  type RosterSlotType,
} from "@fdi/shared-types";
import { DraftEngineError } from "./errors.js";
import { createDraftTeams, generateSnakeDraftOrder, validateLeagueSettings } from "./order.js";

export interface CreateDraftStateInput {
  draftId: string;
  settings: LeagueSettings;
  playerDataRelease: PlayerDataRelease;
  teamNames?: string[];
  teams?: DraftTeam[];
}

type PendingDraftPick = DraftOrderSlot & { playerId: string };

interface ConcreteRosterSlot {
  slot: RosterSlotType;
  slotIndex: number;
  eligiblePositions: PlayerPosition[];
  ruleOrder: number;
}

export function createDraftState(input: CreateDraftStateInput): DraftState {
  const draftId = input.draftId.trim();
  if (draftId.length === 0) {
    throw new DraftEngineError("INVALID_SETTINGS", "draftId must be a non-empty string.");
  }

  validateLeagueSettings(input.settings);
  const playerDataRelease = normalizePlayerDataRelease(input.playerDataRelease);
  const teams = input.teams ?? createDraftTeams(input.settings, input.teamNames);
  const order = generateSnakeDraftOrder(input.settings, teams);
  const playerPoolIds = playerDataRelease.players.map((player) => player.canonical_player_id);

  if (playerPoolIds.length < order.length) {
    throw new DraftEngineError(
      "INVALID_PLAYER_POOL",
      `The player pool contains ${playerPoolIds.length} players but the draft requires ${order.length} picks.`,
    );
  }

  return {
    draftId,
    settings: structuredClone(input.settings),
    teams: structuredClone(teams),
    order,
    playerDataRelease,
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

  const pick: PendingDraftPick = { ...orderSlot, playerId: normalizedPlayerId };
  return rebuildState(state, [...state.picks.map(toPendingPick), pick]);
}

export function undoLastPick(state: DraftState): DraftState {
  assertStateShape(state);

  if (state.picks.length === 0) {
    throw new DraftEngineError("NO_PICKS_TO_UNDO", "There are no picks to undo.");
  }

  return rebuildState(state, state.picks.slice(0, -1).map(toPendingPick));
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

  const correctedPicks: PendingDraftPick[] = state.picks.map((pick) => ({
    ...toPendingPick(pick),
    playerId: pick.overallPick === overallPick ? normalizedPlayerId : pick.playerId,
  }));

  return rebuildState(state, correctedPicks);
}

export function getCurrentOrderSlot(state: DraftState): DraftOrderSlot | null {
  if (state.nextOverallPick === null) {
    return null;
  }
  return state.order[state.nextOverallPick - 1] ?? null;
}

export function getPlayerById(state: DraftState, playerId: string): PlayerDataRecord | null {
  return (
    state.playerDataRelease.players.find(
      (player) => player.canonical_player_id === playerId,
    ) ?? null
  );
}

export function buildRosters(state: DraftState): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(buildRosterAssignments(state)).map(([teamId, picks]) => [
      teamId,
      picks.map((pick) => pick.playerId),
    ]),
  );
}

export function buildRosterAssignments(state: DraftState): Record<string, DraftPick[]> {
  const rosters = Object.fromEntries(state.teams.map((team) => [team.teamId, [] as DraftPick[]]));

  for (const pick of state.picks) {
    const roster = rosters[pick.teamId];
    if (roster === undefined) {
      throw new DraftEngineError(
        "INVALID_SETTINGS",
        `Pick ${pick.overallPick} references unknown team ${pick.teamId}.`,
      );
    }
    roster.push({ ...pick });
  }

  return rosters;
}

function rebuildState(state: DraftState, pendingPicks: PendingDraftPick[]): DraftState {
  validatePickSequence(state.order, pendingPicks);

  const draftedPlayerIds = new Set(pendingPicks.map((pick) => pick.playerId));
  if (draftedPlayerIds.size !== pendingPicks.length) {
    throw new DraftEngineError("PLAYER_UNAVAILABLE", "A player cannot be drafted more than once.");
  }

  const playersById = new Map(
    state.playerDataRelease.players.map((player) => [player.canonical_player_id, player]),
  );
  for (const pick of pendingPicks) {
    if (!playersById.has(pick.playerId)) {
      throw new DraftEngineError(
        "INVALID_PLAYER_POOL",
        `Player ${pick.playerId} is missing from the loaded player data release.`,
      );
    }
  }

  const picks = assignRosterSlots(state.settings, state.teams, pendingPicks, playersById);
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
    picks,
    nextOverallPick: isComplete ? null : picks.length + 1,
    status,
    revision: state.revision + 1,
  };
}

function assignRosterSlots(
  settings: LeagueSettings,
  teams: DraftTeam[],
  pendingPicks: PendingDraftPick[],
  playersById: Map<string, PlayerDataRecord>,
): DraftPick[] {
  const assignments = new Map<number, ConcreteRosterSlot>();
  const concreteSlots = expandRosterSlots(settings.rosterSlots);

  for (const team of teams) {
    const teamPicks = pendingPicks.filter((pick) => pick.teamId === team.teamId);
    const teamAssignments = matchTeamPicksToSlots(team.name, teamPicks, concreteSlots, playersById);

    for (const [overallPick, slot] of teamAssignments) {
      assignments.set(overallPick, slot);
    }
  }

  return pendingPicks.map((pick) => {
    const assignment = assignments.get(pick.overallPick);
    if (assignment === undefined) {
      throw new DraftEngineError(
        "ROSTER_INVALID",
        `Pick ${pick.overallPick} could not be assigned to a roster slot.`,
      );
    }
    return {
      ...pick,
      rosterSlot: assignment.slot,
      rosterSlotIndex: assignment.slotIndex,
    };
  });
}

function matchTeamPicksToSlots(
  teamName: string,
  picks: PendingDraftPick[],
  concreteSlots: ConcreteRosterSlot[],
  playersById: Map<string, PlayerDataRecord>,
): Map<number, ConcreteRosterSlot> {
  const eligibleSlotIndexes = picks.map((pick) => {
    const player = playersById.get(pick.playerId)!;
    return concreteSlots
      .map((slot, index) => ({ slot, index }))
      .filter(({ slot }) => slot.eligiblePositions.includes(player.position))
      .sort(compareConcreteSlotCandidates)
      .map(({ index }) => index);
  });

  const pickOrder = picks
    .map((pick, index) => ({ pick, index, candidateCount: eligibleSlotIndexes[index]!.length }))
    .sort(
      (left, right) =>
        left.candidateCount - right.candidateCount || left.pick.overallPick - right.pick.overallPick,
    );

  const slotToPickIndex = new Map<number, number>();

  const tryAssign = (pickIndex: number, visitedSlots: Set<number>): boolean => {
    for (const slotIndex of eligibleSlotIndexes[pickIndex]!) {
      if (visitedSlots.has(slotIndex)) {
        continue;
      }
      visitedSlots.add(slotIndex);

      const previousPickIndex = slotToPickIndex.get(slotIndex);
      if (previousPickIndex === undefined || tryAssign(previousPickIndex, visitedSlots)) {
        slotToPickIndex.set(slotIndex, pickIndex);
        return true;
      }
    }
    return false;
  };

  for (const { pick, index, candidateCount } of pickOrder) {
    if (candidateCount === 0 || !tryAssign(index, new Set<number>())) {
      const player = playersById.get(pick.playerId)!;
      throw new DraftEngineError(
        "ROSTER_INVALID",
        `${teamName} has no legal roster slot remaining for ${player.display_name} (${player.position}).`,
      );
    }
  }

  const assignments = new Map<number, ConcreteRosterSlot>();
  for (const [slotIndex, pickIndex] of slotToPickIndex) {
    const pick = picks[pickIndex];
    const slot = concreteSlots[slotIndex];
    if (pick !== undefined && slot !== undefined) {
      assignments.set(pick.overallPick, slot);
    }
  }
  return assignments;
}

function compareConcreteSlotCandidates(
  left: { slot: ConcreteRosterSlot; index: number },
  right: { slot: ConcreteRosterSlot; index: number },
): number {
  return (
    left.slot.eligiblePositions.length - right.slot.eligiblePositions.length ||
    left.slot.ruleOrder - right.slot.ruleOrder ||
    left.slot.slotIndex - right.slot.slotIndex
  );
}

function expandRosterSlots(rules: RosterSlotRule[]): ConcreteRosterSlot[] {
  const slotCounters = new Map<RosterSlotType, number>();
  const slots: ConcreteRosterSlot[] = [];

  rules.forEach((rule, ruleOrder) => {
    for (let count = 0; count < rule.count; count += 1) {
      const slotIndex = (slotCounters.get(rule.slot) ?? 0) + 1;
      slotCounters.set(rule.slot, slotIndex);
      slots.push({
        slot: rule.slot,
        slotIndex,
        eligiblePositions: [...rule.eligiblePositions],
        ruleOrder,
      });
    }
  });

  return slots;
}

function validatePickSequence(order: DraftOrderSlot[], picks: PendingDraftPick[]): void {
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

function normalizePlayerDataRelease(release: PlayerDataRelease): PlayerDataRelease {
  try {
    assertPlayerDataRelease(release);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The player data release is invalid.";
    throw new DraftEngineError("INVALID_PLAYER_POOL", message);
  }

  if (release.players.length === 0) {
    throw new DraftEngineError("INVALID_PLAYER_POOL", "The player pool cannot be empty.");
  }

  return structuredClone(release);
}

function assertStateShape(state: DraftState): void {
  if (state.order.length !== state.settings.teamCount * state.settings.rounds) {
    throw new DraftEngineError(
      "INVALID_SETTINGS",
      "Draft order length does not match team count and rounds.",
    );
  }

  const releasePlayerIds = state.playerDataRelease.players.map(
    (player) => player.canonical_player_id,
  );
  if (
    releasePlayerIds.length !== state.playerPoolIds.length ||
    releasePlayerIds.some((playerId, index) => playerId !== state.playerPoolIds[index])
  ) {
    throw new DraftEngineError(
      "INVALID_PLAYER_POOL",
      "Draft player pool does not match the loaded player data release.",
    );
  }
}

function toPendingPick(pick: DraftPick): PendingDraftPick {
  return {
    overallPick: pick.overallPick,
    round: pick.round,
    pickInRound: pick.pickInRound,
    teamId: pick.teamId,
    draftSlot: pick.draftSlot,
    playerId: pick.playerId,
  };
}

function cloneState(state: DraftState): DraftState {
  return {
    ...state,
    settings: structuredClone(state.settings),
    teams: state.teams.map((team) => ({ ...team })),
    order: state.order.map((slot) => ({ ...slot })),
    playerDataRelease: structuredClone(state.playerDataRelease),
    playerPoolIds: [...state.playerPoolIds],
    availablePlayerIds: [...state.availablePlayerIds],
    picks: state.picks.map((pick) => ({ ...pick })),
  };
}
