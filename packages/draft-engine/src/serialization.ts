import {
  DRAFT_EXPORT_SCHEMA_VERSION,
  assertPlayerDataRelease,
  isPlayerPosition,
  isRosterSlotType,
  type DraftExportEnvelope,
  type DraftExportPayload,
  type DraftState,
  type DraftTeam,
  type LeagueSettings,
  type PlayerDataRelease,
  type RosterSlotRule,
  type ScoringSettings,
} from "@fdi/shared-types";
import { DraftEngineError } from "./errors.js";
import { validateLeagueSettings } from "./order.js";
import { createDraftState, makePick } from "./state.js";

const SCORING_PRESETS = ["standard", "half_ppr", "ppr", "custom"] as const;
const SCORING_NUMBER_FIELDS = [
  "passingYardsPerPoint",
  "passingTouchdown",
  "interception",
  "rushingYardsPerPoint",
  "rushingTouchdown",
  "receivingYardsPerPoint",
  "receivingTouchdown",
  "reception",
  "fumbleLost",
] as const;

export function serializeDraftState(
  state: DraftState,
  exportedAt: string = new Date().toISOString(),
): string {
  assertIsoTimestamp(exportedAt, "exportedAt");

  const payload = toExportPayload(state);
  const restored = restoreDraftExportPayload(payload);
  if (stateSignature(restored) !== stateSignature(state)) {
    throw new DraftEngineError(
      "INVALID_DRAFT_EXPORT",
      "Draft state is internally inconsistent and cannot be exported safely.",
    );
  }

  const envelope: DraftExportEnvelope = {
    schema_version: DRAFT_EXPORT_SCHEMA_VERSION,
    exported_at: exportedAt,
    draft: payload,
  };

  return JSON.stringify(envelope, null, 2);
}

export function deserializeDraftState(serialized: string): DraftState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", "Draft export is not valid JSON.");
  }

  const envelope = parseDraftExportEnvelope(parsed);
  return restoreDraftExportPayload(envelope.draft);
}

function restoreDraftExportPayload(payload: DraftExportPayload): DraftState {
  let state: DraftState;
  try {
    state = createDraftState({
      draftId: payload.draftId,
      settings: payload.settings,
      teams: payload.teams,
      playerDataRelease: payload.playerDataRelease,
    });

    for (const playerId of payload.pickPlayerIds) {
      state = makePick(state, playerId);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Draft state could not be restored.";
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", `Draft export is invalid: ${message}`);
  }

  if (!Number.isInteger(payload.revision) || payload.revision < state.picks.length) {
    throw new DraftEngineError(
      "INVALID_DRAFT_EXPORT",
      "Draft revision must be an integer at least as large as the current pick count.",
    );
  }

  return { ...state, revision: payload.revision };
}

function toExportPayload(state: DraftState): DraftExportPayload {
  return {
    draftId: state.draftId,
    settings: structuredClone(state.settings),
    teams: state.teams.map((team) => ({ ...team })),
    playerDataRelease: structuredClone(state.playerDataRelease),
    pickPlayerIds: state.picks.map((pick) => pick.playerId),
    revision: state.revision,
  };
}

function parseDraftExportEnvelope(value: unknown): DraftExportEnvelope {
  if (!isRecord(value)) {
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", "Draft export must be an object.");
  }

  if (value.schema_version !== DRAFT_EXPORT_SCHEMA_VERSION) {
    throw new DraftEngineError(
      "UNSUPPORTED_SCHEMA_VERSION",
      `Unsupported draft export schema version: ${String(value.schema_version)}`,
    );
  }

  assertIsoTimestamp(value.exported_at, "exported_at");
  return {
    schema_version: DRAFT_EXPORT_SCHEMA_VERSION,
    exported_at: value.exported_at,
    draft: parseDraftExportPayload(value.draft),
  };
}

function parseDraftExportPayload(value: unknown): DraftExportPayload {
  if (!isRecord(value)) {
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", "draft must be an object.");
  }

  const draftId = assertNonEmptyString(value.draftId, "draft.draftId");
  const settings = parseLeagueSettings(value.settings);
  const teams = parseTeams(value.teams);
  const playerDataRelease = parsePlayerDataRelease(value.playerDataRelease);

  if (
    !Array.isArray(value.pickPlayerIds) ||
    !value.pickPlayerIds.every(
      (playerId) => typeof playerId === "string" && playerId.trim().length > 0,
    )
  ) {
    throw new DraftEngineError(
      "INVALID_DRAFT_EXPORT",
      "draft.pickPlayerIds must be an array of non-empty strings.",
    );
  }

  if (!Number.isInteger(value.revision) || (value.revision as number) < 0) {
    throw new DraftEngineError(
      "INVALID_DRAFT_EXPORT",
      "draft.revision must be a non-negative integer.",
    );
  }

  return {
    draftId,
    settings,
    teams,
    playerDataRelease,
    pickPlayerIds: [...value.pickPlayerIds],
    revision: value.revision as number,
  };
}

function parseLeagueSettings(value: unknown): LeagueSettings {
  if (!isRecord(value)) {
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", "draft.settings must be an object.");
  }

  const leagueName = assertNonEmptyString(value.leagueName, "draft.settings.leagueName");
  const teamCount = assertInteger(value.teamCount, "draft.settings.teamCount");
  const userDraftSlot = assertInteger(value.userDraftSlot, "draft.settings.userDraftSlot");
  const rounds = assertInteger(value.rounds, "draft.settings.rounds");
  const scoring = parseScoringSettings(value.scoring);

  if (!Array.isArray(value.rosterSlots)) {
    throw new DraftEngineError(
      "INVALID_DRAFT_EXPORT",
      "draft.settings.rosterSlots must be an array.",
    );
  }
  const rosterSlots = value.rosterSlots.map((rule, index) => parseRosterSlotRule(rule, index));

  const settings: LeagueSettings = {
    leagueName,
    teamCount,
    userDraftSlot,
    rounds,
    scoring,
    rosterSlots,
  };

  try {
    validateLeagueSettings(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "League settings are invalid.";
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", `Draft settings are invalid: ${message}`);
  }
  return settings;
}

function parseScoringSettings(value: unknown): ScoringSettings {
  if (!isRecord(value)) {
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", "draft.settings.scoring must be an object.");
  }

  if (
    typeof value.preset !== "string" ||
    !SCORING_PRESETS.includes(value.preset as (typeof SCORING_PRESETS)[number])
  ) {
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", "Scoring preset is unsupported.");
  }

  const scoringNumbers = Object.fromEntries(
    SCORING_NUMBER_FIELDS.map((field) => [
      field,
      assertFiniteNumber(value[field], `draft.settings.scoring.${field}`),
    ]),
  ) as unknown as Omit<ScoringSettings, "preset">;

  return { preset: value.preset as ScoringSettings["preset"], ...scoringNumbers };
}

function parseRosterSlotRule(value: unknown, index: number): RosterSlotRule {
  if (!isRecord(value)) {
    throw new DraftEngineError(
      "INVALID_DRAFT_EXPORT",
      `draft.settings.rosterSlots[${index}] must be an object.`,
    );
  }
  if (!isRosterSlotType(value.slot)) {
    throw new DraftEngineError(
      "INVALID_DRAFT_EXPORT",
      `draft.settings.rosterSlots[${index}].slot is unsupported.`,
    );
  }
  const count = assertInteger(value.count, `draft.settings.rosterSlots[${index}].count`);
  if (!Array.isArray(value.eligiblePositions) || !value.eligiblePositions.every(isPlayerPosition)) {
    throw new DraftEngineError(
      "INVALID_DRAFT_EXPORT",
      `draft.settings.rosterSlots[${index}].eligiblePositions is invalid.`,
    );
  }
  return {
    slot: value.slot,
    count,
    eligiblePositions: [...value.eligiblePositions],
  };
}

function parseTeams(value: unknown): DraftTeam[] {
  if (!Array.isArray(value)) {
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", "draft.teams must be an array.");
  }

  return value.map((team, index) => {
    if (!isRecord(team)) {
      throw new DraftEngineError("INVALID_DRAFT_EXPORT", `draft.teams[${index}] must be an object.`);
    }
    if (typeof team.isUser !== "boolean") {
      throw new DraftEngineError(
        "INVALID_DRAFT_EXPORT",
        `draft.teams[${index}].isUser must be a boolean.`,
      );
    }
    return {
      teamId: assertNonEmptyString(team.teamId, `draft.teams[${index}].teamId`),
      name: assertNonEmptyString(team.name, `draft.teams[${index}].name`),
      draftSlot: assertInteger(team.draftSlot, `draft.teams[${index}].draftSlot`),
      isUser: team.isUser,
    };
  });
}

function parsePlayerDataRelease(value: unknown): PlayerDataRelease {
  try {
    assertPlayerDataRelease(value);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Player data release is invalid.";
    throw new DraftEngineError(
      "INVALID_DRAFT_EXPORT",
      `draft.playerDataRelease is invalid: ${message}`,
    );
  }
  return structuredClone(value);
}

function stateSignature(state: DraftState): string {
  return JSON.stringify({
    draftId: state.draftId,
    settings: state.settings,
    teams: state.teams,
    order: state.order,
    playerDataRelease: state.playerDataRelease,
    playerPoolIds: state.playerPoolIds,
    availablePlayerIds: state.availablePlayerIds,
    picks: state.picks,
    nextOverallPick: state.nextOverallPick,
    status: state.status,
    revision: state.revision,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", `${field} must be a non-empty string.`);
  }
  return value;
}

function assertInteger(value: unknown, field: string): number {
  if (!Number.isInteger(value)) {
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", `${field} must be an integer.`);
  }
  return value as number;
}

function assertFiniteNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new DraftEngineError("INVALID_DRAFT_EXPORT", `${field} must be a finite number.`);
  }
  return value;
}

function assertIsoTimestamp(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0 || Number.isNaN(Date.parse(value))) {
    throw new DraftEngineError(
      "INVALID_DRAFT_EXPORT",
      `${field} must be an ISO-8601 timestamp.`,
    );
  }
}
