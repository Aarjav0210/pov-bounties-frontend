import { test, expect } from "@playwright/test";

test.describe("Happy Path: Bounty Submission to Validation", () => {
  test("should complete full submission and validation flow", async ({
    page,
  }) => {
    // Step 1: Navigate to bounty detail page
    await page.goto("/bounties/1");

    // Verify bounty details are visible
    await expect(
      page.getByText("Capture retail shopping experience")
    ).toBeVisible();
    await expect(page.getByText("RetailCo")).toBeVisible();
    await expect(page.getByText("$500")).toBeVisible();

    // Step 2: Verify tabs are functional
    await page.getByRole("tab", { name: "Requirements" }).click();
    await expect(
      page.getByText("Video must be shot from first-person perspective")
    ).toBeVisible();

    await page.getByRole("tab", { name: "FAQ" }).click();
    await expect(page.getByText("Can I use a smartphone?")).toBeVisible();

    // Step 3: Try to submit without file (should be disabled)
    const submitButton = page.getByRole("button", {
      name: "Submit for Validation",
    });
    await expect(submitButton).toBeDisabled();

    // Step 4: Create a mock video file and upload
    // Note: In a real scenario, we'd use a real test file
    // For now, verify the uploader is present
    await expect(
      page.getByText(/Drop files here or click to upload/i)
    ).toBeVisible();

    // Step 5: Mock file upload by directly calling the submit handler
    // In a real test, you'd upload a file, but for this demo we'll verify the flow
    // by checking that the button exists and would work with a file
    await expect(page.getByText("Submit Video")).toBeVisible();
  });

  test("should show validation progress and completion", async ({ page }) => {
    // Navigate directly to validation page
    await page.goto("/validate/test-123", { waitUntil: "networkidle" });

    // Wait for page to hydrate
    await page.waitForLoadState("domcontentloaded");

    // Check if error boundary triggered (fail fast with helpful message)
    const errorMessage = page.getByText("Something went wrong");
    if (await errorMessage.isVisible().catch(() => false)) {
      const tryAgainBtn = page.getByRole("button", { name: "Try Again" });
      const goHomeBtn = page.getByRole("button", { name: "Go Home" });
      console.error("Page crashed! Error UI visible with buttons:", {
        tryAgain: await tryAgainBtn.isVisible().catch(() => false),
        goHome: await goHomeBtn.isVisible().catch(() => false),
      });
      throw new Error("Validation page crashed during render - check browser console for details");
    }

    // Verify validation page loaded
    await expect(page.getByText("Validation Pipeline")).toBeVisible({ timeout: 10000 });

    // Verify breadcrumb
    await expect(page.getByRole("link", { name: "Submissions" })).toBeVisible();
    await expect(page.getByText(/Video #/)).toBeVisible();

    // Verify steps are rendered with updated labels
    await expect(page.getByText("Rapid Domain Match").first()).toBeVisible();
    await expect(page.getByText("Scene Parsing").first()).toBeVisible();
    await expect(page.getByText("VLM Task Classification").first()).toBeVisible();

    // Verify step details panel is present
    await expect(page.getByText(/Step Details:/)).toBeVisible();

    // Wait for validation to complete (simulated in component)
    // The simulation takes about 10 seconds (5 steps * 2 seconds each)
    await page.waitForTimeout(11000);

    // Verify completion
    await expect(page.getByText("Validation Complete")).toBeVisible();
    
    // Verify sticky footer with eligibility badge
    await expect(page.getByText("Final Result:")).toBeVisible();
    await expect(page.getByText("Eligible").first()).toBeVisible();
    
    // Verify pipeline summary card appears
    await expect(page.getByText("Pipeline Summary")).toBeVisible();
    
    // Verify score breakdown in QualityGauge  
    await expect(page.getByText("Score Breakdown")).toBeVisible();
    await expect(page.getByText("Completeness")).toBeVisible();
    await expect(page.getByText("36/40")).toBeVisible();
    
    // Verify quality gauge shows score
    await expect(page.locator(".text-4xl.font-bold", { hasText: "85" })).toBeVisible();
  });

  test("should support accordion keyboard navigation", async ({ page }) => {
    await page.goto("/bounties/1");

    // Navigate to FAQ tab
    await page.getByRole("tab", { name: "FAQ" }).click();

    // Find accordion trigger and verify it's keyboard accessible
    const accordionTrigger = page
      .getByRole("button", { name: /Can I use a smartphone?/i })
      .first();
    await accordionTrigger.focus();

    // Verify the element is focused
    const isFocused = await accordionTrigger.evaluate(
      (el) => el === document.activeElement
    );
    expect(isFocused).toBe(true);

    // Press Enter to expand accordion
    await page.keyboard.press("Enter");

    // Verify accordion content is visible
    await expect(
      page.getByText(/smartphones are acceptable/i)
    ).toBeVisible();
  });
});

