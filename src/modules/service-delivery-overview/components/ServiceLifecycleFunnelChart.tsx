import React from 'react';
import { ResponsiveContainer, FunnelChart, Funnel, Tooltip, Cell, LabelList } from 'recharts';

type LifecycleStage = {
  name: string;
  value: number;
  fill: string;
  description?: string;
};

const ServiceLifecycleFunnelChart = () => {
  // Mock lifecycle funnel data (Requested → In Progress → Completed → Delivered)
  const lifecycleData: LifecycleStage[] = [
    { name: 'Request Initiated', value: 3400, fill: '#93c5fd', description: 'Total requests initiated' },
    { name: 'In Progress', value: 2950, fill: '#60a5fa', description: 'Requests currently being processed' },
    { name: 'Completed', value: 2820, fill: '#3b82f6', description: 'Requests completed by providers' },
    { name: 'Delivered', value: 2700, fill: '#1d4ed8', description: 'Requests delivered to enterprises' }
  ];

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0]?.payload as LifecycleStage;
      return (
        <div className="bg-white p-3 border border-border rounded-md shadow-sm">
          <div className="text-sm font-semibold text-card-foreground">{d?.name}</div>
          {d?.description && (
            <div className="text-xs text-muted-foreground mb-1">{d?.description}</div>
          )}
          <div className="text-base font-bold text-primary">{d?.value?.toLocaleString()}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <ResponsiveContainer width="100%" height={280}>
        <FunnelChart margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <Tooltip content={renderTooltip} />
          <Funnel dataKey="value" data={lifecycleData} isAnimationActive animationDuration={700}>
            {lifecycleData.map((s, i) => (
              <Cell key={`stage-${i}`} fill={s.fill} />
            ))}
            <LabelList 
              dataKey="name" 
              position="right" 
              style={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} 
            />
            <LabelList 
              dataKey="value" 
              position="center" 
              formatter={(v) => v?.toLocaleString?.() || v}
              style={{ fontSize: 14, fill: '#fff', fontWeight: 600 }} 
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </>
  );
};

export default ServiceLifecycleFunnelChart;


