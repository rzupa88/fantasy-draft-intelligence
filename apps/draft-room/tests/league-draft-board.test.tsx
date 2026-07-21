import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makePick } from "@fdi/draft-engine";
import { LeagueDraftBoard } from "../src/components/LeagueDraftBoard.js";
import { DEFAULT_DRAFT_SETUP, createDraftFromSetup } from "../src/draft-factory.js";

describe("league draft board", () => {
  it("renders all team columns, colored roster needs, and detailed pick metadata", () => {
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
    expect(html).toContain("Hover a pick");
    expect(html).toContain('class="team-needs"');
    expect(html).toContain("position-bg-qb");
    expect(html).toContain("position-bg-rb");
    expect(html).toContain("position-bg-wr");
    expect(html).toContain("position-bg-te");
    expect(html).toContain("position-bg-k");
    expect(html).toContain("position-bg-dst");
    expect(html).toContain(draftedPlayer.display_name);
    expect(html).toContain(`position-bg-${draftedPlayer.position.toLowerCase()}`);
    expect(html).toContain("Overall pick:");
    expect(html).toContain("Projected points:");
    expect(html.match(/league-board-team-header/g)).toHaveLength(DEFAULT_DRAFT_SETUP.teamCount);
    expect(html).toContain("On clock");
  });
});
