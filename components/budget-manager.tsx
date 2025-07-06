'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Target, AlertTriangle } from 'lucide-react';
import { Budget, Transaction } from '@/types/finance';
import { getExpenseCategories, getCategoryById } from '@/lib/categories';
import { formatCurrency, getCurrentMonth } from '@/lib/finance-utils';

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onSave: (budget: Omit<Budget, 'id'>) => void;
  onUpdate: (id: string, budget: Omit<Budget, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function BudgetManager({ budgets, transactions, onSave, onUpdate, onDelete }: BudgetManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    month: getCurrentMonth(),
  });

  const expenseCategories = getExpenseCategories();
  const currentMonth = getCurrentMonth();

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        categoryId: editingBudget.categoryId,
        amount: editingBudget.amount.toString(),
        month: editingBudget.month,
      });
    } else {
      setFormData({
        categoryId: '',
        amount: '',
        month: currentMonth,
      });
    }
  }, [editingBudget, currentMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId || !formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }

    const budgetData = {
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      month: formData.month,
      spent: 0,
    };

    if (editingBudget) {
      onUpdate(editingBudget.id, budgetData);
    } else {
      onSave(budgetData);
    }

    setFormData({
      categoryId: '',
      amount: '',
      month: currentMonth,
    });
    setEditingBudget(null);
    setIsOpen(false);
  };

  const calculateSpent = (budget: Budget) => {
    return transactions
      .filter(t => 
        t.category === budget.categoryId && 
        t.type === 'expense' && 
        t.date.substring(0, 7) === budget.month
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBudgetStatus = (budget: Budget, spent: number) => {
    const percentage = (spent / budget.amount) * 100;
    if (percentage >= 100) return { color: 'text-red-600', label: 'Over Budget', variant: 'destructive' as const };
    if (percentage >= 80) return { color: 'text-yellow-600', label: 'Near Limit', variant: 'secondary' as const };
    return { color: 'text-green-600', label: 'On Track', variant: 'default' as const };
  };

  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budget Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Add New Budget'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingBudget(null);
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {currentMonthBudgets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No budgets set for this month</p>
            <p className="text-sm text-muted-foreground text-center">
              Create budgets to track your spending and stay on target
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMonthBudgets.map(budget => {
            const category = getCategoryById(budget.categoryId);
            const spent = calculateSpent(budget);
            const percentage = Math.min((spent / budget.amount) * 100, 100);
            const status = getBudgetStatus(budget, spent);

            return (
              <Card key={budget.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{category?.name}</CardTitle>
                      <Badge variant={status.variant} className="mt-1">
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingBudget(budget);
                          setIsOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className={spent > budget.amount ? 'text-red-600' : 'text-foreground'}>
                        {formatCurrency(spent)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span>{formatCurrency(budget.amount)}</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                      // @ts-ignore
                      indicatorClassName={spent > budget.amount ? 'bg-red-500' : 'bg-green-500'}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage.toFixed(1)}% used</span>
                      <span>{formatCurrency(budget.amount - spent)} remaining</span>
                    </div>
                    {spent > budget.amount && (
                      <div className="flex items-center text-red-600 text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Over budget by {formatCurrency(spent - budget.amount)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}