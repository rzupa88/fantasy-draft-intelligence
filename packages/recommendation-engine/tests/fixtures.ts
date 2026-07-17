import type {
  DraftOrderSlot,
  DraftPick,
  DraftState,
  PlayerDataRecord,
  PlayerPosition,
} from "@fdi/shared-types";

export function player(
  id: string,
  position: PlayerPosition,
  overrides: Partial<PlayerDataRecord> = {},
): PlayerDataRecord {
  return {
    canonical_player_id: id,
    display_name: id.toUpperCase(),
    position,
    nfl_team: "NYJ",
    bye_week: 9,
    overall_rank: 50,
    position_rank: 10,
    adp: 50,
    projected_points: 150,
    tier: 3,
    risk_score: 50,
    upside_score: 50,
    availability_status: null,
    ...overrides,
  };
}

export function draftState(
  players: PlayerDataRecord[],
  options: {
    picks?: DraftPick[];
    nextOverallPick?: number;
    teamCount?: number;
    rounds?: number;
  } = {},
): DraftState {
  const teamCount = options.teamCount ?? 4;
  const rounds = options.rounds ?? 6;
  const teams = Array.from({ length: teamCount }, (_, index) => ({
    teamId: `team-${index + 1}`,
    name: `Team ${index + 1}`,
    draftSlot: index + 1,
    isUser: index === 0,
  }));
  const order: DraftOrderSlot[] = [];

  for (let round = 1; round <= rounds; round += 1) {
    const slots = Array.from({ length: teamCount }, (_, index) => index + 1);
    if (round % 2 === 0) {
      slots.reverse();
    }
    slots.forEach((draftSlot, index) => {
      order.push({
        overallPick: order.length + 1,
        round,
        pickInRound: index + 1,
        teamId: `team-${draftSlot}`,
        draftSlot,
      });
    });
  }

  const picks = options.picks ?? [];
  const availablePlayerIds = players
    .map((item) => item.canonical_player_id)
    .filter((id) => !picks.some((draftPick) => draftPick.playerId === id));

  return {
    draftId: "test-draft",
    settings: {
      leagueName: "Test League",
      teamCount,
      userDraftSlot: 1,
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
      rosterSlots: [
        { slot: "QB", count: 1, eligiblePositions: ["QB"] },
        { slot: "RB", count: 1, eligiblePositions: ["RB"] },
        { slot: "WR", count: 1, eligiblePositions: ["WR"] },
        { slot: "FLEX", count: 1, eligiblePositions: ["RB", "WR", "TE"] },
        {
          slot: "BENCH",
          count: 2,
          eligiblePositions: ["QB", "RB", "WR", "TE", "K", "DST"],
        },
      ],
    },
    teams,
    order,
    playerDataRelease: {
      schema_version: "1.0",
      season: 2026,
      release_id: "test-release",
      generated_at: "2026-07-17T12:00:00.000Z",
      sources: ["fixture"],
      players,
    },
    playerPoolIds: players.map((item) => item.canonical_player_id),
    availablePlayerIds,
    picks,
    nextOverallPick: options.nextOverallPick ?? picks.length + 1,
    status: picks.length === 0 ? "not_started" : "in_progress",
    revision: picks.length,
  };
}

export function pick(
  overallPick: number,
  playerId: string,
  teamId: string,
  rosterSlot: DraftPick["rosterSlot"],
  rosterSlotIndex = 1,
): DraftPick {
  return {
    overallPick,
    round: 1,
    pickInRound: overallPick,
    teamId,
    draftSlot: Number(teamId.split("-")[1]),
    playerId,
    rosterSlot,
    rosterSlotIndex,
  };
}
