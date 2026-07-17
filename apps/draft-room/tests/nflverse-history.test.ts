import { describe, expect, it } from "vitest";
import type { PlayerDataRecord, PlayerDataRelease, PlayerSeasonHistory } from "@fdi/shared-types";
import {
  enrichPlayerDataReleaseWithNflverse,
  parseNflverseHistoryJson,
  type NflverseHistoryPlayer,
  type NflverseHistoryRelease,
} from "../src/nflverse-history.js";

const HISTORY: PlayerSeasonHistory = {
  season: 2025,
  games: 17,
  fantasy_points_standard: 220,
  fantasy_points_half_ppr: 270,
  fantasy_points_ppr: 320,
  points_per_game_standard: 12.941,
  points_per_game_half_ppr: 15.882,
  points_per_game_ppr: 18.824,
  weekly_points_stddev_half_ppr: 5.2,
  attempts: 0,
  passing_yards: 0,
  passing_tds: 0,
  interceptions: 0,
  carries: 15,
  rushing_yards: 90,
  rushing_tds: 1,
  targets: 140,
  receptions: 100,
  receiving_yards: 1250,
  receiving_tds: 8,
  fumbles_lost: 1,
};

function udkPlayer(
  id: string,
  name: string,
  position: PlayerDataRecord["position"],
  team: string | null,
): PlayerDataRecord {
  return {
    canonical_player_id: id,
    display_name: name,
    position,
    nfl_team: team,
    bye_week: 8,
    overall_rank: 1,
    position_rank: 1,
    adp: 2,
    projected_points: 300,
    tier: 1,
    risk_score: 20,
    upside_score: 80,
    availability_status: "active",
  };
}

function historyPlayer(
  id: string,
  name: string,
  position: Exclude<PlayerDataRecord["position"], "DST">,
  team: string | null,
  aliases: string[] = [],
  stats: PlayerSeasonHistory | null = HISTORY,
): NflverseHistoryPlayer {
  return {
    nflverse_player_id: id,
    canonical_player_id: `nflverse:${id}`,
    display_name: name,
    normalized_name: name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
    aliases: [name, ...aliases],
    position,
    current_team: team,
    roster_status: "ACT",
    prior_season_stats: stats,
  };
}

function release(players: PlayerDataRecord[]): PlayerDataRelease {
  return {
    schema_version: "1.0",
    season: 2026,
    release_id: "udk-test",
    generated_at: "2026-07-17T12:00:00.000Z",
    sources: ["UDK"],
    players,
  };
}

function historyRelease(players: NflverseHistoryPlayer[]): NflverseHistoryRelease {
  return {
    schema_version: "1.0",
    source: "nflverse",
    prior_season: 2025,
    roster_season: 2026,
    generated_at: "2026-07-17T12:00:00.000Z",
    players,
  };
}

describe("NFLverse history enrichment", () => {
  it("replaces temporary UDK IDs and attaches prior-season history", () => {
    const source = release([
      udkPlayer("udk-wr-amon-ra", "Amon-Ra St. Brown", "WR", "DET"),
      udkPlayer("udk-rb-rookie", "Rookie Runner Jr.", "RB", "NYG"),
      udkPlayer("udk-dst-det", "Detroit Lions", "DST", "DET"),
    ]);
    const history = historyRelease([
      historyPlayer("00-0039001", "Amon-Ra St. Brown", "WR", "DET"),
      historyPlayer("00-0042002", "Rookie Runner", "RB", "NYG", ["Rookie Runner Jr."], null),
    ]);

    const result = enrichPlayerDataReleaseWithNflverse(source, history);
    const veteran = result.release.players.find((player) => player.display_name === "Amon-Ra St. Brown");
    const rookie = result.release.players.find((player) => player.display_name === "Rookie Runner Jr.");
    const defense = result.release.players.find((player) => player.position === "DST");

    expect(veteran?.canonical_player_id).toBe("nflverse:00-0039001");
    expect(veteran?.nflverse_player_id).toBe("00-0039001");
    expect(veteran?.prior_season_stats?.points_per_game_half_ppr).toBe(15.882);
    expect(rookie?.canonical_player_id).toBe("nflverse:00-0042002");
    expect(rookie?.prior_season_stats).toBeNull();
    expect(defense?.canonical_player_id).toBe("udk-dst-det");
    expect(result.report.matchedPlayerCount).toBe(2);
    expect(result.report.matchedWithHistoryCount).toBe(1);
    expect(result.release.sources).toContain("nflverse 2025 player history");
  });

  it("uses current team to disambiguate same-name players", () => {
    const source = release([udkPlayer("udk-john-smith", "John Smith", "RB", "NYG")]);
    const history = historyRelease([
      historyPlayer("00-001", "John Smith", "RB", "CHI"),
      historyPlayer("00-002", "John Smith", "RB", "NYG"),
    ]);

    const result = enrichPlayerDataReleaseWithNflverse(source, history);

    expect(result.release.players[0]?.nflverse_player_id).toBe("00-002");
    expect(result.report.teamDisambiguatedCount).toBe(1);
    expect(result.report.ambiguousPlayers).toHaveLength(0);
  });

  it("surfaces fuzzy candidates without silently matching them", () => {
    const source = release([udkPlayer("udk-xavier", "Xavier Worthy", "WR", "KC")]);
    const history = historyRelease([historyPlayer("00-003", "Xavien Worthy", "WR", "KC")]);

    const result = enrichPlayerDataReleaseWithNflverse(source, history);

    expect(result.release.players[0]?.canonical_player_id).toBe("udk-xavier");
    expect(result.report.matchedPlayerCount).toBe(0);
    expect(result.report.ambiguousPlayers[0]?.candidates[0]?.nflversePlayerId).toBe("00-003");
  });

  it("rejects malformed history JSON", () => {
    expect(() => parseNflverseHistoryJson("not-json")).toThrow("not valid JSON");
    expect(() =>
      parseNflverseHistoryJson(
        JSON.stringify({
          schema_version: "1.0",
          source: "nflverse",
          prior_season: 2025,
          roster_season: 2026,
          generated_at: "2026-07-17T12:00:00.000Z",
          players: [{ nflverse_player_id: "duplicate" }, { nflverse_player_id: "duplicate" }],
        }),
      ),
    ).toThrow();
  });
});
