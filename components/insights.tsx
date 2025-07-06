'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Award } from 'lucide-react';
import { Transaction, Budget } from '@/types/finance';
import { calculateCategoryTotals, formatCurrency, getCurrentMonth } from '@/lib/finance-utils';
import { getCategoryById } from '@/lib/categories';

interface InsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function Insights({ transactions, budgets }: InsightsProps) {
  const currentMonth = getCurrentMonth();
  const currentMonthTransactions = transactions.filter(t => t.date.substring(0, 7) === currentMonth);
  const previousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().substring(0, 7);
  const previousMonthTransactions = transactions.filter(t => t.date.substring(0, 7) === previousMonth);

  const currentExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const previousExpenses = previousMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseChange = previousExpenses > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0;

  const categoryTotals = calculateCategoryTotals(currentMonthTransactions, 'expense');
  const topSpendingCategory = categoryTotals[0];

  const currentBudgets = budgets.filter(b => b.month === currentMonth);
  const overBudgetCategories = currentBudgets.filter(budget => {
    const spent = currentMonthTransactions
      .filter(t => t.category === budget.categoryId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return spent > budget.amount;
  });

  const insights = [
    {
      title: 'Spending Trend',
      content: (
        <div className="flex items-center space-x-2">
          {expenseChange > 0 ? (
            <TrendingUp className="h-5 w-5 text-red-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-green-500" />
          )}
          <span className={expenseChange > 0 ? 'text-red-600' : 'text-green-600'}>
            {Math.abs(expenseChange).toFixed(1)}% {expenseChange > 0 ? 'increase' : 'decrease'}
          </span>
          <span className="text-muted-foreground">from last month</span>
        </div>
      ),
      variant: expenseChange > 10 ? 'destructive' : expenseChange > 0 ? 'secondary' : 'default',
    },
    {
      title: 'Top Spending Category',
      content: topSpendingCategory ? (
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: topSpendingCategory.color }}
          />
          <span className="font-medium">{topSpendingCategory.categoryName}</span>
          <span className="text-muted-foreground">
            {formatCurrency(topSpendingCategory.total)}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground">No expenses this month</span>
      ),
      variant: 'default',
    },
    {
      title: 'Budget Status',
      content: overBudgetCategories.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>{overBudgetCategories.length} categories over budget</span>
          </div>
          {overBudgetCategories.slice(0, 2).map(budget => {
            const category = getCategoryById(budget.categoryId);
            const spent = currentMonthTransactions
              .filter(t => t.category === budget.categoryId && t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
            return (
              <div key={budget.id} className="text-sm text-muted-foreground">
                {category?.name}: {formatCurrency(spent - budget.amount)} over
              </div>
            );
          })}
        </div>
      ) : currentBudgets.length > 0 ? (
        <div className="flex items-center space-x-2 text-green-600">
          <Award className="h-4 w-4" />
          <span>All budgets on track</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Target className="h-4 w-4" />
          <span>No budgets set</span>
        </div>
      ),
      variant: overBudgetCategories.length > 0 ? 'destructive' : 'default',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">{insight.title}</h4>
                <div>{insight.content}</div>
              </div>
              <Badge variant={insight.variant as any}>
                {insight.title.split(' ')[0]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}