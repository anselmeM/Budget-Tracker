// screens/CategoriesScreen.js
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useCategories } from '../context/CategoryContext'; // 1. Import the context hook
import { ArrowLeftIcon, PlusIcon } from '../components/icons';

// The CategoryItem component remains the same
const CategoryItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View style={styles.iconContainer}>
      {icon}
    </View>
    <Text style={styles.categoryLabel}>{label}</Text>
  </TouchableOpacity>
);

const CategoriesScreen = ({ navigation }) => {
  const { categories } = useCategories(); // 2. Get the dynamic categories from the context

  // 3. The rest of the logic works as before, but now with dynamic data
  const incomeCategories = Object.values(categories).filter(c => c.type === 'income');
  const expenseCategories = Object.values(categories).filter(c => c.type === 'expense');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        {/* A placeholder to keep the title centered */}
        <View style={{ width: 48 }} /> 
      </View>

      <ScrollView>
        <Text style={styles.sectionTitle}>Income</Text>
        {incomeCategories.map(cat => (
          <CategoryItem key={cat.label} icon={cat.icon} label={cat.label} />
        ))}

        <Text style={styles.sectionTitle}>Expenses</Text>
        {expenseCategories.map(cat => (
          <CategoryItem key={cat.label} icon={cat.icon} label={cat.label} />
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddCategory')}
      >
        <PlusIcon />
      </TouchableOpacity>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#111418',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#111418',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 56,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    color: '#111418',
    fontSize: 16,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#0c7ff2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CategoriesScreen;