import { Transaction, Budget } from '@/types/finance';

const TRANSACTIONS_KEY = 'finance-transactions';
const BUDGETS_KEY = 'finance-budgets';

export const saveTransactions = (transactions: Transaction[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }
};

export const loadTransactions = (): Transaction[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const saveBudgets = (budgets: Budget[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  }
};

export const loadBudgets = (): Budget[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(BUDGETS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const generateSampleData = (): Transaction[] => {
  const sampleTransactions: Transaction[] = [
    {
      id: '1',
      amount: 3500,
      description: 'Monthly Salary',
      date: '2024-01-15',
      category: 'salary',
      type: 'income',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      amount: 45.50,
      description: 'Grocery Store',
      date: '2024-01-10',
      category: 'food',
      type: 'expense',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      amount: 120.00,
      description: 'Gas Bill',
      date: '2024-01-08',
      category: 'bills',
      type: 'expense',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      amount: 25.00,
      description: 'Movie Tickets',
      date: '2024-01-12',
      category: 'entertainment',
      type: 'expense',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      amount: 800.00,
      description: 'Freelance Project',
      date: '2024-01-20',
      category: 'freelance',
      type: 'income',
      createdAt: new Date().toISOString(),
    },
  ];
  
  return sampleTransactions;
};