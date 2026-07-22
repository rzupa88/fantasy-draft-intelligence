import type { HistoricalLeagueData } from "./historical-league.js";

const STORAGE_KEY = "fdi.historical-league.v1";

export interface HistoricalLeaguePreference {
  history: HistoricalLeagueData | null;
  filename: string | null;
  enabled: boolean;
}

export function loadHistoricalLeaguePreference(): HistoricalLeaguePreference {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { history: null, filename: null, enabled: false };
    const parsed = JSON.parse(raw) as Partial<HistoricalLeaguePreference>;
    const history = parsed.history?.format === "fdi-yahoo-copy-workbook-v1" ? parsed.history : null;
    return {
      history,
      filename: typeof parsed.filename === "string" ? parsed.filename : null,
      enabled: parsed.enabled === true && history !== null,
    };
  } catch {
    return { history: null, filename: null, enabled: false };
  }
}

export function saveHistoricalLeaguePreference(preference: HistoricalLeaguePreference): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
}

export function clearHistoricalLeagueStorage(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getHistoricalTeamMatchCount(history: HistoricalLeagueData, currentTeamNames: string[]): number {
  const historicalNames = new Set(history.teams.map(normalizeName));
  return currentTeamNames.filter((name) => historicalNames.has(normalizeName(name))).length;
}

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
