import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Button } from '../../../components/ui/button';

const EfficiencyMatrixHeatmap = ({ benchmarkType = 'standard', partnerType = 'all' }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [matrixView, setMatrixView] = useState('efficiency'); // efficiency, sla

  // Partner efficiency matrix data
  const matrixData = {
    efficiency: [
      { partner: 'ADCB', category: 'Financing & Loans', value: 98.5, volume: 127, benchmark: 95 },
      { partner: 'ADCB', category: 'Credit Enablement', value: 96.8, volume: 89, benchmark: 90 },
      { partner: 'ADCB', category: 'Equity/Investment', value: 94.2, volume: 34, benchmark: 85 },
      { partner: 'FAB', category: 'Financing & Loans', value: 95.2, volume: 134, benchmark: 95 },
      { partner: 'FAB', category: 'Credit Enablement', value: 93.7, volume: 67, benchmark: 90 },
      { partner: 'FAB', category: 'Grants/Subsidies', value: 97.1, volume: 45, benchmark: 88 },
      { partner: 'Flat6Labs', category: 'Incubation/Acceleration', value: 97.8, volume: 89, benchmark: 90 },
      { partner: 'Flat6Labs', category: 'Advisory & Mentorship', value: 95.6, volume: 76, benchmark: 85 },
      { partner: 'Flat6Labs', category: 'Training & Capacity', value: 94.3, volume: 52, benchmark: 82 },
      { partner: 'ADCCI', category: 'Market Access', value: 96.9, volume: 156, benchmark: 88 },
      { partner: 'ADCCI', category: 'Advisory & Mentorship', value: 93.4, volume: 98, benchmark: 85 },
      { partner: 'ADCCI', category: 'Specialist Clinics', value: 95.7, volume: 87, benchmark: 80 },
      { partner: 'AUB', category: 'Training & Capacity', value: 94.6, volume: 78, benchmark: 82 },
      { partner: 'AUB', category: 'Advisory & Mentorship', value: 92.8, volume: 65, benchmark: 85 },
      { partner: 'AUB', category: 'Specialist Clinics', value: 91.5, volume: 43, benchmark: 80 },
      { partner: 'RAKBANK', category: 'Financing & Loans', value: 93.8, volume: 92, benchmark: 95 },
      { partner: 'RAKBANK', category: 'Credit Enablement', value: 91.2, volume: 56, benchmark: 90 },
      { partner: 'RAKBANK', category: 'Grants/Subsidies', value: 94.9, volume: 38, benchmark: 88 }
    ],
    sla: [
      { partner: 'ADCB', category: 'Financing & Loans', value: 6.8, volume: 127, benchmark: 7.2 },
      { partner: 'ADCB', category: 'Credit Enablement', value: 5.2, volume: 89, benchmark: 5.8 },
      { partner: 'ADCB', category: 'Equity/Investment', value: 11.5, volume: 34, benchmark: 12.5 },
      { partner: 'FAB', category: 'Financing & Loans', value: 7.5, volume: 134, benchmark: 7.2 },
      { partner: 'FAB', category: 'Credit Enablement', value: 6.1, volume: 67, benchmark: 5.8 },
      { partner: 'FAB', category: 'Grants/Subsidies', value: 3.8, volume: 45, benchmark: 4.2 },
      { partner: 'Flat6Labs', category: 'Incubation/Acceleration', value: 8.2, volume: 89, benchmark: 9.5 },
      { partner: 'Flat6Labs', category: 'Advisory & Mentorship', value: 1.8, volume: 76, benchmark: 2.1 },
      { partner: 'Flat6Labs', category: 'Training & Capacity', value: 4.9, volume: 52, benchmark: 5.3 },
      { partner: 'ADCCI', category: 'Market Access', value: 4.2, volume: 156, benchmark: 4.7 },
      { partner: 'ADCCI', category: 'Advisory & Mentorship', value: 2.5, volume: 98, benchmark: 2.1 },
      { partner: 'ADCCI', category: 'Specialist Clinics', value: 1.5, volume: 87, benchmark: 1.8 },
      { partner: 'AUB', category: 'Training & Capacity', value: 5.8, volume: 78, benchmark: 5.3 },
      { partner: 'AUB', category: 'Advisory & Mentorship', value: 2.7, volume: 65, benchmark: 2.1 },
      { partner: 'AUB', category: 'Specialist Clinics', value: 2.1, volume: 43, benchmark: 1.8 },
      { partner: 'RAKBANK', category: 'Financing & Loans', value: 8.1, volume: 92, benchmark: 7.2 },
      { partner: 'RAKBANK', category: 'Credit Enablement', value: 6.8, volume: 56, benchmark: 5.8 },
      { partner: 'RAKBANK', category: 'Grants/Subsidies', value: 4.5, volume: 38, benchmark: 4.2 }
    ]
  };

  const currentData = matrixData?.[matrixView] || matrixData?.efficiency;
  
  const partners = [...new Set(currentData?.map(item => item?.partner))];
  const categories = [...new Set(currentData?.map(item => item?.category))];

  const getValueColor = (value, benchmark, viewType) => {
    let performanceRatio;
    
    if (viewType === 'sla') {
      // For SLA (lower is better)
      performanceRatio = benchmark / value;
    } else {
      // For efficiency (higher is better)
      performanceRatio = value / benchmark;
    }
    
    if (performanceRatio >= 1.1) return 'bg-emerald-500'; // Excellent
    if (performanceRatio >= 1.05) return 'bg-emerald-400'; // Very Good
    if (performanceRatio >= 1.0) return 'bg-green-400'; // Good
    if (performanceRatio >= 0.95) return 'bg-yellow-400'; // Acceptable
    if (performanceRatio >= 0.9) return 'bg-orange-400'; // Below Par
    return 'bg-red-400'; // Poor
  };

  const getCellData = (partner, category) => {
    return currentData?.find(item => item?.partner === partner && item?.category === category);
  };

  const formatValue = (value, viewType) => {
    if (viewType === 'efficiency') return `${value}%`;
    if (viewType === 'sla') return `${value}d`;
    return value;
  };

  const getMetricLabel = () => {
    switch (matrixView) {
      case 'efficiency': return 'Efficiency Score';
      case 'sla': return 'SLA Performance';
      default: return 'Performance';
    }
  };

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-card-foreground truncate">Service Provider Performance Matrix</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {getMetricLabel()} heatmap across partner types and service categories
          </p>
        </div>
        
        {/* Matrix View Controls */}
        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg overflow-x-auto scrollbar-hide">
          <Button
            variant={matrixView === 'efficiency' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMatrixView('efficiency')}
            className="px-3 py-1 text-xs whitespace-nowrap"
          >
            Efficiency
          </Button>
          <Button
            variant={matrixView === 'sla' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMatrixView('sla')}
            className="px-3 py-1 text-xs whitespace-nowrap"
          >
            SLA
          </Button>
        </div>
      </div>

      {/* Legend moved to top with Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border min-w-fit">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <span className="text-sm font-medium text-card-foreground whitespace-nowrap">Performance vs Benchmark:</span>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-4 h-4 bg-emerald-500 rounded flex-shrink-0"></div>
              <span className="text-xs text-muted-foreground">Excellent</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-4 h-4 bg-green-400 rounded flex-shrink-0"></div>
              <span className="text-xs text-muted-foreground">Good</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-4 h-4 bg-yellow-400 rounded flex-shrink-0"></div>
              <span className="text-xs text-muted-foreground">Acceptable</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-4 h-4 bg-orange-400 rounded flex-shrink-0"></div>
              <span className="text-xs text-muted-foreground">Below Par</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-4 h-4 bg-red-400 rounded flex-shrink-0"></div>
              <span className="text-xs text-muted-foreground">Poor</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Icon name="MousePointer" size={14} className="flex-shrink-0" />
              <span>Click cells for details</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Activity" size={14} className="flex-shrink-0" />
              <span>Real-time partner performance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matrix Heatmap with Enhanced Scroll */}
      <div className="overflow-x-auto overflow-y-auto max-h-96 mb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="min-w-full">
          {/* Headers */}
          <div className="grid gap-1 mb-2 sticky top-0 bg-card z-10" style={{ gridTemplateColumns: `200px repeat(${categories?.length}, 120px)` }}>
            <div className="p-2 bg-card"></div>
            {categories?.map((category, index) => (
              <div key={index} className="p-2 text-xs font-medium text-muted-foreground text-center bg-card">
                <div className="line-clamp-2 leading-tight">
                  {category?.split(' ')?.[0]}
                  <br />
                  <span className="text-[10px]">{category?.split(' ')?.slice(1)?.join(' ')}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Matrix Rows */}
          {partners?.map((partner, rowIndex) => (
            <div key={rowIndex} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `200px repeat(${categories?.length}, 120px)` }}>
              {/* Partner Name */}
              <div className="p-3 bg-muted rounded-lg flex items-center sticky left-0 z-10">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-card-foreground truncate">{partner}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {partner?.includes('Labs') || partner?.includes('ADCCI') || partner?.includes('AUB') ? 'Capability' : 'Financial'}
                  </div>
                </div>
              </div>
              
              {/* Performance Cells */}
              {categories?.map((category, colIndex) => {
                const cellData = getCellData(partner, category);
                
                return (
                  <div
                    key={colIndex}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:z-20 ${
                      cellData ? getValueColor(cellData?.value, cellData?.benchmark, matrixView) : 'bg-gray-100'
                    } ${selectedCell === `${partner}-${category}` ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedCell(cellData ? `${partner}-${category}` : null)}
                  >
                    {cellData ? (
                      <div className="text-center">
                        <div className="text-sm font-bold text-white truncate">
                          {formatValue(cellData?.value, matrixView)}
                        </div>
                        <div className="text-xs text-white opacity-90 truncate">
                          Vol: {cellData?.volume}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-xs text-gray-400">N/A</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Cell Details */}
      {selectedCell && (
        <div className="p-4 bg-muted rounded-lg mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="Info" size={16} className="text-blue-600 flex-shrink-0" />
            <span className="font-medium text-card-foreground">Performance Details</span>
          </div>
          {(() => {
            const cellData = currentData?.find(item => `${item?.partner}-${item?.category}` === selectedCell);
            if (!cellData) return null;
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground">Partner & Service</div>
                  <div className="font-medium text-card-foreground truncate">{cellData?.partner}</div>
                  <div className="text-sm text-muted-foreground truncate">{cellData?.category}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground">Current vs Benchmark</div>
                  <div className="font-medium text-card-foreground truncate">
                    {formatValue(cellData?.value, matrixView)} vs {formatValue(cellData?.benchmark, matrixView)}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {matrixView === 'sla' 
                      ? cellData?.value <= cellData?.benchmark ? 'Meeting SLA' : 'SLA Breach'
                      : cellData?.value >= cellData?.benchmark ? 'Above Benchmark' : 'Below Benchmark'
                    }
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground">Service Volume</div>
                  <div className="font-medium text-card-foreground">{cellData?.volume} services</div>
                  <div className="text-xs text-muted-foreground">This period</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default EfficiencyMatrixHeatmap;