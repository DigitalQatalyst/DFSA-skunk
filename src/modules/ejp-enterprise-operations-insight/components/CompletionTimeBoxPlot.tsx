import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, LabelList } from 'recharts';
import { ProviderCompletionTimeData } from '../../../types/enterpriseOperations';

interface CompletionTimeBoxPlotProps {
  data: ProviderCompletionTimeData[];
}

const CompletionTimeBoxPlot: React.FC<CompletionTimeBoxPlotProps> = ({ data }) => {
  // Transform data for box plot visualization using bar chart
  const boxPlotData = data.map(item => ({
    provider: item.provider,
    min: item.min,
    q1: item.q1,
    median: item.median,
    q3: item.q3,
    max: item.max,
    mean: item.mean,
    iqr: item.q3 - item.q1,
    lowerWhisker: Math.max(item.min, item.q1 - 1.5 * (item.q3 - item.q1)),
    upperWhisker: Math.min(item.max, item.q3 + 1.5 * (item.q3 - item.q1))
  }));

  // Custom tooltip for box plot
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div>Min: <span className="font-medium">{data.min.toFixed(1)} days</span></div>
            <div>Q1: <span className="font-medium">{data.q1.toFixed(1)} days</span></div>
            <div>Median: <span className="font-medium">{data.median.toFixed(1)} days</span></div>
            <div>Q3: <span className="font-medium">{data.q3.toFixed(1)} days</span></div>
            <div>Max: <span className="font-medium">{data.max.toFixed(1)} days</span></div>
            <div>Mean: <span className="font-medium">{data.mean.toFixed(1)} days</span></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Completion Time by Your Providers</h3>
        <p className="text-sm text-muted-foreground">
          Completion time distribution for your service requests by each provider (min, Q1, median, Q3, max)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={boxPlotData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="provider" 
            stroke="#6b7280" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
            label={{ value: 'Completion Time (days)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#e5e7eb" />
          
          {/* Box plot visualization using multiple bars */}
          {/* Q1 to Q3 (box) */}
          <Bar dataKey="iqr" stackId="box" fill="#3b82f6" radius={[0, 0, 0, 0]} >
            <LabelList
              position="top"
              content={(props: any) => {
                const { x, y, width, payload } = props;
                const labelX = x + (width || 0) / 2;
                const labelY = (y || 0) - 6;
                return (
                  <text x={labelX} y={labelY} textAnchor="middle" fill="#111827" fontSize={12} fontWeight={600}>
                    {payload?.median?.toFixed(1)}d
                  </text>
                );
              }}
            />
          </Bar>
          {/* Median line - shown as a reference line per provider */}
          {boxPlotData.map((item, index) => (
            <ReferenceLine
              key={`median-${index}`}
              x={item.provider}
              y={item.median}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="3 3"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletionTimeBoxPlot;

