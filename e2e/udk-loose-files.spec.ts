import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("imports loose UDK exports without requiring a ZIP", async ({ page }, testInfo) => {
  await page.goto("/");

  const rankingRows = Array.from({ length: 200 }, (_, index) => {
    const rank = index + 1;
    return `Loose Player ${rank},RB,T${String(rank).padStart(2, "0")},7,${rank},${350 - rank},4,7,${Math.ceil(rank / 12)}.${String(((rank - 1) % 12) + 1).padStart(2, "0")},${Math.ceil(rank / 12)},Outlook,Dynasty,Markers`;
  });
  const rankingPath = testInfo.outputPath("UDK Position Rankings - RB.csv");
  await writeFile(
    rankingPath,
    [
      "Name,Position,Team,Bye Week,Rank,Points,Risk,Upside,ADP,Tier,Outlook,Dynasty,Markers",
      ...rankingRows,
    ].join("\n"),
  );

  const adpPath = testInfo.outputPath(
    "UDK - ADP Comparison - Fantasy Footballers Podcast.csv",
  );
  await writeFile(
    adpPath,
    "Rank,Name,Team,Pos,Pos,Avg,Sleeper,ESPN,Yahoo,Underdog\n[object Object],Loose Player 1,T01,RB,RB,1.01,1.01,1.01,1.01,1.01",
  );

  await page.getByTestId("udk-file-input").setInputFiles([rankingPath, adpPath]);

  await expect(page.locator(".udk-ready-badge")).toContainText("UDK");
  await expect(page.getByText("udk-2-files.zip")).toHaveCount(1);

  await page.getByRole("button", { name: "Start new draft" }).click();
  await expect(page.getByRole("heading", { name: "Fantasy Draft" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Draft created with UDK projections");
});
