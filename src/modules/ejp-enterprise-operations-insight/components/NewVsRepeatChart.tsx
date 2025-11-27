import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useNewVsRepeatOverTime } from '../../../hooks/portfolio';

interface NewVsRepeatChartProps {
  year?: number;
  serviceCategory?: string;
  providerId?: string;
}

const NewVsRepeatChart: React.FC<NewVsRepeatChartProps> = ({ year, serviceCategory, providerId }) => {
  const selectedYear = year || new Date().getFullYear();
  const { data: apiData, loading } = useNewVsRepeatOverTime(selectedYear, serviceCategory, providerId);

  const data = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: { [key: string]: { new: number; repeat: number } } = {};
    
    if (apiData && Array.isArray(apiData)) {
      apiData.forEach((item: any) => {
        const monthName = new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' });
        monthlyData[monthName] = {
          new: item.newRequests,
          repeat: item.repeatRequests
        };
      });
    }
    
    return months.map(month => ({
      month,
      new: monthlyData[month]?.new || 0,
      repeat: monthlyData[month]?.repeat || 0
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
        axisPointer: { type: 'shadow' },
        formatter: (params: any[]) => {
          const label = params?.[0]?.axisValue || '';
          const newVal = params.find(p => p.seriesName === 'New Requests')?.data ?? 0;
          const repVal = params.find(p => p.seriesName === 'Repeat Requests')?.data ?? 0;
          const total = Number(newVal) + Number(repVal);
          const repeatRate = total > 0 ? ((Number(repVal) / total) * 100).toFixed(1) : '0.0';
          return [
            `<div style="margin-bottom:6px;font-weight:600">${label}</div>`,
            `<div style="display:flex;justify-content:space-between;gap:12px"><span><span style="display:inline-block;width:8px;height:8px;background:#3b82f6;margin-right:6px"></span>New Requests</span><span style="font-weight:600">${newVal}</span></div>`,
            `<div style="display:flex;justify-content:space-between;gap:12px"><span><span style="display:inline-block;width:8px;height:8px;background:#10b981;margin-right:6px"></span>Repeat Requests</span><span style="font-weight:600">${repVal}</span></div>`,
            `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #e5e7eb"><div style="display:flex;justify-content:space-between;color:#6b7280;font-size:12px"><span>Total Requests</span><span style="color:#374151">${total}</span></div><div style="display:flex;justify-content:space-between;color:#6b7280;font-size:12px"><span>Repeat Rate</span><span style="color:#059669">${repeatRate}%</span></div></div>`
          ].join('');
        }
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#374151' }
      },
      grid: { left: 48, right: 24, top: 32, bottom: 64 },
      xAxis: {
        type: 'category',
        data: data.map(d => d.month),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
        name: 'Number of Requests',
        nameLocation: 'middle',
        nameGap: 45,
        nameTextStyle: { color: '#6b7280' }
      },
      series: [
        {
          name: 'New Requests',
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            color: '#1f2937'
          },
          emphasis: { focus: 'series' },
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
          data: data.map(d => d.new)
        },
        {
          name: 'Repeat Requests',
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            color: '#1f2937'
          },
          emphasis: { focus: 'series' },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#10b981' },
                { offset: 1, color: '#059669' }
              ]
            },
            borderRadius: [6, 6, 0, 0]
          },
          data: data.map(d => d.repeat)
        }
      ]
    };
  }, [data]);

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">New vs Repeat Requests Over Time</h3>
        <p className="text-sm text-muted-foreground">
          Your first-time service requests compared to repeat service usage shown by month for the selected year
        </p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center" style={{ height: 450 }}>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : data.every((d: any) => d.new === 0 && d.repeat === 0) ? (
        <div className="flex flex-col items-center justify-center" style={{ height: 450 }}>
          <p className="text-muted-foreground">No new vs repeat data available for the selected period</p>
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: 450, width: '100%' }} />
      )}
    </div>
  );
};

export default NewVsRepeatChart;

