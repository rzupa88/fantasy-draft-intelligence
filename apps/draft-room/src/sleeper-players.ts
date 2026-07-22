import type { PlayerDataRecord, PlayerPosition } from "@fdi/shared-types";

const SLEEPER_PLAYERS_URL = "https://api.sleeper.app/v1/players/nfl";
const CACHE_KEY = "fdi:sleeper-nfl-players:v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export interface SleeperPlayerProfile {
  sleeperPlayerId: string;
  fullName: string;
  position: string | null;
  fantasyPositions: string[];
  team: string | null;
  number: number | null;
  age: number | null;
  height: string | null;
  weight: string | null;
  college: string | null;
  yearsExperience: number | null;
  status: string | null;
  injuryStatus: string | null;
  injuryBodyPart: string | null;
  injuryStartDate: string | null;
  practiceParticipation: string | null;
  depthChartPosition: string | null;
  depthChartOrder: number | null;
  espnId: string | null;
  yahooId: string | null;
  rotowireId: string | null;
  rotoworldId: string | null;
}

export interface PlayerResearchLink {
  provider: "ESPN" | "Yahoo" | "RotoWire";
  url: string;
}

interface SleeperCacheEnvelope {
  fetchedAt: number;
  players: SleeperPlayerProfile[];
}

export async function loadSleeperPlayerDirectory(
  fetchImpl: typeof fetch = fetch,
): Promise<SleeperPlayerProfile[]> {
  const cached = readCache();
  if (cached !== null && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.players;
  }

  const response = await fetchImpl(SLEEPER_PLAYERS_URL);
  if (!response.ok) {
    if (cached !== null) return cached.players;
    throw new Error(`Sleeper player directory request failed (${response.status}).`);
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload)) {
    if (cached !== null) return cached.players;
    throw new TypeError("Sleeper player directory returned an invalid payload.");
  }

  const players = Object.entries(payload)
    .map(([playerId, value]) => parseSleeperPlayer(playerId, value))
    .filter((value): value is SleeperPlayerProfile => value !== null);

  writeCache({ fetchedAt: Date.now(), players });
  return players;
}

export function matchSleeperPlayer(
  player: PlayerDataRecord,
  directory: SleeperPlayerProfile[],
): SleeperPlayerProfile | null {
  const normalizedName = normalizeName(player.display_name);
  const candidates = directory.filter((candidate) => normalizeName(candidate.fullName) === normalizedName);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0]!;

  const positionMatch = candidates.filter((candidate) =>
    positionMatches(player.position, candidate.position, candidate.fantasyPositions),
  );
  const narrowed = positionMatch.length > 0 ? positionMatch : candidates;

  const teamMatch = narrowed.find(
    (candidate) =>
      player.nfl_team !== null &&
      candidate.team !== null &&
      normalizeTeam(candidate.team) === normalizeTeam(player.nfl_team),
  );
  return teamMatch ?? narrowed[0] ?? null;
}

export function buildPlayerResearchLinks(profile: SleeperPlayerProfile): PlayerResearchLink[] {
  const links: PlayerResearchLink[] = [];
  const slug = slugify(profile.fullName);

  if (profile.espnId !== null) {
    links.push({
      provider: "ESPN",
      url: `https://www.espn.com/nfl/player/_/id/${encodeURIComponent(profile.espnId)}/${slug}`,
    });
  }
  if (profile.yahooId !== null) {
    links.push({
      provider: "Yahoo",
      url: `https://sports.yahoo.com/nfl/players/${encodeURIComponent(profile.yahooId)}/`,
    });
  }
  if (profile.rotowireId !== null) {
    links.push({
      provider: "RotoWire",
      url: `https://www.rotowire.com/football/player.php?id=${encodeURIComponent(profile.rotowireId)}`,
    });
  }

  return links;
}

function parseSleeperPlayer(playerId: string, value: unknown): SleeperPlayerProfile | null {
  if (!isRecord(value)) return null;
  const fullName = stringValue(value.full_name) ??
    [stringValue(value.first_name), stringValue(value.last_name)].filter(Boolean).join(" ").trim();
  if (fullName.length === 0) return null;

  return {
    sleeperPlayerId: stringValue(value.player_id) ?? playerId,
    fullName,
    position: stringValue(value.position),
    fantasyPositions: arrayOfStrings(value.fantasy_positions),
    team: stringValue(value.team),
    number: numberValue(value.number),
    age: numberValue(value.age),
    height: stringValue(value.height),
    weight: stringValue(value.weight),
    college: stringValue(value.college),
    yearsExperience: numberValue(value.years_exp),
    status: stringValue(value.status),
    injuryStatus: stringValue(value.injury_status),
    injuryBodyPart: stringValue(value.injury_body_part),
    injuryStartDate: stringValue(value.injury_start_date),
    practiceParticipation: stringValue(value.practice_participation),
    depthChartPosition: stringValue(value.depth_chart_position),
    depthChartOrder: numberValue(value.depth_chart_order),
    espnId: idValue(value.espn_id),
    yahooId: idValue(value.yahoo_id),
    rotowireId: idValue(value.rotowire_id),
    rotoworldId: idValue(value.rotoworld_id),
  };
}

function positionMatches(
  position: PlayerPosition,
  sleeperPosition: string | null,
  fantasyPositions: string[],
): boolean {
  const normalized = position === "DST" ? "DEF" : position;
  return sleeperPosition?.toUpperCase() === normalized || fantasyPositions.some((value) => value.toUpperCase() === normalized);
}

function normalizeName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/\b(jr|sr|ii|iii|iv)\b/gi, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function normalizeTeam(value: string): string {
  return value.trim().toUpperCase().replace(/[^A-Z]/g, "");
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function readCache(): SleeperCacheEnvelope | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || typeof parsed.fetchedAt !== "number" || !Array.isArray(parsed.players)) {
      return null;
    }
    return parsed as unknown as SleeperCacheEnvelope;
  } catch {
    return null;
  }
}

function writeCache(value: SleeperCacheEnvelope): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {
    // The directory is optional enrichment; storage limits must not break the draft room.
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function idValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function arrayOfStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
