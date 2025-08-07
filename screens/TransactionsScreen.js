import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text,TouchableOpacity, SectionList, ActivityIndicator, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { useTransactions } from '../context/TransactionContext';
import { useCategories } from '../context/CategoryContext';
import TransactionListItem from '../components/transactions/TransactionListItem';
import TransactionsListHeader from '../components/transactions/TransactionsListHeader';
import EmptyState from '../components/EmptyState';
import { PlusIcon } from '../components/icons';

const TransactionsScreen = ({ route, navigation }) => {
  const { transactions, deleteTransaction, isLoading, refetchTransactions } = useTransactions();
  const { categories } = useCategories();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { filterType, filterValue, filterLabel } = route.params || {};

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetchTransactions();
    setIsRefreshing(false);
  }, [refetchTransactions]);

  const filteredTransactions = useMemo(() => {
    let items = [...transactions];
    if (filterType === 'parent' && filterValue) {
      items = items.filter(t => t.category.startsWith(filterValue));
    }
    if (activeFilter === 'Income') {
      items = items.filter(t => t.amount > 0);
    } else if (activeFilter === 'Expenses') {
      items = items.filter(t => t.amount < 0);
    }
    if (searchText) {
      items = items.filter(t => t.title.toLowerCase().includes(searchText.toLowerCase()));
    }
    return items;
  }, [transactions, filterType, filterValue, activeFilter, searchText]);

  const { today, yesterday } = useMemo(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return { today: today.toDateString(), yesterday: yesterday.toDateString() };
  }, []);

  const sortedAndGroupedTransactions = useMemo(() => {
    let items = [...filteredTransactions];
    items.sort((a, b) => {
      switch (sortOrder) {
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc': return a.amount - b.amount;
        default: return new Date(b.date) - new Date(a.date);
      }
    });

    return items.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toDateString();
      let key;
      if (date === today) key = 'Today';
      else if (date === yesterday) key = 'Yesterday';
      else key = new Date(transaction.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      const group = acc.find(g => g.title === key);
      if (group) {
        group.data.push(transaction);
      } else {
        acc.push({ title: key, data: [transaction] });
      }
      return acc;
    }, []);
  }, [filteredTransactions, sortOrder, today, yesterday]);

  const clearFilter = () => {
    navigation.setParams({
      filterType: undefined,
      filterValue: undefined,
      filterLabel: undefined,
    });
  };

  const cycleSortOrder = () => {
    const orders = ['date-desc', 'date-asc', 'amount-desc', 'amount-asc'];
    setSortOrder(orders[(orders.indexOf(sortOrder) + 1) % orders.length]);
  };

  const getSortLabel = () => ({
    'date-desc': 'Newest First', 'date-asc': 'Oldest First',
    'amount-desc': 'Amount: High-Low', 'amount-asc': 'Amount: Low-High'
  })[sortOrder] || 'Sort';

  if (isLoading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0c7ff2" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{filterLabel ? filterLabel : 'Transactions'}</Text>
        <TouchableOpacity style={styles.plusButton} onPress={() => navigation.navigate('AddTransaction')}><PlusIcon color="#111418" /></TouchableOpacity>
      </View>
      <SectionList
        sections={sortedAndGroupedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionListItem item={item} categoryLabel={categories[item.category]?.label || item.category} onDelete={() => deleteTransaction(item.id)} onEdit={() => navigation.navigate('EditTransaction', { transaction: { ...item, date: item.date.toISOString() } })} />}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        ListHeaderComponent={<TransactionsListHeader searchText={searchText} setSearchText={setSearchText} filterLabel={filterLabel} clearFilter={clearFilter} activeFilter={activeFilter} setActiveFilter={setActiveFilter} sortOrder={sortOrder} cycleSortOrder={cycleSortOrder} getSortLabel={getSortLabel} />}
        ListEmptyComponent={<EmptyState filterLabel={filterLabel} />}
        contentContainerStyle={sortedAndGroupedTransactions.length === 0 ? styles.emptyListContainer : {}}
        stickySectionHeadersEnabled
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0c7ff2" colors={['#0c7ff2']} />}
      />
    </View>
  );
};

TransactionsScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      filterType: PropTypes.string,
      filterValue: PropTypes.string,
      filterLabel: PropTypes.string,
    }),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8 },
  headerTitle: { color: '#111418', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  plusButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#f9f9f9', fontSize: 14, fontWeight: 'bold', color: '#60758a', borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#f0f2f5' },
  emptyListContainer: { flex: 1 },
});

export default TransactionsScreen;