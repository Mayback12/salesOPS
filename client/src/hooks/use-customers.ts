import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '@/api/customers';
import toast from 'react-hot-toast';

export const useCustomers = (params?: any) => {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersApi.getAll(params),
  });

  const createCustomer = useMutation({
    mutationFn: (newCustomer: any) => customersApi.create(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add customer');
    },
  });

  const updateCustomer = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => customersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update customer');
    },
  });

  return {
    customers: customersQuery.data || [],
    isLoading: customersQuery.isLoading,
    createCustomer,
    updateCustomer,
  };
};
