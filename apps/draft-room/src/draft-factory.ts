import { createDraftState } from "@fdi/draft-engine";
import type {
  DraftState,
  LeagueSettings,
  RosterSlotRule,
  ScoringPreset,
  ScoringSettings,
} from "@fdi/shared-types";
import { createDemoPlayerDataRelease } from "./demo-data.js";

export type SupportedScoringPreset = Exclude<ScoringPreset, "custom">;

export interface DraftSetup {
  leagueName: string;
  teamCount: number;
  userDraftSlot: number;
  rounds: number;
  scoringPreset: SupportedScoringPreset;
}

export const DEFAULT_DRAFT_SETUP: DraftSetup = {
  leagueName: "Friday Night League",
  teamCount: 12,
  userDraftSlot: 6,
  rounds: 16,
  scoringPreset: "half_ppr",
};

export const TEAM_COUNT_OPTIONS = [8, 10, 12, 14] as const;
export const ROUND_OPTIONS = [14, 15, 16, 17, 18] as const;

export const SCORING_OPTIONS: Array<{
  value: SupportedScoringPreset;
  label: string;
  description: string;
}> = [
  {
    value: "standard",
    label: "Standard",
    description: "No points per reception",
  },
  {
    value: "half_ppr",
    label: "Half PPR",
    description: "0.5 points per reception",
  },
  {
    value: "ppr",
    label: "Full PPR",
    description: "1 point per reception",
  },
];

export function createDraftFromSetup(
  setup: DraftSetup,
  draftId = createDraftId(setup.leagueName),
): DraftState {
  validateDraftSetup(setup);
  const settings = createLeagueSettings(setup);
  const teamNames = Array.from({ length: setup.teamCount }, (_, index) =>
    index + 1 === setup.userDraftSlot ? "My Team" : `Team ${index + 1}`,
  );

  return createDraftState({
    draftId,
    settings,
    teamNames,
    playerDataRelease: createDemoPlayerDataRelease(setup.teamCount * setup.rounds + 40),
  });
}

export function createLeagueSettings(setup: DraftSetup): LeagueSettings {
  validateDraftSetup(setup);

  return {
    leagueName: setup.leagueName.trim(),
    teamCount: setup.teamCount,
    userDraftSlot: setup.userDraftSlot,
    rounds: setup.rounds,
    scoring: createScoringSettings(setup.scoringPreset),
    rosterSlots: createRosterSlots(setup.rounds),
  };
}

export function createRosterSlots(rounds: number): RosterSlotRule[] {
  const requiredStarterSlots = 9;
  if (!Number.isInteger(rounds) || rounds < requiredStarterSlots) {
    throw new RangeError(`Draft rounds must be at least ${requiredStarterSlots}.`);
  }

  return [
    { slot: "QB", count: 1, eligiblePositions: ["QB"] },
    { slot: "RB", count: 2, eligiblePositions: ["RB"] },
    { slot: "WR", count: 2, eligiblePositions: ["WR"] },
    { slot: "TE", count: 1, eligiblePositions: ["TE"] },
    { slot: "FLEX", count: 1, eligiblePositions: ["RB", "WR", "TE"] },
    { slot: "K", count: 1, eligiblePositions: ["K"] },
    { slot: "DST", count: 1, eligiblePositions: ["DST"] },
    {
      slot: "BENCH",
      count: rounds - requiredStarterSlots,
      eligiblePositions: ["QB", "RB", "WR", "TE", "K", "DST"],
    },
  ];
}

function createScoringSettings(preset: SupportedScoringPreset): ScoringSettings {
  const reception = preset === "ppr" ? 1 : preset === "half_ppr" ? 0.5 : 0;

  return {
    preset,
    passingYardsPerPoint: 25,
    passingTouchdown: 4,
    interception: -2,
    rushingYardsPerPoint: 10,
    rushingTouchdown: 6,
    receivingYardsPerPoint: 10,
    receivingTouchdown: 6,
    reception,
    fumbleLost: -2,
  };
}

function validateDraftSetup(setup: DraftSetup): void {
  if (setup.leagueName.trim().length === 0) {
    throw new RangeError("League name is required.");
  }
  if (!TEAM_COUNT_OPTIONS.includes(setup.teamCount as (typeof TEAM_COUNT_OPTIONS)[number])) {
    throw new RangeError("Team count must be 8, 10, 12, or 14.");
  }
  if (
    !Number.isInteger(setup.userDraftSlot) ||
    setup.userDraftSlot < 1 ||
    setup.userDraftSlot > setup.teamCount
  ) {
    throw new RangeError("Draft slot must be within the configured league size.");
  }
  if (!ROUND_OPTIONS.includes(setup.rounds as (typeof ROUND_OPTIONS)[number])) {
    throw new RangeError("Rounds must be between 14 and 18.");
  }
  if (!SCORING_OPTIONS.some((option) => option.value === setup.scoringPreset)) {
    throw new RangeError("Unsupported scoring preset.");
  }
}

function createDraftId(leagueName: string): string {
  const slug = leagueName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${slug || "draft"}-${Date.now()}`;
}
