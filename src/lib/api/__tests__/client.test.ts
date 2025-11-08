import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { submitBountyVideoDirectS3 } from '../client';
import { API_ENDPOINTS } from '../config';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('submitBountyVideoDirectS3', () => {
    it('should successfully generate presigned URL and upload', async () => {
      const mockFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
      const mockPresignedResponse = {
        upload_url: 'https://s3.amazonaws.com/bucket/file',
        file_id: 'test-id-123',
        s3_filename: 'test.mp4',
      };
      const mockConfirmResponse = {
        message: 'Upload confirmed',
        file_id: 'test-id-123',
        status: 'pending_review',
      };

      // Mock the presigned URL request
      (global.fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: async () => mockPresignedResponse,
        })
      );

      // Mock XMLHttpRequest for S3 upload
      const mockXHR = {
        open: vi.fn(),
        send: vi.fn(),
        setRequestHeader: vi.fn(),
        upload: {
          addEventListener: vi.fn(),
        },
        addEventListener: vi.fn((event: string, handler: Function) => {
          if (event === 'load') {
            // Simulate successful upload
            setTimeout(() => {
              (mockXHR as any).status = 200;
              handler();
            }, 0);
          }
        }),
        status: 200,
      };

      global.XMLHttpRequest = vi.fn(() => mockXHR) as any;

      // Mock the confirm request
      (global.fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: async () => mockConfirmResponse,
        })
      );

      const result = await submitBountyVideoDirectS3(
        mockFile,
        'Test User',
        'test@example.com',
        '@testuser'
      );

      expect(result.file_id).toBe('test-id-123');
      expect(result.message).toBe('Video uploaded successfully');
    });

    it('should handle presigned URL generation failure', async () => {
      const mockFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });

      (global.fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          text: async () => 'Server error',
        })
      );

      await expect(
        submitBountyVideoDirectS3(
          mockFile,
          'Test User',
          'test@example.com',
          '@testuser'
        )
      ).rejects.toThrow('Failed to generate upload URL');
    });

    it('should call onProgress callback during upload', async () => {
      const mockFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
      const onProgress = vi.fn();

      const mockPresignedResponse = {
        upload_url: 'https://s3.amazonaws.com/bucket/file',
        file_id: 'test-id-123',
        s3_filename: 'test.mp4',
      };

      (global.fetch as any).mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: async () => mockPresignedResponse,
        })
      );

      const mockXHR = {
        open: vi.fn(),
        send: vi.fn(),
        setRequestHeader: vi.fn(),
        upload: {
          addEventListener: vi.fn((event: string, handler: Function) => {
            if (event === 'progress') {
              // Simulate progress
              handler({ lengthComputable: true, loaded: 50, total: 100 });
            }
          }),
        },
        addEventListener: vi.fn((event: string, handler: Function) => {
          if (event === 'load') {
            setTimeout(() => {
              (mockXHR as any).status = 200;
              handler();
            }, 0);
          }
        }),
        status: 200,
      };

      global.XMLHttpRequest = vi.fn(() => mockXHR) as any;

      await submitBountyVideoDirectS3(
        mockFile,
        'Test User',
        'test@example.com',
        '@testuser',
        onProgress
      );

      expect(onProgress).toHaveBeenCalled();
    });
  });
});

