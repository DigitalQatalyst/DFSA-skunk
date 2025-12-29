import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Cell, LabelList } from 'recharts';
import { ProviderOnTimeDeliveryData } from '../../../types/enterpriseOperations';

interface OnTimeDeliveryChartProps {
  data: ProviderOnTimeDeliveryData[];
}

const OnTimeDeliveryChart: React.FC<OnTimeDeliveryChartProps> = ({ data }) => {
  const ejpAverage = data.length > 0 ? data.reduce((sum, item) => sum + item.onTimePercentage, 0) / data.length : 0;

  const getBarColor = (value: number, average: number) => {
    if (value >= average * 1.1) return 'url(#ontimeExcellentGradient)'; // Excellent - green
    if (value >= average) return 'url(#ontimeGoodGradient)'; // Good - blue
    if (value >= average * 0.9) return 'url(#ontimeAcceptableGradient)'; // Acceptable - amber
    return 'url(#ontimePoorGradient)'; // Poor - red
  };

  const getBarStroke = (value: number, average: number) => {
    if (value >= average * 1.1) return '#10b981';
    if (value >= average) return '#3b82f6';
    if (value >= average * 0.9) return '#f59e0b';
    return '#ef4444';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const diff = value - ejpAverage;
      const status = value >= ejpAverage * 1.1 ? 'Excellent' : 
                     value >= ejpAverage ? 'Good' : 
                     value >= ejpAverage * 0.9 ? 'Acceptable' : 'Needs Improvement';
      
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-gray-900 mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">On-Time Delivery</span>
              <span className="font-semibold text-gray-900">{value.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">vs EJP Average</span>
              <span className={`font-semibold ${diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
              </span>
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
        <h3 className="text-lg font-semibold text-foreground mb-2">On-Time Delivery by Your Providers</h3>
        <p className="text-sm text-muted-foreground">
          On-time delivery performance for your service requests by each provider, compared to EJP platform average
        </p>
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart 
          data={data.sort((a, b) => b.onTimePercentage - a.onTimePercentage)} 
          layout="vertical"
          margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
        >
          <defs>
            <linearGradient id="ontimeExcellentGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
              <stop offset="100%" stopColor="#059669" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="ontimeGoodGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="ontimeAcceptableGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="ontimePoorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.9}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            stroke="#9ca3af" 
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280' }}
            label={{ value: 'On-Time Delivery %', position: 'insideBottom', offset: -5, style: { fill: '#6b7280' } }}
          />
          <YAxis 
            type="category" 
            dataKey="provider" 
            stroke="#9ca3af" 
            fontSize={12}
            width={110}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#374151', fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Removed target reference line per request */}
          <Bar 
            dataKey="onTimePercentage" 
            name="On-Time Delivery %" 
            radius={[0, 8, 8, 0]}
            animationDuration={800}
          >
            <LabelList
              dataKey="onTimePercentage"
              position="right"
              formatter={(v: number) => `${Number(v).toFixed(1)}%`}
              style={{ fill: '#111827', fontSize: 12, fontWeight: 600 }}
            />
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.onTimePercentage, ejpAverage)}
                stroke={getBarStroke(entry.onTimePercentage, ejpAverage)}
                strokeWidth={2}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OnTimeDeliveryChart;

