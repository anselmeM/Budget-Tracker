// screens/AddCategoryScreen.js

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { useCategories } from '../context/CategoryContext'; // 1. Import the context hook
import { ArrowLeftIcon } from '../components/icons';

const AddCategoryScreen = ({ navigation }) => {
  const { addCategory } = useCategories(); // 2. Get the addCategory function from the context
  const [categoryName, setCategoryName] = useState('');

  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert('Invalid Name', 'Please enter a name for the category.');
      return;
    }
    // 3. Call the context function to add the new category to the global state
    addCategory(categoryName);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Category</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Category Name</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g., Groceries"
            value={categoryName}
            onChangeText={setCategoryName}
        />
      </View>
    </View>
  );
};

AddCategoryScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  headerButton: { minWidth: 48, justifyContent: 'center', alignItems: 'center', height: 48 },
  headerTitle: { color: '#111518', fontSize: 18, fontWeight: 'bold' },
  saveText: { color: '#0c7ff2', fontSize: 16, fontWeight: 'bold' },
  formContainer: { padding: 24 },
  label: { fontSize: 16, color: '#60768a', marginBottom: 8 },
  input: { height: 56, borderRadius: 8, color: '#111518', backgroundColor: '#f0f2f5', paddingHorizontal: 16, fontSize: 16 },
});

export default AddCategoryScreen;