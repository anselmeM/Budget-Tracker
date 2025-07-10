// context/TransactionContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTIONS_STORAGE_KEY = '@transactions_data';

const MOCK_TRANSACTIONS = [
  { id: '1', title: 'Fresh Foods Market', category: 'Groceries', amount: -65.20, date: new Date() },
  { id: '2', title: 'Acme Corp', category: 'Salary', amount: 3500.00, date: new Date() },
];

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    loadTransactions();
  }, []);

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

  const addTransaction = (transaction) => {
    setTransactions(prevTransactions => [transaction, ...prevTransactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prevTransactions =>
      prevTransactions.filter(transaction => transaction.id !== id)
    );
  };

  // --- New function to edit a transaction ---
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
    editTransaction, // Add the new function to the context value
    isLoading,
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
