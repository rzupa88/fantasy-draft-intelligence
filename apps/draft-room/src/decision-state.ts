import type { DraftState } from "@fdi/shared-types";

let currentDraftState: DraftState | null = null;

export function setDecisionDraftState(state: DraftState): void {
  currentDraftState = state;
}

export function getDecisionDraftState(): DraftState | null {
  return currentDraftState;
}
