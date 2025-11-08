import { describe, it, expect } from 'vitest';
import { API_BASE_URL, API_ENDPOINTS } from '../config';

describe('API Configuration', () => {
  it('should have valid API base URL', () => {
    expect(API_BASE_URL).toBeDefined();
    expect(typeof API_BASE_URL).toBe('string');
    // Should be localhost in test environment
    expect(API_BASE_URL).toMatch(/http:\/\/localhost:8000/);
  });

  it('should have all required endpoints defined', () => {
    expect(API_ENDPOINTS.UPLOAD_VIDEO).toBeDefined();
    expect(API_ENDPOINTS.SUBMIT_BOUNTY_VIDEO).toBeDefined();
    expect(API_ENDPOINTS.GENERATE_UPLOAD_URL).toBeDefined();
    expect(API_ENDPOINTS.CONFIRM_UPLOAD).toBeDefined();
    expect(API_ENDPOINTS.HEALTH).toBeDefined();
  });

  it('should generate correct endpoint URLs', () => {
    expect(API_ENDPOINTS.GENERATE_UPLOAD_URL).toBe(`${API_BASE_URL}/generate-upload-url`);
    expect(API_ENDPOINTS.CONFIRM_UPLOAD).toBe(`${API_BASE_URL}/confirm-upload`);
    expect(API_ENDPOINTS.SUBMIT_BOUNTY_VIDEO).toBe(`${API_BASE_URL}/submit-bounty-video`);
  });

  it('should have validation status function', () => {
    expect(typeof API_ENDPOINTS.VALIDATION_STATUS).toBe('function');
    const url = API_ENDPOINTS.VALIDATION_STATUS('test-job-id');
    expect(url).toBe(`${API_BASE_URL}/validation-status/test-job-id`);
  });
});

