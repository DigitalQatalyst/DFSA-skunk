import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import { DelayReasonData } from '../../../types/enterpriseOperations';

interface DelayReasonsChartProps {
  data: DelayReasonData[];
}

const DelayReasonsChart: React.FC<DelayReasonsChartProps> = ({ data }) => {
  // Sort by count descending and take top 5
  const top5Data = [...data].sort((a, b) => b.count - a.count).slice(0, 5);
  const totalDelays = top5Data.reduce((sum, item) => sum + item.count, 0);

  const getBarGradient = (index: number) => {
    const gradients = [
      { id: 'delayGrad0', colors: ['#ef4444', '#dc2626'] },
      { id: 'delayGrad1', colors: ['#f59e0b', '#d97706'] },
      { id: 'delayGrad2', colors: ['#eab308', '#ca8a04'] },
      { id: 'delayGrad3', colors: ['#84cc16', '#65a30d'] },
      { id: 'delayGrad4', colors: ['#10b981', '#059669'] }
    ];
    return gradients[index % gradients.length];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage = payload[0].payload.percentage;
      
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-gray-900 mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Delay Count</span>
              <span className="font-semibold text-gray-900">{value}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Percentage</span>
              <span className="font-semibold text-gray-900">{percentage.toFixed(1)}%</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">of Total Delays</span>
                <span className="text-xs font-medium text-gray-700">{totalDelays} total</span>
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
        <h3 className="text-lg font-semibold text-foreground mb-2">Delay Reasons for Your Services (Top 5)</h3>
        <p className="text-sm text-muted-foreground">
          Top 5 reasons for delays in your service deliveries
        </p>
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={top5Data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <defs>
            {top5Data.map((_, index) => {
              const grad = getBarGradient(index);
              return (
                <linearGradient key={grad.id} id={grad.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={grad.colors[0]} stopOpacity={1}/>
                  <stop offset="100%" stopColor={grad.colors[1]} stopOpacity={0.9}/>
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="reason" 
            stroke="#9ca3af" 
            fontSize={11}
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
            label={{ value: 'Delay Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Delay Count" radius={[6, 6, 0, 0]} animationDuration={800}>
            <LabelList
              dataKey="count"
              position="top"
              style={{ fill: '#111827', fontSize: 12, fontWeight: 600 }}
            />
            {top5Data.map((_entry, index) => {
              const grad = getBarGradient(index);
              return (
                <Cell key={`cell-${index}`} fill={`url(#${grad.id})`} />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DelayReasonsChart;

