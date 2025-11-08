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
import { Separator } from "@/components/ui/separator";
import { Info, CheckCircle2 } from "lucide-react";

const bountySchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  industry: z.string().min(1, "Please select an industry"),
  duration: z.string().min(1, "Please specify expected duration"),
  reward: z.number().min(100, "Minimum reward is $100"),
  maxSubmissions: z.number().min(1, "At least 1 submission required"),
  acceptanceCriteria: z.string().min(20, "Please provide acceptance criteria"),
  licensing: z.string().min(1, "Please select a licensing option"),
});

type BountyFormData = z.infer<typeof bountySchema>;

export default function NewBountyPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<string[]>(["retail"]);
  const [augmentations, setAugmentations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
  });

  const reward = watch("reward");
  const maxSubmissions = watch("maxSubmissions");

  const augmentationCosts = {
    "scene-segmentation": 50,
    "object-tracking": 75,
    "audio-transcription": 25,
    "3d-reconstruction": 150,
  };

  const totalAugmentationCost = augmentations.reduce(
    (sum, aug) => sum + (augmentationCosts[aug as keyof typeof augmentationCosts] || 0),
    0
  );

  const totalCost = (reward || 0) * (maxSubmissions || 0) + totalAugmentationCost * (maxSubmissions || 0);

  const onSubmit = async (data: BountyFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Form data:", {
        ...data,
        domains,
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

  const toggleDomain = (domain: string) => {
    setDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const toggleAugmentation = (aug: string) => {
    setAugmentations((prev) =>
      prev.includes(aug) ? prev.filter((a) => a !== aug) : [...prev, aug]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create New Bounty</h1>
        <p className="text-muted-foreground">
          Define your video data collection requirements
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Task Description */}
        <Card>
          <CardHeader>
            <CardTitle>Task Description</CardTitle>
            <CardDescription>
              Describe what you want contributors to capture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">
                Bounty Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Capture retail shopping experience"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">
                Detailed Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide detailed instructions for contributors..."
                rows={5}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="industry">
                Industry <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("industry", value)}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-destructive mt-1">{errors.industry.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="duration">
                Expected Duration <span className="text-destructive">*</span>
              </Label>
              <Input
                id="duration"
                placeholder="e.g., 10-15 minutes"
                {...register("duration")}
              />
              {errors.duration && (
                <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Budget & Payout */}
        <Card>
          <CardHeader>
            <CardTitle>Budget & Payout</CardTitle>
            <CardDescription>
              Set reward amount and maximum submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reward">
                  Reward per Submission ($) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reward"
                  type="number"
                  min="100"
                  step="50"
                  {...register("reward", { valueAsNumber: true })}
                />
                {errors.reward && (
                  <p className="text-sm text-destructive mt-1">{errors.reward.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="maxSubmissions">
                  Max Submissions <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="maxSubmissions"
                  type="number"
                  min="1"
                  {...register("maxSubmissions", { valueAsNumber: true })}
                />
                {errors.maxSubmissions && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.maxSubmissions.message}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Estimated Total Cost:</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalCost.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Base reward: ${((reward || 0) * (maxSubmissions || 0)).toLocaleString()}
                {totalAugmentationCost > 0 &&
                  ` + Augmentations: $${(totalAugmentationCost * (maxSubmissions || 0)).toLocaleString()}`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Domain Checkboxes */}
        <Card>
          <CardHeader>
            <CardTitle>Validation Domains</CardTitle>
            <CardDescription>
              Select domains for automated video validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {["retail", "healthcare", "logistics", "manufacturing", "office", "outdoor"].map(
                (domain) => (
                  <div key={domain} className="flex items-center space-x-2">
                    <Checkbox
                      id={domain}
                      checked={domains.includes(domain)}
                      onCheckedChange={() => toggleDomain(domain)}
                    />
                    <Label htmlFor={domain} className="capitalize cursor-pointer">
                      {domain}
                    </Label>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Acceptance Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Acceptance Criteria</CardTitle>
            <CardDescription>
              Define specific requirements for accepting submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="List your acceptance criteria (e.g., minimum resolution, required scenes, audio quality)..."
              rows={5}
              {...register("acceptanceCriteria")}
            />
            {errors.acceptanceCriteria && (
              <p className="text-sm text-destructive mt-1">
                {errors.acceptanceCriteria.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Augmentations */}
        <Card>
          <CardHeader>
            <CardTitle>Data Augmentations (Optional)</CardTitle>
            <CardDescription>
              Add AI-powered enhancements to collected videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(augmentationCosts).map(([key, cost]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={key}
                      checked={augmentations.includes(key)}
                      onCheckedChange={() => toggleAugmentation(key)}
                    />
                    <div>
                      <Label htmlFor={key} className="capitalize cursor-pointer font-medium">
                        {key.replace("-", " ")}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        +${cost} per submission
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Info className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Licensing */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Licensing</CardTitle>
            <CardDescription>
              Choose how your data can be used
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="licensing">
                License Type <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("licensing", value)}>
                <SelectTrigger id="licensing">
                  <SelectValue placeholder="Select license" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial Use</SelectItem>
                  <SelectItem value="research">Research Only</SelectItem>
                  <SelectItem value="internal">Internal Use Only</SelectItem>
                  <SelectItem value="custom">Custom License</SelectItem>
                </SelectContent>
              </Select>
              {errors.licensing && (
                <p className="text-sm text-destructive mt-1">{errors.licensing.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={isSubmitting}>
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

