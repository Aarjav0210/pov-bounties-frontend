import { API_ENDPOINTS } from "./config";
import type {
  UploadVideoResponse,
  ValidationStatusResponse,
} from "@/lib/types/validation";

/**
 * Upload a video file to the backend
 */
export async function uploadVideo(
  videoFile: File
): Promise<UploadVideoResponse> {
  const formData = new FormData();
  formData.append("file", videoFile);

  const response = await fetch(API_ENDPOINTS.UPLOAD_VIDEO, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to upload video: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

/**
 * Connect to validation stream via Server-Sent Events
 * @param videoPath Path to the uploaded video file
 * @param expectedTask Task description for validation
 * @param onEvent Callback for each validation event
 * @returns Cleanup function to close the connection
 */
export function connectValidationStream(
  videoPath: string,
  expectedTask: string,
  onEvent: (event: ValidationStatusResponse) => void
): () => void {
  // Use fetch with POST to stream SSE response manually
  // (EventSource doesn't support POST requests)
  const abortController = new AbortController();

  fetch(API_ENDPOINTS.VALIDATE_VIDEO_STREAM, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      video_path: videoPath,
      expected_task: expectedTask,
    }),
    signal: abortController.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Validation failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              onEvent(data as ValidationStatusResponse);
            } catch (error) {
              console.error("Failed to parse SSE event:", error, line);
            }
          }
        }
      }
    })
    .catch((error) => {
      if (error.name !== "AbortError") {
        console.error("Validation stream error:", error);
        onEvent({
          job_id: "",
          status: "failed",
          stage: "error",
          progress: 0,
          error: error.message,
        });
      }
    });

  return () => {
    abortController.abort();
  };
}

/**
 * Start a validation job (non-streaming, returns job_id for polling)
 */
export async function startValidation(
  videoPath: string,
  expectedTask: string
): Promise<{ job_id: string }> {
  const response = await fetch(API_ENDPOINTS.VALIDATE_VIDEO, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      video_path: videoPath,
      expected_task: expectedTask,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to start validation: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

/**
 * Get validation status by job_id
 */
export async function getValidationStatus(
  jobId: string
): Promise<ValidationStatusResponse> {
  const response = await fetch(API_ENDPOINTS.VALIDATION_STATUS(jobId));

  if (!response.ok) {
    throw new Error(`Failed to get validation status: ${response.status}`);
  }

  return response.json();
}

/**
 * Direct S3 upload flow (bypasses backend for file transfer)
 * Prevents timeouts on large files and mobile uploads
 */
export async function submitBountyVideoDirectS3(
  videoFile: File,
  name: string,
  email: string,
  venmoId: string,
  onProgress?: (progress: number) => void
): Promise<{ message: string; file_id: string; s3_url?: string }> {
  console.log("📡 Starting direct S3 upload flow...");
  
  // Step 1: Get presigned URL from backend
  console.log("1️⃣ Requesting presigned URL...");
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("venmo_id", venmoId);
  formData.append("filename", videoFile.name);
  formData.append("content_type", videoFile.type || "video/mp4");

  const urlResponse = await fetch(API_ENDPOINTS.GENERATE_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!urlResponse.ok) {
    const errorText = await urlResponse.text();
    throw new Error(
      `Failed to generate upload URL: ${urlResponse.status} ${errorText}`
    );
  }

  const { upload_url, file_id, s3_filename } = await urlResponse.json();
  console.log("✅ Presigned URL received:", s3_filename);

  // Step 2: Upload directly to S3 using presigned URL
  console.log("2️⃣ Uploading to S3...");
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        console.log(`📤 Upload progress: ${progress}%`);
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", async () => {
      if (xhr.status === 200) {
        console.log("✅ S3 upload complete!");
        
        // Step 3: Confirm upload with backend
        console.log("3️⃣ Confirming upload with backend...");
        try {
          const confirmFormData = new FormData();
          confirmFormData.append("file_id", file_id);
          
          const confirmResponse = await fetch(API_ENDPOINTS.CONFIRM_UPLOAD, {
            method: "POST",
            body: confirmFormData,
          });

          if (!confirmResponse.ok) {
            throw new Error("Failed to confirm upload");
          }

          const result = await confirmResponse.json();
          console.log("✅ Upload confirmed!");
          
          resolve({
            message: "Video uploaded successfully",
            file_id: file_id,
            s3_url: `s3://${s3_filename}`,
          });
        } catch (error) {
          console.error("❌ Confirmation failed:", error);
          reject(error);
        }
      } else {
        console.error("❌ S3 upload failed:", xhr.status);
        reject(new Error(`S3 upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      console.error("❌ Network error during S3 upload");
      reject(new Error("Network error during upload"));
    });

    xhr.open("PUT", upload_url);
    xhr.setRequestHeader("Content-Type", videoFile.type || "video/mp4");
    xhr.send(videoFile);
  });
}

/**
 * LEGACY: Submit a bounty video with user information (no validation)
 * Uploads through backend - use submitBountyVideoDirectS3 for better performance
 * Uploads to S3 with VenmoID as filename
 */
export async function submitBountyVideo(
  videoFile: File,
  name: string,
  email: string,
  venmoId: string
): Promise<{ message: string; file_id: string; s3_url?: string }> {
  console.log("📡 submitBountyVideo called");
  console.log("API Endpoint:", API_ENDPOINTS.SUBMIT_BOUNTY_VIDEO);
  console.log("File:", videoFile.name, videoFile.size, "bytes");
  
  const formData = new FormData();
  formData.append("file", videoFile);
  formData.append("name", name);
  formData.append("email", email);
  formData.append("venmo_id", venmoId);

  console.log("📤 Sending POST request...");

  try {
    const response = await fetch(API_ENDPOINTS.SUBMIT_BOUNTY_VIDEO, {
      method: "POST",
      body: formData,
    });

    console.log("📥 Response received:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:", response.status, errorText);
      throw new Error(
        `Failed to submit video: ${response.status} ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ Success response:", result);
    return result;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    throw error;
  }
}

/**
 * Legacy function for backward compatibility
 * Creates a submission by uploading video and starting validation
 */
export async function createSubmission(
  bountyId: string,
  videoFile: File,
  expectedTask: string
): Promise<{ submissionId: string; jobId: string }> {
  // Upload video
  const uploadResult = await uploadVideo(videoFile);

  // Start validation
  const validationResult = await startValidation(
    uploadResult.path,
    expectedTask
  );

  return {
    submissionId: uploadResult.file_id,
    jobId: validationResult.job_id,
  };
}

