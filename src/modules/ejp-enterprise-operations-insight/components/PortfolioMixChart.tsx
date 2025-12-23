import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { usePortfolioMixOverTime } from '../../../hooks/portfolio';

interface PortfolioMixChartProps {
  startDate?: string;
  endDate?: string;
  serviceCategory?: string;
  providerId?: string;
}

const PortfolioMixChart: React.FC<PortfolioMixChartProps> = ({ startDate, endDate, serviceCategory, providerId }) => {
  const { data: apiData, loading } = usePortfolioMixOverTime(startDate, endDate, serviceCategory, providerId);

  const data = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: { [key: string]: { financial: number; nonFinancial: number } } = {};
    
    if (apiData && Array.isArray(apiData)) {
      apiData.forEach((item: any) => {
        const monthName = new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' });
        monthlyData[monthName] = {
          financial: item.finSharePercentage,
          nonFinancial: item.nonFinSharePercentage
        };
      });
    }
    
    return months.map(month => ({
      date: month,
      financial: monthlyData[month]?.financial || 0,
      nonFinancial: monthlyData[month]?.nonFinancial || 0
    }));
  }, [apiData]);

  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#111827' },
        formatter: (params: any[]) => {
          const label = params?.[0]?.axisValue || '';
          const fin = params.find(p => p.seriesName === 'Financial Services')?.data ?? 0;
          const nonFin = params.find(p => p.seriesName === 'Non-Financial Services')?.data ?? 0;
          return [
            `<div style="margin-bottom:6px;font-weight:600">${label}</div>`,
            `<div style="display:flex;justify-content:space-between;gap:12px"><span><span style="display:inline-block;width:8px;height:8px;background:#10b981;border-radius:50%;margin-right:6px"></span>Financial</span><span style="font-weight:600">${Number(fin).toFixed(1)}%</span></div>`,
            `<div style="display:flex;justify-content:space-between;gap:12px"><span><span style="display:inline-block;width:8px;height:8px;background:#3b82f6;border-radius:50%;margin-right:6px"></span>Non-Financial</span><span style="font-weight:600">${Number(nonFin).toFixed(1)}%</span></div>`,
            `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between"><span style="color:#6b7280;font-size:12px">Total</span><span style="color:#374151;font-size:12px">100%</span></div>`
          ].join('');
        }
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        textStyle: { color: '#374151' }
      },
      grid: { left: 48, right: 24, top: 32, bottom: 64 },
      xAxis: {
        type: 'category',
        data: data.map(d => d.date),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
        name: 'Percentage (%)',
        nameLocation: 'middle',
        nameGap: 45,
        nameTextStyle: { color: '#6b7280' }
      },
      series: [
        {
          name: 'Financial Services',
          type: 'line',
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          labelLayout: { hideOverlap: true },
          label: {
            show: true,
            position: 'top',
            color: '#10b981',
            formatter: ({ value }: any) => `${Number(value).toFixed(0)}%`,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16,185,129,0.9)' },
                { offset: 0.5, color: 'rgba(16,185,129,0.6)' },
                { offset: 1, color: 'rgba(16,185,129,0.15)' }
              ]
            }
          },
          smooth: true,
          lineStyle: { width: 3, color: '#10b981' },
          data: data.map(d => d.financial),
          emphasis: { focus: 'series' }
        },
        {
          name: 'Non-Financial Services',
          type: 'line',
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          labelLayout: { hideOverlap: true },
          label: {
            show: true,
            position: 'top',
            color: '#3b82f6',
            formatter: ({ value }: any) => `${Number(value).toFixed(0)}%`,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59,130,246,0.9)' },
                { offset: 0.5, color: 'rgba(59,130,246,0.6)' },
                { offset: 1, color: 'rgba(59,130,246,0.15)' }
              ]
            }
          },
          smooth: true,
          lineStyle: { width: 3, color: '#3b82f6' },
          data: data.map(d => d.nonFinancial),
          emphasis: { focus: 'series' }
        }
      ]
    };
  }, [data]);

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm" style={{ height: '600px' }}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Your Portfolio Mix Over Time</h3>
        <p className="text-sm text-muted-foreground">
          Your service requests split by Financial vs Non-Financial services over time
        </p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center" style={{ height: 450 }}>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : data.length === 0 || data.every((d: any) => d.financial === 0 && d.nonFinancial === 0) ? (
        <div className="flex flex-col items-center justify-center" style={{ height: 450 }}>
          <p className="text-muted-foreground">No portfolio mix data available for the selected period</p>
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: 450, width: '100%' }} />
      )}
    </div>
  );
};

export default PortfolioMixChart;

