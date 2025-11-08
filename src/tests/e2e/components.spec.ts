import { test, expect } from "@playwright/test";

test.describe("Components Showcase", () => {
  test("should render components page", async ({ page }) => {
    await page.goto("/components");

    // Check heading
    await expect(
      page.getByRole("heading", { name: "Component Showcase" })
    ).toBeVisible();

    // Check buttons are rendered (use first() for duplicates)
    await expect(
      page.getByRole("button", { name: "Default" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Secondary" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Destructive" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Outline" })).toBeVisible();
  });

  test("should have accessible button names", async ({ page }) => {
    await page.goto("/components");

    // Check specific named buttons are accessible
    await expect(
      page.getByRole("button", { name: "Secondary" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Destructive" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Outline" })).toBeVisible();

    // Verify we have multiple buttons rendered
    const buttons = await page.getByRole("button").all();
    expect(buttons.length).toBeGreaterThan(5);
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/components");

    // Tab to first button and press Enter
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBe("BUTTON");
  });
});

