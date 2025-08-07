// context/CategoryContext.js

import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES as initialCategories } from '../config/categories';
import { QuestionIcon } from '../components/icons'; // Default icon for new categories

const CategoryContext = createContext();

export const useCategories = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(initialCategories);

  const addCategory = (newCategoryName) => {
    // Generate a unique key for the new category
    const key = newCategoryName.toLowerCase().replace(/\s/g, '_');

    const newCategory = {
      [key]: {
        label: newCategoryName,
        icon: <QuestionIcon />, // Assign a default icon
        type: 'expense', // Default new categories to 'expense'
      }
    };

    setCategories(prevCategories => ({
      ...prevCategories,
      ...newCategory,
    }));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

CategoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};