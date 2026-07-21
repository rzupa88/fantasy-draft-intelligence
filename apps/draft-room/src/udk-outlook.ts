import { strFromU8, unzipSync } from "fflate";
import type { PlayerDataRelease, PlayerPosition } from "@fdi/shared-types";
import { parseCsv } from "./udk-importer.js";

export type UdkOutlookMap = Map<string, string>;

export function extractUdkOutlooks(bytes: Uint8Array): UdkOutlookMap {
  const archive = unzipSync(bytes);
  const outlooks = new Map<string, string>();

  for (const [rawPath, fileBytes] of Object.entries(archive)) {
    const path = rawPath.replaceAll("\\", "/");
    const filename = path.split("/").at(-1) ?? path;
    const match = filename.match(/UDK Position Rankings - (QB|RB|WR|TE|K|DST)\.csv$/i);
    if (match === null || fileBytes.length === 0) continue;

    const position = normalizePosition(match[1]);
    if (position === null) continue;

    const rows = parseCsv(strFromU8(fileBytes));
    const header = rows[0] ?? [];
    const outlookIndex = findHeaderIndex(header, "outlook");
    if (outlookIndex < 0) continue;

    const nameIndex = findNameIndex(header);
    for (const row of rows.slice(1)) {
      const name = clean(row[nameIndex]);
      const outlook = clean(row[outlookIndex]);
      if (name === null || outlook === null) continue;
      outlooks.set(playerKey(name, position), outlook);
    }
  }

  return outlooks;
}

export function enrichReleaseWithUdkOutlooks(
  release: PlayerDataRelease,
  outlooks: UdkOutlookMap,
): PlayerDataRelease {
  if (outlooks.size === 0) return release;

  return {
    ...release,
    players: release.players.map((player) => ({
      ...player,
      outlook: outlooks.get(playerKey(player.display_name, player.position)) ?? player.outlook ?? null,
    })),
  };
}

function findNameIndex(header: string[]): number {
  const normalized = header.map(normalizeHeader);
  const exact = normalized.findIndex((value) => value === "name" || value === "player" || value === "playername");
  return exact >= 0 ? exact : 0;
}

function findHeaderIndex(header: string[], expected: string): number {
  const target = normalizeHeader(expected);
  return header.findIndex((value) => normalizeHeader(value) === target);
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizePosition(value: string | undefined): PlayerPosition | null {
  const normalized = value?.trim().toUpperCase();
  if (normalized === "QB" || normalized === "RB" || normalized === "WR" || normalized === "TE" || normalized === "K" || normalized === "DST") {
    return normalized;
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

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed === undefined || trimmed.length === 0 ? null : trimmed;
}
