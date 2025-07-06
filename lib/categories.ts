import { Category } from '@/types/finance';

export const PREDEFINED_CATEGORIES: Category[] = [
  // Expense categories
  { id: 'food', name: 'Food & Dining', color: '#FF6B6B', icon: 'UtensilsCrossed', type: 'expense' },
  { id: 'transport', name: 'Transportation', color: '#4ECDC4', icon: 'Car', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', color: '#45B7D1', icon: 'Gamepad2', type: 'expense' },
  { id: 'shopping', name: 'Shopping', color: '#96CEB4', icon: 'ShoppingBag', type: 'expense' },
  { id: 'bills', name: 'Bills & Utilities', color: '#FFEAA7', icon: 'Receipt', type: 'expense' },
  { id: 'healthcare', name: 'Healthcare', color: '#DDA0DD', icon: 'Heart', type: 'expense' },
  { id: 'education', name: 'Education', color: '#98D8E8', icon: 'GraduationCap', type: 'expense' },
  { id: 'travel', name: 'Travel', color: '#F7DC6F', icon: 'Plane', type: 'expense' },
  { id: 'other-expense', name: 'Other Expenses', color: '#BDC3C7', icon: 'MoreHorizontal', type: 'expense' },
  
  // Income categories
  { id: 'salary', name: 'Salary', color: '#2ECC71', icon: 'Briefcase', type: 'income' },
  { id: 'freelance', name: 'Freelance', color: '#3498DB', icon: 'Laptop', type: 'income' },
  { id: 'investments', name: 'Investments', color: '#E74C3C', icon: 'TrendingUp', type: 'income' },
  { id: 'business', name: 'Business', color: '#9B59B6', icon: 'Building', type: 'income' },
  { id: 'other-income', name: 'Other Income', color: '#1ABC9C', icon: 'PlusCircle', type: 'income' },
];

export const getCategoryById = (id: string): Category | undefined => {
  return PREDEFINED_CATEGORIES.find(cat => cat.id === id);
};

export const getExpenseCategories = (): Category[] => {
  return PREDEFINED_CATEGORIES.filter(cat => cat.type === 'expense');
};

export const getIncomeCategories = (): Category[] => {
  return PREDEFINED_CATEGORIES.filter(cat => cat.type === 'income');
};