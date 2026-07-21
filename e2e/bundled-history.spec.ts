import { expect, test } from "@playwright/test";

test("loads bundled NFLverse history without a manual import", async ({ page }) => {
  await page.goto("/");

  const readyState = page.locator(".history-ready-state");
  await expect(readyState).toContainText("NFLverse 2025 history is ready.", { timeout: 15_000 });
  await expect(readyState).toContainText("Bundled NFLverse 2025/2026");
});
