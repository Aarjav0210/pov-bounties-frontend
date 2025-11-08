/**
 * Video Compression Utility using MediaRecorder API
 * Compresses videos client-side using native browser APIs (no dependencies)
 */

export interface CompressionOptions {
  /**
   * Max width (maintains aspect ratio)
   */
  maxWidth?: number;
  
  /**
   * Max height (maintains aspect ratio)
   */
  maxHeight?: number;
  
  /**
   * Video bitrate in bits per second
   * Lower = smaller file, lower quality
   */
  videoBitrate?: number;
  
  /**
   * Called during compression with progress 0-100
   */
  onProgress?: (progress: number) => void;
}

/**
 * Compress a video file using MediaRecorder API
 */
export async function compressVideo(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    videoBitrate = 1000000, // 1 Mbps
    onProgress
  } = options;

  try {
    console.log('🎬 Starting video compression...');
    console.log(`   Input: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    if (onProgress) onProgress(10);

    // Create video element
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    // Load video
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('Failed to load video'));
      video.src = URL.createObjectURL(file);
    });

    if (onProgress) onProgress(20);

    // Calculate dimensions
    let width = video.videoWidth;
    let height = video.videoHeight;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }

    console.log(`   Resolution: ${video.videoWidth}x${video.videoHeight} → ${width}x${height}`);

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    if (onProgress) onProgress(30);

    // Create MediaStream from canvas
    const stream = canvas.captureStream(30); // 30 fps
    
    // Set up MediaRecorder with compression
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
      ? 'video/webm;codecs=vp8'
      : 'video/webm';
    
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: videoBitrate,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    // Start recording
    recorder.start();
    video.play();

    if (onProgress) onProgress(40);

    // Draw frames to canvas
    const duration = video.duration;
    let lastProgress = 40;
    
    const drawFrame = () => {
      if (video.paused || video.ended) return;
      
      ctx.drawImage(video, 0, 0, width, height);
      
      // Update progress
      if (onProgress && video.currentTime > 0) {
        const progress = Math.min(40 + Math.round((video.currentTime / duration) * 50), 90);
        if (progress > lastProgress) {
          lastProgress = progress;
          onProgress(progress);
        }
      }
      
      requestAnimationFrame(drawFrame);
    };

    drawFrame();

    // Wait for video to finish
    await new Promise<void>((resolve) => {
      video.onended = () => {
        recorder.stop();
        resolve();
      };
    });

    // Wait for recorder to finish
    const compressedBlob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: mimeType }));
      };
    });

    if (onProgress) onProgress(95);

    // Clean up
    URL.revokeObjectURL(video.src);

    // Create File object
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(/\.[^/.]+$/, '.webm'),
      { type: mimeType }
    );

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
export function estimateCompressedSize(file: File): number {
  const sizeMB = file.size / 1024 / 1024;
  
  if (sizeMB < 15) {
    return file.size;
  }
  
  // Assume ~50% compression for typical videos
  const compressionFactor = 0.5;
  return Math.round(file.size * compressionFactor);
}

/**
 * Format bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}
