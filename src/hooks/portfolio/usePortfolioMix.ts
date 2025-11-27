import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../config/analytics_api';
import { useOrganizationInfo } from '../useOrganizationInfo';

interface PortfolioMixData {
  financialDeliveries: number;
  nonFinancialDeliveries: number;
  totalDeliveries: number;
  finSharePercentage: number;
  nonFinSharePercentage: number;
}

interface PortfolioMixResponse {
  success: boolean;
  data: PortfolioMixData;
  kpi: string;
  description: string;
}

export const usePortfolioMix = (groupBy?: 'month', startDate?: string, endDate?: string, serviceCategory?: string, providerId?: string) => {
  const { organization } = useOrganizationInfo();
  const azureId = organization?.azureid;

  return useQuery<PortfolioMixData>({
    queryKey: ['portfolioMix', azureId, groupBy, startDate, endDate, serviceCategory, providerId],
    queryFn: async () => {
      console.log('🔵 [PORTFOLIO MIX] Fetching data for azureId:', azureId);
      console.log('🔵 [PORTFOLIO MIX] Organization:', organization);
      const params = new URLSearchParams({ azureId: azureId! });
      if (groupBy) params.append('groupBy', groupBy);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (serviceCategory && serviceCategory !== 'all') params.append('serviceCategory', serviceCategory);
      if (providerId && providerId !== 'all') params.append('providerId', providerId);
      
      const url = `${API_BASE_URL}/api/portfolio/portfolio-mix/?${params}`;
      console.log('🔵 [PORTFOLIO MIX] Request URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch portfolio mix');
      
      const result: PortfolioMixResponse = await response.json();
      console.log('🔵 [PORTFOLIO MIX] Response:', result);
      console.log('🔵 [PORTFOLIO MIX] Data:', result.data);
      return result.data;
    },
    enabled: !!azureId,
  });
};
