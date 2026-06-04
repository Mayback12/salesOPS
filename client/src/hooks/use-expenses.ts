import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesApi } from '@/api/expenses';
import toast from 'react-hot-toast';

export const useExpenses = (params?: any) => {
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: ['expenses', params],
    queryFn: () => expensesApi.getAll(params),
  });

  const createExpense = useMutation({
    mutationFn: (data: any) => expensesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast.success('Expense recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record expense');
    },
  });

  const updateExpense = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => expensesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast.success('Expense updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update expense');
    },
  });

  return {
    expenses: expensesQuery.data || [],
    isLoading: expensesQuery.isLoading,
    createExpense,
    updateExpense,
  };
};
