import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";
import { recommendPlayers } from "@fdi/recommendation-engine";
import { buildDraftDecisionExplanation } from "../decision-explanation.js";
import {
  assertRecommendationsAreAvailable,
  reconcileDraftAvailability,
} from "../draft-availability.js";
import { setDecisionDraftState } from "../decision-state.js";
import { DecisionExplanationPanel } from "./DecisionExplanationPanel.js";
import { DraftWorkspace as DraftWorkspaceBase } from "./DraftWorkspaceBase.js";

type DraftWorkspaceProps = ComponentProps<typeof DraftWorkspaceBase>;

export function DraftWorkspace(props: DraftWorkspaceProps) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const safeState = useMemo(() => reconcileDraftAvailability(props.state), [props.state]);
  setDecisionDraftState(safeState);

  const explanations = useMemo(() => {
    if (safeState.availablePlayerIds.length === 0) return [];
    const userTeam = safeState.teams.find((team) => team.isUser) ?? safeState.teams[0];
    if (userTeam === undefined) return [];
    const result = recommendPlayers(safeState, { teamId: userTeam.teamId, limit: 5 });
    assertRecommendationsAreAvailable(
      safeState,
      result.recommendations.map((recommendation) => recommendation.playerId),
    );
    return result.recommendations.slice(0, 2).map((recommendation) =>
      buildDraftDecisionExplanation(recommendation, result.recommendations),
    );
  }, [safeState]);

  useEffect(() => {
    const intro = document.querySelector<HTMLElement>(".recommendation-panel .panel-intro");
    if (intro === null) return;

    const slot = document.createElement("div");
    slot.className = "decision-explanation-slot";
    slot.setAttribute("aria-label", "Why FDI likes the top recommendations");
    intro.insertAdjacentElement("afterend", slot);
    setPortalTarget(slot);

    return () => {
      setPortalTarget(null);
      slot.remove();
    };
  }, []);

  return (
    <>
      <DraftWorkspaceBase {...props} state={safeState} />
      {portalTarget === null || explanations.length === 0
        ? null
        : createPortal(
            <div className="decision-explanation-stack">
              {explanations.map((explanation) => (
                <DecisionExplanationPanel
                  key={explanation.signals[0]?.detail ?? explanation.summary}
                  explanation={explanation}
                  compact
                />
              ))}
            </div>,
            portalTarget,
          )}
    </>
  );
}
