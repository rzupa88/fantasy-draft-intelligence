import { describe, expect, it } from "vitest";
import { assertPlayerDataRelease, type PlayerDataRelease } from "@fdi/shared-types";

function validRelease(): PlayerDataRelease {
  return {
    schema_version: "1.0",
    season: 2026,
    release_id: "2026-preseason-v1",
    generated_at: "2026-07-16T12:00:00Z",
    sources: ["nflverse"],
    players: [
      {
        canonical_player_id: "josh-allen-qb",
        display_name: "Josh Allen",
        position: "QB",
        nfl_team: "BUF",
        bye_week: 7,
        overall_rank: 24,
        position_rank: 1,
        adp: 27.4,
        projected_points: 372.2,
        tier: 1,
        risk_score: 0.2,
        upside_score: 0.9,
        availability_status: "active",
      },
    ],
  };
}

describe("assertPlayerDataRelease", () => {
  it("accepts a release matching the versioned player contract", () => {
    const release: unknown = validRelease();

    expect(() => assertPlayerDataRelease(release)).not.toThrow();
  });

  it("rejects duplicate canonical player IDs", () => {
    const release = validRelease();
    release.players.push({ ...release.players[0]! });

    expect(() => assertPlayerDataRelease(release)).toThrow(/Duplicate canonical_player_id/);
  });

  it("rejects unsupported positions", () => {
    const release = validRelease() as unknown as Record<string, unknown>;
    const players = release.players as Array<Record<string, unknown>>;
    players[0]!.position = "IDP";

    expect(() => assertPlayerDataRelease(release)).toThrow(/position is unsupported/);
  });
});
