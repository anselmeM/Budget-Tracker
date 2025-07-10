// screens/SetBudgetScreen.js

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Svg, { Path } from 'react-native-svg';
import { useBudgets } from '../context/BudgetContext';

const ArrowLeftIcon = ({ color = '#111518' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></Path></Svg>);

const SetBudgetScreen = ({ navigation }) => {
  const { setBudget } = useBudgets();
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid, positive number for the budget.');
      return;
    }
    setBudget(category, numericAmount);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}><ArrowLeftIcon /></TouchableOpacity>
        <Text style={styles.headerTitle}>Set Budget</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
            <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                <Picker.Item label="Food" value="food" />
                <Picker.Item label="Transport" value="transport" />
                <Picker.Item label="Entertainment" value="entertainment" />
                <Picker.Item label="Utilities" value="utilities" />
                <Picker.Item label="Shopping" value="shopping" />
            </Picker>
        </View>

        <Text style={styles.label}>Budget Amount</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g., 400"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  headerButton: { minWidth: 48, justifyContent: 'center', alignItems: 'center', height: 48 },
  headerTitle: { color: '#111518', fontSize: 18, fontWeight: 'bold' },
  saveText: { color: '#0c7ff2', fontSize: 16, fontWeight: 'bold' },
  formContainer: { padding: 24 },
  label: { fontSize: 16, color: '#60768a', marginBottom: 8 },
  pickerWrapper:{ backgroundColor: '#f0f2f5', borderRadius: 8, height: 56, justifyContent: 'center', marginBottom: 24 },
  input: { height: 56, borderRadius: 8, color: '#111518', backgroundColor: '#f0f2f5', paddingHorizontal: 16, fontSize: 16 },
});

export default SetBudgetScreen;
