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

  await page.locator('input[type="file"]').setInputFiles(downloadPath!);
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
