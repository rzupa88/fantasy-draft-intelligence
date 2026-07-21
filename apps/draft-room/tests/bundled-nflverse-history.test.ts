import { strToU8, zipSync } from "fflate";
import { describe, expect, it, vi } from "vitest";
import { loadBundledNflverseHistory } from "../src/bundled-nflverse-history.js";

const RELEASE = {
  schema_version: "1.0",
  source: "nflverse",
  prior_season: 2025,
  roster_season: 2026,
  generated_at: "2026-07-18T00:23:54.397Z",
  players: [],
};

describe("bundled NFLverse history", () => {
  it("downloads, decompresses, and validates the bundled release", async () => {
    const archive = zipSync({
      "nflverse_history_2025_2026.json": strToU8(JSON.stringify(RELEASE)),
    });
    const fetcher = vi.fn(async () => new Response(archive, { status: 200 }));

    const result = await loadBundledNflverseHistory(fetcher, "https://example.test/history.zip");

    expect(fetcher).toHaveBeenCalledWith("https://example.test/history.zip");
    expect(result.prior_season).toBe(2025);
    expect(result.roster_season).toBe(2026);
  });

  it("rejects archives without exactly one JSON release", async () => {
    const archive = zipSync({ "readme.txt": strToU8("missing") });
    const fetcher = vi.fn(async () => new Response(archive, { status: 200 }));

    await expect(loadBundledNflverseHistory(fetcher, "https://example.test/history.zip")).rejects.toThrow(
      "exactly one JSON release",
    );
  });
});
