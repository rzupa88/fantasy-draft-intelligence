import { expect, test } from "@playwright/test";

test("loads bundled NFLverse history without a manual import", async ({ page }) => {
  test.setTimeout(90_000);

  const assetResponse = await page.request.get("/data/nflverse-history-2025-2026.zip");
  expect(assetResponse.status()).toBe(200);
  expect((await assetResponse.body()).byteLength).toBeGreaterThan(1_000);

  await page.goto("/");

  const readyState = page.locator(".history-ready-state");
  await expect(readyState).toContainText("NFLverse 2025 history is ready.", { timeout: 60_000 });
  await expect(readyState).toContainText("Bundled NFLverse 2025/2026");
  await expect(page.locator(".form-error")).toHaveCount(0);
});
