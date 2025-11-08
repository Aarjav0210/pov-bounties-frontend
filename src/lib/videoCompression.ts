/**
 * Video Compression Utility using FFmpeg.wasm
 * Compresses videos client-side before uploading to reduce file size and upload time
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;

/**
 * Load FFmpeg.wasm (only once)
 */
async function loadFFmpeg(onProgress?: (progress: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  if (isLoading) {
    // Wait for existing load to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (ffmpegInstance) return ffmpegInstance;
  }

  try {
    isLoading = true;
    console.log('📦 Loading FFmpeg.wasm...');
    
    const ffmpeg = new FFmpeg();
    
    // Set up progress logging
    ffmpeg.on('log', ({ message }: { message: string }) => {
      console.log('FFmpeg:', message);
    });
    
    ffmpeg.on('progress', ({ progress }: { progress: number }) => {
      const percent = Math.round(progress * 100);
      console.log(`FFmpeg progress: ${percent}%`);
      if (onProgress) {
        onProgress(percent);
      }
    });

    // Load FFmpeg
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    console.log('✅ FFmpeg.wasm loaded successfully');
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  } catch (error) {
    console.error('❌ Failed to load FFmpeg:', error);
    throw new Error('Failed to load video compression library');
  } finally {
    isLoading = false;
  }
}

export interface CompressionOptions {
  /**
   * Target file size in MB (will try to meet this, not guaranteed)
   */
  targetSizeMB?: number;
  
  /**
   * Max width (maintains aspect ratio)
   */
  maxWidth?: number;
  
  /**
   * Max height (maintains aspect ratio)
   */
  maxHeight?: number;
  
  /**
   * Video bitrate (e.g., "1M", "500k")
   * Lower = smaller file, lower quality
   */
  videoBitrate?: string;
  
  /**
   * Compression quality (0-51, lower = better quality, larger file)
   * Default: 28 (good balance)
   */
  crf?: number;
  
  /**
   * Called during compression with progress 0-100
   */
  onProgress?: (progress: number) => void;
}

/**
 * Compress a video file
 */
export async function compressVideo(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    videoBitrate = '1M',
    crf = 28,
    onProgress
  } = options;

  try {
    console.log('🎬 Starting video compression...');
    console.log(`   Input: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // Load FFmpeg
    if (onProgress) onProgress(0);
    const ffmpeg = await loadFFmpeg();
    if (onProgress) onProgress(10);

    // Write input file to FFmpeg filesystem
    const inputFileName = 'input' + getFileExtension(file.name);
    const outputFileName = 'output.mp4';
    
    console.log('📝 Writing input file to FFmpeg filesystem...');
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    if (onProgress) onProgress(20);

    // Compression settings
    // -vf scale: Resize video while maintaining aspect ratio
    // -c:v libx264: Use H.264 codec
    // -crf: Quality (lower = better, 18-28 is good range)
    // -preset: Compression speed/quality trade-off
    // -c:a aac: Audio codec
    // -b:a 128k: Audio bitrate
    const ffmpegArgs = [
      '-i', inputFileName,
      '-vf', `scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease`,
      '-c:v', 'libx264',
      '-crf', crf.toString(),
      '-preset', 'medium', // balance between speed and compression
      '-b:v', videoBitrate,
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart', // Enable streaming
      '-y', // Overwrite output
      outputFileName
    ];

    console.log('⚙️  Running FFmpeg with args:', ffmpegArgs.join(' '));
    
    // Run FFmpeg compression
    await ffmpeg.exec(ffmpegArgs);
    if (onProgress) onProgress(90);

    // Read compressed file
    console.log('📤 Reading compressed file...');
    const data = await ffmpeg.readFile(outputFileName);
    if (onProgress) onProgress(95);

    // Create File object
    const compressedBlob = new Blob([data], { type: 'video/mp4' });
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(getFileExtension(file.name), '.mp4'),
      { type: 'video/mp4' }
    );

    // Clean up
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);
    if (onProgress) onProgress(100);

    const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
    console.log('✅ Compression complete!');
    console.log(`   Output: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Saved: ${compressionRatio}% smaller`);

    return compressedFile;
  } catch (error) {
    console.error('❌ Video compression failed:', error);
    throw new Error(`Failed to compress video: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if compression is recommended for this file
 */
export function shouldCompressVideo(file: File): boolean {
  const sizeMB = file.size / 1024 / 1024;
  // Recommend compression for files > 15 MB
  return sizeMB > 15;
}

/**
 * Estimate compressed size (rough estimate)
 */
export function estimateCompressedSize(file: File, options: CompressionOptions = {}): number {
  const { videoBitrate = '1M' } = options;
  
  // Very rough estimate: assume bitrate determines size
  // 1M bitrate ≈ 7.5 MB per minute
  // This is a simplified estimation
  const sizeMB = file.size / 1024 / 1024;
  
  if (sizeMB < 15) {
    return file.size; // Small files may not compress much
  }
  
  // Assume 50-70% compression for typical videos
  const compressionFactor = 0.6;
  return Math.round(file.size * compressionFactor);
}

/**
 * Get file extension including the dot
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.substring(lastDot);
}

/**
 * Format bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

