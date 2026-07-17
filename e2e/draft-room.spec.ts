import { writeFile } from "node:fs/promises";
import { strToU8, zipSync } from "fflate";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("supports keyboard drafting, recovery, correction, and undo", async ({ page }) => {
  await page.getByLabel("League name").fill("Keyboard League");
  await page.getByRole("button", { name: "Start new draft" }).click();

  await expect(page.getByRole("heading", { name: "Keyboard League" })).toBeVisible();
  await page.keyboard.press("/");
  const search = page.getByPlaceholder("Search player, team, position…");
  await expect(search).toBeFocused();
  await search.fill("Avery");
  await expect(page.locator(".player-row-selected").first()).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.locator(".draft-progress-label")).toContainText("1 / 192 picks");

  await page.reload();
  await expect(page.getByRole("heading", { name: "Keyboard League" })).toBeVisible();
  await expect(page.locator(".draft-progress-label")).toContainText("1 / 192 picks");
  await expect(page.getByRole("status")).toContainText("Autosaved draft restored");

  await page.getByRole("button", { name: "Correct pick 1" }).click();
  await expect(page.getByRole("dialog", { name: "Pick #1" })).toBeVisible();
  const replacements = page.getByRole("button", { name: /Replace pick 1 with/ });
  await expect(replacements).toHaveCount(60);
  await replacements.nth(1).click();
  await expect(page.getByRole("status")).toContainText("Pick 1 corrected");

  await page.keyboard.press("Control+z");
  await expect(page.locator(".draft-progress-label")).toContainText("0 / 192 picks");
});

test("exports a backup and imports it after clearing recovery", async ({ page }) => {
  await page.getByLabel("League name").fill("Backup League");
  await page.getByRole("button", { name: "Start new draft" }).click();
  await page.getByRole("button", { name: /Draft for .*:/ }).first().click();
  await expect(page.locator(".draft-progress-label")).toContainText("1 / 192 picks");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export" }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(download.suggestedFilename()).toBe("backup-league-draft.json");
  expect(downloadPath).not.toBeNull();

  await page.getByRole("button", { name: "Exit" }).click();
  await expect(page.getByText("Autosaved draft found")).toBeVisible();
  await page.getByRole("button", { name: "Discard save" }).click();
  await expect(page.getByText("Autosaved draft found")).toHaveCount(0);

  await page.locator('input[accept*="json"]').setInputFiles(downloadPath!);
  await expect(page.getByRole("heading", { name: "Backup League" })).toBeVisible();
  await expect(page.locator(".draft-progress-label")).toContainText("1 / 192 picks");
  await expect(page.getByRole("status")).toContainText("imported with 1 recorded picks");
});

test("derives draft length from a custom superflex roster", async ({ page }) => {
  await page.getByLabel("League name").fill("Custom Superflex League");
  await page.getByLabel("Superflex roster slots").fill("1");
  await page.getByLabel("Kicker roster slots").fill("0");
  await page.getByLabel("Bench roster slots").fill("8");

  await expect(page.getByText("17 rounds", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("204 total selections in this league.")).toBeVisible();

  await page.getByRole("button", { name: "Start new draft" }).click();
  await expect(page.getByRole("heading", { name: "Custom Superflex League" })).toBeVisible();
  await expect(page.locator(".draft-progress-label")).toContainText("0 / 204 picks");
});

test("imports a UDK ZIP and uses its players in the draft", async ({ page }, testInfo) => {
  const rankingRows = Array.from({ length: 200 }, (_, index) => {
    const rank = index + 1;
    return `UDK Player ${rank},RB,T${String(rank).padStart(2, "0")},7,${rank},${350 - rank},4,7,${Math.ceil(rank / 12)}.${String(((rank - 1) % 12) + 1).padStart(2, "0")},${Math.ceil(rank / 12)},Outlook,Dynasty,Markers`;
  });
  const archive = zipSync({
    "Position Rankings/UDK Position Rankings - RB.csv": strToU8(
      [
        "Name,Position,Team,Bye Week,Rank,Points,Risk,Upside,ADP,Tier,Outlook,Dynasty,Markers",
        ...rankingRows,
      ].join("\n"),
    ),
    "Projections/Andy/UDK - Andys Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nUDK Player 1,T01,7,1,20,250,1200,10,60,500,4,2",
    ),
    "Projections/Jason/UDK - Jasons Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nUDK Player 1,T01,7,1,21,260,1250,11,65,520,4,1",
    ),
    "Projections/Mike/UDK - Mikes Projections - RB.csv": strToU8(
      "Name,Team,Bye Week,Rank,PPG,ATTS,YDS,TDS,REC,YDS,TDS,FUM\nUDK Player 1,T01,7,1,19,240,1150,9,55,480,3,2",
    ),
    "ADP Analysis/UDK - ADP Comparison - Fantasy Footballers Podcast.csv": strToU8(
      "Rank,Name,Team,Pos,Pos,Avg,Sleeper,ESPN,Yahoo,Underdog\n[object Object],UDK Player 1,T01,RB,RB,1.01,1.01,1.01,1.01,1.01",
    ),
    "Career Snapshot Tool/UDK - Consistency Charts - RB.csv": strToU8(
      "Player,Rank,Total Points,Team,2025,2024\nUDK Player 1,1,500,T01,1,2",
    ),
  });
  const zipPath = testInfo.outputPath("udk-fixture.zip");
  await writeFile(zipPath, archive);

  await page.getByTestId("udk-file-input").setInputFiles(zipPath);
  await expect(page.getByText("UDK 2026 ready")).toBeVisible();
  await expect(page.getByText("200", { exact: true }).first()).toBeVisible();

  await page.getByLabel("League name").fill("UDK League");
  await page.getByRole("button", { name: "Start new draft" }).click();
  await expect(page.getByRole("heading", { name: "UDK League" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("2026 UDK release");

  const search = page.getByPlaceholder("Search player, team, position…");
  await search.fill("UDK Player 1");
  await expect(page.getByText("UDK Player 1", { exact: true }).first()).toBeVisible();
});
