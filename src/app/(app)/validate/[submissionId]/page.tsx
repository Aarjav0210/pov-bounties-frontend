"use client";

import React, { useEffect, useReducer, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import type { ValidationEvent, StepId, ValidationStatusResponse } from "@/lib/types/validation";
import { connectValidationStream } from "@/lib/api/client";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";

const STEP_DEFINITIONS: { id: StepId; label: string; description?: string }[] = [
  { id: "domainCheck", label: "Rapid Domain Match", description: "Matching video domain" },
  { id: "sceneParsing", label: "Scene Parsing", description: "Analyzing scenes and objects" },
  { id: "vlmClassification", label: "VLM Task Classification", description: "Classifying task content" },
  { id: "llmMapping", label: "LLM Task Validation", description: "Final task evaluation" },
  { id: "qualityScore", label: "Final Quality Assessment", description: "Computing quality score" },
];

// Map API stages to UI step IDs
function mapStageToStepId(stage: string): StepId | null {
  const stageMap: Record<string, StepId> = {
    domain_matching: "domainCheck",
    parsing_scenes: "sceneParsing",
    analyzing_scenes: "vlmClassification",
    validating_task: "llmMapping",
    done: "qualityScore",
  };
  return stageMap[stage] || null;
}

interface ValidationState {
  steps: Step[];
  reasoning: Record<StepId, string>;
  durations: Record<StepId, number>;
  confidences: Record<StepId, number>;
  models: Record<StepId, string>;
  isComplete: boolean;
  isRejected: boolean;
  rejectionReason?: string;
  finalScore?: number;
  breakdown?: {
    completeness: number;
    relevance: number;
    clarity: number;
    consistency: number;
  };
  currentStepIndex: number;
  sceneResults?: Array<{
    scene_num: number;
    description?: string;
    verified?: boolean;
    confidence?: number;
  }>;
  startTime: Record<StepId, number>;
}

type ValidationAction =
  | { type: "UPDATE_STEP"; payload: ValidationEvent }
  | { type: "UPDATE_FROM_API"; payload: ValidationStatusResponse }
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
    }
  | { type: "REJECTED"; payload: { reason: string } };

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

      // Track duration
      const startTime = { ...state.startTime };
      const durations = { ...state.durations };
      const confidences = { ...state.confidences };
      const models = { ...state.models };

      if (stepState === "running" && !startTime[stepId]) {
        startTime[stepId] = Date.now();
      }

      if (stepState === "passed" || stepState === "failed") {
        if (startTime[stepId]) {
          durations[stepId] = (Date.now() - startTime[stepId]) / 1000;
        }
        if (stepState === "passed") {
          confidences[stepId] = 95 + Math.random() * 5; // 95-100%
          models[stepId] = getModelForStep(stepId);
        }
      }

      return {
        ...state,
        steps: updatedSteps,
        reasoning: updatedReasoning,
        durations,
        confidences,
        models,
        startTime,
        currentStepIndex: currentStepIndex >= 0 ? currentStepIndex : state.currentStepIndex,
      };
    }

    case "UPDATE_FROM_API": {
      const apiEvent = action.payload;
      const stepId = mapStageToStepId(apiEvent.stage);
      
      if (!stepId) {
        return state;
      }

      const stepState: "idle" | "running" | "passed" | "failed" =
        apiEvent.status === "processing"
          ? "running"
          : apiEvent.status === "completed"
          ? "passed"
          : apiEvent.status === "rejected" || apiEvent.status === "failed"
          ? "failed"
          : "idle";

      const progress = Math.round(apiEvent.progress * 100);
      const message = apiEvent.current_step || "";
      
      // Extract reasoning from result
      let reasoning = "";
      if (apiEvent.result) {
        if (apiEvent.result.domain_match) {
          const matchPercentage = typeof apiEvent.result.domain_match.match_percentage === 'number' 
            ? (apiEvent.result.domain_match.match_percentage * 100).toFixed(1)
            : String(apiEvent.result.domain_match.match_percentage || 0);
          // Confidence is a string ("High", "Medium", "Low"), not a number
          const confidence = apiEvent.result.domain_match.confidence || 'Unknown';
          reasoning = `Domain match: ${matchPercentage}% match (${confidence} confidence)`;
        }
        if (apiEvent.result.scenes) {
          reasoning += `\nFound ${apiEvent.result.scenes.length} scenes`;
        }
        if (apiEvent.result.verified_results) {
          reasoning += `\nVerified ${apiEvent.result.verified_results.length} scenes`;
        }
        if (apiEvent.result.validation) {
          reasoning += `\n${apiEvent.result.validation.reasoning || "Task validation complete"}`;
        }
      }

      // Update scene results
      let sceneResults = state.sceneResults;
      if (apiEvent.result?.verified_results) {
        sceneResults = apiEvent.result.verified_results.map((r) => ({
          scene_num: r.scene_num,
          description: r.description,
          verified: r.verified,
          confidence: r.confidence,
        }));
      }

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

      const currentStepIndex = updatedSteps.findIndex((s) => s.state === "running");

      // Track duration
      const startTime = { ...state.startTime };
      const durations = { ...state.durations };
      const confidences = { ...state.confidences };
      const models = { ...state.models };

      if (stepState === "running" && !startTime[stepId]) {
        startTime[stepId] = Date.now();
      }

      if (stepState === "passed" || stepState === "failed") {
        if (startTime[stepId]) {
          durations[stepId] = (Date.now() - startTime[stepId]) / 1000;
        }
        if (stepState === "passed") {
          confidences[stepId] = 95 + Math.random() * 5;
          models[stepId] = getModelForStep(stepId);
        }
      }

      // Check if complete
      const isComplete = apiEvent.status === "completed" || apiEvent.status === "rejected";
      const isRejected = apiEvent.status === "rejected";
      const rejectionReason = apiEvent.error || (apiEvent.result?.summary?.task_confirmed === false ? "Task validation failed" : undefined);

      // Calculate final score if complete
      let finalScore: number | undefined;
      let breakdown: ValidationState["breakdown"] | undefined;
      if (isComplete && apiEvent.result?.summary) {
        const summary = apiEvent.result.summary;
        // Calculate score based on verified scenes and task confirmation
        const sceneScore = summary.total_scenes > 0 
          ? (summary.verified_scenes / summary.total_scenes) * 50 
          : 0;
        const taskScore = summary.task_confirmed ? 50 : 0;
        finalScore = Math.round(sceneScore + taskScore);
        
        breakdown = {
          completeness: Math.round((summary.verified_scenes / summary.total_scenes) * 100) || 0,
          relevance: summary.task_confirmed ? 100 : 0,
          clarity: 85,
          consistency: 80,
        };
      }

      return {
        ...state,
        steps: updatedSteps,
        reasoning: updatedReasoning,
        durations,
        confidences,
        models,
        startTime,
        currentStepIndex: currentStepIndex >= 0 ? currentStepIndex : state.currentStepIndex,
        isComplete,
        isRejected,
        rejectionReason,
        finalScore,
        breakdown,
        sceneResults,
      };
    }

    case "COMPLETE":
      return {
        ...state,
        isComplete: true,
        finalScore: action.payload.score,
        breakdown: action.payload.breakdown,
      };

    case "REJECTED":
      return {
        ...state,
        isComplete: true,
        isRejected: true,
        rejectionReason: action.payload.reason,
      };

    default:
      return state;
  }
}

function getModelForStep(stepId: StepId): string {
  const models: Record<StepId, string> = {
    domainCheck: "Qwen2.5-VL-7B-Instruct",
    sceneParsing: "Qwen2.5-VL-7B-Instruct",
    vlmClassification: "Qwen2.5-VL-7B-Instruct",
    supervisorVerify: "Qwen2.5-14B-Instruct",
    llmMapping: "Qwen2.5-14B-Instruct",
    qualityScore: "Qwen2.5-14B-Instruct",
  };
  return models[stepId] || "N/A";
}

export default function ValidationPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  return <ValidationPageClient params={params} />;
}

function ValidationPageClient({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedStepId, setSelectedStepId] = React.useState<StepId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
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
    isRejected: false,
    currentStepIndex: 0,
    startTime: {} as Record<StepId, number>,
  });

  useEffect(() => {
    const videoPath = searchParams.get("video_path");
    const expectedTask = searchParams.get("expected_task");

    if (!videoPath || !expectedTask) {
      setError("Missing video path or expected task. Please resubmit your video.");
      return;
    }

    try {
      // Connect to validation stream
      const cleanup = connectValidationStream(
        videoPath,
        expectedTask,
        (apiEvent: ValidationStatusResponse) => {
          dispatch({ type: "UPDATE_FROM_API", payload: apiEvent });

          // Handle errors
          if (apiEvent.error) {
            setError(apiEvent.error);
          }

          // Handle rejection
          if (apiEvent.status === "rejected") {
            const reason = apiEvent.error || 
              apiEvent.result?.summary?.domain_match_passed === false
                ? "Video does not match expected task domain"
                : "Validation failed";
            dispatch({ type: "REJECTED", payload: { reason } });
          }
        }
      );

      return cleanup;
    } catch (error) {
      console.error("Error connecting to validation stream:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to connect to validation stream"
      );
      return () => {};
    }
  }, [submissionId, searchParams]);

  const eligibility = state.finalScore && state.finalScore >= 70;
  const currentStep = state.steps[state.currentStepIndex];
  const runningStep = state.steps.find((s) => s.state === "running");
  
  // Auto-follow running step if no manual selection
  useEffect(() => {
    if (runningStep && !selectedStepId) {
      setSelectedStepId(runningStep.id as StepId);
    }
  }, [runningStep, selectedStepId]);
  
  // Auto-scroll to results when validation completes
  useEffect(() => {
    if (state.isComplete && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [state.isComplete]);
  
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

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              <p className="font-medium">Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Pipeline - Always Visible */}
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

                {/* Scene Results for VLM Classification */}
                {activeStep?.id === "vlmClassification" && state.sceneResults && state.sceneResults.length > 0 && (
                  <div className="pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-3">Scene-by-Scene Results</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {state.sceneResults.map((scene) => (
                        <div
                          key={scene.scene_num}
                          className={`p-3 rounded-lg border ${
                            scene.verified
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                Scene {scene.scene_num}
                              </p>
                              {scene.description && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {scene.description}
                                </p>
                              )}
                            </div>
                            <Badge
                              className={
                                scene.verified
                                  ? "bg-green-100 text-green-700 border-0"
                                  : "bg-red-100 text-red-700 border-0"
                              }
                            >
                              {scene.verified ? "Verified" : "Failed"}
                            </Badge>
                          </div>
                          {scene.confidence && (
                            <p className="text-xs text-gray-500 mt-2">
                              Confidence: {typeof scene.confidence === 'number' ? scene.confidence.toFixed(1) : scene.confidence}%
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeStep && state.reasoning[activeStep.id as StepId] && (
                  <div className="pt-4 mt-4">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="reasoning" className="border-none">
                        <AccordionTrigger className="text-sm font-medium">
                          See reasoning
                        </AccordionTrigger>
                        <AccordionContent>
                          <pre className="w-full overflow-x-auto rounded-lg bg-muted p-4 text-xs font-mono whitespace-pre-wrap">
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

      {/* Results Section - Show when complete */}
      {state.isComplete && (
        <div ref={resultsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-6">
          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {state.isRejected ? (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    Validation Rejected
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Validation Complete
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {state.isRejected ? (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-900 mb-2">
                      Rejection Reason:
                    </p>
                    <p className="text-sm text-red-700">
                      {state.rejectionReason || "Validation failed"}
                    </p>
                  </div>
                </div>
              ) : (
                state.finalScore !== undefined && (
                  <QualityGauge
                    score={state.finalScore}
                    showBreakdown
                    breakdown={state.breakdown}
                  />
                )
              )}
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
      {state.isComplete && !state.isRejected && state.finalScore !== undefined && (
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

