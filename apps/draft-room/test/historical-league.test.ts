import { describe, expect, it } from "vitest";
import { strToU8, zipSync } from "fflate";
import { parseHistoricalDraftWorkbook } from "../src/historical-league.js";

describe("historical league workbook", () => {
  it("parses the attached Draft Results block layout", () => {
    const workbook = zipSync({
      "xl/workbook.xml": strToU8(`<?xml version="1.0"?><workbook xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Draft Results" sheetId="1" r:id="rId1"/></sheets></workbook>`),
      "xl/_rels/workbook.xml.rels": strToU8(`<?xml version="1.0"?><Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>`),
      "xl/sharedStrings.xml": strToU8(`<?xml version="1.0"?><sst><si><t>Round 1</t></si><si><t>Ja'Marr Chase</t></si><si><t>WR</t></si><si><t>Tune Squad</t></si><si><t>Bijan Robinson</t></si><si><t>RB</t></si><si><t>Flows Son</t></si><si><t>Round 2</t></si><si><t>Nico Collins</t></si><si><t>Joe Pa Mook</t></si></sst>`),
      "xl/worksheets/sheet1.xml": strToU8(`<?xml version="1.0"?><worksheet><sheetData>
        <row r="2"><c r="C2"><v>2025</v></c></row>
        <row r="7"><c r="B7" t="s"><v>0</v></c></row>
        <row r="8"><c r="B8"><v>1</v></c><c r="C8" t="s"><v>1</v></c><c r="D8" t="s"><v>2</v></c><c r="E8" t="s"><v>3</v></c></row>
        <row r="9"><c r="B9"><v>2</v></c><c r="C9" t="s"><v>4</v></c><c r="D9" t="s"><v>5</v></c><c r="E9" t="s"><v>6</v></c></row>
        <row r="12"><c r="B12" t="s"><v>7</v></c></row>
        <row r="13"><c r="B13"><v>1</v></c><c r="C13" t="s"><v>8</v></c><c r="D13" t="s"><v>2</v></c><c r="E13" t="s"><v>9</v></c></row>
      </sheetData></worksheet>`),
    });

    const history = parseHistoricalDraftWorkbook(workbook);

    expect(history.years).toEqual([2025]);
    expect(history.picks).toHaveLength(3);
    expect(history.picks[0]).toMatchObject({
      round: 1,
      pickInRound: 1,
      player: "Ja'Marr Chase",
      position: "WR",
      team: "Tune Squad",
    });
    expect(history.profiles.find((profile) => profile.team === "Tune Squad")?.positionCounts.WR).toBe(1);
  });
});
