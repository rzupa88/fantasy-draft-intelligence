import { writeFileSync } from "node:fs";
import {
  createRecommendationSnapshotManifest,
  formatRecommendationEvaluationReport,
  runRecommendationEvaluation,
} from "../packages/recommendation-engine/dist/evaluation.js";
import {
  BUILT_IN_RECOMMENDATION_PROFILES,
  BUILT_IN_RECOMMENDATION_SCENARIOS,
} from "../packages/recommendation-engine/dist/benchmarks.js";

const args = process.argv.slice(2);
const report = runRecommendationEvaluation(BUILT_IN_RECOMMENDATION_SCENARIOS, {
  profiles: BUILT_IN_RECOMMENDATION_PROFILES,
  baselineProfileId: "default",
});
const output = args.includes("--json")
  ? `${JSON.stringify(report, null, 2)}\n`
  : formatRecommendationEvaluationReport(report);

console.log(output);

const snapshotArgument = args.find((argument) => argument.startsWith("--write-snapshots="));
if (snapshotArgument !== undefined) {
  const destination = snapshotArgument.slice("--write-snapshots=".length);
  if (destination.trim().length === 0) {
    throw new Error("--write-snapshots requires a file path.");
  }
  writeFileSync(
    destination,
    `${JSON.stringify(createRecommendationSnapshotManifest(report), null, 2)}\n`,
    "utf8",
  );
}

if (!report.passed) {
  process.exitCode = 1;
}
