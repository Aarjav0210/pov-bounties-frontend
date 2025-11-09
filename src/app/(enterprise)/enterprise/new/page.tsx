"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const bountySchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  industry: z.string().min(1, "Please select an industry"),
  duration: z.string().min(1, "Please specify expected duration"),
  reward: z.number().min(100, "Minimum reward is $100"),
  maxSubmissions: z.number().min(1, "At least 1 submission required"),
  imageCount: z.number().min(1000, "Minimum image count is 1000"),
  licensing: z.string().min(1, "Please select a licensing option"),
});

type BountyFormData = z.infer<typeof bountySchema>;

export default function NewBountyPage() {
  const router = useRouter();
  
  const [augmentations, setAugmentations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageCount, setImageCount] = useState(1000);
  const [multiplier, setMultiplier] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BountyFormData>({
    resolver: zodResolver(bountySchema),
    defaultValues: {
      reward: 500,
      maxSubmissions: 10,
      imageCount: 1000,
    },
  });

  const reward = watch("reward");
  const maxSubmissions = watch("maxSubmissions");

  const augmentationCosts = {
    "Hand Meshes & Skeletons": 50,
    "Hand Trajectories": 75,
    "Semantic Segmentation": 25,
    "Synthetic Depth Maps": 150,
  };

  const totalAugmentationCost = augmentations.reduce(
    (sum, aug) => sum + (augmentationCosts[aug as keyof typeof augmentationCosts] || 0),
    0
  ) * multiplier;

  const totalCost = (reward || 0) * (maxSubmissions || 0) + totalAugmentationCost * (maxSubmissions || 0);

  const onSubmit = async (data: BountyFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Form data:", {
        ...data,
        augmentations,
        totalCost,
      });

      router.push("/enterprise?success=true");
    } catch (error) {
      console.error("Failed to create bounty:", error);
      alert("Failed to create bounty. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAugmentation = (aug: string) => {
    setAugmentations((prev) =>
      prev.includes(aug) ? prev.filter((a) => a !== aug) : [...prev, aug]
    );
  };

  // Generate line chart path data based on multiplier - upward trend style
  const generateChartPath = () => {
    const points = 12;
    const width = 472;
    const height = 100;
    const maxValue = 10;
    const stepX = width / (points - 1);
    
    // Generate y values that show upward trend, scaling with multiplier
    // Start flat and ramp up steeply as multiplier increases
    const yValues = Array.from({ length: points }, (_, i) => {
      const progress = i / (points - 1);
      // Base curve: starts around 85, ends around 25 (lower y = higher on chart)
      const baseStart = 85;
      const baseEnd = 65;
      const multiplierEffect = (multiplier / maxValue) * 50; // Scale effect - increased range
      const endY = baseEnd - multiplierEffect; // Lower y = higher on chart
      
      // Use exponential curve to create flat start and steep ramp
      // Lower exponent = steeper curve, higher multiplier = steeper ramp
      const baseExponent = 3.0; // Start with cubic for very flat beginning
      const exponentAdjustment = (multiplier / maxValue) * 1.5; // Higher multiplier = lower exponent = steeper
      const curveExponent = baseExponent - exponentAdjustment; // Range from 3.0 to 1.5
      const easedProgress = Math.pow(progress, curveExponent);
      
      // Create upward trend that starts flat and ramps up steeply
      const trend = baseStart - (baseStart - endY) * easedProgress;
      
      // Add minimal variation at start, more at end
      const variation = progress < 0.3 ? 0 : Math.sin(progress * Math.PI * 2) * 3;
      const y = trend + variation;
      
      return Math.max(1, Math.min(99, y));
    });

    // Create smooth curve path using cubic bezier (matching Average Quality Score style)
    let path = `M0 ${yValues[0]}`;
    for (let i = 1; i < points; i++) {
      const x = i * stepX;
      const prevX = (i - 1) * stepX;
      const cp1x = prevX + stepX / 3;
      const cp1y = yValues[i - 1];
      const cp2x = x - stepX / 3;
      const cp2y = yValues[i];
      path += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${yValues[i]}`;
    }
    
    // Add closing path for fill
    const fillPath = `${path} L${width} ${height} L0 ${height} Z`;
    
    return { linePath: path, fillPath };
  };

  const chartPaths = generateChartPath();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black leading-tight tracking-tighter text-gray-900 md:text-4xl mb-2">
          Create New Bounty
        </h1>
        <p className="text-gray-600">
          Define your video data collection requirements
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Task Description */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Task Description</CardTitle>
            <CardDescription>
              Describe what you want contributors to capture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-900">
                Bounty Title <span className="text-red-500">*</span>
              </Label>
                <Input
                  id="title"
                  placeholder="e.g., Capture retail shopping experience"
                  className="mt-1 border-0 bg-gray-50"
                  {...register("title")}
                />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-900">
                Detailed Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide detailed instructions for contributors..."
                rows={5}
                className="mt-1 border-0 bg-gray-50"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="industry" className="text-gray-900">
                Industry <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("industry", value)}>
                <SelectTrigger id="industry" className="mt-1 border-0 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 focus:ring-offset-0">
                  <SelectValue placeholder="Select industry" className="text-gray-500" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-lg">
                  <SelectItem value="retail" className="text-gray-900 focus:bg-green-50 focus:text-gray-900">Retail</SelectItem>
                  <SelectItem value="healthcare" className="text-gray-900 focus:bg-green-50 focus:text-gray-900">Healthcare</SelectItem>
                  <SelectItem value="logistics" className="text-gray-900 focus:bg-green-50 focus:text-gray-900">Logistics</SelectItem>
                  <SelectItem value="manufacturing" className="text-gray-900 focus:bg-green-50 focus:text-gray-900">Manufacturing</SelectItem>
                  <SelectItem value="food-beverage" className="text-gray-900 focus:bg-green-50 focus:text-gray-900">Food & Beverage</SelectItem>
                  <SelectItem value="education" className="text-gray-900 focus:bg-green-50 focus:text-gray-900">Education</SelectItem>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500 mt-1">{errors.industry.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="duration" className="text-gray-900">
                Expected Duration <span className="text-red-500">*</span>
              </Label>
              <Input
                id="duration"
                placeholder="e.g., 10-15 minutes"
                className="mt-1 border-0 bg-gray-50"
                {...register("duration")}
              />
              {errors.duration && (
                <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Augmentations */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Data Augmentations</CardTitle>
            <CardDescription>
              Add AI-powered enhancements to collected videos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label htmlFor="multiplier" className="text-gray-900">
                  Multiplier
                </Label>
                <span className="text-2xl font-bold text-green-600">
                  {multiplier}x
                </span>
              </div>
              <div className="mb-4 flex-1 flex items-end">
                <svg
                  fill="none"
                  height="100"
                  preserveAspectRatio="none"
                  viewBox="0 0 472 100"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id="sparkline-gradient-multiplier"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="100"
                    >
                      <stop offset="0" stopColor="#22c55e" stopOpacity="0.2" />
                      <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={chartPaths.fillPath}
                    fill="url(#sparkline-gradient-multiplier)"
                  />
                  <path
                    d={chartPaths.linePath}
                    stroke="#22c55e"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="multiplier" className="text-gray-900">
                  Adjust Multiplier
                </Label>
              </div>
              <input
                type="range"
                id="multiplier"
                min="1"
                max="10"
                step="1"
                value={multiplier}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMultiplier(value);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
                style={{
                  background: `linear-gradient(to right, #22c55e 0%, #22c55e ${((multiplier - 1) / (10 - 1)) * 100}%, #e5e7eb ${((multiplier - 1) / (10 - 1)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1x</span>
                <span>2x</span>
                <span>5x</span>
                <span>10x</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(augmentationCosts).map(([key, cost]) => {
                const isSelected = augmentations.includes(key);
                const adjustedCost = cost * multiplier;
                return (
                  <div
                    key={key}
                    onClick={() => toggleAugmentation(key)}
                    className={cn(
                      "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all",
                      isSelected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 capitalize mb-1">
                          {key.replace("-", " ")}
                        </h4>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            +${adjustedCost} per submission
                          </p>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                      <Info className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Budget & Payout */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Budget & Payout</CardTitle>
            <CardDescription>
              Set reward amount and maximum submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reward" className="text-gray-900">
                  Reward per Submission ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reward"
                  type="number"
                  min="100"
                  step="50"
                  className="mt-1 border-0 bg-gray-50"
                  {...register("reward", { valueAsNumber: true })}
                />
                {errors.reward && (
                  <p className="text-sm text-red-500 mt-1">{errors.reward.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="maxSubmissions" className="text-gray-900">
                  Submissions Upper Bound <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxSubmissions"
                  type="number"
                  min="1"
                  className="mt-1 border-0 bg-gray-50"
                  {...register("maxSubmissions", { valueAsNumber: true })}
                />
                {errors.maxSubmissions && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.maxSubmissions.message}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border-0">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Estimated Total Cost:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${totalCost.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Base reward: ${((reward || 0) * (maxSubmissions || 0)).toLocaleString()}
                {totalAugmentationCost > 0 &&
                  ` + Augmentations (${multiplier}x): $${(totalAugmentationCost * (maxSubmissions || 0)).toLocaleString()}`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Licensing */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Privacy & Licensing</CardTitle>
            <CardDescription>
              Choose how your data can be used
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="licensing" className="text-gray-900">
                License Type <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("licensing", value)}>
                <SelectTrigger id="licensing" className="mt-1 border-0 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 focus:ring-offset-0">
                  <SelectValue placeholder="Select license" className="text-gray-500" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-lg">
                  <SelectItem value="commercial" className="text-gray-900 focus:bg-green-50 focus:text-gray-900">Commercial Use</SelectItem>
                  <SelectItem value="research" className="text-gray-900 focus:bg-green-50 focus:text-gray-900">Research Only</SelectItem>
                  <SelectItem value="internal" className="text-gray-900 focus:bg-green-50 focus:text-gray-900">Internal Use Only</SelectItem>
                  <SelectItem value="custom" className="text-gray-900 focus:bg-green-50 focus:text-gray-900">Custom License</SelectItem>
                </SelectContent>
              </Select>
              {errors.licensing && (
                <p className="text-sm text-red-500 mt-1">{errors.licensing.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" variant="enterprise" disabled={isSubmitting}>
            {isSubmitting ? (
              "Creating Bounty..."
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Create Bounty • ${totalCost.toLocaleString()}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

