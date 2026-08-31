import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";
import { recommendPlayers, scorePlayer } from "@fdi/recommendation-engine";
import { buildDraftDecisionExplanation } from "../decision-explanation.js";
import { getDecisionDraftState } from "../decision-state.js";
import { DecisionExplanationPanel } from "./DecisionExplanationPanel.js";
import { PlayerResearchModal as PlayerResearchModalBase } from "./PlayerResearchModalBase.js";

type PlayerResearchModalProps = ComponentProps<typeof PlayerResearchModalBase>;

export function PlayerResearchModal(props: PlayerResearchModalProps) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const explanation = useMemo(() => {
    const state = getDecisionDraftState();
    if (state === null || !state.availablePlayerIds.includes(props.player.canonical_player_id)) {
      return null;
    }

    const userTeam = state.teams.find((team) => team.isUser) ?? state.teams[0];
    if (userTeam === undefined) return null;

    try {
      const result = recommendPlayers(state, { teamId: userTeam.teamId, limit: 10 });
      const recommendation =
        result.recommendations.find(
          (candidate) => candidate.playerId === props.player.canonical_player_id,
        ) ?? scorePlayer(state, props.player.canonical_player_id, { teamId: userTeam.teamId });
      const comparisonPool = [
        recommendation,
        ...result.recommendations.filter((candidate) => candidate.playerId !== recommendation.playerId),
      ];
      return buildDraftDecisionExplanation(recommendation, comparisonPool);
    } catch {
      return null;
    }
  }, [props.player.canonical_player_id]);

  useEffect(() => {
    const tabs = document.querySelector<HTMLElement>(".player-research-modal .player-research-tabs");
    if (tabs === null) return;

    const slot = document.createElement("div");
    slot.className = "decision-explanation-modal-slot";
    tabs.insertAdjacentElement("afterend", slot);
    setPortalTarget(slot);

    return () => {
      setPortalTarget(null);
      slot.remove();
    };
  }, []);

  return (
    <>
      <PlayerResearchModalBase {...props} />
      {portalTarget === null || explanation === null
        ? null
        : createPortal(
            <DecisionExplanationPanel explanation={explanation} />,
            portalTarget,
          )}
    </>
  );
}
