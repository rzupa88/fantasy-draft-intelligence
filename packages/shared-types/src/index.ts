export const PLAYER_POSITIONS = ["QB", "RB", "WR", "TE", "K", "DST"] as const;
export type PlayerPosition = (typeof PLAYER_POSITIONS)[number];

export const ROSTER_SLOT_TYPES = [
  "QB",
  "RB",
  "WR",
  "TE",
  "FLEX",
  "SUPERFLEX",
  "K",
  "DST",
  "BENCH",
] as const;
export type RosterSlotType = (typeof ROSTER_SLOT_TYPES)[number];

export const DRAFT_EXPORT_SCHEMA_VERSION = "1.0" as const;

export type ScoringPreset = "standard" | "half_ppr" | "ppr" | "custom";

export interface ScoringSettings {
  preset: ScoringPreset;
  passingYardsPerPoint: number;
  passingTouchdown: number;
  interception: number;
  rushingYardsPerPoint: number;
  rushingTouchdown: number;
  receivingYardsPerPoint: number;
  receivingTouchdown: number;
  reception: number;
  fumbleLost: number;
}

export interface RosterSlotRule {
  slot: RosterSlotType;
  count: number;
  eligiblePositions: PlayerPosition[];
}

export interface LeagueSettings {
  leagueName: string;
  teamCount: number;
  userDraftSlot: number;
  rounds: number;
  scoring: ScoringSettings;
  rosterSlots: RosterSlotRule[];
}

export interface PlayerSeasonHistory {
  season: number;
  games: number;
  fantasy_points_standard: number;
  fantasy_points_half_ppr: number;
  fantasy_points_ppr: number;
  points_per_game_standard: number;
  points_per_game_half_ppr: number;
  points_per_game_ppr: number;
  weekly_points_stddev_half_ppr: number;
  attempts: number;
  passing_yards: number;
  passing_tds: number;
  interceptions: number;
  carries: number;
  rushing_yards: number;
  rushing_tds: number;
  targets: number;
  receptions: number;
  receiving_yards: number;
  receiving_tds: number;
  fumbles_lost: number;
}

export interface PlayerDataRecord {
  canonical_player_id: string;
  display_name: string;
  position: PlayerPosition;
  nfl_team: string | null;
  bye_week: number | null;
  overall_rank: number | null;
  position_rank: number | null;
  adp: number | null;
  projected_points: number | null;
  tier: number | null;
  risk_score: number | null;
  upside_score: number | null;
  availability_status: string | null;
  outlook?: string | null;
  nflverse_player_id?: string | null;
  prior_season_stats?: PlayerSeasonHistory | null;
}

export interface PlayerDataRelease {
  schema_version: string;
  season: number;
  release_id: string;
  generated_at: string;
  sources: string[];
  players: PlayerDataRecord[];
}

export interface DraftTeam {
  teamId: string;
  name: string;
  draftSlot: number;
  isUser: boolean;
}

export interface DraftOrderSlot {
  overallPick: number;
  round: number;
  pickInRound: number;
  teamId: string;
  draftSlot: number;
}

export interface DraftPick extends DraftOrderSlot {
  playerId: string;
  rosterSlot: RosterSlotType;
  rosterSlotIndex: number;
}

export type DraftStatus = "not_started" | "in_progress" | "complete";

export interface DraftState {
  draftId: string;
  settings: LeagueSettings;
  teams: DraftTeam[];
  order: DraftOrderSlot[];
  playerDataRelease: PlayerDataRelease;
  playerPoolIds: string[];
  availablePlayerIds: string[];
  picks: DraftPick[];
  nextOverallPick: number | null;
  status: DraftStatus;
  revision: number;
}

export interface DraftExportPayload {
  draftId: string;
  settings: LeagueSettings;
  teams: DraftTeam[];
  playerDataRelease: PlayerDataRelease;
  pickPlayerIds: string[];
  revision: number;
}

export interface DraftExportEnvelope {
  schema_version: typeof DRAFT_EXPORT_SCHEMA_VERSION;
  exported_at: string;
  draft: DraftExportPayload;
}

export function isPlayerPosition(value: unknown): value is PlayerPosition {
  return typeof value === "string" && PLAYER_POSITIONS.includes(value as PlayerPosition);
}

export function isRosterSlotType(value: unknown): value is RosterSlotType {
  return typeof value === "string" && ROSTER_SLOT_TYPES.includes(value as RosterSlotType);
}

export function assertPlayerDataRelease(value: unknown): asserts value is PlayerDataRelease {
  if (!isRecord(value)) {
    throw new TypeError("Player data release must be an object.");
  }

  assertNonEmptyString(value.schema_version, "schema_version");
  assertPositiveInteger(value.season, "season");
  assertNonEmptyString(value.release_id, "release_id");
  assertIsoTimestamp(value.generated_at, "generated_at");

  if (!Array.isArray(value.sources) || !value.sources.every((source) => typeof source === "string")) {
    throw new TypeError("sources must be an array of strings.");
  }

  if (!Array.isArray(value.players)) {
    throw new TypeError("players must be an array.");
  }

  const seenPlayerIds = new Set<string>();
  for (const [index, player] of value.players.entries()) {
    assertPlayerRecord(player, index);
    if (seenPlayerIds.has(player.canonical_player_id)) {
      throw new TypeError(`Duplicate canonical_player_id: ${player.canonical_player_id}`);
    }
    seenPlayerIds.add(player.canonical_player_id);
  }
}

function assertPlayerRecord(value: unknown, index: number): asserts value is PlayerDataRecord {
  if (!isRecord(value)) {
    throw new TypeError(`players[${index}] must be an object.`);
  }

  assertNonEmptyString(value.canonical_player_id, `players[${index}].canonical_player_id`);
  assertNonEmptyString(value.display_name, `players[${index}].display_name`);

  if (!isPlayerPosition(value.position)) {
    throw new TypeError(`players[${index}].position is unsupported.`);
  }

  assertNullableString(value.nfl_team, `players[${index}].nfl_team`);
  assertNullablePositiveInteger(value.bye_week, `players[${index}].bye_week`);
  assertNullablePositiveNumber(value.overall_rank, `players[${index}].overall_rank`);
  assertNullablePositiveNumber(value.position_rank, `players[${index}].position_rank`);
  assertNullablePositiveNumber(value.adp, `players[${index}].adp`);
  assertNullableNumber(value.projected_points, `players[${index}].projected_points`);
  assertNullablePositiveInteger(value.tier, `players[${index}].tier`);
  assertNullableNumber(value.risk_score, `players[${index}].risk_score`);
  assertNullableNumber(value.upside_score, `players[${index}].upside_score`);
  assertNullableString(value.availability_status, `players[${index}].availability_status`);

  if ("outlook" in value) {
    assertNullableString(value.outlook, `players[${index}].outlook`);
  }
  if ("nflverse_player_id" in value) {
    assertNullableString(value.nflverse_player_id, `players[${index}].nflverse_player_id`);
  }
  if ("prior_season_stats" in value && value.prior_season_stats !== null) {
    assertPlayerSeasonHistory(value.prior_season_stats, `players[${index}].prior_season_stats`);
  }
}

function assertPlayerSeasonHistory(value: unknown, field: string): asserts value is PlayerSeasonHistory {
  if (!isRecord(value)) {
    throw new TypeError(`${field} must be null or an object.`);
  }
  assertPositiveInteger(value.season, `${field}.season`);
  assertPositiveInteger(value.games, `${field}.games`);
  const numericFields = [
    "fantasy_points_standard",
    "fantasy_points_half_ppr",
    "fantasy_points_ppr",
    "points_per_game_standard",
    "points_per_game_half_ppr",
    "points_per_game_ppr",
    "weekly_points_stddev_half_ppr",
    "attempts",
    "passing_yards",
    "passing_tds",
    "interceptions",
    "carries",
    "rushing_yards",
    "rushing_tds",
    "targets",
    "receptions",
    "receiving_yards",
    "receiving_tds",
    "fumbles_lost",
  ] as const;
  for (const key of numericFields) {
    assertNumber(value[key], `${field}.${key}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertNonEmptyString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string.`);
  }
}

function assertIsoTimestamp(value: unknown, field: string): asserts value is string {
  assertNonEmptyString(value, field);
  if (Number.isNaN(Date.parse(value))) {
    throw new TypeError(`${field} must be an ISO-8601 timestamp.`);
  }
}

function assertPositiveInteger(value: unknown, field: string): asserts value is number {
  if (!Number.isInteger(value) || (value as number) <= 0) {
    throw new TypeError(`${field} must be a positive integer.`);
  }
}

function assertNullablePositiveInteger(value: unknown, field: string): void {
  if (value !== null) {
    assertPositiveInteger(value, field);
  }
}

function assertNullablePositiveNumber(value: unknown, field: string): void {
  if (value !== null && (typeof value !== "number" || !Number.isFinite(value) || value <= 0)) {
    throw new TypeError(`${field} must be null or a positive number.`);
  }
}

function assertNullableNumber(value: unknown, field: string): void {
  if (value !== null) {
    assertNumber(value, field);
  }
}

function assertNumber(value: unknown, field: string): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${field} must be a finite number.`);
  }
}

function assertNullableString(value: unknown, field: string): void {
  if (value !== null && typeof value !== "string") {
    throw new TypeError(`${field} must be null or a string.`);
  }
}
