import type { LeagueSettings } from "@fdi/shared-types";

export function leagueSettings(overrides: Partial<LeagueSettings> = {}): LeagueSettings {
  return {
    leagueName: "Test League",
    teamCount: 12,
    userDraftSlot: 6,
    rounds: 16,
    scoring: {
      preset: "half_ppr",
      passingYardsPerPoint: 25,
      passingTouchdown: 4,
      interception: -2,
      rushingYardsPerPoint: 10,
      rushingTouchdown: 6,
      receivingYardsPerPoint: 10,
      receivingTouchdown: 6,
      reception: 0.5,
      fumbleLost: -2,
    },
    rosterSlots: [
      { slot: "QB", count: 1, eligiblePositions: ["QB"] },
      { slot: "RB", count: 2, eligiblePositions: ["RB"] },
      { slot: "WR", count: 2, eligiblePositions: ["WR"] },
      { slot: "TE", count: 1, eligiblePositions: ["TE"] },
      { slot: "FLEX", count: 1, eligiblePositions: ["RB", "WR", "TE"] },
      { slot: "K", count: 1, eligiblePositions: ["K"] },
      { slot: "DST", count: 1, eligiblePositions: ["DST"] },
      { slot: "BENCH", count: 7, eligiblePositions: ["QB", "RB", "WR", "TE", "K", "DST"] },
    ],
    ...overrides,
  };
}

export function playerPool(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `player-${index + 1}`);
}
