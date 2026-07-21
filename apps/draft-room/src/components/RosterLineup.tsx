import type {
  DraftPick,
  PlayerDataRecord,
  PlayerPosition,
  RosterSlotRule,
  RosterSlotType,
} from "@fdi/shared-types";

export interface RosterLineupSlot {
  slot: RosterSlotType;
  slotIndex: number;
  eligiblePositions: PlayerPosition[];
  pick: DraftPick | null;
}

interface RosterLineupProps {
  rules: RosterSlotRule[];
  picks: DraftPick[];
  playersById: ReadonlyMap<string, PlayerDataRecord>;
}

export function RosterLineup({ rules, picks, playersById }: RosterLineupProps) {
  const slots = buildRosterLineupSlots(rules, picks);
  const starters = slots.filter((slot) => slot.slot !== "BENCH");
  const bench = slots.filter((slot) => slot.slot === "BENCH");

  return (
    <div className="roster-lineup" aria-label="Configured fantasy roster">
      <RosterSection
        title="Starting lineup"
        slots={starters}
        playersById={playersById}
      />
      {bench.length === 0 ? null : (
        <RosterSection title="Bench" slots={bench} playersById={playersById} />
      )}
    </div>
  );
}

export function buildRosterLineupSlots(
  rules: RosterSlotRule[],
  picks: DraftPick[],
): RosterLineupSlot[] {
  const picksBySlot = new Map(
    picks.map((pick) => [slotKey(pick.rosterSlot, pick.rosterSlotIndex), pick]),
  );
  const slotCounts = new Map<RosterSlotType, number>();
  const slots: RosterLineupSlot[] = [];

  for (const rule of rules) {
    for (let count = 0; count < rule.count; count += 1) {
      const slotIndex = (slotCounts.get(rule.slot) ?? 0) + 1;
      slotCounts.set(rule.slot, slotIndex);
      slots.push({
        slot: rule.slot,
        slotIndex,
        eligiblePositions: [...rule.eligiblePositions],
        pick: picksBySlot.get(slotKey(rule.slot, slotIndex)) ?? null,
      });
    }
  }

  return slots;
}

function RosterSection({
  title,
  slots,
  playersById,
}: {
  title: string;
  slots: RosterLineupSlot[];
  playersById: ReadonlyMap<string, PlayerDataRecord>;
}) {
  const filled = slots.filter((slot) => slot.pick !== null).length;

  return (
    <section className="roster-lineup-section" aria-label={title}>
      <div className="roster-lineup-section-heading">
        <strong>{title}</strong>
        <span>
          {filled}/{slots.length}
        </span>
      </div>
      {slots.map((slot) => (
        <RosterSlotRow
          key={slotKey(slot.slot, slot.slotIndex)}
          slot={slot}
          player={slot.pick === null ? null : playersById.get(slot.pick.playerId) ?? null}
        />
      ))}
    </section>
  );
}

function RosterSlotRow({
  slot,
  player,
}: {
  slot: RosterLineupSlot;
  player: PlayerDataRecord | null;
}) {
  const pick = slot.pick;
  const empty = pick === null;

  return (
    <div
      className={`roster-row roster-lineup-row ${empty ? "roster-row-empty" : ""}`}
      aria-label={`${formatSlotLabel(slot.slot)} slot ${slot.slotIndex}: ${player?.display_name ?? "empty"}`}
    >
      <span
        className={`roster-slot roster-lineup-slot roster-lineup-slot-${slot.slot.toLowerCase()}`}
        title={formatEligiblePositions(slot.eligiblePositions)}
      >
        {formatSlotLabel(slot.slot)}
      </span>
      <div className="roster-lineup-player">
        <strong>{player?.display_name ?? "Empty"}</strong>
        <span>
          {pick === null || player === null
            ? formatEligiblePositions(slot.eligiblePositions)
            : `${player.position} · ${player.nfl_team ?? "FA"} · Pick ${pick.overallPick}`}
        </span>
      </div>
      {pick === null ? null : <span className="roster-lineup-pick">#{pick.overallPick}</span>}
    </div>
  );
}

function slotKey(slot: RosterSlotType, slotIndex: number): string {
  return `${slot}:${slotIndex}`;
}

function formatSlotLabel(slot: RosterSlotType): string {
  if (slot === "SUPERFLEX") return "SFLEX";
  if (slot === "BENCH") return "BN";
  return slot;
}

function formatEligiblePositions(positions: PlayerPosition[]): string {
  if (positions.length === 0) return "No eligible positions";
  if (positions.length >= 6) return "Any position";
  return positions.join(" / ");
}
