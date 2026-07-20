import type { DraftOrderSlot, DraftTeam, LeagueSettings } from "@fdi/shared-types";
import { DraftEngineError } from "./errors.js";

export function validateLeagueSettings(settings: LeagueSettings): void {
  if (!Number.isInteger(settings.teamCount) || settings.teamCount < 2 || settings.teamCount > 20) {
    throw new DraftEngineError(
      "INVALID_SETTINGS",
      "teamCount must be an integer between 2 and 20.",
    );
  }

  if (
    !Number.isInteger(settings.userDraftSlot) ||
    settings.userDraftSlot < 1 ||
    settings.userDraftSlot > settings.teamCount
  ) {
    throw new DraftEngineError(
      "INVALID_SETTINGS",
      "userDraftSlot must be within the configured team count.",
    );
  }

  if (!Number.isInteger(settings.rounds) || settings.rounds < 1 || settings.rounds > 40) {
    throw new DraftEngineError(
      "INVALID_SETTINGS",
      "rounds must be an integer between 1 and 40.",
    );
  }

  if (settings.rosterSlots.length === 0) {
    throw new DraftEngineError("INVALID_SETTINGS", "At least one roster slot rule is required.");
  }

  for (const rule of settings.rosterSlots) {
    if (!Number.isInteger(rule.count) || rule.count < 0) {
      throw new DraftEngineError(
        "INVALID_SETTINGS",
        `Roster slot ${rule.slot} must have a non-negative integer count.`,
      );
    }

    if (rule.count > 0 && rule.eligiblePositions.length === 0) {
      throw new DraftEngineError(
        "INVALID_SETTINGS",
        `Roster slot ${rule.slot} must define eligible positions.`,
      );
    }
  }
}

export function createDraftTeams(settings: LeagueSettings, teamNames?: string[]): DraftTeam[] {
  validateLeagueSettings(settings);

  if (teamNames !== undefined && teamNames.length !== settings.teamCount) {
    throw new DraftEngineError(
      "INVALID_SETTINGS",
      "teamNames must contain one name for each configured team.",
    );
  }

  return Array.from({ length: settings.teamCount }, (_, index) => {
    const draftSlot = index + 1;
    const providedName = teamNames?.[index]?.trim();

    return {
      teamId: `team-${draftSlot}`,
      name: providedName && providedName.length > 0 ? providedName : `Team ${draftSlot}`,
      draftSlot,
      isUser: draftSlot === settings.userDraftSlot,
    };
  });
}

export function generateSnakeDraftOrder(
  settings: LeagueSettings,
  teams: DraftTeam[] = createDraftTeams(settings),
): DraftOrderSlot[] {
  validateLeagueSettings(settings);
  validateTeams(settings, teams);

  const teamsByDraftSlot = [...teams].sort((left, right) => left.draftSlot - right.draftSlot);
  const order: DraftOrderSlot[] = [];

  for (let round = 1; round <= settings.rounds; round += 1) {
    const roundTeams = round % 2 === 1 ? teamsByDraftSlot : [...teamsByDraftSlot].reverse();

    roundTeams.forEach((team, index) => {
      order.push({
        overallPick: order.length + 1,
        round,
        pickInRound: index + 1,
        teamId: team.teamId,
        draftSlot: team.draftSlot,
      });
    });
  }

  return order;
}

function validateTeams(settings: LeagueSettings, teams: DraftTeam[]): void {
  if (teams.length !== settings.teamCount) {
    throw new DraftEngineError(
      "INVALID_SETTINGS",
      "The number of teams must match league settings.",
    );
  }

  const teamIds = new Set<string>();
  const draftSlots = new Set<number>();

  for (const team of teams) {
    if (teamIds.has(team.teamId)) {
      throw new DraftEngineError("INVALID_SETTINGS", `Duplicate teamId: ${team.teamId}`);
    }
    if (
      !Number.isInteger(team.draftSlot) ||
      team.draftSlot < 1 ||
      team.draftSlot > settings.teamCount ||
      draftSlots.has(team.draftSlot)
    ) {
      throw new DraftEngineError(
        "INVALID_SETTINGS",
        "Each team must have one unique draft slot within the league size.",
      );
    }

    teamIds.add(team.teamId);
    draftSlots.add(team.draftSlot);
  }
}
