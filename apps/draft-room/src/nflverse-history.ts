import type {
  PlayerDataRecord,
  PlayerDataRelease,
  PlayerPosition,
  PlayerSeasonHistory,
} from "@fdi/shared-types";

export interface NflverseHistoryRelease {
  schema_version: string;
  source: "nflverse";
  prior_season: number;
  roster_season: number;
  generated_at: string;
  players: NflverseHistoryPlayer[];
}

export interface NflverseHistoryPlayer {
  nflverse_player_id: string;
  canonical_player_id: string;
  display_name: string;
  normalized_name: string;
  aliases: string[];
  position: Exclude<PlayerPosition, "DST">;
  current_team: string | null;
  roster_status: string | null;
  prior_season_stats: PlayerSeasonHistory | null;
}

export interface NflverseMatchCandidate {
  nflversePlayerId: string;
  displayName: string;
  position: PlayerPosition;
  currentTeam: string | null;
}

export interface NflverseAmbiguousMatch {
  playerId: string;
  displayName: string;
  position: PlayerPosition;
  nflTeam: string | null;
  candidates: NflverseMatchCandidate[];
}

export interface NflverseEnrichmentReport {
  priorSeason: number;
  rosterSeason: number;
  historyPlayerCount: number;
  udkPlayerCount: number;
  matchedPlayerCount: number;
  exactMatchCount: number;
  teamDisambiguatedCount: number;
  matchedWithHistoryCount: number;
  unmatchedPlayers: string[];
  ambiguousPlayers: NflverseAmbiguousMatch[];
}

export interface NflverseEnrichmentResult {
  release: PlayerDataRelease;
  report: NflverseEnrichmentReport;
}

type MatchMethod = "exact" | "team";

interface ResolvedMatch {
  player: NflverseHistoryPlayer;
  method: MatchMethod;
}

export function parseNflverseHistoryJson(input: string): NflverseHistoryRelease {
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch (error) {
    throw new TypeError(`NFLverse history file is not valid JSON: ${messageOf(error)}`);
  }
  assertHistoryRelease(value);
  return value;
}

export async function importNflverseHistoryFile(file: File): Promise<NflverseHistoryRelease> {
  return parseNflverseHistoryJson(await file.text());
}

export function enrichPlayerDataReleaseWithNflverse(
  source: PlayerDataRelease,
  history: NflverseHistoryRelease,
): NflverseEnrichmentResult {
  const candidatesByKey = new Map<string, NflverseHistoryPlayer[]>();
  for (const candidate of history.players) {
    for (const name of [candidate.display_name, candidate.normalized_name, ...candidate.aliases]) {
      const key = playerKey(name, candidate.position);
      candidatesByKey.set(key, uniqueCandidates([...(candidatesByKey.get(key) ?? []), candidate]));
    }
  }

  let exactMatchCount = 0;
  let teamDisambiguatedCount = 0;
  let matchedWithHistoryCount = 0;
  const unmatchedPlayers: string[] = [];
  const ambiguousPlayers: NflverseAmbiguousMatch[] = [];
  const usedNflverseIds = new Set<string>();

  const players = source.players.map((player): PlayerDataRecord => {
    if (player.position === "DST") {
      return player;
    }
    const candidates = (candidatesByKey.get(playerKey(player.display_name, player.position)) ?? []).filter(
      (candidate) => !usedNflverseIds.has(candidate.nflverse_player_id),
    );
    const match = resolveCandidate(player, candidates);
    if (match === null) {
      if (candidates.length > 1) {
        ambiguousPlayers.push({
          playerId: player.canonical_player_id,
          displayName: player.display_name,
          position: player.position,
          nflTeam: player.nfl_team,
          candidates: candidates.map(toCandidateSummary),
        });
      } else {
        const suggestions = findSuggestions(player, history.players, usedNflverseIds);
        if (suggestions.length > 0) {
          ambiguousPlayers.push({
            playerId: player.canonical_player_id,
            displayName: player.display_name,
            position: player.position,
            nflTeam: player.nfl_team,
            candidates: suggestions.map(toCandidateSummary),
          });
        } else {
          unmatchedPlayers.push(`${player.display_name} (${player.position}, ${player.nfl_team ?? "FA"})`);
        }
      }
      return player;
    }

    usedNflverseIds.add(match.player.nflverse_player_id);
    if (match.method === "team") teamDisambiguatedCount += 1;
    else exactMatchCount += 1;
    if (match.player.prior_season_stats !== null) matchedWithHistoryCount += 1;

    return {
      ...player,
      canonical_player_id: match.player.canonical_player_id,
      nflverse_player_id: match.player.nflverse_player_id,
      nfl_team: player.nfl_team ?? match.player.current_team,
      availability_status: player.availability_status ?? match.player.roster_status,
      prior_season_stats: match.player.prior_season_stats,
    };
  });

  const matchedPlayerCount = exactMatchCount + teamDisambiguatedCount;
  const generatedAt = new Date().toISOString();
  return {
    release: {
      ...source,
      release_id: `${source.release_id}-nflverse-${history.prior_season}`,
      generated_at: generatedAt,
      sources: [...new Set([...source.sources, `nflverse ${history.prior_season} player history`])],
      players,
    },
    report: {
      priorSeason: history.prior_season,
      rosterSeason: history.roster_season,
      historyPlayerCount: history.players.length,
      udkPlayerCount: source.players.length,
      matchedPlayerCount,
      exactMatchCount,
      teamDisambiguatedCount,
      matchedWithHistoryCount,
      unmatchedPlayers: unmatchedPlayers.sort((left, right) => left.localeCompare(right)),
      ambiguousPlayers: ambiguousPlayers.sort((left, right) =>
        left.displayName.localeCompare(right.displayName),
      ),
    },
  };
}

function resolveCandidate(
  player: PlayerDataRecord,
  candidates: NflverseHistoryPlayer[],
): ResolvedMatch | null {
  if (candidates.length === 1) {
    return { player: candidates[0]!, method: "exact" };
  }
  if (candidates.length > 1 && player.nfl_team !== null) {
    const teamMatches = candidates.filter(
      (candidate) => normalizedTeam(candidate.current_team) === normalizedTeam(player.nfl_team),
    );
    if (teamMatches.length === 1) {
      return { player: teamMatches[0]!, method: "team" };
    }
  }
  return null;
}

function findSuggestions(
  player: PlayerDataRecord,
  candidates: NflverseHistoryPlayer[],
  usedIds: Set<string>,
): NflverseHistoryPlayer[] {
  const target = normalizeName(player.display_name);
  return candidates
    .filter(
      (candidate) =>
        candidate.position === player.position && !usedIds.has(candidate.nflverse_player_id),
    )
    .map((candidate) => ({
      candidate,
      distance: normalizedEditDistance(target, normalizeName(candidate.display_name)),
      teamMatch:
        player.nfl_team !== null &&
        normalizedTeam(player.nfl_team) === normalizedTeam(candidate.current_team),
    }))
    .filter((item) => item.distance <= 0.2 || (item.teamMatch && item.distance <= 0.34))
    .sort((left, right) => {
      if (left.teamMatch !== right.teamMatch) return left.teamMatch ? -1 : 1;
      if (left.distance !== right.distance) return left.distance - right.distance;
      return left.candidate.display_name.localeCompare(right.candidate.display_name);
    })
    .slice(0, 3)
    .map((item) => item.candidate);
}

function toCandidateSummary(player: NflverseHistoryPlayer): NflverseMatchCandidate {
  return {
    nflversePlayerId: player.nflverse_player_id,
    displayName: player.display_name,
    position: player.position,
    currentTeam: player.current_team,
  };
}

function playerKey(name: string, position: PlayerPosition): string {
  return `${normalizeName(name)}|${position}`;
}

function normalizeName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'.]/g, "")
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/gi, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function normalizedTeam(value: string | null): string {
  return value?.trim().toUpperCase() ?? "";
}

function normalizedEditDistance(left: string, right: string): number {
  const denominator = Math.max(left.length, right.length, 1);
  return levenshtein(left, right) / denominator;
}

function levenshtein(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1]! + 1,
        previous[rightIndex]! + 1,
        previous[rightIndex - 1]! + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length]!;
}

function uniqueCandidates(players: NflverseHistoryPlayer[]): NflverseHistoryPlayer[] {
  return [...new Map(players.map((player) => [player.nflverse_player_id, player])).values()];
}

function assertHistoryRelease(value: unknown): asserts value is NflverseHistoryRelease {
  if (!isRecord(value)) throw new TypeError("NFLverse history release must be an object.");
  assertString(value.schema_version, "schema_version");
  if (value.source !== "nflverse") throw new TypeError("source must be nflverse.");
  assertPositiveInteger(value.prior_season, "prior_season");
  assertPositiveInteger(value.roster_season, "roster_season");
  assertTimestamp(value.generated_at, "generated_at");
  if (!Array.isArray(value.players)) throw new TypeError("players must be an array.");

  const seen = new Set<string>();
  for (const [index, player] of value.players.entries()) {
    assertHistoryPlayer(player, index);
    if (seen.has(player.nflverse_player_id)) {
      throw new TypeError(`Duplicate nflverse_player_id: ${player.nflverse_player_id}`);
    }
    seen.add(player.nflverse_player_id);
  }
}

function assertHistoryPlayer(value: unknown, index: number): asserts value is NflverseHistoryPlayer {
  if (!isRecord(value)) throw new TypeError(`players[${index}] must be an object.`);
  assertString(value.nflverse_player_id, `players[${index}].nflverse_player_id`);
  assertString(value.canonical_player_id, `players[${index}].canonical_player_id`);
  assertString(value.display_name, `players[${index}].display_name`);
  assertString(value.normalized_name, `players[${index}].normalized_name`);
  if (!Array.isArray(value.aliases) || !value.aliases.every((alias) => typeof alias === "string")) {
    throw new TypeError(`players[${index}].aliases must be an array of strings.`);
  }
  if (!isHistoryPosition(value.position)) {
    throw new TypeError(`players[${index}].position is unsupported.`);
  }
  assertNullableString(value.current_team, `players[${index}].current_team`);
  assertNullableString(value.roster_status, `players[${index}].roster_status`);
  if (value.prior_season_stats !== null) {
    assertSeasonHistory(value.prior_season_stats, `players[${index}].prior_season_stats`);
  }
}

function assertSeasonHistory(value: unknown, field: string): asserts value is PlayerSeasonHistory {
  if (!isRecord(value)) throw new TypeError(`${field} must be an object.`);
  assertPositiveInteger(value.season, `${field}.season`);
  assertPositiveInteger(value.games, `${field}.games`);
  const fields = [
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
  for (const key of fields) {
    if (typeof value[key] !== "number" || !Number.isFinite(value[key])) {
      throw new TypeError(`${field}.${key} must be a finite number.`);
    }
  }
}

function isHistoryPosition(value: unknown): value is Exclude<PlayerPosition, "DST"> {
  return value === "QB" || value === "RB" || value === "WR" || value === "TE" || value === "K";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string.`);
  }
}

function assertNullableString(value: unknown, field: string): void {
  if (value !== null && typeof value !== "string") {
    throw new TypeError(`${field} must be null or a string.`);
  }
}

function assertPositiveInteger(value: unknown, field: string): asserts value is number {
  if (!Number.isInteger(value) || (value as number) <= 0) {
    throw new TypeError(`${field} must be a positive integer.`);
  }
}

function assertTimestamp(value: unknown, field: string): asserts value is string {
  assertString(value, field);
  if (Number.isNaN(Date.parse(value))) throw new TypeError(`${field} must be an ISO timestamp.`);
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
