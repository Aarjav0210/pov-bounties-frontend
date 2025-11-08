import { test, expect } from "@playwright/test";

test.describe("Marketplace Page", () => {
  test("should render bounties with filters", async ({ page }) => {
    await page.goto("/bounties");

    // Check header
    await expect(page.getByText("Browse Bounties")).toBeVisible();

    // Check search and filters
    await expect(page.getByPlaceholder("Search bounties...")).toBeVisible();

    // Check bounty cards are rendered
    await expect(page.getByText("RetailCo").first()).toBeVisible();
  });

  test("should filter bounties by search", async ({ page }) => {
    await page.goto("/bounties");

    // Type in search box
    await page.getByPlaceholder("Search bounties...").fill("warehouse");

    // Wait for filter to apply
    await page.waitForTimeout(300);

    // Should show warehouse bounty
    await expect(page.getByText("LogisticsPro")).toBeVisible();
  });

  test("should have clickable bounty cards", async ({ page }) => {
    await page.goto("/bounties");

    // Check bounty cards are clickable (have links)
    const links = page.locator('a[href^="/bounties/"]');
    await expect(links.first()).toBeVisible();
  });
});

test.describe("Dashboard Page", () => {
  test("should render KPIs", async ({ page }) => {
    await page.goto("/dashboard");

    // Check header
    await expect(page.getByText("Dashboard").first()).toBeVisible();

    // Check at least one KPI card
    await expect(page.getByText("Total Submissions")).toBeVisible();
  });

  test("should render submissions table", async ({ page }) => {
    await page.goto("/dashboard");

    // Check table is rendered
    await expect(page.getByText("Recent Submissions")).toBeVisible();

    // Check submission data
    await expect(page.getByText("sub-001")).toBeVisible();
  });

  test("should render charts", async ({ page }) => {
    await page.goto("/dashboard");

    // Check at least one chart exists
    await expect(page.getByText("Submissions by Industry")).toBeVisible();
  });
});

test.describe("Enterprise Pages", () => {
  test("should render enterprise landing page", async ({ page }) => {
    await page.goto("/enterprise");

    // Check header
    await expect(page.getByText("Enterprise Solutions")).toBeVisible();

    // Check options
    await expect(page.getByText("Create Private Dataset")).toBeVisible();
    await expect(page.getByText("Invest in Platform")).toBeVisible();

    // Check features section
    await expect(page.getByText("Why Choose POV Bounties?")).toBeVisible();
  });

  test("should have link to create bounty form", async ({ page }) => {
    await page.goto("/enterprise");

    // Check link exists
    const link = page.locator('a[href="/enterprise/new"]');
    await expect(link).toBeVisible();
  });

  test("should render bounty creation form", async ({ page }) => {
    await page.goto("/enterprise/new");

    // Check form sections
    await expect(page.getByText("Task Description")).toBeVisible();
    await expect(page.getByText("Budget & Payout")).toBeVisible();
    await expect(page.getByText("Validation Domains")).toBeVisible();
    await expect(page.getByText("Acceptance Criteria")).toBeVisible();
    await expect(page.getByText("Data Augmentations")).toBeVisible();
    await expect(page.getByText("Privacy & Licensing")).toBeVisible();

    // Check form fields
    await expect(page.getByLabel("Bounty Title")).toBeVisible();
    await expect(page.getByLabel("Reward per Submission")).toBeVisible();
    await expect(page.getByLabel("Max Submissions")).toBeVisible();
  });

  test("should show cost calculator", async ({ page }) => {
    await page.goto("/enterprise/new");

    // Check cost calculator is visible
    await expect(page.getByText("Estimated Total Cost")).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.goto("/enterprise/new");

    // Try to submit without filling required fields
    await page.getByRole("button", { name: /Create Bounty/i }).click();

    // Should show validation errors
    await expect(
      page.getByText(/Title must be at least 10 characters/i)
    ).toBeVisible();
  });
});

