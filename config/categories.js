// config/categories.js
import React from 'react';
import {
  CurrencyDollarIcon, ChartLineIcon, PizzaIcon, ShoppingBagIcon, 
  HouseIcon, CarIcon, QuestionIcon, TagIcon 
} from '../components/icons'; // Assuming all icons are in this central file

export const CATEGORIES = {
  // --- Income Categories ---
  salary: { 
    label: 'Income: Salary', 
    icon: <CurrencyDollarIcon />, 
    type: 'income' 
  },
  investments: { 
    label: 'Income: Investments', 
    icon: <ChartLineIcon />, 
    type: 'income' 
  },

  // --- Expense Categories ---
  // Housing
  housing_rent: { label: 'Housing: Mortgage or Rent', icon: <HouseIcon />, type: 'expense' },
  housing_tax: { label: 'Housing: Property Taxes', icon: <HouseIcon />, type: 'expense' },
  housing_repairs: { label: 'Housing: Household Repairs', icon: <HouseIcon />, type: 'expense' },
  housing_hoa: { label: 'Housing: HOA Fees', icon: <HouseIcon />, type: 'expense' },

  // Transportation
  transport_payment: { label: 'Transportation: Car Payment', icon: <CarIcon />, type: 'expense' },
  transport_warranty: { label: 'Transportation: Car Warranty', icon: <CarIcon />, type: 'expense' },
  transport_gas: { label: 'Transportation: Gas', icon: <CarIcon />, type: 'expense' },
  transport_tires: { label: 'Transportation: Tires', icon: <CarIcon />, type: 'expense' },
  transport_maintenance: { label: 'Transportation: Maintenance', icon: <CarIcon />, type: 'expense' },
  transport_parking: { label: 'Transportation: Parking Fees', icon: <CarIcon />, type: 'expense' },
  transport_repairs: { label: 'Transportation: Repairs', icon: <CarIcon />, type: 'expense' },
  transport_registration: { label: 'Transportation: Registration/DMV', icon: <CarIcon />, type: 'expense' },

  // Food
  food_groceries: { label: 'Food: Groceries', icon: <PizzaIcon />, type: 'expense' },
  food_restaurants: { label: 'Food: Restaurants', icon: <PizzaIcon />, type: 'expense' },
  food_pet: { label: 'Food: Pet Food', icon: <PizzaIcon />, type: 'expense' },

  // Utilities
  utils_electricity: { label: 'Utilities: Electricity', icon: <TagIcon />, type: 'expense' },
  utils_water: { label: 'Utilities: Water', icon: <TagIcon />, type: 'expense' },
  utils_garbage: { label: 'Utilities: Garbage', icon: <TagIcon />, type: 'expense' },
  utils_phones: { label: 'Utilities: Phones', icon: <TagIcon />, type: 'expense' },
  utils_cable: { label: 'Utilities: Cable', icon: <TagIcon />, type: 'expense' },
  utils_internet: { label: 'Utilities: Internet', icon: <TagIcon />, type: 'expense' },

  // Clothing
  clothing_adult: { label: 'Clothing: Adults', icon: <ShoppingBagIcon />, type: 'expense' },
  clothing_adult_shoes: { label: 'Clothing: Adults\' Shoes', icon: <ShoppingBagIcon />, type: 'expense' },
  clothing_child: { label: 'Clothing: Children', icon: <ShoppingBagIcon />, type: 'expense' },
  clothing_child_shoes: { label: 'Clothing: Children\'s Shoes', icon: <ShoppingBagIcon />, type: 'expense' },
  
  // Medical/Healthcare
  medical_primary: { label: 'Medical: Primary Care', icon: <TagIcon />, type: 'expense' },
  medical_dental: { label: 'Medical: Dental Care', icon: <TagIcon />, type: 'expense' },
  medical_specialty: { label: 'Medical: Specialty Care', icon: <TagIcon />, type: 'expense' },
  medical_urgent: { label: 'Medical: Urgent Care', icon: <TagIcon />, type: 'expense' },
  medical_meds: { label: 'Medical: Medications', icon: <TagIcon />, type: 'expense' },
  medical_devices: { label: 'Medical: Medical Devices', icon: <TagIcon />, type: 'expense' },

  // Insurance
  ins_health: { label: 'Insurance: Health', icon: <TagIcon />, type: 'expense' },
  ins_home: { label: 'Insurance: Homeowner/Renter', icon: <TagIcon />, type: 'expense' },
  ins_auto: { label: 'Insurance: Auto', icon: <TagIcon />, type: 'expense' },
  ins_life: { label: 'Insurance: Life', icon: <TagIcon />, type: 'expense' },
  ins_disability: { label: 'Insurance: Disability', icon: <TagIcon />, type: 'expense' },

  // Household
  household_toiletries: { label: 'Household: Toiletries', icon: <ShoppingBagIcon />, type: 'expense' },
  household_laundry: { label: 'Household: Laundry Supplies', icon: <ShoppingBagIcon />, type: 'expense' },
  household_cleaning: { label: 'Household: Cleaning Supplies', icon: <ShoppingBagIcon />, type: 'expense' },
  household_tools: { label: 'Household: Tools', icon: <ShoppingBagIcon />, type: 'expense' },

  // Personal
  personal_gym: { label: 'Personal: Gym Memberships', icon: <TagIcon />, type: 'expense' },
  personal_hair: { label: 'Personal: Haircuts/Salon', icon: <TagIcon />, type: 'expense' },
  personal_cosmetics: { label: 'Personal: Cosmetics', icon: <TagIcon />, type: 'expense' },
  personal_babysitter: { label: 'Personal: Babysitter', icon: <TagIcon />, type: 'expense' },
  personal_subs: { label: 'Personal: Subscriptions', icon: <TagIcon />, type: 'expense' },

  // Debt
  debt_personal: { label: 'Debt: Personal Loans', icon: <CurrencyDollarIcon />, type: 'expense' },
  debt_student: { label: 'Debt: Student Loans', icon: <CurrencyDollarIcon />, type: 'expense' },
  debt_credit: { label: 'Debt: Credit Cards', icon: <CurrencyDollarIcon />, type: 'expense' },

  // Retirement
  retire_plan: { label: 'Retirement: Financial Planning', icon: <ChartLineIcon />, type: 'expense' },
  retire_invest: { label: 'Retirement: Investing', icon: <ChartLineIcon />, type: 'expense' },
  
  // Education
  edu_college: { label: 'Education: College', icon: <TagIcon />, type: 'expense' },
  edu_supplies: { label: 'Education: School Supplies', icon: <TagIcon />, type: 'expense' },
  edu_books: { label: 'Education: Books', icon: <TagIcon />, type: 'expense' },

  // Savings
  save_emergency: { label: 'Savings: Emergency Fund', icon: <CurrencyDollarIcon />, type: 'expense' },
  save_big: { label: 'Savings: Big Purchases', icon: <CurrencyDollarIcon />, type: 'expense' },
  save_other: { label: 'Savings: Other', icon: <CurrencyDollarIcon />, type: 'expense' },
  
  // Gifts/Donations
  gift_bday: { label: 'Gifts: Birthday/Anniversary', icon: <TagIcon />, type: 'expense' },
  gift_special: { label: 'Gifts: Special Occasion', icon: <TagIcon />, type: 'expense' },
  gift_charity: { label: 'Gifts: Charities', icon: <TagIcon />, type: 'expense' },

  // Entertainment
  ent_alcohol: { label: 'Entertainment: Alcohol/Bars', icon: <TagIcon />, type: 'expense' },
  ent_games: { label: 'Entertainment: Games', icon: <TagIcon />, type: 'expense' },
  ent_movies: { label: 'Entertainment: Movies/Concerts', icon: <TagIcon />, type: 'expense' },
  ent_vacations: { label: 'Entertainment: Vacations', icon: <TagIcon />, type: 'expense' },
  ent_subs: { label: 'Entertainment: Subscriptions', icon: <TagIcon />, type: 'expense' },
  
  // Other
  other: { 
    label: 'Other', 
    icon: <QuestionIcon />, 
    type: 'expense'
  },
};