import type {
  PlayerDataRecord,
  PlayerDataRelease,
  PlayerPosition,
} from "@fdi/shared-types";

interface GeneratedPlayer extends PlayerDataRecord {
  marketScore: number;
}

interface PositionProfile {
  position: PlayerPosition;
  count: number;
  projectionStart: number;
  projectionStep: number;
  marketStart: number;
  marketStep: number;
  tierSize: number;
}

const FIRST_NAMES = [
  "Avery",
  "Blake",
  "Cameron",
  "Drew",
  "Eli",
  "Finn",
  "Grant",
  "Hayden",
  "Isaiah",
  "Jordan",
  "Kai",
  "Logan",
  "Micah",
  "Nolan",
  "Owen",
  "Parker",
  "Quinn",
  "Riley",
  "Sawyer",
  "Theo",
  "Victor",
  "Wesley",
  "Xavier",
  "Zane",
] as const;

const LAST_NAMES = [
  "Adams",
  "Bennett",
  "Carter",
  "Davis",
  "Ellis",
  "Foster",
  "Gibson",
  "Hayes",
  "Irving",
  "Jackson",
  "King",
  "Lewis",
  "Mitchell",
  "Nelson",
  "Owens",
  "Porter",
  "Reed",
  "Simmons",
  "Turner",
  "Vaughn",
  "Walker",
  "Young",
] as const;

const NFL_TEAMS = [
  "ARI",
  "ATL",
  "BAL",
  "BUF",
  "CAR",
  "CHI",
  "CIN",
  "CLE",
  "DAL",
  "DEN",
  "DET",
  "GB",
  "HOU",
  "IND",
  "JAX",
  "KC",
  "LAC",
  "LAR",
  "LV",
  "MIA",
  "MIN",
  "NE",
  "NO",
  "NYG",
  "NYJ",
  "PHI",
  "PIT",
  "SEA",
  "SF",
  "TB",
  "TEN",
  "WAS",
] as const;

const POSITION_PROFILES: PositionProfile[] = [
  {
    position: "QB",
    count: 48,
    projectionStart: 310,
    projectionStep: 3.1,
    marketStart: 84,
    marketStep: 1.1,
    tierSize: 6,
  },
  {
    position: "RB",
    count: 96,
    projectionStart: 265,
    projectionStep: 1.65,
    marketStart: 100,
    marketStep: 1.15,
    tierSize: 8,
  },
  {
    position: "WR",
    count: 110,
    projectionStart: 258,
    projectionStep: 1.35,
    marketStart: 98,
    marketStep: 1,
    tierSize: 10,
  },
  {
    position: "TE",
    count: 48,
    projectionStart: 215,
    projectionStep: 2.05,
    marketStart: 88,
    marketStep: 1.4,
    tierSize: 6,
  },
  {
    position: "K",
    count: 14,
    projectionStart: 150,
    projectionStep: 2,
    marketStart: 25,
    marketStep: 1.3,
    tierSize: 7,
  },
  {
    position: "DST",
    count: 14,
    projectionStart: 160,
    projectionStep: 2.2,
    marketStart: 28,
    marketStep: 1.35,
    tierSize: 7,
  },
];

export function createDemoPlayerDataRelease(requiredPlayerCount = 252): PlayerDataRelease {
  const generated: GeneratedPlayer[] = [];

  POSITION_PROFILES.forEach((profile, profileIndex) => {
    for (let positionIndex = 0; positionIndex < profile.count; positionIndex += 1) {
      const globalIndex = generated.length;
      const team = NFL_TEAMS[(globalIndex + profileIndex * 3) % NFL_TEAMS.length]!;
      const displayName = buildDisplayName(profile.position, positionIndex, globalIndex);
      const marketScore =
        profile.marketStart - profile.marketStep * positionIndex + ((positionIndex % 5) - 2) * 0.18;

      generated.push({
        canonical_player_id: `demo-${profile.position.toLowerCase()}-${positionIndex + 1}`,
        display_name: displayName,
        position: profile.position,
        nfl_team: team,
        bye_week: 5 + ((globalIndex + profileIndex) % 10),
        overall_rank: null,
        position_rank: positionIndex + 1,
        adp: null,
        projected_points: round(
          Math.max(65, profile.projectionStart - profile.projectionStep * positionIndex),
        ),
        tier: Math.floor(positionIndex / profile.tierSize) + 1,
        risk_score: 18 + ((globalIndex * 17 + profileIndex * 11) % 73),
        upside_score: 22 + ((globalIndex * 23 + profileIndex * 7) % 77),
        availability_status: "active",
        marketScore,
      });
    }
  });

  let overflowIndex = 0;
  while (generated.length < requiredPlayerCount) {
    generated.push({
      canonical_player_id: `demo-overflow-${overflowIndex + 1}`,
      display_name: `Reserve Player ${overflowIndex + 1}`,
      position: overflowIndex % 2 === 0 ? "WR" : "RB",
      nfl_team: NFL_TEAMS[overflowIndex % NFL_TEAMS.length]!,
      bye_week: 5 + (overflowIndex % 10),
      overall_rank: null,
      position_rank: 120 + overflowIndex,
      adp: null,
      projected_points: Math.max(50, 95 - overflowIndex * 0.5),
      tier: 15 + Math.floor(overflowIndex / 8),
      risk_score: 50,
      upside_score: 45,
      availability_status: "active",
      marketScore: -20 - overflowIndex,
    });
    overflowIndex += 1;
  }

  generated.sort((left, right) => {
    if (right.marketScore !== left.marketScore) {
      return right.marketScore - left.marketScore;
    }
    return left.canonical_player_id.localeCompare(right.canonical_player_id);
  });

  const players: PlayerDataRecord[] = generated.map((player, index) => ({
    canonical_player_id: player.canonical_player_id,
    display_name: player.display_name,
    position: player.position,
    nfl_team: player.nfl_team,
    bye_week: player.bye_week,
    overall_rank: index + 1,
    position_rank: player.position_rank,
    adp: round(Math.max(1, index + 1 + ((index % 7) - 3) * 0.35)),
    projected_points: player.projected_points,
    tier: player.tier,
    risk_score: player.risk_score,
    upside_score: player.upside_score,
    availability_status: player.availability_status,
  }));

  return {
    schema_version: "1.0",
    season: 2026,
    release_id: "offline-demo-2026-v1",
    generated_at: "2026-07-17T12:00:00.000Z",
    sources: ["deterministic fictional demo data"],
    players,
  };
}

function buildDisplayName(
  position: PlayerPosition,
  positionIndex: number,
  globalIndex: number,
): string {
  if (position === "DST") {
    const city = LAST_NAMES[positionIndex % LAST_NAMES.length]!;
    return `${city} Defense`;
  }

  const firstName = FIRST_NAMES[globalIndex % FIRST_NAMES.length]!;
  const lastName = LAST_NAMES[(globalIndex * 3 + positionIndex) % LAST_NAMES.length]!;
  const duplicateCycle = Math.floor(globalIndex / (FIRST_NAMES.length * LAST_NAMES.length));
  return duplicateCycle === 0
    ? `${firstName} ${lastName}`
    : `${firstName} ${lastName} ${duplicateCycle + 1}`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
