import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useServiceDepth } from '../../../hooks/portfolio';
import { getServiceCategoryLabel } from '../../../utils/serviceCategoryMapping';

interface ServiceDepthData {
  service: string;
  requests: number;
  cumulativePercentage: number;
}

interface ServiceDepthChartProps {
  data?: ServiceDepthData[];
  startDate?: string;
  endDate?: string;
  serviceCategory?: string;
  providerId?: string;
}

const ServiceDepthChart: React.FC<ServiceDepthChartProps> = ({ data: propData, startDate, endDate, serviceCategory, providerId }) => {
  const { data: apiData, loading } = useServiceDepth(startDate, endDate, serviceCategory, providerId);

  const data = useMemo(() => {
    // Only use propData if apiData is not available (initial state)
    if (propData && !apiData) return propData;
    const serviceDepth = apiData?.serviceDepth || [];
    let cumulative = 0;
    return serviceDepth.map((item: any) => {
      cumulative += item.percentage;
      return {
        service: getServiceCategoryLabel(item.subService),
        requests: item.requestCount,
        cumulativePercentage: cumulative
      };
    });
  }, [apiData, propData]);
  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#111827' },
        axisPointer: { type: 'cross' },
        formatter: (params: any[]) => {
          const label = params?.[0]?.axisValue || '';
          const req = params.find(p => p.seriesName === 'Requests')?.data ?? 0;
          const cum = params.find(p => p.seriesName === 'Cumulative %')?.data ?? 0;
          const isCore = Number(cum) <= 80;
          return [
            `<div style="margin-bottom:6px;font-weight:600">${label}</div>`,
            `<div style="display:flex;justify-content:space-between;gap:12px"><span>Requests</span><span style="font-weight:600">${req}</span></div>`,
            `<div style="display:flex;justify-content:space-between;gap:12px"><span>Cumulative %</span><span style="font-weight:600">${Number(cum).toFixed(1)}%</span></div>`,
            `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between"><span style="color:#6b7280;font-size:12px">Portfolio Type</span><span style="font-size:12px;color:${isCore ? '#059669' : '#4b5563'}">${isCore ? 'Core (80/20)' : 'Supporting'}</span></div>`
          ].join('');
        }
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#374151' }
      },
      grid: { left: 56, right: 56, top: 32, bottom: 140 },
      xAxis: {
        type: 'category',
        data: data.map(d => d.service),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { 
          color: '#6b7280', 
          rotate: 45, 
          margin: 16,
          fontSize: 11,
          interval: 0
        }
      },
      yAxis: [
        {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#6b7280' },
          splitLine: { lineStyle: { color: '#f3f4f6' } },
          name: 'Requests',
          nameLocation: 'middle',
          nameGap: 45,
          nameTextStyle: { color: '#6b7280' }
        }
      ],
      series: [
        {
          name: 'Requests',
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            color: '#1f2937'
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#2563eb' }
              ]
            },
            borderRadius: [6, 6, 0, 0]
          },
          data: data.map(d => d.requests)
        }
      ]
    };
  }, [data]);

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Your Service Depth (Pareto 80/20)</h3>
        <p className="text-sm text-muted-foreground">
          Your service request concentration showing which services you use most (80/20 analysis)
        </p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center" style={{ height: 450 }}>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center" style={{ height: 450 }}>
          <p className="text-muted-foreground">No service depth data available for the selected period</p>
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: 450, width: '100%' }} />
      )}
    </div>
  );
};

export default ServiceDepthChart;

