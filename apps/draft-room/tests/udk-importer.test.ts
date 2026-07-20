import { strToU8, zipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { createScoringSettings } from "../src/draft-factory.js";
import {
  buildUdkPlayerDataRelease,
  parseCsv,
  parseUdkZip,
} from "../src/udk-importer.js";

function createFixtureZip(): Uint8Array {
  const files: Record<string, Uint8Array> = {
    "Position Rankings/UDK Position Rankings - QB.csv": strToU8(
      [
        "Name,Position,Team,Bye Week,Rank,Points,Risk,Upside,ADP,Tier,Outlook,Dynasty,Markers",
        'Josh Allen,QB,BUF,7,1,419.7,2.6,9.7,2.12,1,"Line one, with comma\nand line two",Dynasty,Markers',
      ].join("\n"),
    ),
    "Position Rankings/UDK Position Rankings - RB.csv": strToU8(
      [
        "Name,Position,Team,Bye Week,Rank,Points,Risk,Upside,ADP,Tier,Outlook,Dynasty,Markers",
        "Bijan Robinson,RB,ATL,11,1,356.4,1.3,10,1.02,1,Outlook,Dynasty,Markers",
      ].join("\n"),
    ),
    "Position Rankings/UDK Position Rankings - K.csv": strToU8(
      "Name,Position,Team,Bye Week,Rank,Andy,Jason,Mike,Markers\nBrandon Aubrey,K,DAL,14,1,1,1,1,Markers",
    ),
    "Position Rankings/UDK Position Rankings - DST.csv": strToU8(
      "Name,Position,Team,Bye Week,Rank,Andy,Jason,Mike,Markers\nHouston Texans,D,HOU,8,1,1,2,1,Markers",
    ),
    "Projections/Andy/UDK - Andys Projections - QB.csv": strToU8(
      [
        "Name,Team,Bye Week,Rank,PPG,YDS,TDS,YDS,TDS,INT,FUM",
        "Josh Allen,BUF,7,1,25.2,4000,30,500,8,10,3",
        "Ghost Quarterback,FA,1,99,1,100,1,0,0,0,0",
      ].join("\n"),
    ),
    "Projections/Jason/UDK - Jasons Projections - QB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,YDS,TDS,YDS,TDS,INT,FUM\nJosh Allen,BUF,7,1,25.8,4100,32,600,7,9,4",
    ),
    "Projections/Mike/UDK - Mikes Projections - QB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,YDS,TDS,YDS,TDS,INT,FUM\nJosh Allen,BUF,7,1,23,3900,28,550,9,12,5",
    ),
    "Projections/Andy/UDK - Andys Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nBijan Robinson,ATL,11,1,20,250,1200,10,60,500,4,2",
    ),
    "Projections/Jason/UDK - Jasons Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nBijan Robinson,ATL,11,1,21,275,1300,12,70,550,5,1",
    ),
    "Projections/Mike/UDK - Mikes Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nBijan Robinson,ATL,11,1,19,230,1100,8,50,450,3,3",
    ),
    "ADP Analysis/UDK - ADP Comparison - Fantasy Footballers Podcast.csv": strToU8(
      [
        "Rank,Name,Team,Pos,Pos,Avg,Sleeper,ESPN,Yahoo,Underdog",
        "[object Object],Bijan Robinson,ATL,RB,RB,1.03,1.05,1.02,1.04,1.01",
        "[object Object],Josh Allen,BUF,QB,QB,2.01,2.03,,2.02,2.04",
      ].join("\n"),
    ),
    "Career Snapshot Tool/UDK - Consistency Charts - QB.csv": strToU8(
      "Player,Rank,Total Points,Team,2025,2024,2023\nJosh Allen,1,1000,BUF,1,4,1",
    ),
    "Value Scout Tool/UDK - Value Scout - Fantasy Footballers Podcast.csv": strToU8(
      "Name,Team,Pos,Pos,TrueValue,Diff,Sleeper ADP,Markers\nBijan Robinson,ATL,RB,RB,1.03,-2Pick,1.05,Markers",
    ),
    "Cheat Sheet/Cheat Sheet.pdf": new Uint8Array([37, 80, 68, 70]),
  };
  return zipSync(files);
}

describe("UDK ZIP importer", () => {
  it("recognizes the package and builds a scored player release", () => {
    const parsed = parseUdkZip(createFixtureZip(), 2024);
    const result = buildUdkPlayerDataRelease(parsed, {
      scoring: createScoringSettings("half_ppr"),
      adpTeamCount: 12,
      adpSource: "sleeper",
      generatedAt: "2026-07-17T18:00:00.000Z",
    });

    expect(parsed.season).toBe(2026);
    expect(parsed.ignoredFiles).toEqual(["Cheat Sheet/Cheat Sheet.pdf"]);
    expect(result.report.playerCount).toBe(4);
    expect(result.report.projectedPlayerCount).toBe(2);
    expect(result.report.allAnalystProjectionCount).toBe(2);
    expect(result.report.selectedAdpPlayerCount).toBe(2);
    expect(result.report.unmatchedProjectionRows).toEqual([
      "Ghost Quarterback (QB, Andy)",
    ]);

    const allen = result.release.players.find((player) => player.display_name === "Josh Allen");
    const bijan = result.release.players.find((player) => player.display_name === "Bijan Robinson");
    const defense = result.release.players.find((player) => player.position === "DST");

    expect(allen?.projected_points).toBe(352);
    expect(allen?.adp).toBe(15);
    expect(bijan?.projected_points).toBe(280);
    expect(bijan?.adp).toBe(5);
    expect(bijan?.overall_rank).toBe(1);
    expect(defense?.nfl_team).toBe("HOU");
    expect(result.release.release_id).toBe("udk-2026-half_ppr-sleeper-20260717180000");
  });

  it("falls back to average ADP when the chosen platform is blank", () => {
    const parsed = parseUdkZip(createFixtureZip());
    const result = buildUdkPlayerDataRelease(parsed, {
      scoring: createScoringSettings("ppr"),
      adpTeamCount: 12,
      adpSource: "espn",
      generatedAt: "2026-07-17T18:00:00.000Z",
    });
    const allen = result.release.players.find((player) => player.display_name === "Josh Allen");

    expect(allen?.adp).toBe(13);
  });

  it("parses commas and newlines inside quoted CSV fields", () => {
    const rows = parseCsv('Name,Outlook\nPlayer,"First line, still field\nSecond line"');

    expect(rows).toEqual([
      ["Name", "Outlook"],
      ["Player", "First line, still field\nSecond line"],
    ]);
  });

  it("rejects ZIP archives without position rankings", () => {
    const bytes = zipSync({
      "ADP Analysis/UDK - ADP Comparison - Fantasy Footballers Podcast.csv": strToU8(
        "Rank,Name,Team,Pos,Pos,Avg,Sleeper,ESPN,Yahoo,Underdog",
      ),
    });

    expect(() => parseUdkZip(bytes)).toThrow("No UDK position-ranking CSV files");
  });
});
