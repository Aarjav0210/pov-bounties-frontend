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
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (ffmpegInstance) return ffmpegInstance;
  }

  try {
    isLoading = true;
    console.log('📦 Loading FFmpeg.wasm...');
    
    const ffmpeg = new FFmpeg();
    
    ffmpeg.on('log', ({ message }: { message: string }) => {
      console.log('FFmpeg:', message);
    });
    
    ffmpeg.on('progress', ({ progress }: { progress: number }) => {
      const percent = Math.round(progress * 100);
      if (onProgress) {
        onProgress(percent);
      }
    });

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
  maxWidth?: number;
  maxHeight?: number;
  videoBitrate?: string;
  crf?: number;
  preset?: 'ultrafast' | 'veryfast' | 'fast' | 'medium' | 'slow';
  onProgress?: (progress: number) => void;
}

/**
 * Compress a video file - outputs MP4
 */
export async function compressVideo(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 480,
    maxHeight = 480,
    videoBitrate = '250k',
    crf = 38,
    preset = 'ultrafast',
    onProgress
  } = options;

  try {
    console.log('🎬 Starting video compression...');
    console.log(`   Input: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    if (onProgress) onProgress(0);
    const ffmpeg = await loadFFmpeg();
    if (onProgress) onProgress(10);

    const inputFileName = 'input' + getFileExtension(file.name);
    const outputFileName = 'output.mp4'; // Always output MP4
    
    console.log('📝 Writing input file to FFmpeg filesystem...');
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    if (onProgress) onProgress(20);

    const ffmpegArgs = [
      '-i', inputFileName,
      '-vf', `scale=${maxWidth}:${maxHeight}:force_original_aspect_ratio=decrease,pad=${maxWidth}:${maxHeight}:(ow-iw)/2:(oh-ih)/2`,
      '-c:v', 'libx264',
      '-crf', crf.toString(),
      '-preset', preset,
      '-b:v', videoBitrate,
      '-an',
      '-movflags', '+faststart',
      '-y',
      outputFileName,
    ] as string[];

    console.log('⚙️  Running FFmpeg compression...');
    await ffmpeg.exec(ffmpegArgs);
    if (onProgress) onProgress(90);

    console.log('📤 Reading compressed file...');
    const data = await ffmpeg.readFile(outputFileName);
    if (onProgress) onProgress(95);

    // Convert Uint8Array to proper format for Blob
    const compressedBlob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' });
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(getFileExtension(file.name), '.mp4'),
      { type: 'video/mp4' }
    );

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

export function shouldCompressVideo(file: File): boolean {
  // Always compress to 512x512 for VLM processing
//   return true;
    return file.size > 50 * 1024 * 1024;
}

export function estimateCompressedSize(file: File): number {
  const sizeMB = file.size / 1024 / 1024;
  if (sizeMB < 15) return file.size;
  return Math.round(file.size * 0.6);
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.substring(lastDot);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}
