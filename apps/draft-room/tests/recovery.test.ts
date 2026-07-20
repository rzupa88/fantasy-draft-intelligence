import { describe, expect, it } from "vitest";
import { makePick, serializeDraftState } from "@fdi/draft-engine";
import { DEFAULT_DRAFT_SETUP, createDraftFromSetup } from "../src/draft-factory.js";
import {
  DRAFT_RECOVERY_STORAGE_KEY,
  clearDraftRecovery,
  importDraftFile,
  loadDraftRecovery,
  saveDraftRecovery,
} from "../src/draft-storage.js";

interface MemoryStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  has: (key: string) => boolean;
}

describe("draft recovery storage", () => {
  it("round-trips an autosaved draft", () => {
    const storage = createMemoryStorage();
    const initial = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "recovery-test");
    const state = makePick(initial, initial.availablePlayerIds[0]!);

    saveDraftRecovery(state, storage);
    const restored = loadDraftRecovery(storage);

    expect(restored?.draftId).toBe("recovery-test");
    expect(restored?.picks).toHaveLength(1);
    expect(restored?.picks[0]?.playerId).toBe(state.picks[0]?.playerId);
    expect(restored?.revision).toBe(state.revision);
  });

  it("removes a corrupted autosave instead of loading it", () => {
    const storage = createMemoryStorage();
    storage.setItem(DRAFT_RECOVERY_STORAGE_KEY, "not json");

    expect(loadDraftRecovery(storage)).toBeNull();
    expect(storage.has(DRAFT_RECOVERY_STORAGE_KEY)).toBe(false);
  });

  it("clears the saved draft on request", () => {
    const storage = createMemoryStorage();
    const state = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "clear-test");
    saveDraftRecovery(state, storage);

    clearDraftRecovery(storage);

    expect(storage.has(DRAFT_RECOVERY_STORAGE_KEY)).toBe(false);
  });

  it("imports a versioned JSON backup through the file adapter", async () => {
    const initial = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "import-test");
    const state = makePick(initial, initial.availablePlayerIds[0]!);
    const file = {
      text: async () => serializeDraftState(state, "2026-07-17T16:00:00.000Z"),
    } satisfies Pick<File, "text">;

    const restored = await importDraftFile(file);

    expect(restored.draftId).toBe("import-test");
    expect(restored.picks).toHaveLength(1);
    expect(restored.nextOverallPick).toBe(2);
  });
});

function createMemoryStorage(): MemoryStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    has: (key) => values.has(key),
  };
}
