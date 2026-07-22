import { strFromU8, unzipSync } from "fflate";
import type { DraftState, PlayerPosition } from "@fdi/shared-types";

export interface HistoricalDraftPick {
  year: number;
  round: number;
  pickInRound: number;
  overallPick: number;
  team: string;
  player: string;
  position: PlayerPosition;
}

export interface HistoricalTeamProfile {
  team: string;
  years: number[];
  totalPicks: number;
  positionCounts: Record<PlayerPosition, number>;
  averageRoundByPosition: Partial<Record<PlayerPosition, number>>;
  firstRoundByPosition: Partial<Record<PlayerPosition, number>>;
}

export interface HistoricalLeagueData {
  format: "fdi-yahoo-copy-workbook-v1";
  years: number[];
  teamCount: number;
  picks: HistoricalDraftPick[];
  teams: string[];
  profiles: HistoricalTeamProfile[];
  warnings: string[];
}

const POSITIONS: PlayerPosition[] = ["QB", "RB", "WR", "TE", "K", "DST"];
const BLOCK_START_COLUMNS = [2, 7, 12];

export function parseHistoricalDraftWorkbook(bytes: Uint8Array): HistoricalLeagueData {
  let archive: Record<string, Uint8Array>;
  try {
    archive = unzipSync(bytes);
  } catch (error) {
    throw new TypeError(`The historical draft file is not a readable XLSX workbook: ${messageOf(error)}`);
  }

  const sheetPath = findDraftResultsSheetPath(archive);
  const sheetBytes = archive[sheetPath];
  if (sheetBytes === undefined) throw new TypeError("The Draft Results worksheet could not be read.");

  const sharedStrings = parseSharedStrings(archive["xl/sharedStrings.xml"]);
  const cells = parseWorksheetCells(strFromU8(sheetBytes), sharedStrings);
  const picks: HistoricalDraftPick[] = [];
  const warnings: string[] = [];

  for (const startColumn of BLOCK_START_COLUMNS) {
    const year = numberCell(cells, startColumn + 1, 2);
    if (year === null || year < 2000 || year > 2100) continue;

    let currentRound: number | null = null;
    for (let row = 1; row <= 500; row += 1) {
      const first = textCell(cells, startColumn, row);
      const roundMatch = first.match(/^Round\s+(\d+)$/i);
      if (roundMatch !== null) {
        currentRound = Number(roundMatch[1]);
        continue;
      }
      if (currentRound === null) continue;

      const pickInRound = numericText(first);
      const player = textCell(cells, startColumn + 1, row);
      const position = normalizePosition(textCell(cells, startColumn + 2, row));
      const team = textCell(cells, startColumn + 3, row);
      if (pickInRound === null || player.length === 0 || position === null || team.length === 0) continue;

      picks.push({
        year,
        round: currentRound,
        pickInRound,
        overallPick: (currentRound - 1) * 12 + pickInRound,
        team,
        player,
        position,
      });
    }
  }

  if (picks.length === 0) {
    throw new TypeError(
      "No historical picks were found. This importer expects the attached workbook layout with 2025, 2024, and 2023 blocks on the Draft Results sheet.",
    );
  }

  const years = unique(picks.map((pick) => pick.year)).sort((a, b) => b - a);
  const teamCount = Math.max(...picks.map((pick) => pick.pickInRound));
  const teams = unique(picks.map((pick) => pick.team)).sort((a, b) => a.localeCompare(b));
  if (teamCount !== 12) warnings.push(`The workbook appears to contain ${teamCount} teams rather than 12.`);

  return {
    format: "fdi-yahoo-copy-workbook-v1",
    years,
    teamCount,
    picks: picks.sort((a, b) => b.year - a.year || a.overallPick - b.overallPick),
    teams,
    profiles: buildProfiles(picks),
    warnings,
  };
}

export function getHistoricalPositionPressure(
  history: HistoricalLeagueData,
  state: DraftState,
  position: PlayerPosition,
  teamId?: string,
): number {
  if (state.nextOverallPick === null) return 0;
  const userTeam =
    (teamId === undefined ? state.teams.find((team) => team.isUser) : state.teams.find((team) => team.teamId === teamId)) ??
    state.teams[0];
  if (userTeam === undefined) return 0;

  const nextUserPick = state.order.find(
    (slot) => slot.overallPick > state.nextOverallPick! && slot.teamId === userTeam.teamId,
  )?.overallPick;
  if (nextUserPick === undefined) return 0;

  const upcomingTeamNames = state.order
    .filter((slot) => slot.overallPick >= state.nextOverallPick! && slot.overallPick < nextUserPick)
    .map((slot) => state.teams.find((team) => team.teamId === slot.teamId)?.name)
    .filter((name): name is string => name !== undefined);
  if (upcomingTeamNames.length === 0) return 0;

  const currentRound = state.order[state.nextOverallPick - 1]?.round ?? 1;
  const profileByName = new Map(history.profiles.map((profile) => [normalizeName(profile.team), profile]));
  const matched = upcomingTeamNames
    .map((name) => profileByName.get(normalizeName(name)))
    .filter((profile): profile is HistoricalTeamProfile => profile !== undefined);
  if (matched.length === 0) return 0;

  const pressure = matched.reduce((sum, profile) => {
    const avgRound = profile.averageRoundByPosition[position];
    const firstRound = profile.firstRoundByPosition[position];
    const positionShare = profile.positionCounts[position] / Math.max(1, profile.totalPicks);
    const roundFit = avgRound === undefined ? 0 : Math.max(0, 1 - Math.abs(avgRound - currentRound) / 6);
    const firstPickFit = firstRound === undefined ? 0 : currentRound >= firstRound - 1 ? 1 : 0.2;
    return sum + positionShare * 45 + roundFit * 35 + firstPickFit * 20;
  }, 0);

  return Math.round(Math.min(100, pressure / matched.length));
}

function buildProfiles(picks: HistoricalDraftPick[]): HistoricalTeamProfile[] {
  return unique(picks.map((pick) => pick.team)).map((team) => {
    const teamPicks = picks.filter((pick) => pick.team === team);
    const positionCounts = Object.fromEntries(POSITIONS.map((position) => [position, 0])) as Record<PlayerPosition, number>;
    const averageRoundByPosition: Partial<Record<PlayerPosition, number>> = {};
    const firstRoundByPosition: Partial<Record<PlayerPosition, number>> = {};

    for (const position of POSITIONS) {
      const positionPicks = teamPicks.filter((pick) => pick.position === position);
      positionCounts[position] = positionPicks.length;
      if (positionPicks.length > 0) {
        averageRoundByPosition[position] = round(positionPicks.reduce((sum, pick) => sum + pick.round, 0) / positionPicks.length);
        const firstByYear = unique(positionPicks.map((pick) => pick.year)).map(
          (year) => Math.min(...positionPicks.filter((pick) => pick.year === year).map((pick) => pick.round)),
        );
        firstRoundByPosition[position] = round(firstByYear.reduce((sum, value) => sum + value, 0) / firstByYear.length);
      }
    }

    return {
      team,
      years: unique(teamPicks.map((pick) => pick.year)).sort((a, b) => b - a),
      totalPicks: teamPicks.length,
      positionCounts,
      averageRoundByPosition,
      firstRoundByPosition,
    };
  });
}

function findDraftResultsSheetPath(archive: Record<string, Uint8Array>): string {
  const workbookBytes = archive["xl/workbook.xml"];
  const relationshipsBytes = archive["xl/_rels/workbook.xml.rels"];
  if (workbookBytes === undefined || relationshipsBytes === undefined) return "xl/worksheets/sheet1.xml";

  const workbook = new DOMParser().parseFromString(strFromU8(workbookBytes), "application/xml");
  const relationshipId = Array.from(workbook.getElementsByTagName("sheet")).find(
    (sheet) => sheet.getAttribute("name") === "Draft Results",
  )?.getAttribute("r:id");
  if (relationshipId === undefined || relationshipId === null) return "xl/worksheets/sheet1.xml";

  const relationships = new DOMParser().parseFromString(strFromU8(relationshipsBytes), "application/xml");
  const target = Array.from(relationships.getElementsByTagName("Relationship")).find(
    (relationship) => relationship.getAttribute("Id") === relationshipId,
  )?.getAttribute("Target");
  return target === undefined || target === null ? "xl/worksheets/sheet1.xml" : `xl/${target.replace(/^\.\//, "")}`;
}

function parseSharedStrings(bytes: Uint8Array | undefined): string[] {
  if (bytes === undefined) return [];
  const xml = new DOMParser().parseFromString(strFromU8(bytes), "application/xml");
  return Array.from(xml.getElementsByTagName("si")).map((node) =>
    Array.from(node.getElementsByTagName("t"))
      .map((text) => text.textContent ?? "")
      .join(""),
  );
}

function parseWorksheetCells(xmlText: string, sharedStrings: string[]): Map<string, string> {
  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  const cells = new Map<string, string>();
  for (const cell of Array.from(xml.getElementsByTagName("c"))) {
    const reference = cell.getAttribute("r");
    if (reference === null) continue;
    const type = cell.getAttribute("t");
    const value = cell.getElementsByTagName("v")[0]?.textContent ?? "";
    const inline = Array.from(cell.getElementsByTagName("t"))
      .map((node) => node.textContent ?? "")
      .join("");
    cells.set(reference, type === "s" ? sharedStrings[Number(value)] ?? "" : type === "inlineStr" ? inline : value);
  }
  return cells;
}

function textCell(cells: Map<string, string>, column: number, row: number): string {
  return (cells.get(`${columnName(column)}${row}`) ?? "").trim();
}

function numberCell(cells: Map<string, string>, column: number, row: number): number | null {
  return numericText(textCell(cells, column, row));
}

function numericText(value: string): number | null {
  if (!/^\d+(?:\.\d+)?$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePosition(value: string): PlayerPosition | null {
  const normalized = value.trim().toUpperCase();
  return POSITIONS.includes(normalized as PlayerPosition) ? (normalized as PlayerPosition) : null;
}

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function columnName(column: number): string {
  let value = column;
  let name = "";
  while (value > 0) {
    value -= 1;
    name = String.fromCharCode(65 + (value % 26)) + name;
    value = Math.floor(value / 26);
  }
  return name;
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "unknown error";
}
