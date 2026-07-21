import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { PlayerDataRecord } from "@fdi/shared-types";
import { PlayerResearchModal } from "../src/components/PlayerResearchModal.js";

const player: PlayerDataRecord = {
  canonical_player_id: "puka-nacua",
  display_name: "Puka Nacua",
  position: "WR",
  nfl_team: "LAR",
  bye_week: 8,
  overall_rank: 12,
  position_rank: 5,
  adp: 15.9,
  projected_points: 284.6,
  tier: 2,
  risk_score: 24,
  upside_score: 76,
  availability_status: "Active",
  nflverse_player_id: "00-0039075",
  prior_season_stats: {
    season: 2025,
    games: 17,
    fantasy_points_standard: 210,
    fantasy_points_half_ppr: 252,
    fantasy_points_ppr: 294,
    points_per_game_standard: 12.4,
    points_per_game_half_ppr: 14.8,
    points_per_game_ppr: 17.3,
    weekly_points_stddev_half_ppr: 7.2,
    attempts: 0,
    passing_yards: 0,
    passing_tds: 0,
    interceptions: 0,
    carries: 8,
    rushing_yards: 42,
    rushing_tds: 0,
    targets: 160,
    receptions: 105,
    receiving_yards: 1486,
    receiving_tds: 6,
    fumbles_lost: 1,
  },
};

describe("player research modal", () => {
  it("renders UDK market data and matched NFLverse production", () => {
    const html = renderToStaticMarkup(
      <PlayerResearchModal
        player={player}
        scoringPreset="half_ppr"
        releaseSeason={2026}
        sources={["UDK", "NFLverse"]}
        onClose={() => undefined}
      />,
    );

    expect(html).toContain("Puka Nacua");
    expect(html).toContain("UDK snapshot");
    expect(html).toContain("15.9");
    expect(html).toContain("252.0");
    expect(html).toContain("NFLverse");
    expect(html).toContain("Data sources");
  });

  it("uses explicit unavailable states when NFLverse history is missing", () => {
    const html = renderToStaticMarkup(
      <PlayerResearchModal
        player={{ ...player, prior_season_stats: null, nflverse_player_id: null }}
        scoringPreset="ppr"
        releaseSeason={2026}
        sources={["UDK"]}
        onClose={() => undefined}
      />,
    );

    expect(html).toContain("NFLverse match unavailable");
    expect(html).toContain("Data unavailable");
  });
});
