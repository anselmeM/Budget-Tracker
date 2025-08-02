// context/BudgetContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BUDGET_STORAGE_KEY = '@app_budgets';

const MOCK_BUDGETS = [
  { category: 'food', amount: 400, period: 'monthly' },
  { category: 'transport', amount: 150, period: 'monthly' },
  { category: 'entertainment', amount: 50, period: 'weekly' },
];

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBudgets = async () => {
      try {
        const storedBudgets = await AsyncStorage.getItem(BUDGET_STORAGE_KEY);
        if (storedBudgets !== null) {
          setBudgets(JSON.parse(storedBudgets));
        } else {
          setBudgets(MOCK_BUDGETS);
        }
      } catch (error) {
        console.error('Failed to load budgets.', error);
        setBudgets(MOCK_BUDGETS);
      } finally {
        setIsLoading(false);
      }
    };
    loadBudgets();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const saveBudgets = async () => {
        try {
          const jsonValue = JSON.stringify(budgets);
          await AsyncStorage.setItem(BUDGET_STORAGE_KEY, jsonValue);
        } catch (error) {
          console.error('Failed to save budgets.', error);
        }
      };
      saveBudgets();
    }
  }, [budgets, isLoading]);

  const setBudget = (category, amount, period) => {
    setBudgets(prevBudgets => {
      const existingBudgetIndex = prevBudgets.findIndex(b => b.category === category);
      const newBudgets = [...prevBudgets];
      const newBudget = { category, amount, period };

      if (existingBudgetIndex >= 0) {
        newBudgets[existingBudgetIndex] = newBudget;
      } else {
        newBudgets.push(newBudget);
      }
      return newBudgets;
    });
  };

  // THE FIX: This function handles the actual deletion logic.
  const deleteBudget = (category) => {
    setBudgets(prevBudgets => prevBudgets.filter(b => b.category !== category));
  };

  const value = {
    budgets,
    setBudget,
    deleteBudget, // Ensure the delete function is provided to the app
    isLoading,
  };

  if (isLoading) {
    return null;
  }

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
};
