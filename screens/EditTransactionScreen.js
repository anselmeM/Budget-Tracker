// screens/EditTransactionScreen.js

import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Platform, Alert, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

import { useTransactions } from '../context/TransactionContext';

const XIcon = () => (<Svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><Path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></Path></Svg>);

// This screen receives the transaction to edit via navigation parameters
const EditTransactionScreen = ({ route, navigation }) => {
  const { transaction } = route.params;
  const { editTransaction } = useTransactions();

  // Initialize state with the data from the transaction being edited
  const [amount, setAmount] = useState(Math.abs(transaction.amount).toString());
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(new Date(transaction.date));
  const [description, setDescription] = useState(transaction.title);
  const [transactionType, setTransactionType] = useState(transaction.amount > 0 ? 'income' : 'expense');
  const [receiptImageUri, setReceiptImageUri] = useState(transaction.receiptImageUri);
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
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
    const updatedTransaction = {
      ...transaction, // Keep the original ID and other properties
      title: description,
      amount: finalAmount,
      category: category,
      date: date,
      receiptImageUri: receiptImageUri,
    };

    editTransaction(transaction.id, updatedTransaction);
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}><XIcon /></TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Transaction</Text>
        </View>

        <View style={styles.toggleContainer}>
            <TouchableOpacity style={[styles.toggleButton, transactionType === 'expense' && styles.activeToggle]} onPress={() => setTransactionType('expense')}><Text style={[styles.toggleText, transactionType === 'expense' && styles.activeToggleText]}>Expense</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.toggleButton, transactionType === 'income' && styles.activeToggle]} onPress={() => setTransactionType('income')}><Text style={[styles.toggleText, transactionType === 'income' && styles.activeToggleText]}>Income</Text></TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <TextInput placeholder="Amount" style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />
          <View style={styles.pickerWrapper}><Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}><Picker.Item label="Food" value="food" /><Picker.Item label="Transport" value="transport" /><Picker.Item label="Entertainment" value="entertainment" /><Picker.Item label="Utilities" value="utilities" /><Picker.Item label="Salary" value="salary" /></Picker></View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputAsButton}><Text style={styles.inputText}>{date.toLocaleDateString()}</Text></TouchableOpacity>
          {showDatePicker && (<DateTimePicker value={date} mode="date" display="default" onChange={onDateChange}/>)}
          <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription}/>
        </View>

        <View style={styles.receiptContainer}>
          <TouchableOpacity style={styles.receiptBox} onPress={handlePickImage}>
            {receiptImageUri ? (
              <Image source={{ uri: receiptImageUri }} style={styles.receiptImage} />
            ) : (
              <View style={styles.receiptPlaceholder}><Text style={styles.receiptTextBold}>Add Receipt</Text></View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}><Text style={styles.saveButtonText}>Save Changes</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:'#fff'},mainContent:{flex:1},header:{flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingTop:40,paddingBottom:8},iconButton:{width:48,height:48,justifyContent:'center',alignItems:'center'},headerTitle:{color:'#111418',fontSize:18,fontWeight:'bold',flex:1,textAlign:'center',marginRight:48},
  toggleContainer: { flexDirection: 'row', backgroundColor: '#f0f2f5', borderRadius: 8, marginHorizontal: 16, marginTop: 16, padding: 4 },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  activeToggle: { backgroundColor: '#fff' },
  toggleText: { color: '#60758a', fontWeight: '500' },
  activeToggleText: { color: '#0c7ff2' },
  formContainer:{paddingHorizontal:16,paddingTop:16},input:{height:56,borderRadius:8,color:'#111418',backgroundColor:'#f0f2f5',paddingHorizontal:16,fontSize:16,marginBottom:16},inputAsButton:{height:56,borderRadius:8,backgroundColor:'#f0f2f5',paddingHorizontal:16,justifyContent:'center',marginBottom:16},inputText:{fontSize:16,color:'#111418'},pickerWrapper:{backgroundColor:'#f0f2f5',borderRadius:8,height:56,justifyContent:'center',marginBottom:16},
  receiptContainer:{paddingHorizontal:16, marginTop: 16, marginBottom: 24},
  receiptBox:{alignItems:'center', justifyContent: 'center', gap:24,borderRadius:8,borderWidth:2,borderColor:'#dbe0e6',borderStyle:'dashed', minHeight: 150, padding: 24},
  receiptImage: { width: '100%', height: 200, borderRadius: 8, resizeMode: 'cover' },
  receiptPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  receiptTextBold:{color:'#111418',fontSize:18,fontWeight:'bold',textAlign:'center'},
  footer:{padding:16,backgroundColor:'white',borderTopWidth:1,borderColor:'#f0f2f5'},saveButton:{borderRadius:8,height:48,alignItems:'center',justifyContent:'center',backgroundColor:'#0c7ff2'},saveButtonText:{color:'white',fontSize:16,fontWeight:'bold'}
});

export default EditTransactionScreen;
