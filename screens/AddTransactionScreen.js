// screens/AddTransactionScreen.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Platform, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

import { useTransactions } from '../context/TransactionContext';
import { XIcon } from '../components/icons';
import { CATEGORIES } from '../config/categories'; // Import categories config

const AddTransactionScreen = ({ navigation }) => {
  const { addTransaction } = useTransactions();
  const [transactionType, setTransactionType] = useState('expense');
  
  // Filter categories based on the selected transaction type
  const availableCategories = Object.entries(CATEGORIES)
    .filter(([, details]) => details.type === transactionType)
    .map(([key, details]) => ({ key, ...details }));

  // State for form fields
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(availableCategories.length > 0 ? availableCategories[0].key : '');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [receiptImageUri, setReceiptImageUri] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Effect to update the default category when the transaction type changes
  useEffect(() => {
    const newCategories = Object.keys(CATEGORIES).filter(key => CATEGORIES[key].type === transactionType);
    if (newCategories.length > 0) {
      setCategory(newCategories[0]);
    }
  }, [transactionType]);


  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleAddReceipt = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      // THE FIX: Use the modern, non-deprecated syntax
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setReceiptImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert('Invalid Input', 'Please enter a valid amount.');
      return;
    }
    const finalAmount = transactionType === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
    const newTransaction = {
      id: new Date().getTime().toString(),
      title: description || CATEGORIES[category]?.label || 'Transaction',
      amount: finalAmount,
      category: category,
      date: date,
      receiptImageUri: receiptImageUri,
    };
    addTransaction(newTransaction);
    navigation.goBack();
  };


  return (
    <View style={styles.root}>
      <ScrollView style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}><XIcon /></TouchableOpacity>
          <Text style={styles.headerTitle}>Add Transaction</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.toggleContainer}>
            <TouchableOpacity style={[styles.toggleButton, transactionType === 'expense' && styles.activeToggle]} onPress={() => setTransactionType('expense')}><Text style={[styles.toggleText, transactionType === 'expense' && styles.activeToggleText]}>Expense</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.toggleButton, transactionType === 'income' && styles.activeToggle]} onPress={() => setTransactionType('income')}><Text style={[styles.toggleText, transactionType === 'income' && styles.activeToggleText]}>Income</Text></TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <TextInput placeholder="Amount" style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
              {availableCategories.map(cat => (
                <Picker.Item label={cat.label} value={cat.key} key={cat.key} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputAsButton}><Text style={styles.inputText}>{date.toLocaleDateString()}</Text></TouchableOpacity>
          {showDatePicker && (<DateTimePicker value={date} mode="date" display="default" onChange={onDateChange}/>)}
          <TextInput placeholder="Description (optional)" style={styles.input} value={description} onChangeText={setDescription}/>
        </View>

        <View style={styles.receiptContainer}>
          <TouchableOpacity style={styles.receiptBox} onPress={handleAddReceipt}>
            {receiptImageUri ? ( <Image source={{ uri: receiptImageUri }} style={styles.receiptImage} /> ) : (
              <>
                <View style={styles.receiptTextContainer}><Text style={styles.receiptTextBold}>Add Receipt</Text><Text style={styles.receiptTextNormal}>Take a photo or upload an image</Text></View>
                <View style={styles.addReceiptButton}><Text style={styles.addReceiptButtonText}>Add Receipt</Text></View>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}><Text style={styles.saveButtonText}>Save</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:'#fff'},mainContent:{flex:1},header:{flexDirection:'row',alignItems:'center',justifyContent: 'space-between', paddingHorizontal:16,paddingTop:40,paddingBottom:8},iconButton:{width:48,height:48,justifyContent:'center',alignItems:'center'},headerTitle:{color:'#111418',fontSize:18,fontWeight:'bold'},
  toggleContainer: { flexDirection: 'row', backgroundColor: '#f0f2f5', borderRadius: 8, marginHorizontal: 16, marginTop: 16, padding: 4 },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  activeToggle: { backgroundColor: '#fff' },
  toggleText: { color: '#60758a', fontWeight: '500' },
  activeToggleText: { color: '#0c7ff2' },
  formContainer:{paddingHorizontal:16,paddingTop:16},input:{height:56,borderRadius:8,color:'#111418',backgroundColor:'#f0f2f5',paddingHorizontal:16,fontSize:16,marginBottom:16},inputAsButton:{height:56,borderRadius:8,backgroundColor:'#f0f2f5',paddingHorizontal:16,justifyContent:'center',marginBottom:16},inputText:{fontSize:16,color:'#111418'},pickerWrapper:{backgroundColor:'#f0f2f5',borderRadius:8,height:56,justifyContent:'center',marginBottom:16},
  receiptContainer:{paddingHorizontal:16, marginTop: 16, marginBottom: 24},
  receiptBox:{alignItems:'center', justifyContent: 'center', gap:24,borderRadius:8,borderWidth:2,borderColor:'#dbe0e6',borderStyle:'dashed', minHeight: 150, padding: 24},
  receiptImage: { width: '100%', height: 200, borderRadius: 8, resizeMode: 'cover' },
  receiptTextContainer:{alignItems:'center',gap:8},receiptTextBold:{color:'#111418',fontSize:18,fontWeight:'bold',textAlign:'center'},receiptTextNormal:{color:'#111418',fontSize:14,textAlign:'center'},addReceiptButton:{borderRadius:8,height:40,paddingHorizontal:16,backgroundColor:'#f0f2f5',alignItems:'center',justifyContent:'center'},addReceiptButtonText:{color:'#111418',fontSize:14,fontWeight:'bold'},footer:{padding:16,backgroundColor:'white',borderTopWidth:1,borderColor:'#f0f2f5'},saveButton:{borderRadius:8,height:48,alignItems:'center',justifyContent:'center',backgroundColor:'#0c7ff2'},saveButtonText:{color:'white',fontSize:16,fontWeight:'bold'}
});

export default AddTransactionScreen;
