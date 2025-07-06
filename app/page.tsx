'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart, Target, TrendingUp, Wallet, Plus } from 'lucide-react';
import { Transaction, Budget } from '@/types/finance';
import { loadTransactions, saveTransactions, loadBudgets, saveBudgets, generateSampleData } from '@/lib/storage';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { DashboardCards } from '@/components/dashboard-cards';
import { MonthlyChart } from '@/components/charts/monthly-chart';
import { CategoryChart } from '@/components/charts/category-chart';
import { BudgetManager } from '@/components/budget-manager';
import { Insights } from '@/components/insights';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedTransactions = loadTransactions();
    const loadedBudgets = loadBudgets();
    
    if (loadedTransactions.length === 0) {
      const sampleData = generateSampleData();
      setTransactions(sampleData);
      saveTransactions(sampleData);
    } else {
      setTransactions(loadedTransactions);
    }
    
    setBudgets(loadedBudgets);
    setIsLoading(false);
  }, []);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transactionData,
      createdAt: new Date().toISOString(),
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const handleUpdateTransaction = (id: string, transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, ...transactionData } : t
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const handleAddBudget = (budgetData: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      id: Date.now().toString(),
      ...budgetData,
    };
    
    const updatedBudgets = [...budgets, newBudget];
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
  };

  const handleUpdateBudget = (id: string, budgetData: Omit<Budget, 'id'>) => {
    const updatedBudgets = budgets.map(b => 
      b.id === id ? { ...b, ...budgetData } : b
    );
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
  };

  const handleDeleteBudget = (id: string) => {
    const updatedBudgets = budgets.filter(b => b.id !== id);
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Personal Finance Visualizer
          </h1>
          <p className="text-gray-600">
            Track your income, expenses, and budgets with beautiful insights
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Budgets
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardCards transactions={transactions} budgets={budgets} />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <MonthlyChart transactions={transactions} />
              <CategoryChart transactions={transactions} type="expense" />
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Transactions</h2>
              <TransactionForm onSave={handleAddTransaction} />
            </div>
            
            <TransactionList 
              transactions={transactions}
              onUpdate={handleUpdateTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CategoryChart transactions={transactions} type="expense" />
              <CategoryChart transactions={transactions} type="income" />
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <BudgetManager 
              budgets={budgets}
              transactions={transactions}
              onSave={handleAddBudget}
              onUpdate={handleUpdateBudget}
              onDelete={handleDeleteBudget}
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Insights transactions={transactions} budgets={budgets} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}