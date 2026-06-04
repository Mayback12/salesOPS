import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtsApi } from '@/api/debts';
import toast from 'react-hot-toast';

export const useDebts = (params?: any) => {
  const queryClient = useQueryClient();

  const debtsQuery = useQuery({
    queryKey: ['debts', params],
    queryFn: () => debtsApi.getAll(params),
  });

  const recordPayment = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => debtsApi.recordPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast.success('Payment recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    },
  });

  return {
    debts: debtsQuery.data || [],
    isLoading: debtsQuery.isLoading,
    recordPayment,
  };
};
