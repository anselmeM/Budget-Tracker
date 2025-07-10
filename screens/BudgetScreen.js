// screens/BudgetScreen.js

import React, { useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useBudgets } from '../context/BudgetContext';
import { useTransactions } from '../context/TransactionContext';

// --- Icon Components ---
const ArrowLeftIcon = ({ color = '#111518' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></Path></Svg>);
const PlusIcon = ({ color = '#fff' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></Path></Svg>);
const TagIcon = ({ color = '#111418' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M213.58,118.12,137.88,42.42a28,28,0,0,0-39.6,0L22.42,118.12a28,28,0,0,0,0,39.6l75.7,75.7a28,28,0,0,0,39.6,0l75.7-75.7a28,28,0,0,0,0-39.6ZM128,152a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z"></Path></Svg>);

// --- Budget Item Component ---
const BudgetItem = ({ category, spent, total }) => {
  const progress = total > 0 ? (spent / total) * 100 : 0;
  const progressPercent = `${Math.min(progress, 100)}%`; // Cap at 100%
  const isOverBudget = progress > 100;

  return (
    <View style={styles.budgetItem}>
      <View style={styles.iconContainer}><TagIcon /></View>
      <View style={styles.budgetInfo}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
          <Text style={styles.budgetAmount}>${spent.toFixed(2)} / ${total.toFixed(2)}</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: progressPercent, backgroundColor: isOverBudget ? '#d9534f' : '#0c7ff2' }]} />
        </View>
      </View>
    </View>
  );
};

// --- Main Screen Component ---
const BudgetScreen = ({ navigation }) => {
  const { budgets } = useBudgets();
  const { transactions } = useTransactions();

  // useMemo will recalculate the spending data only when budgets or transactions change
  const budgetData = useMemo(() => {
    const expenses = transactions.filter(t => t.amount < 0);
    
    return budgets.map(budget => {
      const spent = expenses
        .filter(e => e.category === budget.category)
        .reduce((sum, e) => sum + Math.abs(e.amount), 0);
      
      // THE FIX: Explicitly map the 'amount' property from the budget
      // to the 'total' prop that the BudgetItem component expects.
      return {
        category: budget.category,
        total: budget.amount,
        spent,
      };
    });
  }, [budgets, transactions]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><ArrowLeftIcon /></TouchableOpacity>
        <Text style={styles.headerTitle}>Budgets</Text>
      </View>

      <FlatList
        data={budgetData}
        renderItem={({ item }) => <BudgetItem {...item} />}
        keyExtractor={item => item.category}
        ListHeaderComponent={<Text style={styles.subHeader}>Monthly Budgets</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('SetBudget')}>
        <PlusIcon />
        <Text style={styles.fabText}>New Budget</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8 },
  backButton: { width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { color: '#111518', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', marginRight: 48 },
  subHeader: { color: '#111518', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  budgetItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f2f5' },
  iconContainer: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#f0f2f5', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  budgetInfo: { flex: 1 },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  budgetTitle: { color: '#111518', fontSize: 16, fontWeight: '500' },
  budgetAmount: { color: '#60768a', fontSize: 14 },
  progressBarBackground: { height: 8, backgroundColor: '#f0f2f5', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  fab: { position: 'absolute', bottom: 30, right: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0c7ff2', borderRadius: 8, height: 56, paddingHorizontal: 20, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  fabText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default BudgetScreen;
