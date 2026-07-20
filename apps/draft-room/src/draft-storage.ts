import { deserializeDraftState, serializeDraftState } from "@fdi/draft-engine";
import type { DraftState } from "@fdi/shared-types";

export const DRAFT_RECOVERY_STORAGE_KEY = "fdi.draft-room.recovery.v1";

type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadDraftRecovery(storage: DraftStorage | null = getBrowserStorage()): DraftState | null {
  if (storage === null) {
    return null;
  }

  const serialized = storage.getItem(DRAFT_RECOVERY_STORAGE_KEY);
  if (serialized === null) {
    return null;
  }

  try {
    return deserializeDraftState(serialized);
  } catch {
    storage.removeItem(DRAFT_RECOVERY_STORAGE_KEY);
    return null;
  }
}

export function saveDraftRecovery(
  state: DraftState,
  storage: DraftStorage | null = getBrowserStorage(),
): void {
  if (storage === null) {
    return;
  }
  storage.setItem(DRAFT_RECOVERY_STORAGE_KEY, serializeDraftState(state));
}

export function clearDraftRecovery(storage: DraftStorage | null = getBrowserStorage()): void {
  storage?.removeItem(DRAFT_RECOVERY_STORAGE_KEY);
}

export async function importDraftFile(file: Pick<File, "text">): Promise<DraftState> {
  return deserializeDraftState(await file.text());
}

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
}
