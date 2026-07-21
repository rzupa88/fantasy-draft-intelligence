import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makePick } from "@fdi/draft-engine";
import { LeagueDraftBoard } from "../src/components/LeagueDraftBoard.js";
import { DEFAULT_DRAFT_SETUP, createDraftFromSetup } from "../src/draft-factory.js";

describe("league draft board", () => {
  it("renders all team columns, roster needs, and position-colored picks", () => {
    const initial = createDraftFromSetup(DEFAULT_DRAFT_SETUP, "board-test");
    const draftedPlayerId = initial.availablePlayerIds[0]!;
    const draftedPlayer = initial.playerDataRelease.players.find(
      (player) => player.canonical_player_id === draftedPlayerId,
    )!;
    const state = makePick(initial, draftedPlayerId);
    const playersById = new Map(
      state.playerDataRelease.players.map((player) => [player.canonical_player_id, player]),
    );

    const html = renderToStaticMarkup(
      <LeagueDraftBoard state={state} playersById={playersById} />,
    );

    expect(html).toContain("League-wide grid");
    expect(html).toContain("Needs QB");
    expect(html).toContain(draftedPlayer.display_name);
    expect(html).toContain(`position-bg-${draftedPlayer.position.toLowerCase()}`);
    expect(html.match(/league-board-team-header/g)).toHaveLength(DEFAULT_DRAFT_SETUP.teamCount);
    expect(html).toContain("On clock");
  });
});
