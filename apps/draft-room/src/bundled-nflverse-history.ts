import { strFromU8, unzipSync } from "fflate";
import {
  parseNflverseHistoryJson,
  type NflverseHistoryRelease,
} from "./nflverse-history.js";

export const BUNDLED_NFLVERSE_HISTORY_ARCHIVE = "nflverse-history-2025-2026.zip";
export const BUNDLED_NFLVERSE_HISTORY_LABEL = "Bundled NFLverse 2025/2026";

export async function loadBundledNflverseHistory(
  fetcher: typeof fetch = fetch,
  url = defaultBundledUrl(),
): Promise<NflverseHistoryRelease> {
  const response = await fetcher(url);
  if (!response.ok) {
    throw new TypeError(
      `Bundled NFLverse history could not be loaded (${response.status} ${response.statusText}).`,
    );
  }

  let archive: Record<string, Uint8Array>;
  try {
    archive = unzipSync(new Uint8Array(await response.arrayBuffer()));
  } catch (error) {
    throw new TypeError(`Bundled NFLverse history is not a readable ZIP archive: ${messageOf(error)}`);
  }

  const jsonEntries = Object.entries(archive).filter(
    ([path, bytes]) => /\.json$/i.test(path) && bytes.length > 0,
  );
  if (jsonEntries.length !== 1) {
    throw new TypeError(
      `Bundled NFLverse history must contain exactly one JSON release; found ${jsonEntries.length}.`,
    );
  }

  return parseNflverseHistoryJson(strFromU8(jsonEntries[0]![1]));
}

function defaultBundledUrl(): string {
  const baseUrl = typeof document === "undefined" ? "http://localhost/" : document.baseURI;
  return new URL(`data/${BUNDLED_NFLVERSE_HISTORY_ARCHIVE}`, baseUrl).toString();
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
