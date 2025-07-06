'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { Transaction, Budget } from '@/types/finance';
import { formatCurrency } from '@/lib/finance-utils';

interface DashboardCardsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function DashboardCards({ transactions, budgets }: DashboardCardsProps) {
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  const currentMonthTransactions = transactions.filter(t => 
    t.date.substring(0, 7) === currentMonth
  );
  
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netIncome = totalIncome - totalExpenses;
  
  const totalBudget = budgets
    .filter(b => b.month === currentMonth)
    .reduce((sum, b) => sum + b.amount, 0);
  
  const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Net Income',
      value: formatCurrency(netIncome),
      icon: Wallet,
      color: netIncome >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: netIncome >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      title: 'Budget Usage',
      value: `${budgetUtilization.toFixed(1)}%`,
      icon: Target,
      color: budgetUtilization > 100 ? 'text-red-600' : budgetUtilization > 80 ? 'text-yellow-600' : 'text-green-600',
      bgColor: budgetUtilization > 100 ? 'bg-red-50' : budgetUtilization > 80 ? 'bg-yellow-50' : 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}