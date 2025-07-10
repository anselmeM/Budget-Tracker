// context/BudgetContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A unique key to store and retrieve budget data from AsyncStorage.
const BUDGET_STORAGE_KEY = '@app_budgets';

// Default budgets if none are saved
// This serves as initial data for first-time users.
const MOCK_BUDGETS = [
  { category: 'food', amount: 400 },
  { category: 'transport', amount: 150 },
  { category: 'entertainment', amount: 200 },
];

// 1. Create the Context
// This creates a context object. When React renders a component that subscribes
// to this Context object it will read the current context value from the
// closest matching Provider in the tree.
const BudgetContext = createContext();

// 2. Create the Provider component
// This component will wrap parts of the app that need access to the budget data.
// It manages the state and provides it to all children components.
export const BudgetProvider = ({ children }) => {
  // State to hold the array of budget objects.
  const [budgets, setBudgets] = useState([]);
  // State to manage the loading status, useful for showing a loader or splash screen.
  const [isLoading, setIsLoading] = useState(true);

  // --- Load budgets from AsyncStorage when the component mounts ---
  // This effect runs only once when the provider is first rendered.
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        // Attempt to get the saved budgets from AsyncStorage.
        const storedBudgets = await AsyncStorage.getItem(BUDGET_STORAGE_KEY);
        // If data exists, parse it from JSON and update the state.
        if (storedBudgets !== null) {
          setBudgets(JSON.parse(storedBudgets));
        } else {
          // If no data is found, initialize with mock/default budgets.
          setBudgets(MOCK_BUDGETS);
        }
      } catch (error) {
        // If there's an error loading, log it and fall back to mock data.
        console.error('Failed to load budgets.', error);
        setBudgets(MOCK_BUDGETS);
      } finally {
        // Once loading is finished (successfully or not), update the loading state.
        setIsLoading(false);
      }
    };
    loadBudgets();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // --- Save budgets to AsyncStorage whenever the `budgets` state changes ---
  // This effect runs whenever `budgets` or `isLoading` state changes.
  useEffect(() => {
    // We don't want to save during the initial loading phase.
    if (!isLoading) {
      const saveBudgets = async () => {
        try {
          // Convert the budgets array to a JSON string.
          const jsonValue = JSON.stringify(budgets);
          // Save the JSON string to AsyncStorage.
          await AsyncStorage.setItem(BUDGET_STORAGE_KEY, jsonValue);
        } catch (error) {
          // Log any errors that occur during the save operation.
          console.error('Failed to save budgets.', error);
        }
      };
      saveBudgets();
    }
  }, [budgets, isLoading]); // Dependency array: effect runs if `budgets` or `isLoading` changes.

  // --- Function to add a new budget or update an existing one ---
  // It takes a category and an amount as arguments.
  const setBudget = (category, amount) => {
    // Use the functional form of setState to ensure we have the latest previous state.
    setBudgets(prevBudgets => {
      // Check if a budget for the given category already exists.
      const existingBudgetIndex = prevBudgets.findIndex(b => b.category === category);
      // Create a new array from the previous budgets to avoid direct mutation.
      const newBudgets = [...prevBudgets];
      if (existingBudgetIndex >= 0) {
        // If the budget exists, update its amount.
        newBudgets[existingBudgetIndex] = { category, amount };
      } else {
        // If it doesn't exist, add a new budget object to the array.
        newBudgets.push({ category, amount });
      }
      // Return the new array to update the state.
      return newBudgets;
    });
  };

  // The value object that will be passed down to consuming components.
  // It includes the budgets state and the function to modify it.
  const value = {
    budgets,
    setBudget,
    isLoading,
  };

  // While loading data from storage, don't render the children to prevent
  // them from accessing an uninitialized state.
  if (isLoading) {
    return null;
  }

  // Render the provider, passing the `value` object to all children.
  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption of the context
// This hook simplifies the process of using the budget context in other components.
export const useBudgets = () => {
  // `useContext` hook to access the context value.
  const context = useContext(BudgetContext);
  // If the hook is used outside of a BudgetProvider, it will throw an error.
  // This is a good practice to ensure the context is used correctly.
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
};
