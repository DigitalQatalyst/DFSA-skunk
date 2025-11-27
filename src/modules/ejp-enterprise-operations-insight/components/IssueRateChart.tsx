import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine, LabelList } from 'recharts';
import { ProviderIssueRateData } from '../../../types/enterpriseOperations';

interface IssueRateChartProps {
  data: ProviderIssueRateData[];
}

const IssueRateChart: React.FC<IssueRateChartProps> = ({ data }) => {
  const getBarGradient = (rate: number) => {
    if (rate <= 0.02) return 'url(#issueExcellentGradient)'; // Excellent - < 2%
    if (rate <= 0.05) return 'url(#issueGoodGradient)'; // Good - 2-5%
    if (rate <= 0.10) return 'url(#issueAcceptableGradient)'; // Acceptable - 5-10%
    return 'url(#issuePoorGradient)'; // Poor - > 10%
  };

  const getBarStroke = (rate: number) => {
    if (rate <= 0.02) return '#10b981';
    if (rate <= 0.05) return '#3b82f6';
    if (rate <= 0.10) return '#f59e0b';
    return '#ef4444';
  };

  const getStatus = (rate: number) => {
    if (rate <= 0.02) return 'Excellent';
    if (rate <= 0.05) return 'Good';
    if (rate <= 0.10) return 'Acceptable';
    return 'Needs Attention';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const issues = payload[0].payload.issues;
      const requests = payload[0].payload.requests;
      const status = getStatus(value);
      
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-gray-900 mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Issue Rate</span>
              <span className="font-semibold text-gray-900">{(value * 100).toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Issues</span>
              <span className="font-semibold text-gray-900">{issues}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Total Requests</span>
              <span className="font-semibold text-gray-900">{requests}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <span className="text-xs font-medium text-gray-700">{status}</span>
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
        <h3 className="text-lg font-semibold text-foreground mb-2">Issue Rate by Your Providers</h3>
        <p className="text-sm text-muted-foreground">
          Issue rate (Issues / Requests) for your service requests by each provider
        </p>
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart 
          data={data.sort((a, b) => b.issueRate - a.issueRate)} 
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <defs>
            <linearGradient id="issueExcellentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
              <stop offset="100%" stopColor="#059669" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="issueGoodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="issueAcceptableGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="issuePoorGradient" x1="0" y1="0" x2="0" y2="1">
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
            angle={-45}
            textAnchor="end"
            height={90}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280' }}
            label={{ value: 'Issue Rate', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          {/* Removed target threshold line per request */}
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="issueRate" name="Issue Rate" radius={[6, 6, 0, 0]} animationDuration={800}>
            <LabelList
              dataKey="issueRate"
              position="top"
              formatter={(v: number) => `${(Number(v) * 100).toFixed(1)}%`}
              style={{ fill: '#111827', fontSize: 12, fontWeight: 600 }}
            />
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarGradient(entry.issueRate)}
                stroke={getBarStroke(entry.issueRate)}
                strokeWidth={2}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IssueRateChart;

