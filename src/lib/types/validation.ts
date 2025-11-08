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

// API Response Types
export type ValidationStatus = "processing" | "completed" | "failed" | "rejected";
export type ValidationStage =
  | "initializing"
  | "domain_matching"
  | "parsing_scenes"
  | "analyzing_scenes"
  | "validating_task"
  | "done"
  | "error";

export interface ValidationStatusResponse {
  job_id: string;
  status: ValidationStatus;
  stage: ValidationStage;
  progress: number; // 0.0 to 1.0
  current_step?: string;
  result?: ValidationResult;
  error?: string;
}

export interface DomainMatchResult {
  overall_match: boolean;
  match_percentage: number;
  confidence: number;
  frame_results?: Array<{
    frame_index: number;
    matches: boolean;
    confidence: number;
  }>;
}

export interface Scene {
  scene_num: number;
  start: number;
  end: number;
}

export interface SceneResult extends Scene {
  description?: string;
  verified?: boolean;
  confidence?: number;
  previous_context?: string;
}

export interface ValidationResult {
  domain_match?: DomainMatchResult;
  domain_match_error?: string;
  scenes?: Scene[];
  verified_results?: SceneResult[];
  failed_results?: SceneResult[];
  validation?: {
    confirmed: boolean;
    reasoning?: string;
    confidence?: number;
  };
  summary?: {
    total_scenes: number;
    verified_scenes: number;
    failed_scenes: number;
    task_confirmed: boolean;
    expected_task: string;
    domain_match_passed?: boolean;
    domain_match_percentage?: number;
    domain_match_confidence?: number;
    domain_match_error?: string;
    domain_match_bypassed?: boolean;
  };
}

export interface UploadVideoResponse {
  file_id: string;
  filename: string;
  path: string;
  message: string;
}

