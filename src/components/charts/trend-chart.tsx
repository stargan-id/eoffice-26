"use client";

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface TrendChartProps {
  data: Array<{ date: string; value: number; porsi?: number }>;
  height?: number;
  className?: string;
}

export function TrendChart({ data, height = 300, className }: TrendChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { 
              month: 'short', 
              day: 'numeric' 
            })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            strokeWidth={2}
            name="Kegiatan"
          />
          {data.some(d => d.porsi !== undefined) && (
            <Line 
              type="monotone" 
              dataKey="porsi" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Porsi"
            />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}