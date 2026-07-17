import { createDraftState } from "@fdi/draft-engine";
import type {
  DraftState,
  LeagueSettings,
  PlayerDataRelease,
  PlayerPosition,
  RosterSlotRule,
  RosterSlotType,
  ScoringPreset,
  ScoringSettings,
} from "@fdi/shared-types";
import { createDemoPlayerDataRelease } from "./demo-data.js";
import { UDK_ADP_SOURCES, type UdkAdpSource } from "./udk-importer.js";

export type SupportedScoringPreset = Exclude<ScoringPreset, "custom">;
export type RosterCounts = Record<RosterSlotType, number>;

export interface DraftSetup {
  leagueName: string;
  teamCount: number;
  userDraftSlot: number;
  rounds: number;
  scoringPreset: SupportedScoringPreset;
  adpSource: UdkAdpSource;
  rosterCounts: RosterCounts;
}

export interface RosterSlotOption {
  slot: RosterSlotType;
  label: string;
  description: string;
  min: number;
  max: number;
  eligiblePositions: PlayerPosition[];
}

export const ROSTER_SLOT_OPTIONS: RosterSlotOption[] = [
  { slot: "QB", label: "Quarterback", description: "Dedicated QB starters", min: 0, max: 3, eligiblePositions: ["QB"] },
  { slot: "RB", label: "Running back", description: "Dedicated RB starters", min: 0, max: 6, eligiblePositions: ["RB"] },
  { slot: "WR", label: "Wide receiver", description: "Dedicated WR starters", min: 0, max: 6, eligiblePositions: ["WR"] },
  { slot: "TE", label: "Tight end", description: "Dedicated TE starters", min: 0, max: 3, eligiblePositions: ["TE"] },
  { slot: "FLEX", label: "Flex", description: "RB, WR, or TE", min: 0, max: 4, eligiblePositions: ["RB", "WR", "TE"] },
  { slot: "SUPERFLEX", label: "Superflex", description: "QB, RB, WR, or TE", min: 0, max: 3, eligiblePositions: ["QB", "RB", "WR", "TE"] },
  { slot: "K", label: "Kicker", description: "Dedicated kicker slot", min: 0, max: 1, eligiblePositions: ["K"] },
  { slot: "DST", label: "Defense", description: "Team defense / special teams", min: 0, max: 1, eligiblePositions: ["DST"] },
  { slot: "BENCH", label: "Bench", description: "Any offensive player, K, or DST", min: 0, max: 16, eligiblePositions: ["QB", "RB", "WR", "TE", "K", "DST"] },
];

export const DEFAULT_ROSTER_COUNTS: RosterCounts = {
  QB: 1,
  RB: 2,
  WR: 2,
  TE: 1,
  FLEX: 1,
  SUPERFLEX: 0,
  K: 1,
  DST: 1,
  BENCH: 7,
};

export const DEFAULT_DRAFT_SETUP: DraftSetup = {
  leagueName: "Friday Night League",
  teamCount: 12,
  userDraftSlot: 6,
  rounds: getRosterCapacity(DEFAULT_ROSTER_COUNTS),
  scoringPreset: "half_ppr",
  adpSource: "sleeper",
  rosterCounts: { ...DEFAULT_ROSTER_COUNTS },
};

export const TEAM_COUNT_OPTIONS = [8, 10, 12, 14] as const;
export const ROUND_OPTIONS = [14, 15, 16, 17, 18] as const;

export const SCORING_OPTIONS: Array<{
  value: SupportedScoringPreset;
  label: string;
  description: string;
}> = [
  { value: "standard", label: "Standard", description: "No points per reception" },
  { value: "half_ppr", label: "Half PPR", description: "0.5 points per reception" },
  { value: "ppr", label: "Full PPR", description: "1 point per reception" },
];

export function createDraftFromSetup(
  setup: DraftSetup,
  draftId = createDraftId(setup.leagueName),
  playerDataRelease?: PlayerDataRelease,
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
    playerDataRelease:
      playerDataRelease ?? createDemoPlayerDataRelease(setup.teamCount * settings.rounds + 40),
  });
}

export function createLeagueSettings(setup: DraftSetup): LeagueSettings {
  validateDraftSetup(setup);
  const rounds = getRosterCapacity(setup.rosterCounts);
  return {
    leagueName: setup.leagueName.trim(),
    teamCount: setup.teamCount,
    userDraftSlot: setup.userDraftSlot,
    rounds,
    scoring: createScoringSettings(setup.scoringPreset),
    rosterSlots: createRosterSlots(setup.rosterCounts),
  };
}

export function createRosterSlots(rosterCounts: RosterCounts): RosterSlotRule[] {
  return ROSTER_SLOT_OPTIONS.map((option) => ({
    slot: option.slot,
    count: rosterCounts[option.slot],
    eligiblePositions: [...option.eligiblePositions],
  }));
}

export function getRosterCapacity(rosterCounts: RosterCounts): number {
  return ROSTER_SLOT_OPTIONS.reduce((total, option) => total + rosterCounts[option.slot], 0);
}

export function getStarterCapacity(rosterCounts: RosterCounts): number {
  return getRosterCapacity(rosterCounts) - rosterCounts.BENCH;
}

export function setRosterCount(setup: DraftSetup, slot: RosterSlotType, count: number): DraftSetup {
  const rosterCounts = { ...setup.rosterCounts, [slot]: count };
  return { ...setup, rosterCounts, rounds: getRosterCapacity(rosterCounts) };
}

export function resetRosterCounts(setup: DraftSetup): DraftSetup {
  const rosterCounts = { ...DEFAULT_ROSTER_COUNTS };
  return { ...setup, rosterCounts, rounds: getRosterCapacity(rosterCounts) };
}

export function createScoringSettings(preset: SupportedScoringPreset): ScoringSettings {
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
  if (setup.leagueName.trim().length === 0) throw new RangeError("League name is required.");
  if (!TEAM_COUNT_OPTIONS.includes(setup.teamCount as (typeof TEAM_COUNT_OPTIONS)[number])) {
    throw new RangeError("Team count must be 8, 10, 12, or 14.");
  }
  if (!Number.isInteger(setup.userDraftSlot) || setup.userDraftSlot < 1 || setup.userDraftSlot > setup.teamCount) {
    throw new RangeError("Draft slot must be within the configured league size.");
  }
  for (const option of ROSTER_SLOT_OPTIONS) {
    const count = setup.rosterCounts[option.slot];
    if (!Number.isInteger(count) || count < option.min || count > option.max) {
      throw new RangeError(`${option.label} count must be between ${option.min} and ${option.max}.`);
    }
  }
  const rounds = getRosterCapacity(setup.rosterCounts);
  if (rounds < 8 || rounds > 24) throw new RangeError("Custom rosters must contain between 8 and 24 total slots.");
  if (getStarterCapacity(setup.rosterCounts) < 1) throw new RangeError("At least one starting roster slot is required.");
  if (setup.rounds !== rounds) throw new RangeError("Draft rounds must match the configured roster capacity.");
  if (!SCORING_OPTIONS.some((option) => option.value === setup.scoringPreset)) throw new RangeError("Unsupported scoring preset.");
  if (!UDK_ADP_SOURCES.includes(setup.adpSource)) throw new RangeError("Unsupported ADP market.");
}

function createDraftId(leagueName: string): string {
  const slug = leagueName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return `${slug || "draft"}-${Date.now()}`;
}
