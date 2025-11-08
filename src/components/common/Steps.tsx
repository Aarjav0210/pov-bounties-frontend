"use client";

import { Check, Loader2, X, AlertTriangle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StepState } from "@/lib/types/validation";

export interface Step {
  id: string;
  label: string;
  description?: string;
  state: StepState;
  progress?: number;
}

interface StepsProps {
  steps: Step[];
  orientation?: "vertical" | "horizontal";
  className?: string;
}

function getStepIcon(state: StepState) {
  switch (state) {
    case "passed":
      return <Check className="h-5 w-5" />;
    case "running":
      return <Loader2 className="h-5 w-5 animate-spin" />;
    case "failed":
      return <X className="h-5 w-5" />;
    case "retrying":
      return <AlertTriangle className="h-5 w-5" />;
    case "skipped":
      return <Circle className="h-5 w-5" />;
    default:
      return <Circle className="h-5 w-5" />;
  }
}

function getStepColor(state: StepState) {
  switch (state) {
    case "passed":
      return "bg-green-100 text-green-600";
    case "running":
      return "bg-primary/10 text-primary";
    case "failed":
      return "bg-red-100 text-red-600";
    case "retrying":
      return "bg-yellow-100 text-yellow-600";
    case "skipped":
      return "bg-gray-100 text-gray-500";
    case "idle":
      return "border-2 border-dashed border-gray-300 text-gray-400 bg-transparent";
    default:
      return "border-2 border-dashed border-gray-300 text-gray-400 bg-transparent";
  }
}

export function Steps({
  steps,
  orientation = "vertical",
  className,
}: StepsProps) {
  if (orientation === "horizontal") {
    return (
      <div
        className={cn("flex items-start space-x-4", className)}
        role="list"
        aria-label="Progress steps"
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center flex-1"
            role="listitem"
            aria-label={`${step.label}: ${step.state}`}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full mb-2 transition-colors",
                getStepColor(step.state)
              )}
            >
              {getStepIcon(step.state)}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{step.label}</p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-border mt-5" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("space-y-4", className)}
      role="list"
      aria-label="Progress steps"
    >
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="flex gap-4"
          role="listitem"
          aria-label={`${step.label}: ${step.state}`}
        >
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                getStepColor(step.state),
                step.state === "running" && "animate-pulse"
              )}
            >
              <div className={cn(step.state === "running" && "animate-spin")}>
                {getStepIcon(step.state)}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 w-px bg-border mt-2" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <h4
              className={cn(
                "text-sm font-medium mb-1",
                step.state === "passed" && "text-green-600",
                step.state === "running" && "text-primary font-semibold",
                step.state === "failed" && "text-red-600",
                (step.state === "idle" || !step.state) &&
                  "text-gray-600"
              )}
            >
              {step.label}
            </h4>
            {step.description && (
              <p
                className={cn(
                  "text-xs",
                  step.state === "passed" && "text-green-600/80",
                  step.state === "running" && "text-primary/80",
                  step.state === "failed" && "text-red-600/80",
                  (step.state === "idle" || !step.state) && "text-gray-500"
                )}
              >
                {step.description}
              </p>
            )}
            {step.state === "running" && step.progress !== undefined && (
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${step.progress}%` }}
                  role="progressbar"
                  aria-valuenow={step.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

