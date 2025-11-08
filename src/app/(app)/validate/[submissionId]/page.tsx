"use client";

import React, { useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Steps, Step } from "@/components/common/Steps";
import { QualityGauge } from "@/components/common/QualityGauge";
import type { ValidationEvent, StepId } from "@/lib/types/validation";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";

const STEP_DEFINITIONS: { id: StepId; label: string; description?: string }[] = [
  { id: "domainCheck", label: "Rapid Domain Match", description: "Matching video domain" },
  { id: "sceneParsing", label: "Scene Parsing", description: "Analyzing scenes and objects" },
  { id: "vlmClassification", label: "VLM Task Classification", description: "Classifying task content" },
  { id: "supervisorVerify", label: "Ethics & Privacy Scan", description: "Checking compliance" },
  { id: "qualityScore", label: "Final Quality Assessment", description: "Computing quality score" },
];

interface ValidationState {
  steps: Step[];
  reasoning: Record<StepId, string>;
  durations: Record<StepId, number>;
  confidences: Record<StepId, number>;
  models: Record<StepId, string>;
  isComplete: boolean;
  finalScore?: number;
  breakdown?: {
    completeness: number;
    relevance: number;
    clarity: number;
    consistency: number;
  };
  currentStepIndex: number;
}

type ValidationAction =
  | { type: "UPDATE_STEP"; payload: ValidationEvent }
  | {
      type: "COMPLETE";
      payload: {
        score: number;
        breakdown: {
          completeness: number;
          relevance: number;
          clarity: number;
          consistency: number;
        };
      };
    };

function validationReducer(
  state: ValidationState,
  action: ValidationAction
): ValidationState {
  switch (action.type) {
    case "UPDATE_STEP": {
      const { stepId, state: stepState, progress, message, reasoning } = action.payload;

      const updatedSteps = state.steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              state: stepState,
              progress,
              description: message,
            }
          : step
      );

      const updatedReasoning = reasoning
        ? { ...state.reasoning, [stepId]: reasoning }
        : state.reasoning;

      // Update current step index
      const currentStepIndex = updatedSteps.findIndex((s) => s.state === "running");

      // Mock data for step details
      const durations = { ...state.durations };
      const confidences = { ...state.confidences };
      const models = { ...state.models };

      if (stepState === "passed") {
        durations[stepId] = Math.random() * 10 + 2; // 2-12 seconds
        confidences[stepId] = Math.random() * 5 + 95; // 95-100%
        models[stepId] = getModelForStep(stepId);
      }

      return {
        ...state,
        steps: updatedSteps,
        reasoning: updatedReasoning,
        durations,
        confidences,
        models,
        currentStepIndex: currentStepIndex >= 0 ? currentStepIndex : state.currentStepIndex,
      };
    }

    case "COMPLETE":
      return {
        ...state,
        isComplete: true,
        finalScore: action.payload.score,
        breakdown: action.payload.breakdown,
      };

    default:
      return state;
  }
}

function getModelForStep(stepId: StepId): string {
  const models: Record<StepId, string> = {
    domainCheck: "DomainNet-v3",
    sceneParsing: "SceneNet-v2, SegFormer",
    vlmClassification: "CLIP-ViT-L/14",
    supervisorVerify: "EthicsGuard-v1",
    llmMapping: "GPT-4-Turbo",
    qualityScore: "QualityNet-v2",
  };
  return models[stepId] || "N/A";
}

export default async function ValidationPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  
  return <ValidationPageClient submissionId={submissionId} />;
}

function ValidationPageClient({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [selectedStepId, setSelectedStepId] = React.useState<StepId | null>(null);
  const [state, dispatch] = useReducer(validationReducer, {
    steps: STEP_DEFINITIONS.map((def) => ({
      id: def.id,
      label: def.label,
      state: "idle" as const,
      description: def.description,
    })),
    reasoning: {} as Record<StepId, string>,
    durations: {} as Record<StepId, number>,
    confidences: {} as Record<StepId, number>,
    models: {} as Record<StepId, string>,
    isComplete: false,
    currentStepIndex: 0,
  });

  useEffect(() => {
    try {
      // Simulate SSE connection (in production, use real EventSource)
      let currentStep = 0;
      const simulateValidation = () => {
        const interval = setInterval(() => {
          if (currentStep >= STEP_DEFINITIONS.length) {
            clearInterval(interval);
            // Complete validation
            dispatch({
              type: "COMPLETE",
              payload: {
                score: 85,
                breakdown: {
                  completeness: 36,
                  relevance: 22,
                  clarity: 18,
                  consistency: 9,
                },
              },
            });
            return;
          }

          const step = STEP_DEFINITIONS[currentStep];

          // Running state
          dispatch({
            type: "UPDATE_STEP",
            payload: {
              submissionId,
              stepId: step.id,
              state: "running",
              progress: 50,
              message: "Processing...",
            },
          });

          // After 1 second, mark as passed
          setTimeout(() => {
            dispatch({
              type: "UPDATE_STEP",
              payload: {
                submissionId,
                stepId: step.id,
                state: "passed",
                progress: 100,
                message: "Completed successfully",
                reasoning: `${step.label} completed. All checks passed successfully with high confidence.`,
              },
            });
            currentStep++;
          }, 1000);
        }, 2000);

        return () => clearInterval(interval);
      };

      const cleanup = simulateValidation();
      return cleanup;
    } catch (error) {
      console.error("Error in validation simulation:", error);
      return () => {};
    }
  }, [submissionId]);

  const eligibility = state.finalScore && state.finalScore >= 70;
  const currentStep = state.steps[state.currentStepIndex];
  const runningStep = state.steps.find((s) => s.state === "running");
  
  // Auto-follow running step if no manual selection
  useEffect(() => {
    if (runningStep && !selectedStepId) {
      setSelectedStepId(runningStep.id as StepId);
    }
  }, [runningStep, selectedStepId]);
  
  // Determine which step to display
  const displayStep = selectedStepId 
    ? state.steps.find(s => s.id === selectedStepId)
    : (runningStep || currentStep);
  const activeStep = displayStep;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumb and Header */}
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Submissions
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Video #{submissionId.slice(0, 8)}</span>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submissions
        </Button>
      </header>

      {!state.isComplete ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Stepper */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Validation Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {state.steps.map((step, index) => {
                    const isCompleted = step.state === "passed";
                    const isRunning = step.state === "running";
                    const isSelected = selectedStepId === step.id;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => isCompleted || isRunning ? setSelectedStepId(step.id as StepId) : null}
                        disabled={step.state === "idle"}
                        className={`w-full text-left transition-all ${
                          isCompleted || isRunning ? "cursor-pointer hover:bg-gray-50" : "cursor-default"
                        } ${isSelected ? "bg-red-50 border-l-4 border-red-500 pl-4" : "pl-5"} py-2 rounded-r`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                            isCompleted ? "bg-green-500 text-white" :
                            isRunning ? "bg-red-500 text-white animate-pulse" :
                            "bg-gray-200 text-gray-400"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : isRunning ? (
                              <Clock className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              isCompleted || isRunning ? "text-gray-900" : "text-gray-400"
                            }`}>
                              {step.label}
                            </p>
                            {step.description && (
                              <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Step Details: {activeStep?.label || "Preparing..."}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground w-40">
                        Status
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            activeStep?.state === "running"
                              ? "bg-primary/10 text-primary border-0 font-medium"
                              : activeStep?.state === "passed"
                              ? "bg-green-100 text-green-700 border-0 font-medium"
                              : "bg-muted text-muted-foreground border-0"
                          }
                        >
                          {activeStep?.state === "running"
                            ? "Running"
                            : activeStep?.state === "passed"
                            ? "Passed"
                            : activeStep?.state || "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Duration
                      </TableCell>
                      <TableCell>
                        {activeStep && state.durations[activeStep.id as StepId]
                          ? `${state.durations[activeStep.id as StepId].toFixed(1)}s`
                          : activeStep?.state === "running"
                          ? "In progress..."
                          : "—"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Confidence Score
                      </TableCell>
                      <TableCell>
                        {activeStep && state.confidences[activeStep.id as StepId]
                          ? `${state.confidences[activeStep.id as StepId].toFixed(1)}%`
                          : "—"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Models Used
                      </TableCell>
                      <TableCell>
                        {activeStep && state.models[activeStep.id as StepId]
                          ? state.models[activeStep.id as StepId]
                          : "—"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {activeStep && state.reasoning[activeStep.id as StepId] && (
                  <div className="pt-4 mt-4">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="reasoning" className="border-none">
                        <AccordionTrigger className="text-sm font-medium">
                          See reasoning
                        </AccordionTrigger>
                        <AccordionContent>
                          <pre className="w-full overflow-x-auto rounded-lg bg-muted p-4 text-xs font-mono">
                            {state.reasoning[activeStep.id as StepId]}
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Validation Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <QualityGauge
                score={state.finalScore!}
                showBreakdown
                breakdown={state.breakdown}
              />
            </CardContent>
          </Card>

          {/* All Steps Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {state.steps.map((step) => (
                  <AccordionItem key={step.id} value={step.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="text-sm font-medium text-gray-900">{step.label}</span>
                        <div className="flex items-center gap-2">
                          {state.durations[step.id as StepId] && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {state.durations[step.id as StepId].toFixed(1)}s
                            </span>
                          )}
                          <Badge
                            className={
                              step.state === "passed"
                                ? "bg-green-100 text-green-800 border-0"
                                : ""
                            }
                          >
                            {step.state}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium text-muted-foreground w-40">
                                Confidence Score
                              </TableCell>
                              <TableCell>
                                {state.confidences[step.id as StepId]
                                  ? `${state.confidences[step.id as StepId].toFixed(1)}%`
                                  : "—"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-muted-foreground">
                                Models Used
                              </TableCell>
                              <TableCell>
                                {state.models[step.id as StepId] || "—"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        {state.reasoning[step.id as StepId] && (
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-2">Reasoning:</p>
                            <pre className="w-full overflow-x-auto rounded-lg bg-muted p-3 text-xs font-mono">
                              {state.reasoning[step.id as StepId]}
                            </pre>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sticky Footer */}
      {state.isComplete && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background-light/80 backdrop-blur-sm border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-gray-600">
                  Final Result:
                </p>
                {eligibility ? (
                  <Badge className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 border-0">
                    <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                    Eligible
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-sm font-semibold px-3 py-1">
                    Not Eligible
                  </Badge>
                )}
                <p className="hidden md:block text-xs text-gray-600">
                  Completed on {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-gray-900">Quality Score</p>
                <div className="relative h-20 w-20">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-gray-200"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${state.finalScore}, 100`}
                      strokeLinecap="round"
                      className="text-red-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-red-500">
                      {state.finalScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

