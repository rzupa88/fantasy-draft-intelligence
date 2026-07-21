import { expect, test } from "@playwright/test";

test("loads bundled NFLverse history without a manual import", async ({ page }) => {
  const assetResponse = await page.request.get("/data/nflverse-history-2025-2026.zip");
  expect(assetResponse.status()).toBe(200);
  expect((await assetResponse.body()).byteLength).toBeGreaterThan(1_000);

  await page.goto("/");
  await page.waitForFunction(
    () =>
      document.querySelector(".history-ready-state") !== null ||
      document.querySelector(".form-error") !== null,
    undefined,
    { timeout: 15_000 },
  );

  const loadingError = await page.locator(".form-error").textContent().catch(() => null);
  if (loadingError !== null) {
    throw new Error(`Bundled NFLverse startup failed: ${loadingError}`);
  }

  const readyState = page.locator(".history-ready-state");
  await expect(readyState).toContainText("NFLverse 2025 history is ready.");
  await expect(readyState).toContainText("Bundled NFLverse 2025/2026");
});
