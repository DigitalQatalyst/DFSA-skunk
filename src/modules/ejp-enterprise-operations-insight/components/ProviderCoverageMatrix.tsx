import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import { Button } from '../../../components/ui/button';
import { ProviderCoverageData } from '../../../types';
import { useProviderCoverage } from '../../../hooks/portfolio';
import { getServiceCategoryLabel } from '../../../utils/serviceCategoryMapping';

interface ProviderCoverageMatrixProps {
  data?: ProviderCoverageData[];
  onProviderClick?: (provider: string) => void;
  startDate?: string;
  endDate?: string;
  serviceCategory?: string;
  providerId?: string;
}

const ProviderCoverageMatrix: React.FC<ProviderCoverageMatrixProps> = ({ data: propData, onProviderClick, startDate, endDate, serviceCategory, providerId }) => {
  const { data: apiData, loading } = useProviderCoverage(startDate, endDate, serviceCategory, providerId);
  
  const matrixData = useMemo(() => {
    if (propData && Array.isArray(propData)) return { providers: [], subServices: [], coverageMatrix: propData };
    if (apiData && typeof apiData === 'object' && 'coverageMatrix' in apiData) return apiData;
    if (apiData && Array.isArray(apiData)) return { providers: [], subServices: [], coverageMatrix: apiData };
    return { providers: [], subServices: [], coverageMatrix: [] };
  }, [apiData, propData]);
  
  const data = Array.isArray(matrixData.coverageMatrix) ? matrixData.coverageMatrix : [];
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'volume' | 'services'>('volume');

  const providers = matrixData.providers.length > 0 ? matrixData.providers : [...new Set(data.map((item: any) => item.provider))];
  const subServiceColumns = matrixData.subServices.length > 0 
    ? matrixData.subServices.map(s => ({ code: s, label: getServiceCategoryLabel(s) }))
    : [...new Set((data || []).flatMap((item: any) => item.subServices || []))].map(s => ({ code: s, label: getServiceCategoryLabel(s) }));

  const getCellValue = (provider: string, subServiceCode: string | number) => {
    const providerData = data.find((item: any) => item.provider === provider);
    if (!providerData) return 0;
    const subServiceData = providerData.subServices?.find((s: any) => s.subService === subServiceCode);
    return subServiceData?.requestCount || 0;
  };
  
  const isHighVolume = (provider: string, subServiceCode: string | number) => {
    const providerData = data.find((item: any) => item.provider === provider);
    if (!providerData) return false;
    const subServiceData = providerData.subServices?.find((s: any) => s.subService === subServiceCode);
    return subServiceData?.isHighVolume || false;
  };

  const getCellColor = (value: number, highVolume: boolean) => {
    if (!value) return 'bg-gray-100';
    
    const allValues = data.flatMap((item: any) => item.subServices?.map((s: any) => s.requestCount) || []);
    const maxValue = Math.max(...allValues, 1);
    const intensity = value / maxValue;

    if (highVolume) {
      return intensity > 0.7 ? 'bg-blue-600' : intensity > 0.4 ? 'bg-blue-400' : 'bg-blue-300';
    }
    return intensity > 0.5 ? 'bg-green-500' : intensity > 0.3 ? 'bg-green-400' : 'bg-green-300';
  };

  const selectedCellData = null;

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Your Provider Coverage Matrix</h3>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'volume' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('volume')}
            >
              Volume
            </Button>
            <Button
              variant={viewMode === 'services' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('services')}
            >
              Services
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Which providers serve which of your services, highlighting your provider dependencies and quality risks
        </p>
      </div>

      {/* Legend */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>High Volume (Top 20%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Quality Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="MousePointer" size={14} />
            <span>Hover for details | Click to filter</span>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto overflow-y-auto max-h-96 mb-6">
        <div className="min-w-full">
          {/* Headers */}
          <div className="grid gap-1 mb-2 sticky top-0 bg-white z-10" style={{ gridTemplateColumns: `150px repeat(${subServiceColumns.length}, 140px)` }}>
            <div className="p-2 bg-white"></div>
            {subServiceColumns.map((sub, index) => (
              <div key={index} className="p-2 text-xs font-medium text-muted-foreground text-center bg-white">
                <div className="line-clamp-2 leading-tight">{sub.label || sub}</div>
              </div>
            ))}
          </div>
          
          {/* Rows */}
          {providers.map((provider, rowIndex) => (
            <div key={rowIndex} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `150px repeat(${subServiceColumns.length}, 140px)` }}>
              <div className="p-3 bg-gray-50 rounded-lg flex items-center sticky left-0 z-10 cursor-pointer hover:bg-gray-100"
                   onClick={() => onProviderClick?.(provider)}>
                <div className="text-sm font-medium text-foreground truncate">{provider}</div>
              </div>
              
              {subServiceColumns.map((sub, colIndex) => {
                const subCode = sub.code || sub;
                const value = getCellValue(provider, subCode);
                const highVolume = isHighVolume(provider, subCode);
                const cellKey = `${provider}-${subCode}`;
                
                return (
                  <div
                    key={colIndex}
                    className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                      getCellColor(value, highVolume)
                    } ${selectedCell === cellKey ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => {
                      setSelectedCell(cellKey);
                      if (value && onProviderClick) {
                        onProviderClick(provider);
                      }
                    }}
                    title={value ? `${provider} - ${sub.label || sub}: ${value} requests` : 'No data'}
                  >
                    {value ? (
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">{value}</div>
                        {highVolume && (
                          <div className="text-xs text-white opacity-90">▲</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-xs text-gray-400">-</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )}
      
      {!loading && providers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Icon name="Inbox" size={48} className="text-gray-300 mb-3" />
          <p className="text-muted-foreground">No provider coverage data available for the selected period</p>
        </div>
      )}
      
      {/* Selected Cell Details */}
      {selectedCellData && false && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Volume</div>
              <div className="font-medium">{selectedCellData.requestCount} requests</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Distinct Services</div>
              <div className="font-medium">{selectedCellData.distinctServices}</div>
            </div>
            {selectedCellData.onTimePercentage !== undefined && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">On-Time %</div>
                <div className="font-medium">{selectedCellData.onTimePercentage.toFixed(1)}%</div>
              </div>
            )}
            {selectedCellData.issueRate !== undefined && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Issue Rate</div>
                <div className="font-medium">{(selectedCellData.issueRate * 100).toFixed(1)}%</div>
              </div>
            )}
          </div>

          {selectedCellData.subServices?.length ? (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="text-xs text-muted-foreground mb-2">Sub-Services</div>
              <div className="flex flex-wrap gap-2">
                {selectedCellData.subServices.map((s, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ProviderCoverageMatrix;

