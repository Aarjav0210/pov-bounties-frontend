/**
 * API Configuration
 * 
 * Base URL for the video validation API backend.
 * Can be configured via NEXT_PUBLIC_API_URL environment variable.
 * Defaults to http://localhost:8000 for local development.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  UPLOAD_VIDEO: `${API_BASE_URL}/upload-video`,
  SUBMIT_BOUNTY_VIDEO: `${API_BASE_URL}/submit-bounty-video`,
  GENERATE_UPLOAD_URL: `${API_BASE_URL}/generate-upload-url`,
  CONFIRM_UPLOAD: `${API_BASE_URL}/confirm-upload`,
  VALIDATE_VIDEO_STREAM: `${API_BASE_URL}/validate-video/stream`,
  VALIDATE_VIDEO: `${API_BASE_URL}/validate-video`,
  VALIDATION_STATUS: (jobId: string) => `${API_BASE_URL}/validation-status/${jobId}`,
  HEALTH: `${API_BASE_URL}/health`,
} as const;

