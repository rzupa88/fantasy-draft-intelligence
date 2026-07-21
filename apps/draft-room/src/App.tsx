import { useEffect, useMemo, useState } from "react";
import {
  correctPick,
  getPlayerById,
  makePick,
  serializeDraftState,
  undoLastPick,
} from "@fdi/draft-engine";
import type { DraftState } from "@fdi/shared-types";
import { DraftWorkspace } from "./components/DraftWorkspace.js";
import { LeagueDraftBoard } from "./components/LeagueDraftBoard.js";
import { PlayerResearchModal } from "./components/PlayerResearchModal.js";
import { RecoverySetupScreen } from "./components/RecoverySetupScreen.js";
import {
  DEFAULT_DRAFT_SETUP,
  createDraftFromSetup,
  createScoringSettings,
  type DraftSetup,
} from "./draft-factory.js";
import {
  clearDraftRecovery,
  importDraftFile,
  loadDraftRecovery,
  saveDraftRecovery,
} from "./draft-storage.js";
import {
  BUNDLED_NFLVERSE_HISTORY_LABEL,
  loadBundledNflverseHistory,
} from "./bundled-nflverse-history.js";
import {
  enrichPlayerDataReleaseWithNflverse,
  importNflverseHistoryFile,
  type NflverseHistoryRelease,
} from "./nflverse-history.js";
import {
  buildUdkPlayerDataRelease,
  parseUdkZip,
  type UdkImportPackage,
} from "./udk-importer.js";
import {
  enrichReleaseWithUdkOutlooks,
  extractUdkOutlooks,
  type UdkOutlookMap,
} from "./udk-outlook.js";

export function App() {
  const [initialRecovery] = useState<DraftState | null>(() => loadDraftRecovery());
  const [setup, setSetup] = useState<DraftSetup>(DEFAULT_DRAFT_SETUP);
  const [draftState, setDraftState] = useState<DraftState | null>(initialRecovery);
  const [recoveredDraft, setRecoveredDraft] = useState<DraftState | null>(initialRecovery);
  const [udkPackage, setUdkPackage] = useState<UdkImportPackage | null>(null);
  const [udkOutlooks, setUdkOutlooks] = useState<UdkOutlookMap>(new Map());
  const [udkFilename, setUdkFilename] = useState<string | null>(null);
  const [bundledHistory, setBundledHistory] = useState<NflverseHistoryRelease | null>(null);
  const [historyRelease, setHistoryRelease] = useState<NflverseHistoryRelease | null>(null);
  const [historyFilename, setHistoryFilename] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedResearchPlayerId, setSelectedResearchPlayerId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    initialRecovery === null ? null : "Autosaved draft restored on this device.",
  );

  const udkBuild = useMemo(() => {
    if (udkPackage === null) {
      return null;
    }
    const build = buildUdkPlayerDataRelease(udkPackage, {
      scoring: createScoringSettings(setup.scoringPreset),
      adpTeamCount: setup.teamCount,
      adpSource: setup.adpSource,
      generatedAt: new Date().toISOString(),
    });
    return {
      ...build,
      release: enrichReleaseWithUdkOutlooks(build.release, udkOutlooks),
    };
  }, [setup.adpSource, setup.scoringPreset, setup.teamCount, udkOutlooks, udkPackage]);

  const historyBuild = useMemo(() => {
    if (udkBuild === null || historyRelease === null) {
      return null;
    }
    return enrichPlayerDataReleaseWithNflverse(udkBuild.release, historyRelease);
  }, [historyRelease, udkBuild]);

  const activePlayersById = useMemo(
    () =>
      new Map(
        (draftState?.playerDataRelease.players ?? []).map((player) => [
          player.canonical_player_id,
          player,
        ]),
      ),
    [draftState],
  );

  const selectedResearchPlayer =
    selectedResearchPlayerId === null ? null : activePlayersById.get(selectedResearchPlayerId) ?? null;

  useEffect(() => {
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
    if (draftState === null) {
      return;
    }
    saveDraftRecovery(draftState);
    setRecoveredDraft(draftState);
  }, [draftState]);

  useEffect(() => {
    if (draftState === null) return;

    const handlePlayerNameClick = (event: MouseEvent): void => {
      const target = event.target instanceof Element ? event.target : null;
      const playerNameTarget = target?.closest(
        ".player-identity strong, .recommendation-title-row h3, .roster-row strong, .recent-pick-card > strong",
      );
      if (playerNameTarget === null) return;

      const playerRow = playerNameTarget.closest<HTMLElement>(".player-row[data-player-id]");
      const directPlayerId = playerRow?.dataset.playerId;
      if (directPlayerId !== undefined && activePlayersById.has(directPlayerId)) {
        setSelectedResearchPlayerId(directPlayerId);
        return;
      }

      const displayName = playerNameTarget.textContent?.trim();
      if (displayName === undefined || displayName.length === 0) return;
      const player = draftState.playerDataRelease.players.find(
        (candidate) => candidate.display_name === displayName,
      );
      if (player !== undefined) setSelectedResearchPlayerId(player.canonical_player_id);
    };

    document.addEventListener("click", handlePlayerNameClick);
    return () => document.removeEventListener("click", handlePlayerNameClick);
  }, [activePlayersById, draftState]);

  function startDraft(): void {
    try {
      const release = historyBuild?.release ?? udkBuild?.release;
      if (release !== undefined && release.players.length < setup.teamCount * setup.rounds) {
        throw new RangeError(
          `The imported player release contains ${release.players.length} players, but this draft requires ${
            setup.teamCount * setup.rounds
          } selections.`,
        );
      }
      const nextState = createDraftFromSetup(setup, undefined, release);
      clearDraftRecovery();
      setRecoveredDraft(null);
      setDraftState(nextState);
      setErrorMessage(null);
      setNotice(
        release === undefined
          ? "Draft created with demonstration player data."
          : historyBuild === null
            ? `Draft created with the ${release.season} UDK release and ${release.players.length} players.`
            : `Draft created with UDK projections and ${historyBuild.report.matchedPlayerCount} NFLverse identity matches.`,
      );
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  }

  async function importUdkPackage(file: File): Promise<void> {
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const parsed = parseUdkZip(bytes);
      setUdkPackage(parsed);
      setUdkOutlooks(extractUdkOutlooks(bytes));
      setUdkFilename(file.name);
      setErrorMessage(null);
      setNotice(null);
    } catch (error) {
      setUdkPackage(null);
      setUdkOutlooks(new Map());
      setUdkFilename(null);
      setErrorMessage(toErrorMessage(error));
    }
  }

  function clearUdkPackage(): void {
    setUdkPackage(null);
    setUdkOutlooks(new Map());
    setUdkFilename(null);
    setErrorMessage(null);
  }

  async function importHistory(file: File): Promise<void> {
    try {
      const parsed = await importNflverseHistoryFile(file);
      setHistoryRelease(parsed);
      setHistoryFilename(file.name);
      setErrorMessage(null);
      setNotice(null);
    } catch (error) {
      setHistoryRelease(null);
      setHistoryFilename(null);
      setErrorMessage(toErrorMessage(error));
    }
  }

  function clearHistory(): void {
    setHistoryRelease(bundledHistory);
    setHistoryFilename(
      bundledHistory === null ? null : BUNDLED_NFLVERSE_HISTORY_LABEL,
    );
    setErrorMessage(null);
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
    setSelectedResearchPlayerId(null);
    setNotice(null);
    setErrorMessage(null);
  }

  if (draftState === null) {
    return (
      <RecoverySetupScreen
        setup={setup}
        recoveredDraft={recoveredDraft}
        udkReport={udkBuild?.report ?? null}
        udkFilename={udkFilename}
        history={historyRelease}
        historyReport={historyBuild?.report ?? null}
        historyFilename={historyFilename}
        errorMessage={errorMessage}
        onSetupChange={(nextSetup) => {
          setSetup(nextSetup);
          setErrorMessage(null);
        }}
        onStartDraft={startDraft}
        onResumeDraft={resumeDraft}
        onDiscardRecovery={discardRecovery}
        onImportDraft={importDraft}
        onImportUdk={importUdkPackage}
        onClearUdk={clearUdkPackage}
        onImportHistory={importHistory}
        onClearHistory={clearHistory}
      />
    );
  }

  return (
    <>
      <div className="draft-board-standalone">
        <LeagueDraftBoard state={draftState} playersById={activePlayersById} />
      </div>
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
      {selectedResearchPlayer === null ? null : (
        <PlayerResearchModal
          player={selectedResearchPlayer}
          scoringPreset={draftState.settings.scoring.preset}
          releaseSeason={draftState.playerDataRelease.season}
          sources={draftState.playerDataRelease.sources}
          onClose={() => setSelectedResearchPlayerId(null)}
        />
      )}
    </>
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
