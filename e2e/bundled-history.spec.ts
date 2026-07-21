import { expect, test } from "@playwright/test";

test("loads bundled NFLverse history without a manual import", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("NFLverse 2025 history is ready.")).toBeVisible();
  await expect(page.getByText(/Bundled NFLverse 2025\/2026/)).toBeVisible();
});
