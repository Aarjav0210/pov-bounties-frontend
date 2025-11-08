"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export interface DonutData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutData[];
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  className,
}: DonutChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => {
              const item = entry.payload as unknown as DonutData;
              return `${value}: ${item.value}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && centerValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-2xl font-bold">{centerValue}</div>
          <div className="text-xs text-muted-foreground">{centerLabel}</div>
        </div>
      )}
    </div>
  );
}

