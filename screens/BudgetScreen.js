// screens/BudgetScreen.js

import React, { useMemo, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { useBudgets } from '../context/BudgetContext';
import { useTransactions } from '../context/TransactionContext';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  TagIcon, 
  CarIcon, 
  ShoppingBagIcon, 
  PopcornIcon, 
  ForkKnifeIcon,
  TrashIcon
} from '../components/icons';

// --- Icon Mapping ---
const getIconForCategory = (category) => {
  const categoryIcons = {
    food: ForkKnifeIcon,
    transport: CarIcon,
    shopping: ShoppingBagIcon,
    entertainment: PopcornIcon,
  };
  const IconComponent = categoryIcons[category.toLowerCase()];
  // Safely render the icon, falling back to the default if the specific one is not found.
  return IconComponent ? <IconComponent /> : <TagIcon />;
};


// --- Budget Item Component ---
const BudgetItem = ({ category, spent, total, period }) => {
  const progress = total > 0 ? (spent / total) * 100 : 0;
  const progressPercent = `${Math.min(progress, 100)}%`;
  const isOverBudget = progress > 100;
  
  const safePeriod = period || 'monthly';
  const periodLabel = safePeriod.charAt(0).toUpperCase() + safePeriod.slice(1);

  return (
    <View style={styles.budgetItem}>
      <View style={styles.iconContainer}>{getIconForCategory(category)}</View>
      <View style={styles.budgetInfo}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
          <Text style={styles.budgetPeriod}>{periodLabel}</Text>
        </View>
         <Text style={styles.budgetAmount}>${spent.toFixed(2)} / ${total.toFixed(2)}</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: progressPercent, backgroundColor: isOverBudget ? '#d9534f' : '#0c7ff2' }]} />
        </View>
      </View>
    </View>
  );
};

BudgetItem.propTypes = {
  category: PropTypes.string.isRequired,
  spent: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  period: PropTypes.string.isRequired,
};

// --- Swipeable Budget Item Wrapper ---
const SwipeableBudgetItem = ({ item, onDelete, onEdit }) => {
  const swipeableRef = useRef(null);

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={() => {
        swipeableRef.current?.close();
        onDelete();
      }}>
        <Animated.View style={[styles.deleteAction, { transform: [{ translateX: trans }] }]}>
          {TrashIcon ? <TrashIcon color="#fff" /> : <Text style={styles.deleteActionText}>Delete</Text>}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
        {/* THE FIX: Changed onLongPress to onPress for editing */}
        <TouchableOpacity onPress={onEdit} activeOpacity={0.8}>
            <BudgetItem {...item} />
        </TouchableOpacity>
    </Swipeable>
  );
};

SwipeableBudgetItem.propTypes = {
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};


// --- Main Screen Component ---
const BudgetScreen = ({ navigation }) => {
  const { budgets, deleteBudget } = useBudgets();
  const { transactions } = useTransactions();

  const budgetData = useMemo(() => {
    const expenses = transactions.filter(t => t.amount < 0);

    const getStartDate = (period) => {
        const date = new Date();
        const safePeriod = period || 'monthly';
        if (safePeriod === 'weekly') {
            date.setDate(date.getDate() - date.getDay());
        } else if (safePeriod === 'monthly') {
            date.setDate(1);
        } else if (safePeriod === 'yearly') {
            date.setMonth(0, 1);
        }
        date.setHours(0, 0, 0, 0);
        return date;
    };
    
    return budgets.map(budget => {
      const startDate = getStartDate(budget.period);
      const spent = expenses
        .filter(e => e.category === budget.category && new Date(e.date) >= startDate)
        .reduce((sum, e) => sum + Math.abs(e.amount), 0);
      
      return {
        category: budget.category,
        amount: budget.amount,
        period: budget.period || 'monthly',
        total: budget.amount,
        spent,
      };
    });
  }, [budgets, transactions]);

  const handleEdit = (item) => {
    navigation.navigate('SetBudget', { budgetToEdit: item });
  };

  const handleDeleteConfirmation = (category) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the budget for "${category}"? This action cannot be undone.`,
      [
        {
          text: 'Delete',
          onPress: () => deleteBudget(category),
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><ArrowLeftIcon /></TouchableOpacity>
        <Text style={styles.headerTitle}>Budgets</Text>
      </View>

      <FlatList
        data={budgetData}
        renderItem={({ item }) => (
            <SwipeableBudgetItem 
                item={item} 
                onDelete={() => handleDeleteConfirmation(item.category)}
                onEdit={() => handleEdit(item)}
            />
        )}
        keyExtractor={item => item.category}
        ListHeaderComponent={<Text style={styles.subHeader}>Your Budgets</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('SetBudget')}>
        <PlusIcon />
        <Text style={styles.fabText}>New Budget</Text>
      </TouchableOpacity>
    </View>
  );
};

BudgetScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8 },
  backButton: { width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { color: '#111518', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', marginRight: 48 },
  subHeader: { color: '#111518', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  budgetItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    backgroundColor: '#fff', // Add background color to prevent transparency during swipe
    borderBottomWidth: 1, 
    borderColor: '#f0f2f5' 
  },
  iconContainer: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#f0f2f5', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  budgetInfo: { flex: 1 },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  budgetTitle: { color: '#111518', fontSize: 16, fontWeight: '500' },
  budgetPeriod: { color: '#60768a', fontSize: 12, fontStyle: 'italic' },
  budgetAmount: { color: '#60768a', fontSize: 14, marginBottom: 8 },
  progressBarBackground: { height: 8, backgroundColor: '#f0f2f5', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  fab: { position: 'absolute', bottom: 30, right: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0c7ff2', borderRadius: 8, height: 56, paddingHorizontal: 20, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  fabText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  deleteAction: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteActionText: {
    color: '#fff',
    fontWeight: '600',
    padding: 10,
  },
});

export default BudgetScreen;
