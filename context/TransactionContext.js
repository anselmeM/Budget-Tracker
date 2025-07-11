// context/TransactionContext.js

import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTIONS_STORAGE_KEY = '@transactions_data';

const MOCK_TRANSACTIONS = [
  // Example for current month
  { id: '1', title: 'Acme Corp', category: 'Salary', amount: 3500.00, date: new Date() },
  { id: '2', title: 'Fresh Foods Market', category: 'Groceries', amount: -150.00, date: new Date() },
  // Example for last month
  { id: '3', title: 'Acme Corp', category: 'Salary', amount: 3400.00, date: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
  { id: '4', title: 'Power & Light Co.', category: 'Utilities', amount: -100.00, date: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
];

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (storedTransactions !== null) {
        const parsedTransactions = JSON.parse(storedTransactions).map(t => ({
          ...t,
          date: new Date(t.date),
        }));
        setTransactions(parsedTransactions);
      } else {
        setTransactions(MOCK_TRANSACTIONS);
      }
    } catch (error) {
      console.error('Failed to load transactions.', error);
      setTransactions(MOCK_TRANSACTIONS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const refetchTransactions = async () => {
    setIsLoading(true);
    await loadTransactions();
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      const saveTransactions = async () => {
        try {
          const jsonValue = JSON.stringify(transactions);
          await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, jsonValue);
        } catch (error) {
          console.error('Failed to save transactions.', error);
        }
      };
      saveTransactions();
    }
  }, [transactions, isLoading]);

  // --- Calculate monthly totals using useMemo for performance ---
  const monthlyTotals = useMemo(() => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);


    const currentMonthTxs = transactions.filter(t => new Date(t.date) >= startOfCurrentMonth);
    const previousMonthTxs = transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= startOfPreviousMonth && txDate <= endOfPreviousMonth;
    });

    const calculateTotals = (txs) => ({
        income: txs.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
        expenses: txs.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
    });

    return {
        current: calculateTotals(currentMonthTxs),
        previous: calculateTotals(previousMonthTxs),
    };
  }, [transactions]);


  const addTransaction = (transaction) => {
    setTransactions(prevTransactions => [transaction, ...prevTransactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prevTransactions =>
      prevTransactions.filter(transaction => transaction.id !== id)
    );
  };

  const editTransaction = (id, updatedTransaction) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(transaction =>
        transaction.id === id ? updatedTransaction : transaction
      )
    );
  };

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    monthlyTotals, // Provide the new monthly totals
    isLoading,
    refetchTransactions,
  };

  if (isLoading) {
    return null; 
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
