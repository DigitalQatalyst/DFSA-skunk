import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from 'recharts';
import { ServiceCSATData } from '../../../types/enterpriseOperations';

interface ServiceCSATChartProps {
  data: ServiceCSATData[];
}

const ServiceCSATChart: React.FC<ServiceCSATChartProps> = ({ data }) => {
  const averageCSAT = data.length > 0 ? data.reduce((sum, item) => sum + item.csat, 0) / data.length : 0;
  const targetCSAT = data.length > 0 ? data[0].target : 4.5;

  const getBarColor = (csat: number, target: number) => {
    if (csat >= target) return '#10b981'; // Meets or exceeds target - green
    if (csat >= target * 0.9) return '#f59e0b'; // Within 10% of target - amber
    return '#ef4444'; // Below target - red
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Your CSAT by Service</h3>
        <p className="text-sm text-muted-foreground">
          Your Customer Satisfaction (CSAT) ratings by service type with average and target benchmarks
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data.sort((a, b) => b.csat - a.csat)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="service" 
            stroke="#6b7280" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
            domain={[0, 5]}
            label={{ value: 'CSAT Score', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`${value.toFixed(2)} / 5.0`, 'CSAT']}
          />
          <ReferenceLine 
            y={averageCSAT} 
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{ value: `Average: ${averageCSAT.toFixed(2)}`, position: 'top' }}
          />
          <ReferenceLine 
            y={targetCSAT} 
            stroke="#10b981" 
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{ value: `Target: ${targetCSAT.toFixed(2)}`, position: 'top' }}
          />
          <Bar dataKey="csat" name="CSAT Score" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.csat, targetCSAT)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServiceCSATChart;

