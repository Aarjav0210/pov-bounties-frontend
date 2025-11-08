import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Steps } from "@/components/common/Steps";

describe("Steps Component", () => {
  const mockSteps = [
    { id: "1", label: "Step 1", state: "passed" as const },
    { id: "2", label: "Step 2", state: "running" as const, progress: 50 },
    { id: "3", label: "Step 3", state: "idle" as const },
  ];

  it("should render all steps", () => {
    render(<Steps steps={mockSteps} />);

    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("should render vertical orientation by default", () => {
    const { container } = render(<Steps steps={mockSteps} />);
    const stepsContainer = container.querySelector('[role="list"]');
    expect(stepsContainer).toHaveClass("space-y-4");
  });

  it("should render horizontal orientation when specified", () => {
    const { container } = render(
      <Steps steps={mockSteps} orientation="horizontal" />
    );
    const stepsContainer = container.querySelector('[role="list"]');
    expect(stepsContainer).toHaveClass("flex");
  });

  it("should show progress bar for running steps with progress", () => {
    render(<Steps steps={mockSteps} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "50");
  });

  it("should have accessible labels", () => {
    render(<Steps steps={mockSteps} />);
    expect(screen.getByLabelText(/Step 1: passed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Step 2: running/i)).toBeInTheDocument();
  });
});


