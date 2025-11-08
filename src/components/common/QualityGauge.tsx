"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface QualityGaugeProps {
  score: number; // 0-100
  label?: string;
  className?: string;
  showBreakdown?: boolean;
  breakdown?: {
    completeness: number; // out of 40
    relevance: number; // out of 25
    clarity: number; // out of 20
    consistency: number; // out of 15
  };
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e"; // green
  if (score >= 60) return "#eab308"; // yellow
  if (score >= 40) return "#f97316"; // orange
  return "#ef4444"; // red
}

export function QualityGauge({
  score,
  label = "Quality Score",
  className,
  showBreakdown = false,
  breakdown,
}: QualityGaugeProps) {
  const data = [
    { value: score, fill: getScoreColor(score) },
    { value: 100 - score, fill: "#e5e7eb" },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>
            {score}
          </div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>

      {showBreakdown && breakdown && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Score Breakdown</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completeness</span>
              <span className="font-medium">
                {breakdown.completeness}/40
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Relevance</span>
              <span className="font-medium">{breakdown.relevance}/25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Clarity</span>
              <span className="font-medium">{breakdown.clarity}/20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Consistency</span>
              <span className="font-medium">{breakdown.consistency}/15</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

