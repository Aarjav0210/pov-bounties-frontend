"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Mock bounty data
const mockBounty = {
  id: "1",
  title: "Egocentric Video Footage for Warehouse Navigation",
  company: "Boston Dynamics",
  reward: 150,
  description:
    "We're looking for first-person video footage captured while walking through warehouse environments. The video should showcase typical warehouse navigation scenarios including narrow aisles, forklifts, pallets, and inventory shelving.",
  requirements: [
    "Video must contain unobstructed recordings of your hands",
    "Video must clearly show you successfully completed the tasks",
    "Video must have decent lighting and video quality",
  ],
  examples: [
    "Task Example 1: Walking through narrow warehouse aisles with high shelving on both sides",
    "Task Example 2 - TaskNavigating around forklifts and pallet jacks in an active work zone",
    "Task Example 3: Moving between different sections of a warehouse facility",
  ],
  faq: [
    {
      question: "What type of camera should I use?",
      answer: "Anything that gets the job done. Your phone, a GoPro, or anything that can record at atleast 30fps is preferred.",
    },
    {
      question: "Do I need permission to record in public?",
      answer: "Check with your state laws. Our security system automatically rejects videos that have other peoples in them not participating in the task.",
    },
    {
      question: "Can I edit the video before submission?",
      answer: "We need to see a full uninterrupted competion of your task. Our validation pipeline needs to analyze the original video data.",
    },
  ],
  validationSteps: [
    {
      title: "Domain Check",
      description: "Verifies your video is of the requested task",
    },
    {
      title: "Task Breakdown",
      description: "Breaks your video down into its component tasks",
    },
    {
      title: "Quality Scoring",
      description: "Scores your video based on what how well it shows you completing the task",
    },
    {
      title: "Payday",
      description: "You get paid. The higher your quality score the more you earn.",
    },
  ],
};

export default function BountyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState("requirements");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
        }
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if (!fileName || !confirmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bountyId: params.id }),
      });

      const data = await response.json();
      
      // Navigate to validation page
      router.push(`/validate/${data.submissionId}`);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Left Column */}
      <div className="lg:col-span-2">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-start gap-4 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 text-3xl md:text-4xl font-black leading-tight tracking-tighter">
              {mockBounty.title}
            </h1>
            <p className="text-gray-600 text-base font-normal leading-normal">
              Sponsored by {mockBounty.company}
            </p>
          </div>
          <button className="flex min-w-[84px] shrink-0 max-w-[480px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 text-gray-900 text-sm font-bold leading-normal">
            <span className="truncate">${mockBounty.reward} / video</span>
          </button>
        </div>

        {/* Chips */}
        <div className="flex gap-3 pb-6 flex-wrap">
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 px-4">
            <p className="text-gray-900 text-sm font-medium leading-normal">Video</p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 px-4">
            <p className="text-gray-900 text-sm font-medium leading-normal">Egocentric</p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-green-100 px-4">
            <div className="size-2 rounded-full bg-green-500"></div>
            <p className="text-green-800 text-sm font-medium leading-normal">Active</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="flex border-b border-gray-200 gap-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                activeTab === "overview"
                  ? "border-b-red-500 text-red-500"
                  : "border-b-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Overview</p>
            </button>
            <button
              onClick={() => setActiveTab("requirements")}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                activeTab === "requirements"
                  ? "border-b-red-500 text-red-500"
                  : "border-b-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Requirements</p>
            </button>
            <button
              onClick={() => setActiveTab("examples")}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                activeTab === "examples"
                  ? "border-b-red-500 text-red-500"
                  : "border-b-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Examples</p>
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                activeTab === "faq"
                  ? "border-b-red-500 text-red-500"
                  : "border-b-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">FAQ</p>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="py-8">
            <p className="text-gray-600 text-base leading-relaxed">{mockBounty.description}</p>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="py-8">
            {/* Validation Pipeline */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Validation Pipeline</h3>
              <p className="text-sm text-gray-600 mb-6">
                Submitted videos will undergo the following automated checks before being sent for final review.
              </p>
              <div className="grid grid-cols-[auto_1fr] gap-x-4">
                {mockBounty.validationSteps.map((step, index) => (
                  <div key={index} className="contents">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-red-500 text-white mt-2">
                        <span className="material-symbols-outlined !text-[14px] !leading-none">check</span>
                      </div>
                      {index < mockBounty.validationSteps.length - 1 && (
                        <div className="w-px bg-gray-200 h-full"></div>
                      )}
                    </div>
                    <div className={`flex flex-1 flex-col ${index < mockBounty.validationSteps.length - 1 ? 'pb-8' : ''}`}>
                      <p className="text-gray-900 text-base font-medium leading-normal">{step.title}</p>
                      <p className="text-gray-600 text-sm font-normal leading-normal">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Requirements</h3>
              <ul className="space-y-3">
                {mockBounty.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">check_circle</span>
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "examples" && (
          <div className="py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Submissions</h3>
            <ul className="space-y-3">
              {mockBounty.examples.map((example, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">play_circle</span>
                  <span className="text-gray-600">{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {mockBounty.faq.map((item, index) => (
                <div key={index}>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">{item.question}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Submission Panel */}
      <div className="lg:col-span-1">
        <div className="sticky top-8 bg-white border border-gray-200 rounded-xl p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Your Video</h3>
          
          {/* File Uploader */}
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-4xl text-red-500 mb-3">upload_file</span>
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold text-red-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-600">MP4, MOV, or AVI (MAX. 500MB)</p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
          </label>

          {/* Upload Progress */}
          {fileName && (
            <div className="w-full mt-4">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <p className="truncate text-gray-900 font-medium">{fileName}</p>
                <p>{uploadProgress}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Confirmation Checkbox */}
          <div className="flex items-start mt-6">
            <Checkbox
              id="confirmation"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              className="mt-0.5"
            />
            <label htmlFor="confirmation" className="ml-3 text-sm leading-6 font-medium text-gray-900 cursor-pointer">
              I confirm my submission meets all requirements.
            </label>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full mt-6 h-12 text-base"
            onClick={handleSubmit}
            disabled={!fileName || uploadProgress < 100 || !confirmed || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit for validation"}
          </Button>
        </div>
      </div>
    </div>
  );
}

