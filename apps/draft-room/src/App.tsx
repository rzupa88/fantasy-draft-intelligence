import { useEffect, useState } from "react";
import {
  correctPick,
  getPlayerById,
  makePick,
  serializeDraftState,
  undoLastPick,
} from "@fdi/draft-engine";
import type { DraftState } from "@fdi/shared-types";
import { DraftWorkspace } from "./components/DraftWorkspace.js";
import { RecoverySetupScreen } from "./components/RecoverySetupScreen.js";
import {
  DEFAULT_DRAFT_SETUP,
  createDraftFromSetup,
  type DraftSetup,
} from "./draft-factory.js";
import {
  clearDraftRecovery,
  importDraftFile,
  loadDraftRecovery,
  saveDraftRecovery,
} from "./draft-storage.js";

export function App() {
  const [initialRecovery] = useState<DraftState | null>(() => loadDraftRecovery());
  const [setup, setSetup] = useState<DraftSetup>(DEFAULT_DRAFT_SETUP);
  const [draftState, setDraftState] = useState<DraftState | null>(initialRecovery);
  const [recoveredDraft, setRecoveredDraft] = useState<DraftState | null>(initialRecovery);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    initialRecovery === null ? null : "Autosaved draft restored on this device.",
  );

  useEffect(() => {
    if (draftState === null) {
      return;
    }
    saveDraftRecovery(draftState);
    setRecoveredDraft(draftState);
  }, [draftState]);

  function startDraft(): void {
    try {
      const nextState = createDraftFromSetup(setup);
      clearDraftRecovery();
      setRecoveredDraft(null);
      setDraftState(nextState);
      setErrorMessage(null);
      setNotice("Draft created. Record the first selection from the player board.");
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  }

  function resumeDraft(): void {
    if (recoveredDraft === null) {
      return;
    }
    setDraftState(recoveredDraft);
    setErrorMessage(null);
    setNotice("Autosaved draft resumed.");
  }

  function discardRecovery(): void {
    clearDraftRecovery();
    setRecoveredDraft(null);
    setErrorMessage(null);
  }

  function draftPlayer(playerId: string): void {
    if (draftState === null) {
      return;
    }

    try {
      const player = getPlayerById(draftState, playerId);
      const currentPick = draftState.nextOverallPick;
      const nextState = makePick(draftState, playerId);
      setDraftState(nextState);
      setNotice(
        `${player?.display_name ?? playerId} selected at pick ${currentPick ?? "—"}.`,
      );
    } catch (error) {
      setNotice(toErrorMessage(error));
    }
  }

  function undoPick(): void {
    if (draftState === null || draftState.picks.length === 0) {
      return;
    }

    try {
      const lastPick = draftState.picks[draftState.picks.length - 1]!;
      const player = getPlayerById(draftState, lastPick.playerId);
      const nextState = undoLastPick(draftState);
      setDraftState(nextState);
      setNotice(`${player?.display_name ?? lastPick.playerId} returned to the player pool.`);
    } catch (error) {
      setNotice(toErrorMessage(error));
    }
  }

  function correctDraftPick(overallPick: number, replacementPlayerId: string): boolean {
    if (draftState === null) {
      return false;
    }

    try {
      const previousPick = draftState.picks[overallPick - 1];
      const previousPlayer =
        previousPick === undefined ? null : getPlayerById(draftState, previousPick.playerId);
      const replacementPlayer = getPlayerById(draftState, replacementPlayerId);
      const nextState = correctPick(draftState, overallPick, replacementPlayerId);
      setDraftState(nextState);
      setNotice(
        `Pick ${overallPick} corrected: ${previousPlayer?.display_name ?? "previous player"} replaced by ${
          replacementPlayer?.display_name ?? replacementPlayerId
        }.`,
      );
      return true;
    } catch (error) {
      setNotice(toErrorMessage(error));
      return false;
    }
  }

  function exportDraft(): void {
    if (draftState === null) {
      return;
    }

    try {
      const json = serializeDraftState(draftState);
      const blob = new Blob([json], { type: "application/json" });
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `${slugify(draftState.settings.leagueName)}-draft.json`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(downloadUrl);
      setNotice("Draft backup exported to your downloads folder.");
    } catch (error) {
      setNotice(toErrorMessage(error));
    }
  }

  async function importDraft(file: File): Promise<boolean> {
    try {
      const nextState = await importDraftFile(file);
      setDraftState(nextState);
      setRecoveredDraft(nextState);
      setErrorMessage(null);
      setNotice(
        `${nextState.settings.leagueName} imported with ${nextState.picks.length} recorded picks.`,
      );
      return true;
    } catch (error) {
      const message = toErrorMessage(error);
      setErrorMessage(message);
      setNotice(message);
      return false;
    }
  }

  function exitDraft(): void {
    setDraftState(null);
    setNotice(null);
    setErrorMessage(null);
  }

  if (draftState === null) {
    return (
      <RecoverySetupScreen
        setup={setup}
        recoveredDraft={recoveredDraft}
        errorMessage={errorMessage}
        onSetupChange={(nextSetup) => {
          setSetup(nextSetup);
          setErrorMessage(null);
        }}
        onStartDraft={startDraft}
        onResumeDraft={resumeDraft}
        onDiscardRecovery={discardRecovery}
        onImportDraft={importDraft}
      />
    );
  }

  return (
    <DraftWorkspace
      state={draftState}
      notice={notice}
      onDraftPlayer={draftPlayer}
      onUndo={undoPick}
      onCorrectPick={correctDraftPick}
      onExport={exportDraft}
      onImportDraft={importDraft}
      onExit={exitDraft}
    />
  );
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected draft-room error occurred.";
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "fantasy-draft"
  );
}
