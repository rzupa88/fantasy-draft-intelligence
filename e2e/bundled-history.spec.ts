import { expect, test } from "@playwright/test";

test("loads bundled UDK and NFLverse data without a manual import", async ({ page }) => {
  test.setTimeout(90_000);

  const historyResponse = await page.request.get("/data/nflverse-history-2025-2026.zip");
  expect(historyResponse.status()).toBe(200);
  expect((await historyResponse.body()).byteLength).toBeGreaterThan(1_000);

  const udkResponse = await page.request.get("/udk/udk-docs-v2.zip");
  expect(udkResponse.status()).toBe(200);
  expect((await udkResponse.body()).byteLength).toBeGreaterThan(1_000);

  await page.goto("/");

  await expect(page.getByText("UDK 2026 ready")).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText("Bundled UDK 2026")).toBeVisible();
  await expect(page.getByText("NFLverse 2025 matched")).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText("Bundled NFLverse 2025/2026")).toBeVisible();
  await expect(page.locator(".form-error")).toHaveCount(0);
});
