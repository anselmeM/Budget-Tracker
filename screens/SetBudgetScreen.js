// screens/SetBudgetScreen.js

import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { useBudgets } from '../context/BudgetContext';
import { CATEGORIES } from '../config/categories';

const ArrowLeftIcon = ({ color = '#111518' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></Path></Svg>);

ArrowLeftIcon.propTypes = {
  color: PropTypes.string,
};

const SetBudgetScreen = ({ route, navigation }) => {
  const { budgetToEdit } = route.params || {};
  const isEditMode = !!budgetToEdit;

  const { budgets, setBudget } = useBudgets();
  
  const [amount, setAmount] = useState(isEditMode ? budgetToEdit.amount.toString() : '');
  const [category, setCategory] = useState(isEditMode ? budgetToEdit.category : '');
  const [period, setPeriod] = useState(isEditMode ? budgetToEdit.period : 'monthly');

  const availableCategories = useMemo(() => {
    const existingBudgetCategories = budgets.map(b => b.category);
    return Object.keys(CATEGORIES)
      .filter(key => CATEGORIES[key].type === 'expense' && (isEditMode ? key === category : !existingBudgetCategories.includes(key)));
  }, [budgets, isEditMode, category]);

  const handleSave = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid, positive amount for the budget.');
      return;
    }
    if (!category) {
      Alert.alert('Invalid Input', 'Please select a category for the budget.');
      return;
    }

    const newAmount = parseFloat(amount);
    setBudget(category, newAmount, period);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><ArrowLeftIcon /></TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? 'Edit Budget' : 'Set New Budget'}</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          placeholder="Enter budget amount"
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          {isEditMode ? (
            <Text style={styles.categoryText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
          ) : (
            <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
              <Picker.Item label="Select a category..." value="" />
              {availableCategories.map(catKey => (
                <Picker.Item label={CATEGORIES[catKey].label} value={catKey} key={catKey} />
              ))}
            </Picker>
          )}
        </View>

        <Text style={styles.label}>Period</Text>
        <View style={styles.pickerWrapper}>
            <Picker selectedValue={period} onValueChange={(itemValue) => setPeriod(itemValue)}>
              <Picker.Item label="Monthly" value="monthly" />
              <Picker.Item label="Weekly" value="weekly" />
              <Picker.Item label="Yearly" value="yearly" />
            </Picker>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

SetBudgetScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      budgetToEdit: PropTypes.shape({
        amount: PropTypes.number,
        category: PropTypes.string,
        period: PropTypes.string,
      }),
    }),
  }),
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8 },
    backButton: { width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center' },
    headerTitle: { color: '#111518', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', marginRight: 48 },
    formContainer: { padding: 16 },
    label: { color: '#60768a', fontSize: 14, marginBottom: 8 },
    input: { height: 56, borderRadius: 8, color: '#111518', backgroundColor: '#f0f2f5', paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
    pickerWrapper: { backgroundColor: '#f0f2f5', borderRadius: 8, height: 56, justifyContent: 'center', marginBottom: 16 },
    categoryText: { fontSize: 16, color: '#111418', paddingHorizontal: 16 },
    footer: { flex: 1, justifyContent: 'flex-end', padding: 16, backgroundColor: 'white' },
    saveButton: { borderRadius: 8, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0c7ff2' },
    saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default SetBudgetScreen;
