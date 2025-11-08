import { http, HttpResponse } from "msw";

export const handlers = [
  // POST /api/submissions - Create a new submission
  http.post("/api/submissions", async () => {
    // Generate a deterministic ID for testing
    const submissionId = "test-submission-" + Date.now();
    return HttpResponse.json({ submissionId });
  }),

  // GET /api/validation/:id/stream - SSE stream for validation
  // Note: MSW v2 doesn't support SSE out of the box, so we handle this in the component
  http.get("/api/validation/:id/stream", () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  }),
];

