import { test, expect } from "@playwright/test";

test.describe("Primitives Showcase", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/components");
  });

  test("should render KPI cards", async ({ page }) => {
    await expect(page.getByText("Total Bounties")).toBeVisible();
    await expect(page.getByText("1,234")).toBeVisible();
    await expect(page.getByText("Total Revenue")).toBeVisible();
    await expect(page.getByText("$45,231")).toBeVisible();
  });

  test("should render steps component", async ({ page }) => {
    await expect(page.getByText("Vertical Steps")).toBeVisible();
    await expect(
      page.locator('[aria-label*="Domain Check: passed"]').first()
    ).toBeVisible();
    await expect(
      page.locator('[aria-label*="Scene Parsing: running"]').first()
    ).toBeVisible();
  });

  test("should render file uploader", async ({ page }) => {
    await expect(
      page.getByText(/Drop files here or click to upload/i)
    ).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeAttached();
  });

  test("should render charts", async ({ page }) => {
    await expect(page.getByText("Donut Chart")).toBeVisible();
    await expect(page.getByText("Quality Gauge")).toBeVisible();
    await expect(page.getByText("85")).toBeVisible();
  });

  test("should toggle data states", async ({ page }) => {
    // Toggle empty state off
    await page.getByRole("button", { name: "Toggle Empty" }).click();
    await expect(
      page.getByText("No bounties found").first()
    ).not.toBeVisible();

    // Toggle error state on
    await page.getByRole("button", { name: "Toggle Error" }).click();
    await expect(
      page.getByText(/Failed to load bounties/i)
    ).toBeVisible();

    // Toggle loading state on
    await page.getByRole("button", { name: "Toggle Loading" }).click();
    await expect(page.getByRole("status", { name: "Loading" })).toBeVisible();
  });

  test("should support keyboard navigation", async ({ page }) => {
    // Verify steps are accessible with proper ARIA labels
    const steps = await page.locator('[role="listitem"]').all();
    expect(steps.length).toBeGreaterThan(0);

    // Test button keyboard navigation
    const toggleButton = page.getByRole("button", { name: "Toggle Empty" });
    await toggleButton.focus();
    const isFocused = await toggleButton.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });
});

