import type {
  DraftOrderSlot,
  DraftPick,
  DraftState,
  PlayerDataRecord,
  PlayerPosition,
} from "@fdi/shared-types";
import { DEFAULT_RECOMMENDATION_WEIGHTS } from "./index.js";
import type {
  RecommendationScenario,
  RecommendationWeightProfile,
} from "./evaluation.js";

export const BUILT_IN_RECOMMENDATION_PROFILES: RecommendationWeightProfile[] = [
  {
    id: "default",
    label: "Default",
    description: "Recommendation Engine v1 production weights.",
    weights: DEFAULT_RECOMMENDATION_WEIGHTS,
  },
  {
    id: "value-heavy",
    label: "Value heavy",
    description: "Prioritizes projection and value over replacement.",
    weights: {
      baseValue: 0.34,
      valueOverReplacement: 0.31,
      tierUrgency: 0.08,
      rosterNeed: 0.09,
      adpValue: 0.08,
      expectedAvailability: 0.04,
      upside: 0.04,
      riskSafety: 0.02,
    },
  },
  {
    id: "roster-first",
    label: "Roster first",
    description: "Heavily favors unfilled starting positions.",
    weights: {
      baseValue: 0.12,
      valueOverReplacement: 0.1,
      tierUrgency: 0.08,
      rosterNeed: 0.52,
      adpValue: 0.05,
      expectedAvailability: 0.05,
      upside: 0.04,
      riskSafety: 0.04,
    },
  },
  {
    id: "urgency-first",
    label: "Urgency first",
    description: "Emphasizes tier cliffs and whether a player will return.",
    weights: {
      baseValue: 0.06,
      valueOverReplacement: 0.05,
      tierUrgency: 0.18,
      rosterNeed: 0.05,
      adpValue: 0.02,
      expectedAvailability: 0.59,
      upside: 0.03,
      riskSafety: 0.02,
    },
  },
  {
    id: "upside-first",
    label: "Upside first",
    description: "Favors ceiling outcomes when baseline value is close.",
    weights: {
      baseValue: 0.1,
      valueOverReplacement: 0.1,
      tierUrgency: 0.04,
      rosterNeed: 0.04,
      adpValue: 0.03,
      expectedAvailability: 0.02,
      upside: 0.64,
      riskSafety: 0.03,
    },
  },
  {
    id: "safety-first",
    label: "Safety first",
    description: "Favors lower-risk players when baseline value is close.",
    weights: {
      baseValue: 0.1,
      valueOverReplacement: 0.1,
      tierUrgency: 0.04,
      rosterNeed: 0.04,
      adpValue: 0.03,
      expectedAvailability: 0.02,
      upside: 0.03,
      riskSafety: 0.64,
    },
  },
];

export const BUILT_IN_RECOMMENDATION_SCENARIOS: RecommendationScenario[] = [
  {
    id: "elite-value",
    name: "Elite player separates from the pool",
    description: "A true elite running back should lead a balanced board.",
    state: benchmarkState([
      benchmarkPlayer("rb-elite", "RB", {
        projected_points: 260,
        overall_rank: 4,
        position_rank: 1,
        adp: 5,
        tier: 1,
        upside_score: 82,
        risk_score: 24,
      }),
      benchmarkPlayer("rb-good", "RB", {
        projected_points: 210,
        overall_rank: 18,
        position_rank: 5,
        adp: 20,
        tier: 2,
      }),
      benchmarkPlayer("rb-replacement", "RB", {
        projected_points: 150,
        overall_rank: 45,
        position_rank: 12,
        adp: 48,
        tier: 4,
      }),
      benchmarkPlayer("wr-good", "WR", {
        projected_points: 205,
        overall_rank: 20,
        position_rank: 6,
        adp: 21,
        tier: 2,
      }),
      benchmarkPlayer("qb-one", "QB", {
        projected_points: 280,
        overall_rank: 35,
        position_rank: 4,
        adp: 38,
        tier: 3,
      }),
      benchmarkPlayer("te-one", "TE", {
        projected_points: 145,
        overall_rank: 55,
        position_rank: 7,
        adp: 58,
        tier: 4,
      }),
    ]),
    limit: 6,
    expectations: [
      { kind: "top_player", playerId: "rb-elite" },
      {
        kind: "metric_at_least",
        playerId: "rb-elite",
        component: "valueOverReplacement",
        minimum: 75,
      },
    ],
  },
  {
    id: "open-starter",
    name: "Open starter outweighs redundant depth",
    description: "A roster-first profile should fill the missing WR starter before adding RB depth.",
    state: benchmarkState(
      [
        benchmarkPlayer("rb-rostered", "RB", { projected_points: 180 }),
        benchmarkPlayer("wr-candidate", "WR", { projected_points: 170 }),
        benchmarkPlayer("rb-candidate", "RB", { projected_points: 170 }),
      ],
      {
        picks: [benchmarkPick(1, "rb-rostered", "team-1", "RB")],
        nextOverallPick: 2,
      },
    ),
    limit: 2,
    expectations: [
      {
        kind: "top_player",
        profileId: "roster-first",
        playerId: "wr-candidate",
      },
      {
        kind: "reason_contains",
        profileId: "roster-first",
        playerId: "wr-candidate",
        text: "WR starting need",
      },
    ],
  },
  {
    id: "tier-cliff",
    name: "Last player before a tier cliff",
    description: "The urgency profile should recognize the final WR in the top tier.",
    state: benchmarkState([
      benchmarkPlayer("wr-tier-one", "WR", {
        tier: 1,
        projected_points: 210,
        overall_rank: 12,
        adp: 13,
      }),
      benchmarkPlayer("wr-tier-two-a", "WR", {
        tier: 2,
        projected_points: 200,
        overall_rank: 18,
        adp: 19,
      }),
      benchmarkPlayer("wr-tier-two-b", "WR", {
        tier: 2,
        projected_points: 198,
        overall_rank: 20,
        adp: 21,
      }),
    ]),
    limit: 3,
    expectations: [
      {
        kind: "top_player",
        profileId: "urgency-first",
        playerId: "wr-tier-one",
      },
      {
        kind: "reason_contains",
        profileId: "urgency-first",
        playerId: "wr-tier-one",
        text: "Only 1 WR",
      },
    ],
  },
  {
    id: "will-not-return",
    name: "Take now versus wait until the turn",
    description: "The urgency profile should favor the player unlikely to survive to the next user pick.",
    state: benchmarkState(
      [
        benchmarkPlayer("unlikely-return", "WR", {
          adp: 3,
          projected_points: 180,
          overall_rank: 18,
          tier: 2,
        }),
        benchmarkPlayer("likely-return", "WR", {
          adp: 18,
          projected_points: 180,
          overall_rank: 18,
          tier: 2,
        }),
      ],
      { nextOverallPick: 1 },
    ),
    limit: 2,
    expectations: [
      {
        kind: "top_player",
        profileId: "urgency-first",
        playerId: "unlikely-return",
      },
      {
        kind: "reason_contains",
        profileId: "urgency-first",
        playerId: "unlikely-return",
        text: "pick 8",
      },
    ],
  },
  {
    id: "risk-reward",
    name: "Safety versus ceiling preference",
    description: "Different strategy profiles should make an intentional choice between floor and upside.",
    state: benchmarkState([
      benchmarkPlayer("safe-rb", "RB", {
        projected_points: 195,
        overall_rank: 20,
        adp: 20,
        risk_score: 5,
        upside_score: 40,
      }),
      benchmarkPlayer("boom-rb", "RB", {
        projected_points: 200,
        overall_rank: 19,
        adp: 20,
        risk_score: 95,
        upside_score: 95,
      }),
    ]),
    limit: 2,
    expectations: [
      {
        kind: "top_player",
        profileId: "safety-first",
        playerId: "safe-rb",
      },
      {
        kind: "top_player",
        profileId: "upside-first",
        playerId: "boom-rb",
      },
    ],
  },
  {
    id: "drafted-filter",
    name: "Drafted players never return",
    description: "A previously selected superstar must be absent from every recommendation list.",
    state: benchmarkState(
      [
        benchmarkPlayer("already-drafted", "RB", {
          projected_points: 300,
          overall_rank: 1,
          adp: 1,
          tier: 1,
        }),
        benchmarkPlayer("available-wr", "WR", {
          projected_points: 180,
          overall_rank: 25,
          adp: 25,
          tier: 3,
        }),
      ],
      {
        picks: [benchmarkPick(1, "already-drafted", "team-1", "RB")],
        nextOverallPick: 2,
      },
    ),
    limit: 2,
    expectations: [
      { kind: "excludes_player", playerId: "already-drafted" },
      { kind: "top_player", playerId: "available-wr" },
    ],
  },
];

function benchmarkPlayer(
  id: string,
  position: PlayerPosition,
  overrides: Partial<PlayerDataRecord> = {},
): PlayerDataRecord {
  return {
    canonical_player_id: id,
    display_name: id
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
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

function benchmarkState(
  players: PlayerDataRecord[],
  options: { picks?: DraftPick[]; nextOverallPick?: number } = {},
): DraftState {
  const teamCount = 4;
  const rounds = 6;
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
  const draftedIds = new Set(picks.map((pick) => pick.playerId));
  return {
    draftId: "recommendation-benchmark",
    settings: {
      leagueName: "Recommendation Benchmark",
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
      release_id: "recommendation-benchmark-v1",
      generated_at: "2026-07-17T12:00:00.000Z",
      sources: ["benchmark"],
      players,
    },
    playerPoolIds: players.map((player) => player.canonical_player_id),
    availablePlayerIds: players
      .map((player) => player.canonical_player_id)
      .filter((playerId) => !draftedIds.has(playerId)),
    picks,
    nextOverallPick: options.nextOverallPick ?? picks.length + 1,
    status: picks.length === 0 ? "not_started" : "in_progress",
    revision: picks.length,
  };
}

function benchmarkPick(
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
