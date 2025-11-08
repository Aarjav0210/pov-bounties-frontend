import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  shouldCompressVideo, 
  estimateCompressedSize, 
  formatFileSize 
} from '../videoCompression';

describe('videoCompression', () => {
  describe('shouldCompressVideo', () => {
    it('should return true for files larger than 15 MB', () => {
      const largeFile = new File([''], 'test.mp4', { 
        type: 'video/mp4' 
      });
      Object.defineProperty(largeFile, 'size', { value: 20 * 1024 * 1024 });
      
      expect(shouldCompressVideo(largeFile)).toBe(true);
    });

    it('should return false for files smaller than 15 MB', () => {
      const smallFile = new File([''], 'test.mp4', { 
        type: 'video/mp4' 
      });
      Object.defineProperty(smallFile, 'size', { value: 10 * 1024 * 1024 });
      
      expect(shouldCompressVideo(smallFile)).toBe(false);
    });

    it('should return false for files exactly 15 MB', () => {
      const file = new File([''], 'test.mp4', { 
        type: 'video/mp4' 
      });
      Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 });
      
      expect(shouldCompressVideo(file)).toBe(false);
    });
  });

  describe('estimateCompressedSize', () => {
    it('should return original size for small files', () => {
      const smallFile = new File([''], 'test.mp4', { 
        type: 'video/mp4' 
      });
      Object.defineProperty(smallFile, 'size', { value: 10 * 1024 * 1024 });
      
      expect(estimateCompressedSize(smallFile)).toBe(smallFile.size);
    });

    it('should estimate 50% compression for large files', () => {
      const largeFile = new File([''], 'test.mp4', { 
        type: 'video/mp4' 
      });
      const fileSize = 20 * 1024 * 1024;
      Object.defineProperty(largeFile, 'size', { value: fileSize });
      
      const estimated = estimateCompressedSize(largeFile);
      expect(estimated).toBe(Math.round(fileSize * 0.5));
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should format kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
      expect(formatFileSize(20 * 1024 * 1024)).toBe('20.0 MB');
    });

    it('should handle zero bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });
  });
});

