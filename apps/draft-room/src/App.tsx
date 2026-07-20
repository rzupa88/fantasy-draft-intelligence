import { useState } from "react";
import {
  getPlayerById,
  makePick,
  serializeDraftState,
  undoLastPick,
} from "@fdi/draft-engine";
import type { DraftState } from "@fdi/shared-types";
import { DraftRoom } from "./components/DraftRoom.js";
import { SetupScreen } from "./components/SetupScreen.js";
import {
  DEFAULT_DRAFT_SETUP,
  createDraftFromSetup,
  type DraftSetup,
} from "./draft-factory.js";

export function App() {
  const [setup, setSetup] = useState<DraftSetup>(DEFAULT_DRAFT_SETUP);
  const [draftState, setDraftState] = useState<DraftState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function startDraft(): void {
    try {
      const nextState = createDraftFromSetup(setup);
      setDraftState(nextState);
      setErrorMessage(null);
      setNotice("Draft created. Record the first selection from the player board.");
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
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

  function exitDraft(): void {
    setDraftState(null);
    setNotice(null);
    setErrorMessage(null);
  }

  if (draftState === null) {
    return (
      <SetupScreen
        setup={setup}
        errorMessage={errorMessage}
        onSetupChange={(nextSetup) => {
          setSetup(nextSetup);
          setErrorMessage(null);
        }}
        onStartDraft={startDraft}
      />
    );
  }

  return (
    <DraftRoom
      state={draftState}
      notice={notice}
      onDraftPlayer={draftPlayer}
      onUndo={undoPick}
      onExport={exportDraft}
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
