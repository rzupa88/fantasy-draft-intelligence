from __future__ import annotations

from pathlib import Path


def replace_once(path: Path, old: str, new: str) -> None:
    content = path.read_text(encoding="utf-8")
    if new in content:
        return
    if old not in content:
        raise RuntimeError(f"Expected text was not found in {path}: {old[:80]!r}")
    path.write_text(content.replace(old, new, 1), encoding="utf-8")


def main() -> None:
    app = Path("apps/draft-room/src/App.tsx")
    replace_once(
        app,
        '} from "./draft-storage.js";\nimport {\n  enrichPlayerDataReleaseWithNflverse,',
        '} from "./draft-storage.js";\nimport {\n  BUNDLED_NFLVERSE_HISTORY_LABEL,\n  loadBundledNflverseHistory,\n} from "./bundled-nflverse-history.js";\nimport {\n  enrichPlayerDataReleaseWithNflverse,',
    )
    replace_once(
        app,
        '  const [historyRelease, setHistoryRelease] = useState<NflverseHistoryRelease | null>(null);\n  const [historyFilename, setHistoryFilename] = useState<string | null>(null);',
        '  const [bundledHistory, setBundledHistory] = useState<NflverseHistoryRelease | null>(null);\n  const [historyRelease, setHistoryRelease] = useState<NflverseHistoryRelease | null>(null);\n  const [historyFilename, setHistoryFilename] = useState<string | null>(null);',
    )
    replace_once(
        app,
        '  useEffect(() => {\n    if (draftState === null) {',
        '''  useEffect(() => {
    let cancelled = false;
    void loadBundledNflverseHistory()
      .then((release) => {
        if (cancelled) return;
        setBundledHistory(release);
        setHistoryRelease((current) => current ?? release);
        setHistoryFilename((current) => current ?? BUNDLED_NFLVERSE_HISTORY_LABEL);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage((current) =>
          current ?? `Bundled NFLverse history failed to load: ${toErrorMessage(error)}`,
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (draftState === null) {''',
    )
    replace_once(
        app,
        '''  function clearHistory(): void {
    setHistoryRelease(null);
    setHistoryFilename(null);
    setErrorMessage(null);
  }''',
        '''  function clearHistory(): void {
    setHistoryRelease(bundledHistory);
    setHistoryFilename(
      bundledHistory === null ? null : BUNDLED_NFLVERSE_HISTORY_LABEL,
    );
    setErrorMessage(null);
  }''',
    )

    card = Path("apps/draft-room/src/components/NflverseHistoryCard.tsx")
    replace_once(
        card,
        'import { useRef, type ChangeEvent } from "react";\nimport type {',
        'import { useRef, type ChangeEvent } from "react";\nimport { BUNDLED_NFLVERSE_HISTORY_LABEL } from "../bundled-nflverse-history.js";\nimport type {',
    )
    replace_once(
        card,
        '  const inputRef = useRef<HTMLInputElement>(null);',
        '  const inputRef = useRef<HTMLInputElement>(null);\n  const isBundled = filename === BUNDLED_NFLVERSE_HISTORY_LABEL;',
    )
    replace_once(
        card,
        '''            Load the compact JSON release generated from NFLverse. It supplies stable player IDs,
            current teams, and prior-season production while UDK remains the projection source.''',
        '''            The app loads a validated NFLverse release automatically. Import a newer JSON release
            only when you want to replace the bundled identities and prior-season production.''',
    )
    replace_once(
        card,
        '{history === null ? "Import NFLverse history" : "Replace history file"}',
        'Import newer history',
    )
    replace_once(
        card,
        '''          {history === null ? null : (
            <button className="ghost-button" type="button" onClick={onClear}>
              Clear history
            </button>
          )}''',
        '''          {history === null || isBundled ? null : (
            <button className="ghost-button" type="button" onClick={onClear}>
              Use bundled release
            </button>
          )}''',
    )
    replace_once(
        card,
        '''        <div className="history-empty-state">
          <strong>Historical enrichment is optional.</strong>
          <span>The UDK release can still run without it, but player IDs and prior-year context will be limited.</span>
        </div>''',
        '''        <div className="history-empty-state">
          <strong>Loading bundled NFLverse history.</strong>
          <span>The validated local release will be ready before you start the draft.</span>
        </div>''',
    )

    app_test = Path("apps/draft-room/tests/app.test.tsx")
    replace_once(
        app_test,
        '    expect(html).toContain("Import NFLverse history");',
        '    expect(html).toContain("Import newer history");',
    )

    Path("apps/draft-room/tests/bundled-nflverse-history.test.ts").write_text(
        '''import { strToU8, zipSync } from "fflate";
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
''',
        encoding="utf-8",
    )

    Path("apps/draft-room/e2e/bundled-history.spec.ts").write_text(
        '''import { expect, test } from "@playwright/test";

test("loads bundled NFLverse history without a manual import", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("NFLverse 2025 history is ready.")).toBeVisible();
  await expect(page.getByText(/Bundled NFLverse 2025\/2026/)).toBeVisible();
});
''',
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
