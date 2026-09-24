import { test, expect } from "@playwright/test";

test("command center loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Command Center" })).toBeVisible();
  await expect(page.getByText("NO AI SAFE MODE")).toBeVisible();
});

test("navigation collapses and expands on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const app = page.locator(".app");
  const button = page.getByRole("button", { name: "Collapse navigation" });
  await expect(button).toBeVisible();
  await button.click();
  await expect(app).toHaveClass(/nav-collapsed/);
  const expand = page.getByRole("button", { name: "Expand navigation" });
  await expect(expand).toBeVisible();
  await expand.click();
  await expect(app).not.toHaveClass(/nav-collapsed/);
});

test("navigation opens and closes on medium screens", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Collapse navigation" });
  await button.click();
  await expect(page.locator(".app")).toHaveClass(/nav-collapsed/);
  await page.getByRole("button", { name: "Expand navigation" }).click();
  await expect(page.locator(".app")).not.toHaveClass(/nav-collapsed/);
});

test("navigation opens and closes on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 760, height: 900 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Collapse navigation" });
  await button.click();
  await expect(page.locator(".sidebar")).toHaveClass(/nav-collapsed/);
  await page.getByRole("button", { name: "Expand navigation" }).click();
  await expect(page.locator(".sidebar")).not.toHaveClass(/nav-collapsed/);
});

test("command search is actionable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open command search" }).click();
  const dialog = page.getByRole("dialog", { name: "Command search" });
  await expect(dialog).toBeVisible();
  const input = page.getByPlaceholder("Jump to a workspace area…");
  await input.fill("Campaigns");
  const result = dialog.locator(".command-item").filter({ hasText: "Campaigns" }).first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/campaigns\/?$/);
});

test("module builders open and close across core work surfaces", async ({ page }) => {
  for (const [path, actionName] of [["/campaigns", "Create campaign"], ["/meta-ads", "Create ad plan"], ["/analytics", "Record metric"], ["/outreach", "Draft outreach"]] as const) {
    await page.goto(path);
    const action = page.getByRole("button", { name: actionName });
    await expect(action).toBeVisible();
    await action.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
});

test("campaign create flow persists a real demo workspace record", async ({ page }) => {
  await page.goto("/campaigns");
  await page.getByRole("button", { name: "Create campaign" }).click();
  const dialog = page.getByRole("dialog", { name: /Create campaign/i });
  await dialog.getByLabel("Campaign name").fill("E2E interaction campaign");
  await dialog.getByLabel("Objective").fill("Engagement");
  await dialog.getByLabel("Audience").fill("SMB employers");
  await dialog.getByLabel("Core message").fill("Evidence-led marketing operations");
  await dialog.getByRole("button", { name: "Save record" }).click();
  await expect(page.getByText("Created. The record is now linked to this workspace.")).toBeVisible();
  await expect(page.getByText("E2E interaction campaign", { exact: true })).toBeVisible();
});

test("filters, display and view controls change the surface", async ({ page }) => {
  await page.goto("/analytics");
  await page.getByRole("button", { name: "Filters" }).click();
  await expect(page.getByText("Filter records")).toBeVisible();
  await page.getByRole("button", { name: "Display" }).click();
  await expect(page.getByText("Display columns")).toBeVisible();
});

test("AI gateway runs in no-AI mode without a provider", async ({ page }) => {
  await page.goto("/ai-gateway");
  await page.getByRole("button", { name: "Generate / prepare" }).click();
  await expect(page.getByRole("heading", { name: "Candidates & provenance" })).toBeVisible();
  await expect(page.getByText("No measured performance evidence was supplied", { exact: false })).toBeVisible();
});

test("manual bridge validates JSON locally", async ({ page }) => {
  await page.goto("/manual-ai");
  await page.getByRole("button", { name: "Parse JSON" }).click();
  await expect(page.getByText("RESPONSE_EXPECTED", { exact: false })).toBeVisible();
});
