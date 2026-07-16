import type {
  LeagueSettings,
  PlayerDataRecord,
  PlayerDataRelease,
  PlayerPosition,
  RosterSlotRule,
} from "@fdi/shared-types";

const ALL_POSITIONS: PlayerPosition[] = ["QB", "RB", "WR", "TE", "K", "DST"];

export function leagueSettings(overrides: Partial<LeagueSettings> = {}): LeagueSettings {
  const rounds = overrides.rounds ?? 16;
  const rosterSlots = overrides.rosterSlots ?? defaultRosterSlots(rounds);

  return {
    leagueName: "Test League",
    teamCount: 12,
    userDraftSlot: 6,
    rounds,
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
    rosterSlots,
    ...overrides,
  };
}

export function playerRecord(
  canonicalPlayerId: string,
  position: PlayerPosition,
  displayName: string = canonicalPlayerId,
): PlayerDataRecord {
  return {
    canonical_player_id: canonicalPlayerId,
    display_name: displayName,
    position,
    nfl_team: "TST",
    bye_week: 7,
    overall_rank: null,
    position_rank: null,
    adp: null,
    projected_points: null,
    tier: null,
    risk_score: null,
    upside_score: null,
    availability_status: "active",
  };
}

export function playerDataRelease(players: PlayerDataRecord[]): PlayerDataRelease {
  return {
    schema_version: "1.0",
    season: 2026,
    release_id: "test-release-v1",
    generated_at: "2026-07-16T12:00:00Z",
    sources: ["test-fixture"],
    players,
  };
}

export function generatedPlayerRelease(
  count: number,
  positions: PlayerPosition[] = ALL_POSITIONS,
): PlayerDataRelease {
  return playerDataRelease(
    Array.from({ length: count }, (_, index) =>
      playerRecord(`player-${index + 1}`, positions[index % positions.length]!),
    ),
  );
}

export function fullDraftPlayerRelease(settings: LeagueSettings): PlayerDataRelease {
  const standardRoundPositions: PlayerPosition[] = [
    "QB",
    "RB",
    "RB",
    "WR",
    "WR",
    "TE",
    "RB",
    "K",
    "DST",
    "QB",
    "RB",
    "WR",
    "WR",
    "TE",
    "RB",
    "WR",
  ];

  const requiredPlayers = settings.teamCount * settings.rounds;
  const players = Array.from({ length: requiredPlayers + 20 }, (_, index) => {
    const round = Math.floor(index / settings.teamCount);
    const position = standardRoundPositions[round] ?? ALL_POSITIONS[index % ALL_POSITIONS.length]!;
    return playerRecord(`player-${index + 1}`, position);
  });
  return playerDataRelease(players);
}

function defaultRosterSlots(rounds: number): RosterSlotRule[] {
  if (rounds !== 16) {
    return [{ slot: "BENCH", count: rounds, eligiblePositions: [...ALL_POSITIONS] }];
  }

  return [
    { slot: "QB", count: 1, eligiblePositions: ["QB"] },
    { slot: "RB", count: 2, eligiblePositions: ["RB"] },
    { slot: "WR", count: 2, eligiblePositions: ["WR"] },
    { slot: "TE", count: 1, eligiblePositions: ["TE"] },
    { slot: "FLEX", count: 1, eligiblePositions: ["RB", "WR", "TE"] },
    { slot: "K", count: 1, eligiblePositions: ["K"] },
    { slot: "DST", count: 1, eligiblePositions: ["DST"] },
    { slot: "BENCH", count: 7, eligiblePositions: [...ALL_POSITIONS] },
  ];
}
