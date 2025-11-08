export async function createSubmission(
  bountyId: string,
  videoFile: File
): Promise<{ submissionId: string }> {
  const formData = new FormData();
  formData.append("bountyId", bountyId);
  formData.append("video", videoFile);

  const response = await fetch("/api/submissions", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create submission");
  }

  return response.json();
}

