import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '@/api/sales';
import toast from 'react-hot-toast';

export const useSales = () => {
  const queryClient = useQueryClient();

  const salesQuery = useQuery({
    queryKey: ['sales'],
    queryFn: () => salesApi.getAll(),
  });

  const createSale = useMutation({
    mutationFn: (newSale: any) => salesApi.create(newSale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast.success('Sale recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record sale');
    },
  });

  return {
    sales: salesQuery.data || [],
    isLoading: salesQuery.isLoading,
    createSale,
  };
};
