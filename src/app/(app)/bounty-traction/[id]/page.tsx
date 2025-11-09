"use client";

import { useState, useRef, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { submitBountyVideoDirectS3 } from "@/lib/api/client";
import { compressVideo, shouldCompressVideo, formatFileSize } from "@/lib/videoCompression";

// Bounty data mapped by ID
const bountyData: Record<string, {
  disabled: boolean;
  title: string;
  company: string;
  reward: number;
  description: string;
  requirements: string[];
  examples: string[];
  faq: { question: string; answer: string }[];
}> = {
  "1": {
    disabled: false,
    title: "POV Video: Do a bottle flip",
    company: "PepperTech",
    reward: 67,
    description: "We're looking for video footage of someone doing as many bottle flips as they can. The video should capture the entire process from picking up the bottle to the flip, showing hands performing the actions. The winner of this challenge will receive a $67 bounty.",
    requirements: [
      "Maximum 30 seconds of continuous footage",
      "Must show complete bottle flip process",
      "Clear visibility of hands, bottle, and floor",
      "480p minimum resolution, 24fps or higher"
    ],
    examples: [
      "No examples yet",
    ],
    faq: [
      {
        question: "Can I keep going after a failed attempt?",
        answer: "Yes, you can keep going after a failed attempt. We will count all successful flips.",
      },
    ],
  },
  "2": {
    disabled: true,
    title: "POV Video: Preparing a Caesar Salad",
    company: "CulinaryAI",
    reward: 50,
    description: "First-person video of preparing a Caesar salad from start to finish.",
    requirements: [],
    examples: [],
    faq: [],
  },
  "3": {
    disabled: true,
    title: "POV Video: Changing a Tire",
    company: "AutoFix Inc.",
    reward: 250,
    description: "First-person video of changing a car tire.",
    requirements: [],
    examples: [],
    faq: [],
  },
  "4": {
    disabled: true,
    title: "POV Video: Repotting a Houseplant",
    company: "GreenThumb Bots",
    reward: 75,
    description: "First-person video of repotting a houseplant.",
    requirements: [],
    examples: [],
    faq: [],
  },
  "5": {
    disabled: true,
    title: "POV Video: Baking Chocolate Chip Cookies",
    company: "CulinaryAI",
    reward: 100,
    description: "First-person video of baking chocolate chip cookies.",
    requirements: [],
    examples: [],
    faq: [],
  },
  "6": {
    disabled: true,
    title: "POV Video: Setting up a Router",
    company: "ConnectNet",
    reward: 120,
    description: "First-person video of setting up a wireless router.",
    requirements: [],
    examples: [],
    faq: [],
  },
  "7": {
    disabled: true,
    title: "POV Video: Folding a Fitted Sheet",
    company: "HomeHelper AI",
    reward: 40,
    description: "First-person video of folding a fitted sheet.",
    requirements: [],
    examples: [],
    faq: [],
  },
  "8": {
    disabled: true,
    title: "POV Video: Brewing Pour-Over Coffee",
    company: "BrewBot",
    reward: 60,
    description: "First-person video of brewing pour-over coffee.",
    requirements: [],
    examples: [],
    faq: [],
  },
};

export default function BountyTractionPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params Promise
  const { id } = use(params);
  
  // Get bounty data
  const bountyId = id || "1";
  const bounty = bountyData[bountyId];
  
  // All hooks must be called before any conditional returns
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState("requirements");
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Compression state
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [needsCompression, setNeedsCompression] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [venmoId, setVenmoId] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // If bounty doesn't exist, show as disabled
  if (!bounty) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-4">Bounty Not Found</h1>
        <Button onClick={() => window.location.href = "/bounties"}>Back to Marketplace</Button>
      </div>
    );
  }
  
  const isDisabled = bounty.disabled;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check video duration (hard limit: 30 seconds)
      const duration = await getVideoDuration(file);
      setVideoDuration(duration);
      
      if (duration > 30) {
        setError(`Video is too long (${Math.round(duration)}s). Maximum length is 30 seconds.`);
        setSelectedFile(null);
        setFileName("");
        // Reset file input
        event.target.value = "";
        return;
      }
      
      setSelectedFile(file);
      setFileName(file.name);
      setOriginalSize(file.size);
      setCompressedSize(0);
      setUploadProgress(0);
      setCompressionProgress(0);
      setSimulatedProgress(0);
      setError(null);
      
      // Check if compression is needed
      const shouldCompress = shouldCompressVideo(file);
      setNeedsCompression(shouldCompress);
      
      if (shouldCompress) {
        console.log(`📊 Will downsample to 480x480 for VLM processing (${formatFileSize(file.size)})`);
      }
    }
  };
  
  // Helper function to get video duration
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async () => {
    console.log("🔍 Submit clicked");
    console.log("Selected file:", selectedFile);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("VenmoID:", venmoId);
    console.log("Confirmed:", confirmed);
    
    if (!selectedFile || !confirmed || !name || !email || !venmoId) {
      console.error("❌ Validation failed - missing fields");
      setError("Please fill in all fields and select a video");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let fileToUpload = selectedFile;
      
      // Compress video to 512x512 for VLM processing
      if (needsCompression) {
        console.log("🗜️ Downsampling video to 480x480...");
        setIsCompressing(true);
        setCompressionProgress(0);
        setSimulatedProgress(0);
        
        // Start simulated progress timer for better UX during long encoding phase
        const progressSimulator = setInterval(() => {
          setSimulatedProgress(prev => {
            // Slowly increment to 85%, then stop (let real progress take over)
            if (prev < 85) return prev + 1;
            return prev;
          });
        }, 2000); // Increment by 1% every 2 seconds
        
        try {
          fileToUpload = await compressVideo(selectedFile, {
            maxWidth: 480,
            maxHeight: 480,
            videoBitrate: '250k',
            crf: 38,
            preset: 'ultrafast',
            onProgress: (progress) => {
              setCompressionProgress(progress);
              // Clear simulator when we get real progress near the end
              if (progress >= 90) {
                clearInterval(progressSimulator);
              }
            }
          });
          
          clearInterval(progressSimulator);
          setCompressedSize(fileToUpload.size);
          console.log(`✅ Compression complete! ${formatFileSize(selectedFile.size)} → ${formatFileSize(fileToUpload.size)}`);
          setIsCompressing(false);
        } catch (compressionError) {
          clearInterval(progressSimulator);
          console.error("⚠️ Compression failed, uploading original file:", compressionError);
          setIsCompressing(false);
          // Continue with original file if compression fails
          fileToUpload = selectedFile;
        }
      }
      
      console.log("🚀 Starting direct S3 upload...");
      
      // Submit video with user info using direct S3 upload (bypasses backend timeout)
      const result = await submitBountyVideoDirectS3(
        fileToUpload, 
        name, 
        email, 
        venmoId,
        (progress) => {
          // Real-time progress updates from S3 upload
          setUploadProgress(progress);
        }
      );
      
      console.log("✅ Upload successful:", result);
      
      // Show success page
      setShowSuccess(true);
    } catch (error) {
      console.error("❌ Submission failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit. Please try again."
      );
      setIsSubmitting(false);
      setIsCompressing(false);
      setUploadProgress(0);
      setCompressionProgress(0);
      setSimulatedProgress(0);
    }
  };

  // Coming Soon page for disabled bounties
  if (isDisabled) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white border-2 border-yellow-200 rounded-xl p-12 shadow-lg text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-yellow-600 text-6xl">schedule</span>
          </div>
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full mb-4">
              COMING SOON
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            {bounty.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            This bounty is currently being prepared and will be available soon!
          </p>
          <div className="bg-gray-50 rounded-lg p-8 mb-8 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">What to expect:</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-2xl mt-0.5">notifications_active</span>
                <div>
                  <strong className="text-gray-900 block">Get Notified</strong>
                  <span className="text-sm">We'll announce when this bounty goes live</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-2xl mt-0.5">payments</span>
                <div>
                  <strong className="text-gray-900 block">Earn ${bounty.reward}</strong>
                  <span className="text-sm">Reward per accepted video submission</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-2xl mt-0.5">quick_reference</span>
                <div>
                  <strong className="text-gray-900 block">Easy Submission</strong>
                  <span className="text-sm">Simple upload process when ready</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => window.location.href = "/bounties"}
              className="h-12 px-8 text-base"
            >
              Browse Available Bounties
            </Button>
            <Button
              onClick={() => window.location.href = "/"}
              variant="outline"
              className="h-12 px-8 text-base"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success page view
  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Submission Received!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for submitting your video, {name}!
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">schedule</span>
                <span>Your video will be reviewed within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">verified</span>
                <span>We'll validate it meets all requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">payments</span>
                <span>If approved, you'll receive ${bounty.reward} via Venmo at @{venmoId}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">email</span>
                <span>We'll send updates to {email}</span>
              </li>
            </ul>
          </div>
          <Button
            onClick={() => window.location.href = "/bounties"}
            className="w-full h-12 text-base"
          >
            Browse More Bounties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Left Column */}
      <div className="lg:col-span-2">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-start gap-4 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 text-3xl md:text-4xl font-black leading-tight tracking-tighter">
              {bounty.title}
            </h1>
            <p className="text-gray-600 text-base font-normal leading-normal">
              Sponsored by {bounty.company}
            </p>
          </div>
          <button className="flex min-w-[84px] shrink-0 max-w-[480px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 text-gray-900 text-sm font-bold leading-normal">
            <span className="truncate font-bold text-red-500 text-3xl">${bounty.reward}</span>
          </button>
        </div>

        {/* Chips */}
        <div className="flex gap-3 pb-6 flex-wrap">
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 px-4">
            <p className="text-gray-900 text-sm font-medium leading-normal">Video</p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 px-4">
            <p className="text-gray-900 text-sm font-medium leading-normal">POV</p>
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
            <p className="text-gray-600 text-base leading-relaxed">{bounty.description}</p>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Requirements</h3>
            <ul className="space-y-3">
              {bounty.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">check_circle</span>
                  <span className="text-gray-600">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "examples" && (
          <div className="py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Submissions</h3>
            <ul className="space-y-3">
              {bounty.examples.map((example, index) => (
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
              {bounty.faq.map((item, index) => (
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
          
          {/* Submission Form */}
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="venmoId" className="text-sm font-medium text-gray-900">
                Venmo ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="venmoId"
                type="text"
                placeholder="@username"
                value={venmoId}
                onChange={(e) => setVenmoId(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Payment will be sent to this Venmo account
              </p>
            </div>
          </div>
          
          {/* File Uploader */}
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-4xl text-red-500 mb-3">upload_file</span>
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold text-red-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-600">MP4, MOV, or AVI (MAX. 30 seconds, 500MB)</p>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
          </label>

          {/* File Info & Progress */}
          {fileName && (
            <div className="w-full mt-4 space-y-3">
              {/* File info */}
              <div className="flex justify-between items-center text-sm">
                <p className="truncate text-gray-900 font-medium">{fileName}</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">{Math.round(videoDuration)}s</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-gray-600">{formatFileSize(originalSize)}</p>
                </div>
              </div>
              
              {/* Compression notice */}
              {needsCompression && !isSubmitting && !compressedSize && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-xl">auto_awesome</span>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Optimizing for VLM</p>
                      <p className="text-xs text-blue-600 mt-1">
                        We'll downsample to 512x512 to match VLM processing (faster upload & processing)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Compression result */}
              {compressedSize > 0 && !isSubmitting && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-green-600 text-xl">check_circle</span>
                    <div className="text-sm text-green-800">
                      <p className="font-medium">Optimized!</p>
                      <p className="text-xs text-green-600 mt-1">
                        {formatFileSize(originalSize)} → {formatFileSize(compressedSize)} ({Math.round((1 - compressedSize / originalSize) * 100)}% smaller)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Compression Progress */}
              {isCompressing && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-700 font-medium">🗜️ Optimizing video...</p>
                    <p className="text-gray-600">
                      {compressionProgress >= 20 && compressionProgress < 90 
                        ? `${simulatedProgress}%` 
                        : `${compressionProgress}%`}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: compressionProgress >= 20 && compressionProgress < 90 
                          ? `${simulatedProgress}%` 
                          : `${compressionProgress}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {compressionProgress < 20 
                      ? 'Loading encoder...' 
                      : compressionProgress >= 90 
                        ? 'Finalizing...' 
                        : 'Encoding video (typically 1-2 minutes)...'}
                  </p>
                </div>
              )}
              
              {/* Upload Progress */}
              {uploadProgress > 0 && !isCompressing && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-700 font-medium">📤 Uploading to S3...</p>
                    <p className="text-gray-600">{uploadProgress}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
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
              I confirm my submission meets all requirements and the information provided is accurate.
            </label>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full mt-6 h-12 text-base"
            onClick={handleSubmit}
            disabled={!selectedFile || !name || !email || !venmoId || !confirmed || isSubmitting}
          >
            {isCompressing 
              ? "Optimizing..." 
              : isSubmitting 
                ? "Uploading..." 
                : "Submit Video"}
          </Button>
        </div>
      </div>
    </div>
  );
}

