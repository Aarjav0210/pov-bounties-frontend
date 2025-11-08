export type StepId =
  | "domainCheck"
  | "sceneParsing"
  | "vlmClassification"
  | "supervisorVerify"
  | "llmMapping"
  | "qualityScore";

export type StepState =
  | "idle"
  | "running"
  | "passed"
  | "failed"
  | "retrying"
  | "skipped";

export interface ValidationEvent {
  submissionId: string;
  stepId: StepId;
  state: StepState;
  progress?: number; // 0..100
  message?: string;
  reasoning?: string;
  payload?: unknown; // e.g., scenes[], scores
}

