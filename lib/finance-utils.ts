import { Transaction, MonthlyData, CategoryTotal, Budget } from '@/types/finance';
import { getCategoryById } from './categories';

export const calculateMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
  const monthlyMap = new Map<string, { income: number; expenses: number }>();
  
  transactions.forEach(transaction => {
    const month = transaction.date.substring(0, 7); // YYYY-MM
    const existing = monthlyMap.get(month) || { income: 0, expenses: 0 };
    
    if (transaction.type === 'income') {
      existing.income += transaction.amount;
    } else {
      existing.expenses += transaction.amount;
    }
    
    monthlyMap.set(month, existing);
  });
  
  return Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const calculateCategoryTotals = (transactions: Transaction[], type: 'income' | 'expense'): CategoryTotal[] => {
  const categoryMap = new Map<string, number>();
  
  transactions
    .filter(t => t.type === type)
    .forEach(transaction => {
      const existing = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, existing + transaction.amount);
    });
  
  return Array.from(categoryMap.entries())
    .map(([categoryId, total]) => {
      const category = getCategoryById(categoryId);
      return {
        categoryId,
        categoryName: category?.name || 'Unknown',
        total,
        color: category?.color || '#BDC3C7',
        icon: category?.icon || 'Circle',
      };
    })
    .sort((a, b) => b.total - a.total);
};

export const calculateBudgetProgress = (budgets: Budget[], transactions: Transaction[]): Budget[] => {
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  return budgets.map(budget => {
    const monthlyTransactions = transactions.filter(
      t => t.date.substring(0, 7) === budget.month && 
          t.category === budget.categoryId && 
          t.type === 'expense'
    );
    
    const spent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...budget,
      spent,
    };
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getCurrentMonth = (): string => {
  return new Date().toISOString().substring(0, 7);
};