import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => reportsApi.getSummary(),
  });
};

export const useRevenueChart = () => {
  return useQuery({
    queryKey: ['revenue-chart'],
    queryFn: () => reportsApi.getDailyChart(),
  });
};

export const useBusinessReport = (params?: any) => {
  return useQuery({
    queryKey: ['business-report', params],
    queryFn: () => reportsApi.getBusinessReport(params),
  });
};
