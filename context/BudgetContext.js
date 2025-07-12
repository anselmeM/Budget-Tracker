// context/BudgetContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A unique key to store and retrieve budget data from AsyncStorage.
const BUDGET_STORAGE_KEY = '@app_budgets';

// Default budgets if none are saved
const MOCK_BUDGETS = [
  { category: 'food', amount: 400 },
  { category: 'transport', amount: 150 },
  { category: 'entertainment', amount: 200 },
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

  const setBudget = (category, amount) => {
    setBudgets(prevBudgets => {
      const existingBudgetIndex = prevBudgets.findIndex(b => b.category === category);
      const newBudgets = [...prevBudgets];
      if (existingBudgetIndex >= 0) {
        newBudgets[existingBudgetIndex] = { category, amount };
      } else {
        newBudgets.push({ category, amount });
      }
      return newBudgets;
    });
  };

  // Function to delete a budget by its category
  const deleteBudget = (category) => {
    setBudgets(prevBudgets => prevBudgets.filter(b => b.category !== category));
  };


  const value = {
    budgets,
    setBudget,
    deleteBudget, // Expose the delete function
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
