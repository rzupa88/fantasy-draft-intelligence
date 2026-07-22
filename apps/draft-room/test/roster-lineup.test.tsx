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
  player("wr-one", "Ja'Marr Chase", "WR", "CIN"),
  player("wr-two", "WR Two", "WR", "LAR"),
  player("wr-three", "WR Three", "WR", "MIN"),
  player("wr-four", "WR Four", "WR", "SEA"),
];

const playersById = new Map(
  players.map((value) => [value.canonical_player_id, value]),
);

const picks: DraftPick[] = [
  pick(1, "qb-one", "QB", 1),
  pick(2, "rb-one", "RB", 1),
  pick(3, "wr-one", "FLEX", 1),
];

describe("roster lineup", () => {
  it("expands every configured starting and bench slot", () => {
    const slots = buildRosterLineupSlots(rules, picks, playersById);

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
    expect(slots.find((slot) => slot.slot === "WR")?.pick?.playerId).toBe("wr-one");
  });

  it("keeps earlier receivers fixed while later receivers fill WR2, FLEX, then bench", () => {
    const receiverPicks = [
      pick(1, "wr-one", "WR", 2),
      pick(2, "wr-two", "WR", 1),
      pick(3, "wr-three", "WR", 1),
      pick(4, "wr-four", "WR", 1),
    ];

    const slots = buildRosterLineupSlots(rules, receiverPicks, playersById);

    expect(findPlayer(slots, "WR", 1)).toBe("wr-one");
    expect(findPlayer(slots, "WR", 2)).toBe("wr-two");
    expect(findPlayer(slots, "FLEX", 1)).toBe("wr-three");
    expect(findPlayer(slots, "BENCH", 1)).toBe("wr-four");
  });

  it("renders filled players and visible empty lineup spots", () => {
    const html = renderToStaticMarkup(
      <RosterLineup
        rules={rules}
        picks={picks}
        playersById={playersById}
      />,
    );

    expect(html).toContain("Starting lineup");
    expect(html).toContain("Bench");
    expect(html).toContain("QB One");
    expect(html).toContain("RB One");
    expect(html).toContain("Ja&#x27;Marr Chase");
    expect(html).toContain("Empty");
    expect(html).toContain("roster-lineup-slot-flex");
  });
});

function findPlayer(
  slots: ReturnType<typeof buildRosterLineupSlots>,
  slot: DraftPick["rosterSlot"],
  slotIndex: number,
): string | undefined {
  return slots.find(
    (candidate) => candidate.slot === slot && candidate.slotIndex === slotIndex,
  )?.pick?.playerId;
}

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
