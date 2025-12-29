import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';

type DailyPoint = { date: string; avgHours: number };

const AverageResponseTimeChart = () => {
  // Mock daily average response times (in hours)
  const dailyData: DailyPoint[] = [
    { date: 'Jun 1', avgHours: 2.3 },
    { date: 'Jun 2', avgHours: 2.0 },
    { date: 'Jun 3', avgHours: 1.9 },
    { date: 'Jun 4', avgHours: 2.2 },
    { date: 'Jun 5', avgHours: 1.8 },
    { date: 'Jun 6', avgHours: 1.6 },
    { date: 'Jun 7', avgHours: 1.5 },
    { date: 'Jun 8', avgHours: 1.6 },
    { date: 'Jun 9', avgHours: 1.7 },
    { date: 'Jun 10', avgHours: 1.8 },
    { date: 'Jun 11', avgHours: 1.7 },
    { date: 'Jun 12', avgHours: 1.6 },
    { date: 'Jun 13', avgHours: 1.5 },
    { date: 'Jun 14', avgHours: 1.5 }
  ];

  return (
    <>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af" 
            style={{ fontSize: '12px' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            style={{ fontSize: '12px' }} 
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="avgHours" 
            stroke="#14b8a6" 
            strokeWidth={3}
            dot={{ fill: '#14b8a6', r: 5, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
            name="Avg Response Time (hrs)" 
          >
            <LabelList dataKey="avgHours" position="top" formatter={(v) => `${v.toFixed(1)}h`} style={{ fontSize: 12, fill: '#374151' }} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default AverageResponseTimeChart;


