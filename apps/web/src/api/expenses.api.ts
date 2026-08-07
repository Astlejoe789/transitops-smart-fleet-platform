import { apiClient } from './client';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const { data } = await apiClient.get('/api/expenses');
    return data;
  } catch (err) {
    console.error("Error fetching expenses:", err);
    return [];
  }
};

export const addExpense = async (expenseData: Partial<Expense>): Promise<Expense | null> => {
  try {
    const { data } = await apiClient.post('/api/expenses', expenseData);
    return data;
  } catch (err) {
    console.error("Error adding expense:", err);
    return null;
  }
};
