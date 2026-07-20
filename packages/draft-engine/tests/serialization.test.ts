import { describe, expect, it } from "vitest";
import {
  correctPick,
  createDraftState,
  deserializeDraftState,
  makePick,
  serializeDraftState,
  undoLastPick,
} from "@fdi/draft-engine";
import { generatedPlayerRelease, leagueSettings } from "./fixtures.js";

function draftWithHistory() {
  let state = createDraftState({
    draftId: "export-test",
    settings: leagueSettings({ teamCount: 4, userDraftSlot: 2, rounds: 2 }),
    playerDataRelease: generatedPlayerRelease(12),
  });
  state = makePick(state, "player-1");
  state = makePick(state, "player-2");
  state = makePick(state, "player-3");
  state = correctPick(state, 1, "player-4");
  return undoLastPick(state);
}

describe("draft export and import", () => {
  it("round-trips a draft through a versioned JSON export", () => {
    const state = draftWithHistory();
    const serialized = serializeDraftState(state, "2026-07-16T15:30:00Z");
    const restored = deserializeDraftState(serialized);

    expect(restored).toEqual(state);
    expect(restored.revision).toBeGreaterThan(restored.picks.length);
  });

  it("stores only source inputs and pick IDs in the export payload", () => {
    const serialized = serializeDraftState(draftWithHistory(), "2026-07-16T15:30:00Z");
    const envelope = JSON.parse(serialized) as Record<string, unknown>;
    const draft = envelope.draft as Record<string, unknown>;

    expect(envelope.schema_version).toBe("1.0");
    expect(draft.pickPlayerIds).toEqual(["player-4", "player-2"]);
    expect(draft).not.toHaveProperty("availablePlayerIds");
    expect(draft).not.toHaveProperty("order");
    expect(draft).not.toHaveProperty("status");
  });

  it("rejects malformed JSON", () => {
    expect(() => deserializeDraftState("{broken-json")).toThrow(/not valid JSON/);
  });

  it("rejects unsupported schema versions", () => {
    const serialized = serializeDraftState(draftWithHistory(), "2026-07-16T15:30:00Z");
    const envelope = JSON.parse(serialized) as Record<string, unknown>;
    envelope.schema_version = "2.0";

    expect(() => deserializeDraftState(JSON.stringify(envelope))).toThrow(/Unsupported/);
  });

  it("rejects a tampered export containing duplicate picks", () => {
    const serialized = serializeDraftState(draftWithHistory(), "2026-07-16T15:30:00Z");
    const envelope = JSON.parse(serialized) as { draft: { pickPlayerIds: string[] } };
    envelope.draft.pickPlayerIds = ["player-4", "player-4"];

    expect(() => deserializeDraftState(JSON.stringify(envelope))).toThrow(/not available/);
  });

  it("refuses to serialize an internally inconsistent state", () => {
    const state = draftWithHistory();
    const tampered = { ...state, availablePlayerIds: [...state.availablePlayerIds, "player-4"] };

    expect(() => serializeDraftState(tampered)).toThrow(/internally inconsistent/);
  });
});
