import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import { StageDurationData } from '../../../types/enterpriseOperations';

interface StageDurationChartProps {
  data: StageDurationData[];
}

const StageDurationChart: React.FC<StageDurationChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0);
      
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-gray-900 mb-3">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{entry.value.toFixed(1)} days</span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Total Duration</span>
                <span className="text-xs font-medium text-gray-700">{total.toFixed(1)} days</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Your Service Stage Duration Breakdown</h3>
        <p className="text-sm text-muted-foreground">
          Time spent in each delivery stage (Acceptance → WIP → Review → Completion) for your service requests by provider
        </p>
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <defs>
            <linearGradient id="acceptanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="wipGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
              <stop offset="100%" stopColor="#059669" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="reviewGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.9}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="provider" 
            stroke="#9ca3af" 
            fontSize={12}
            axisLine={false}
            tickLine={false}
            height={60}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280' }}
            label={{ value: 'Duration (days)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span style={{ color: '#374151', fontSize: '13px' }}>{value}</span>}
          />
          <Bar dataKey="acceptance" stackId="a" name="Acceptance" fill="url(#acceptanceGradient)" radius={[0, 0, 0, 0]} animationDuration={800} />
          <Bar dataKey="wip" stackId="a" name="Work in Progress" fill="url(#wipGradient)" radius={[0, 0, 0, 0]} animationDuration={800} />
          <Bar dataKey="review" stackId="a" name="Review" fill="url(#reviewGradient)" radius={[0, 0, 0, 0]} animationDuration={800} />
          <Bar dataKey="completion" stackId="a" name="Completion" fill="url(#completionGradient)" radius={[6, 6, 0, 0]} animationDuration={800}>
            <LabelList
              position="top"
              content={(props: any) => {
                const { x, y, width, value, viewBox, payload } = props;
                const total = (payload.acceptance || 0) + (payload.wip || 0) + (payload.review || 0) + (payload.completion || 0);
                if (total === 0) return null;
                const labelX = x + (width || 0) / 2;
                const labelY = (y || 0) - 6;
                return (
                  <text x={labelX} y={labelY} textAnchor="middle" fill="#111827" fontSize={12} fontWeight={600}>
                    {total.toFixed(1)}d
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StageDurationChart;

