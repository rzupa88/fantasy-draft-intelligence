import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type {
  DraftPick,
  PlayerDataRecord,
  RosterSlotRule,
} from "@fdi/shared-types";
import {
  RosterLineup,
  buildRosterLineupSlots,
} from "../src/components/RosterLineup.js";

const rules: RosterSlotRule[] = [
  { slot: "QB", count: 1, eligiblePositions: ["QB"] },
  { slot: "RB", count: 2, eligiblePositions: ["RB"] },
  { slot: "WR", count: 2, eligiblePositions: ["WR"] },
  { slot: "TE", count: 1, eligiblePositions: ["TE"] },
  { slot: "FLEX", count: 1, eligiblePositions: ["RB", "WR", "TE"] },
  {
    slot: "BENCH",
    count: 2,
    eligiblePositions: ["QB", "RB", "WR", "TE", "K", "DST"],
  },
];

const players: PlayerDataRecord[] = [
  player("qb-one", "QB One", "QB", "BUF"),
  player("rb-one", "RB One", "RB", "NYJ"),
  player("wr-one", "WR One", "WR", "LAR"),
];

const picks: DraftPick[] = [
  pick(1, "qb-one", "QB", 1),
  pick(2, "rb-one", "RB", 1),
  pick(3, "wr-one", "FLEX", 1),
];

describe("roster lineup", () => {
  it("expands every configured starting and bench slot", () => {
    const slots = buildRosterLineupSlots(rules, picks);

    expect(slots).toHaveLength(9);
    expect(slots.map((slot) => `${slot.slot}:${slot.slotIndex}`)).toEqual([
      "QB:1",
      "RB:1",
      "RB:2",
      "WR:1",
      "WR:2",
      "TE:1",
      "FLEX:1",
      "BENCH:1",
      "BENCH:2",
    ]);
    expect(slots.find((slot) => slot.slot === "FLEX")?.pick?.playerId).toBe("wr-one");
  });

  it("renders filled players and visible empty lineup spots", () => {
    const html = renderToStaticMarkup(
      <RosterLineup
        rules={rules}
        picks={picks}
        playersById={new Map(players.map((value) => [value.canonical_player_id, value]))}
      />,
    );

    expect(html).toContain("Starting lineup");
    expect(html).toContain("Bench");
    expect(html).toContain("QB One");
    expect(html).toContain("RB One");
    expect(html).toContain("WR One");
    expect(html).toContain("Empty");
    expect(html).toContain("roster-lineup-slot-flex");
  });
});

function player(
  id: string,
  displayName: string,
  position: PlayerDataRecord["position"],
  team: string,
): PlayerDataRecord {
  return {
    canonical_player_id: id,
    display_name: displayName,
    position,
    nfl_team: team,
    bye_week: 7,
    overall_rank: 1,
    position_rank: 1,
    adp: 1,
    projected_points: 200,
    tier: 1,
    risk_score: 20,
    upside_score: 80,
    availability_status: "active",
  };
}

function pick(
  overallPick: number,
  playerId: string,
  rosterSlot: DraftPick["rosterSlot"],
  rosterSlotIndex: number,
): DraftPick {
  return {
    overallPick,
    round: 1,
    pickInRound: overallPick,
    teamId: "team-1",
    draftSlot: 1,
    playerId,
    rosterSlot,
    rosterSlotIndex,
  };
}
