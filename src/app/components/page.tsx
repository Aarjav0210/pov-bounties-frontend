"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/DataStates";
import { Steps } from "@/components/common/Steps";
import { FileUploader, FileWithProgress } from "@/components/common/FileUploader";
import { KpiCard } from "@/components/common/KpiCard";
import { DonutChart } from "@/components/common/DonutChart";
import { QualityGauge } from "@/components/common/QualityGauge";
import { Inbox, DollarSign, Users, TrendingUp } from "lucide-react";

export default function ComponentsPage() {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [showEmpty, setShowEmpty] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const steps = [
    { id: "1", label: "Domain Check", state: "passed" as const, description: "Video domain verified" },
    { id: "2", label: "Scene Parsing", state: "running" as const, progress: 60, description: "Analyzing scenes..." },
    { id: "3", label: "VLM Classification", state: "idle" as const },
    { id: "4", label: "Supervisor Verify", state: "idle" as const },
  ];

  const donutData = [
    { name: "Tech", value: 30, color: "#3b82f6" },
    { name: "Healthcare", value: 25, color: "#10b981" },
    { name: "Finance", value: 20, color: "#f59e0b" },
    { name: "Retail", value: 15, color: "#ef4444" },
    { name: "Other", value: 10, color: "#8b5cf6" },
  ];

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Component Showcase</h1>
        <p className="text-muted-foreground">
          A comprehensive preview of all shared UI primitives
        </p>
      </div>

      <Separator />

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex gap-4 flex-wrap mt-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <Separator />

      {/* KPI Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">KPI Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Bounties"
            value="1,234"
            icon={Inbox}
            trend={{ value: 12.5, label: "from last month" }}
          />
          <KpiCard
            title="Total Revenue"
            value="$45,231"
            icon={DollarSign}
            trend={{ value: -5.2, label: "from last month" }}
          />
          <KpiCard title="Active Users" value="573" icon={Users} />
          <KpiCard title="Growth Rate" value="28%" icon={TrendingUp} />
        </div>
      </section>

      <Separator />

      {/* Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Steps</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Vertical Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <Steps steps={steps} orientation="vertical" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Horizontal Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <Steps steps={steps} orientation="horizontal" />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* File Uploader */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">File Uploader</h2>
        <Card>
          <CardHeader>
            <CardTitle>Upload Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader
              accept="video/*"
              maxSize={100 * 1024 * 1024}
              maxFiles={3}
              files={files}
              onFilesSelected={(newFiles) => {
                setFiles([
                  ...files,
                  ...newFiles.map((file) => ({ file, progress: 0 })),
                ]);
              }}
              onFileRemove={(index) => {
                setFiles(files.filter((_, i) => i !== index));
              }}
            />
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Charts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Donut Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart data={donutData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quality Gauge</CardTitle>
            </CardHeader>
            <CardContent>
              <QualityGauge
                score={85}
                showBreakdown
                breakdown={{
                  completeness: 36,
                  relevance: 22,
                  clarity: 18,
                  consistency: 9,
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Data States */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Data States</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setShowEmpty(!showEmpty)} variant="outline">
              Toggle Empty
            </Button>
            <Button onClick={() => setShowError(!showError)} variant="outline">
              Toggle Error
            </Button>
            <Button
              onClick={() => setShowLoading(!showLoading)}
              variant="outline"
            >
              Toggle Loading
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Empty State</CardTitle>
            </CardHeader>
            <CardContent>
              {showEmpty && (
                <EmptyState
                  title="No bounties found"
                  description="Get started by creating your first bounty"
                  action={{
                    label: "Create Bounty",
                    onClick: () => alert("Creating bounty..."),
                  }}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error State</CardTitle>
            </CardHeader>
            <CardContent>
              {showError && (
                <ErrorState
                  message="Failed to load bounties. Please check your connection."
                  retry={() => alert("Retrying...")}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loading State</CardTitle>
            </CardHeader>
            <CardContent>
              {showLoading && <LoadingSkeleton rows={5} />}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
