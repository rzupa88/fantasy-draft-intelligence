import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import { recommendPlayers } from "../packages/recommendation-engine/dist/index.js";
import { BUILT_IN_RECOMMENDATION_PROFILES } from "../packages/recommendation-engine/dist/benchmarks.js";
import {
  DEFAULT_DRAFT_SETUP,
  createDraftFromSetup,
  createScoringSettings,
} from "../apps/draft-room/dist/draft-factory.js";
import {
  buildUdkPlayerDataRelease,
  parseUdkZip,
} from "../apps/draft-room/dist/udk-importer.js";
import {
  enrichPlayerDataReleaseWithNflverse,
  parseNflverseHistoryJson,
} from "../apps/draft-room/dist/nflverse-history.js";

const args = process.argv.slice(2);
const udkPath = valueAfter("--udk");
const historyPath = valueAfter("--history") ??
  "apps/draft-room/public/data/nflverse-history-2025-2026.zip";
const top = numberAfter("--top", 12);

if (udkPath === null) {
  throw new Error("Usage: npm run calibrate:real -- --udk=/absolute/path/to/UDK Tools.zip [--top=12]");
}

const setup = DEFAULT_DRAFT_SETUP;
const udkPackage = parseUdkZip(new Uint8Array(readFileSync(resolve(udkPath))));
const udkBuild = buildUdkPlayerDataRelease(udkPackage, {
  scoring: createScoringSettings(setup.scoringPreset),
  adpTeamCount: setup.teamCount,
  adpSource: setup.adpSource,
  generatedAt: new Date().toISOString(),
});
const historyArchive = unzipSync(new Uint8Array(readFileSync(resolve(historyPath))));
const historyEntries = Object.entries(historyArchive).filter(([name]) => name.endsWith(".json"));
if (historyEntries.length !== 1) {
  throw new Error(`Expected exactly one JSON file in ${historyPath}; found ${historyEntries.length}.`);
}
const history = parseNflverseHistoryJson(strFromU8(historyEntries[0][1]));
const enriched = enrichPlayerDataReleaseWithNflverse(udkBuild.release, history);
const state = createDraftFromSetup(setup, "real-data-calibration", enriched.release);

const profiles = [
  { id: "default", label: "Default", weights: undefined },
  ...BUILT_IN_RECOMMENDATION_PROFILES.filter((profile) => profile.id !== "default"),
];

const results = profiles.map((profile) => ({
  id: profile.id,
  label: profile.label,
  recommendations: recommendPlayers(state, {
    limit: top,
    weights: profile.weights,
  }).recommendations,
}));

const baseline = results[0];
const baselineIds = new Set(baseline.recommendations.map((item) => item.playerId));
const report = {
  generatedAt: new Date().toISOString(),
  inputs: {
    udkPath: resolve(udkPath),
    historyPath: resolve(historyPath),
    playerCount: enriched.release.players.length,
    matchedPlayers: enriched.report.matchedPlayerCount,
    matchedWithHistory: enriched.report.matchedWithHistoryCount,
    unmatchedPlayers: enriched.report.unmatchedPlayers,
    ambiguousPlayers: enriched.report.ambiguousPlayers,
  },
  setup: {
    teams: setup.teamCount,
    draftSlot: setup.userDraftSlot,
    scoring: setup.scoringPreset,
    rosterSlots: setup.rosterCounts,
  },
  profiles: results.map((profile) => ({
    ...profile,
    overlapWithDefault: profile.recommendations.filter((item) => baselineIds.has(item.playerId)).length,
  })),
};

if (args.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Real-data calibration: ${report.inputs.playerCount} UDK players, ${report.inputs.matchedPlayers} NFLverse matches, ${report.inputs.matchedWithHistory} with history.`);
  for (const profile of report.profiles) {
    console.log(`\n${profile.label} (${profile.id}) — overlap with default: ${profile.overlapWithDefault}/${top}`);
    profile.recommendations.forEach((item) => {
      console.log(`${String(item.rank).padStart(2)}. ${item.displayName} ${item.position} | ${item.score.toFixed(2)} | ${item.primaryReason}`);
    });
  }
}

function valueAfter(name) {
  const match = args.find((argument) => argument.startsWith(`${name}=`));
  return match === undefined ? null : match.slice(name.length + 1);
}

function numberAfter(name, fallback) {
  const raw = valueAfter(name);
  if (raw === null) return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 100) {
    throw new Error(`${name} must be an integer from 1 to 100.`);
  }
  return parsed;
}
