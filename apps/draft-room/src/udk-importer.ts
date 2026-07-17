import { strFromU8, unzipSync } from "fflate";
import type {
  PlayerDataRecord,
  PlayerDataRelease,
  PlayerPosition,
  ScoringSettings,
} from "@fdi/shared-types";

export const UDK_ADP_SOURCES = ["average", "sleeper", "espn", "yahoo", "underdog"] as const;
export type UdkAdpSource = (typeof UDK_ADP_SOURCES)[number];
export type UdkAnalyst = "Andy" | "Jason" | "Mike";

export interface UdkImportPackage {
  season: number;
  recognizedFiles: UdkRecognizedFile[];
  ignoredFiles: string[];
  rankings: UdkRankingRow[];
  projections: UdkProjectionRow[];
  adpRows: UdkAdpRow[];
  warnings: string[];
}

export interface UdkRecognizedFile {
  path: string;
  kind: "rankings" | "projections" | "adp" | "career" | "value-scout";
  rowCount: number;
}

export interface UdkBuildOptions {
  scoring: ScoringSettings;
  adpTeamCount: number;
  adpSource: UdkAdpSource;
  generatedAt?: string;
}

export interface UdkBuildReport {
  season: number;
  recognizedFileCount: number;
  ignoredFileCount: number;
  playerCount: number;
  projectedPlayerCount: number;
  allAnalystProjectionCount: number;
  adpPlayerCount: number;
  selectedAdpPlayerCount: number;
  unmatchedProjectionRows: string[];
  unmatchedAdpRows: string[];
  warnings: string[];
}

export interface UdkBuildResult {
  release: PlayerDataRelease;
  report: UdkBuildReport;
}

interface UdkRankingRow {
  name: string;
  position: PlayerPosition;
  team: string | null;
  byeWeek: number | null;
  positionRank: number;
  projectedPoints: number | null;
  risk: number | null;
  upside: number | null;
  adp: string | null;
  tier: number | null;
}

interface UdkProjectionRow {
  analyst: UdkAnalyst;
  name: string;
  position: PlayerPosition;
  team: string | null;
  byeWeek: number | null;
  stats: ProjectionStats;
}

interface ProjectionStats {
  passingYards?: number;
  passingTouchdowns?: number;
  interceptions?: number;
  rushingAttempts?: number;
  rushingYards?: number;
  rushingTouchdowns?: number;
  receptions?: number;
  receivingYards?: number;
  receivingTouchdowns?: number;
  fumbles?: number;
}

interface UdkAdpRow {
  name: string;
  position: PlayerPosition;
  team: string | null;
  values: Record<UdkAdpSource, string | null>;
}

interface BuiltPlayer extends PlayerDataRecord {
  sortAdp: number | null;
}

export function parseUdkZip(bytes: Uint8Array, fallbackSeason = new Date().getFullYear()): UdkImportPackage {
  let archive: Record<string, Uint8Array>;
  try {
    archive = unzipSync(bytes);
  } catch (error) {
    throw new TypeError(`The selected file is not a readable ZIP archive: ${toErrorMessage(error)}`);
  }

  const recognizedFiles: UdkRecognizedFile[] = [];
  const ignoredFiles: string[] = [];
  const rankings: UdkRankingRow[] = [];
  const projections: UdkProjectionRow[] = [];
  const adpRows: UdkAdpRow[] = [];
  const warnings: string[] = [];
  const careerYears: number[] = [];

  for (const [rawPath, contents] of Object.entries(archive)) {
    const path = rawPath.replaceAll("\\", "/");
    if (path.endsWith("/") || contents.length === 0) {
      continue;
    }
    const filename = path.split("/").at(-1) ?? path;

    if (/\.pdf$/i.test(filename)) {
      ignoredFiles.push(path);
      continue;
    }
    if (!/\.csv$/i.test(filename)) {
      ignoredFiles.push(path);
      continue;
    }

    const rows = parseCsv(strFromU8(contents));
    if (rows.length === 0) {
      warnings.push(`${path} was empty and was ignored.`);
      continue;
    }

    const rankingMatch = filename.match(/UDK Position Rankings - (QB|RB|WR|TE|K|DST)\.csv$/i);
    if (rankingMatch !== null) {
      const position = normalizePosition(rankingMatch[1]);
      if (position === null) {
        warnings.push(`${path} used an unsupported ranking position.`);
        continue;
      }
      const parsed = parseRankingRows(rows, position, path, warnings);
      rankings.push(...parsed);
      recognizedFiles.push({ path, kind: "rankings", rowCount: parsed.length });
      continue;
    }

    const projectionMatch = filename.match(/UDK - (Andys|Jasons|Mikes) Projections - (QB|RB|WR|TE)\.csv$/i);
    if (projectionMatch !== null) {
      const analyst = normalizeAnalyst(projectionMatch[1]);
      const position = normalizePosition(projectionMatch[2]);
      if (analyst === null || position === null || position === "K" || position === "DST") {
        warnings.push(`${path} used unsupported projection metadata.`);
        continue;
      }
      const parsed = parseProjectionRows(rows, analyst, position, path, warnings);
      projections.push(...parsed);
      recognizedFiles.push({ path, kind: "projections", rowCount: parsed.length });
      continue;
    }

    if (/ADP Comparison/i.test(filename)) {
      const parsed = parseAdpRows(rows, path, warnings);
      adpRows.push(...parsed);
      recognizedFiles.push({ path, kind: "adp", rowCount: parsed.length });
      continue;
    }

    if (/Consistency Charts/i.test(filename)) {
      const header = rows[0] ?? [];
      for (const cell of header) {
        if (/^20\d{2}$/.test(cell.trim())) {
          careerYears.push(Number(cell));
        }
      }
      recognizedFiles.push({ path, kind: "career", rowCount: Math.max(0, rows.length - 1) });
      continue;
    }

    if (/Value Scout/i.test(filename)) {
      recognizedFiles.push({ path, kind: "value-scout", rowCount: Math.max(0, rows.length - 1) });
      continue;
    }

    ignoredFiles.push(path);
  }

  if (rankings.length === 0) {
    throw new TypeError("No UDK position-ranking CSV files were found in the ZIP archive.");
  }

  const season = careerYears.length > 0 ? Math.max(...careerYears) + 1 : fallbackSeason;
  if (projections.length === 0) {
    warnings.push("No Andy, Jason, or Mike projection files were recognized.");
  }
  if (adpRows.length === 0) {
    warnings.push("No UDK ADP Comparison file was recognized.");
  }

  return {
    season,
    recognizedFiles,
    ignoredFiles,
    rankings,
    projections,
    adpRows,
    warnings,
  };
}

export function buildUdkPlayerDataRelease(
  source: UdkImportPackage,
  options: UdkBuildOptions,
): UdkBuildResult {
  if (!Number.isInteger(options.adpTeamCount) || options.adpTeamCount < 2 || options.adpTeamCount > 20) {
    throw new RangeError("ADP team count must be an integer between 2 and 20.");
  }
  if (!UDK_ADP_SOURCES.includes(options.adpSource)) {
    throw new RangeError("Unsupported UDK ADP source.");
  }

  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const rankingByKey = new Map<string, UdkRankingRow>();
  for (const row of source.rankings) {
    const key = playerKey(row.name, row.position);
    if (rankingByKey.has(key)) {
      throw new TypeError(`Duplicate UDK ranking row for ${row.name} (${row.position}).`);
    }
    rankingByKey.set(key, row);
  }

  const projectionsByKey = groupBy(source.projections, (row) => playerKey(row.name, row.position));
  const adpByKey = new Map(source.adpRows.map((row) => [playerKey(row.name, row.position), row]));
  const unmatchedProjectionRows = uniqueSorted(
    source.projections
      .filter((row) => !rankingByKey.has(playerKey(row.name, row.position)))
      .map((row) => `${row.name} (${row.position}, ${row.analyst})`),
  );
  const unmatchedAdpRows = uniqueSorted(
    source.adpRows
      .filter((row) => !rankingByKey.has(playerKey(row.name, row.position)))
      .map((row) => `${row.name} (${row.position})`),
  );

  const builtPlayers: BuiltPlayer[] = source.rankings.map((ranking) => {
    const key = playerKey(ranking.name, ranking.position);
    const projectionRows = projectionsByKey.get(key) ?? [];
    const analystPoints = projectionRows.map((row) => scoreProjection(row.stats, options.scoring));
    const projection = median(analystPoints) ?? ranking.projectedPoints;
    const adpRow = adpByKey.get(key);
    const marketAdp = adpRow === undefined
      ? null
      : parseOverallAdp(adpRow.values[options.adpSource], options.adpTeamCount) ??
        parseOverallAdp(adpRow.values.average, options.adpTeamCount) ??
        firstAvailableAdp(adpRow, options.adpTeamCount);

    return {
      canonical_player_id: createUdkPlayerId(source.season, ranking.name, ranking.position),
      display_name: ranking.name,
      position: ranking.position,
      nfl_team: ranking.team,
      bye_week: ranking.byeWeek,
      overall_rank: null,
      position_rank: ranking.positionRank,
      adp: marketAdp,
      projected_points: projection === null ? null : round(projection, 1),
      tier: ranking.tier,
      risk_score: ranking.risk,
      upside_score: ranking.upside,
      availability_status: "active",
      sortAdp: marketAdp,
    };
  });

  const ranked = [...builtPlayers].sort(compareForOverallRank);
  const overallRankById = new Map(
    ranked.map((player, index) => [player.canonical_player_id, index + 1]),
  );
  const players: PlayerDataRecord[] = builtPlayers
    .map(({ sortAdp: _sortAdp, ...player }) => ({
      ...player,
      overall_rank: overallRankById.get(player.canonical_player_id) ?? null,
    }))
    .sort((left, right) => (left.overall_rank ?? Infinity) - (right.overall_rank ?? Infinity));

  const projectionCounts = new Map<string, number>();
  for (const row of source.projections) {
    const key = playerKey(row.name, row.position);
    projectionCounts.set(key, (projectionCounts.get(key) ?? 0) + 1);
  }
  const projectedPlayerCount = source.rankings.filter(
    (row) => (projectionCounts.get(playerKey(row.name, row.position)) ?? 0) > 0,
  ).length;
  const allAnalystProjectionCount = source.rankings.filter(
    (row) => (projectionCounts.get(playerKey(row.name, row.position)) ?? 0) >= 3,
  ).length;
  const adpPlayerCount = source.rankings.filter((row) => adpByKey.has(playerKey(row.name, row.position))).length;
  const selectedAdpPlayerCount = players.filter((player) => player.adp !== null).length;
  const warnings = [...source.warnings];
  if (unmatchedProjectionRows.length > 0) {
    warnings.push(`${unmatchedProjectionRows.length} projection rows did not match a position-ranking player.`);
  }
  if (unmatchedAdpRows.length > 0) {
    warnings.push(`${unmatchedAdpRows.length} ADP rows did not match a position-ranking player.`);
  }

  const release: PlayerDataRelease = {
    schema_version: "1.0",
    season: source.season,
    release_id: createReleaseId(source.season, generatedAt, options.scoring.preset, options.adpSource),
    generated_at: generatedAt,
    sources: [
      "Fantasy Footballers UDK position rankings",
      "Fantasy Footballers UDK analyst projections",
      `Fantasy Footballers UDK ${options.adpSource} ADP`,
    ],
    players,
  };

  return {
    release,
    report: {
      season: source.season,
      recognizedFileCount: source.recognizedFiles.length,
      ignoredFileCount: source.ignoredFiles.length,
      playerCount: players.length,
      projectedPlayerCount,
      allAnalystProjectionCount,
      adpPlayerCount,
      selectedAdpPlayerCount,
      unmatchedProjectionRows,
      unmatchedAdpRows,
      warnings,
    },
  };
}

export function parseCsv(input: string): string[][] {
  const text = input.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]!;
    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") {
        index += 1;
      }
      row.push(field);
      field = "";
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
    } else {
      field += character;
    }
  }

  row.push(field);
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }
  if (quoted) {
    throw new TypeError("CSV input ended inside a quoted field.");
  }
  return rows;
}

function parseRankingRows(
  rows: string[][],
  position: PlayerPosition,
  path: string,
  warnings: string[],
): UdkRankingRow[] {
  const result: UdkRankingRow[] = [];
  for (const [offset, row] of rows.slice(1).entries()) {
    const name = cleanString(row[0]);
    if (name === null) {
      continue;
    }
    const rank = parsePositiveInteger(row[4]);
    if (rank === null) {
      warnings.push(`${path} row ${offset + 2} was skipped because Rank was invalid.`);
      continue;
    }
    const offensive = position !== "K" && position !== "DST";
    result.push({
      name,
      position,
      team: cleanString(row[2]),
      byeWeek: parsePositiveInteger(row[3]),
      positionRank: rank,
      projectedPoints: offensive ? parseNumber(row[5]) : null,
      risk: offensive ? parseNumber(row[6]) : null,
      upside: offensive ? parseNumber(row[7]) : null,
      adp: offensive ? cleanString(row[8]) : null,
      tier: offensive ? parsePositiveInteger(row[9]) : null,
    });
  }
  return result;
}

function parseProjectionRows(
  rows: string[][],
  analyst: UdkAnalyst,
  position: Exclude<PlayerPosition, "K" | "DST">,
  path: string,
  warnings: string[],
): UdkProjectionRow[] {
  const result: UdkProjectionRow[] = [];
  for (const [offset, row] of rows.slice(1).entries()) {
    const name = cleanString(row[0]);
    if (name === null) {
      continue;
    }
    const stats = parseProjectionStats(row, position);
    if (Object.keys(stats).length === 0) {
      warnings.push(`${path} row ${offset + 2} had no usable projection statistics.`);
    }
    result.push({
      analyst,
      name,
      position,
      team: cleanString(row[1]),
      byeWeek: parsePositiveInteger(row[2]),
      stats,
    });
  }
  return result;
}

function parseProjectionStats(
  row: string[],
  position: Exclude<PlayerPosition, "K" | "DST">,
): ProjectionStats {
  if (position === "QB") {
    return compactStats({
      passingYards: parseNumber(row[5]),
      passingTouchdowns: parseNumber(row[6]),
      rushingYards: parseNumber(row[7]),
      rushingTouchdowns: parseNumber(row[8]),
      interceptions: parseNumber(row[9]),
      fumbles: parseNumber(row[10]),
    });
  }
  if (position === "RB") {
    return compactStats({
      rushingAttempts: parseNumber(row[5]),
      rushingYards: parseNumber(row[6]),
      rushingTouchdowns: parseNumber(row[7]),
      receptions: parseNumber(row[8]),
      receivingYards: parseNumber(row[9]),
      receivingTouchdowns: parseNumber(row[10]),
      fumbles: parseNumber(row[11]),
    });
  }
  if (position === "WR") {
    return compactStats({
      receptions: parseNumber(row[5]),
      receivingYards: parseNumber(row[6]),
      receivingTouchdowns: parseNumber(row[7]),
      rushingAttempts: parseNumber(row[8]),
      rushingYards: parseNumber(row[9]),
      rushingTouchdowns: parseNumber(row[10]),
      fumbles: parseNumber(row[11]),
    });
  }
  return compactStats({
    receptions: parseNumber(row[5]),
    receivingYards: parseNumber(row[6]),
    receivingTouchdowns: parseNumber(row[7]),
    fumbles: parseNumber(row[8]),
  });
}

function parseAdpRows(rows: string[][], path: string, warnings: string[]): UdkAdpRow[] {
  const result: UdkAdpRow[] = [];
  for (const [offset, row] of rows.slice(1).entries()) {
    const name = cleanString(row[1]);
    const position = normalizePosition(row[3]);
    if (name === null || position === null || position === "K" || position === "DST") {
      if (name !== null) {
        warnings.push(`${path} row ${offset + 2} used an unsupported ADP position.`);
      }
      continue;
    }
    result.push({
      name,
      position,
      team: cleanString(row[2]),
      values: {
        average: cleanString(row[5]),
        sleeper: cleanString(row[6]),
        espn: cleanString(row[7]),
        yahoo: cleanString(row[8]),
        underdog: cleanString(row[9]),
      },
    });
  }
  return result;
}

function scoreProjection(stats: ProjectionStats, scoring: ScoringSettings): number {
  return (
    (stats.passingYards ?? 0) / scoring.passingYardsPerPoint +
    (stats.passingTouchdowns ?? 0) * scoring.passingTouchdown +
    (stats.interceptions ?? 0) * scoring.interception +
    (stats.rushingYards ?? 0) / scoring.rushingYardsPerPoint +
    (stats.rushingTouchdowns ?? 0) * scoring.rushingTouchdown +
    (stats.receivingYards ?? 0) / scoring.receivingYardsPerPoint +
    (stats.receivingTouchdowns ?? 0) * scoring.receivingTouchdown +
    (stats.receptions ?? 0) * scoring.reception +
    (stats.fumbles ?? 0) * scoring.fumbleLost
  );
}

function parseOverallAdp(value: string | null, teamCount: number): number | null {
  if (value === null) {
    return null;
  }
  const match = value.trim().match(/^(\d+)\.(\d{1,2})$/);
  if (match === null) {
    return null;
  }
  const roundNumber = Number(match[1]);
  const pickInRound = Number(match[2]);
  if (roundNumber < 1 || pickInRound < 1 || pickInRound > teamCount) {
    return null;
  }
  return (roundNumber - 1) * teamCount + pickInRound;
}

function firstAvailableAdp(row: UdkAdpRow, teamCount: number): number | null {
  for (const source of UDK_ADP_SOURCES) {
    const value = parseOverallAdp(row.values[source], teamCount);
    if (value !== null) {
      return value;
    }
  }
  return null;
}

function compareForOverallRank(left: BuiltPlayer, right: BuiltPlayer): number {
  if (left.sortAdp !== null || right.sortAdp !== null) {
    const comparison = (left.sortAdp ?? Infinity) - (right.sortAdp ?? Infinity);
    if (comparison !== 0) {
      return comparison;
    }
  }
  if (left.projected_points !== null || right.projected_points !== null) {
    const comparison = (right.projected_points ?? -Infinity) - (left.projected_points ?? -Infinity);
    if (comparison !== 0) {
      return comparison;
    }
  }
  if (left.position !== right.position) {
    return positionOrder(left.position) - positionOrder(right.position);
  }
  return (left.position_rank ?? Infinity) - (right.position_rank ?? Infinity);
}

function positionOrder(position: PlayerPosition): number {
  return ["RB", "WR", "QB", "TE", "K", "DST"].indexOf(position);
}

function compactStats(input: Record<keyof ProjectionStats, number | null | undefined>): ProjectionStats {
  return Object.fromEntries(
    Object.entries(input).filter((entry): entry is [string, number] => entry[1] !== null && entry[1] !== undefined),
  ) as ProjectionStats;
}

function normalizePosition(value: string | undefined): PlayerPosition | null {
  const normalized = value?.trim().toUpperCase();
  if (normalized === "D" || normalized === "DEF" || normalized === "D/ST") {
    return "DST";
  }
  return normalized === "QB" || normalized === "RB" || normalized === "WR" || normalized === "TE" || normalized === "K" || normalized === "DST"
    ? normalized
    : null;
}

function normalizeAnalyst(value: string | undefined): UdkAnalyst | null {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "andys") {
    return "Andy";
  }
  if (normalized === "jasons") {
    return "Jason";
  }
  if (normalized === "mikes") {
    return "Mike";
  }
  return null;
}

function playerKey(name: string, position: PlayerPosition): string {
  return `${normalizeName(name)}|${position}`;
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

function createUdkPlayerId(season: number, name: string, position: PlayerPosition): string {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `udk-${season}-${position.toLowerCase()}-${slug}`;
}

function createReleaseId(
  season: number,
  generatedAt: string,
  scoringPreset: string,
  adpSource: UdkAdpSource,
): string {
  const timestamp = generatedAt.replace(/[^0-9]/g, "").slice(0, 14);
  return `udk-${season}-${scoringPreset}-${adpSource}-${timestamp}`;
}

function groupBy<T>(values: T[], keyFor: (value: T) => string): Map<string, T[]> {
  const result = new Map<string, T[]>();
  for (const value of values) {
    const key = keyFor(value);
    const group = result.get(key) ?? [];
    group.push(value);
    result.set(key, group);
  }
  return result;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]!
    : (sorted[middle - 1]! + sorted[middle]!) / 2;
}

function parseNumber(value: string | undefined): number | null {
  if (value === undefined || value.trim() === "") {
    return null;
  }
  const parsed = Number(value.replaceAll(",", ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePositiveInteger(value: string | undefined): number | null {
  const parsed = parseNumber(value);
  return parsed !== null && Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function cleanString(value: string | undefined): string | null {
  const cleaned = value?.trim();
  return cleaned === undefined || cleaned.length === 0 ? null : cleaned;
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
