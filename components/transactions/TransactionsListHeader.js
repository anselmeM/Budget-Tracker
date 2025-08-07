import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon, ArrowUpDownIcon } from '../icons';

const TransactionsListHeader = ({ 
  searchText, 
  setSearchText, 
  filterLabel, 
  clearFilter, 
  activeFilter, 
  setActiveFilter, 
  cycleSortOrder, 
  getSortLabel 
}) => (
  <>
    <View style={styles.searchContainer}>
      <View style={styles.searchInputWrapper}>
        <View style={styles.searchIcon}><MagnifyingGlassIcon /></View>
        <TextInput placeholder="Search transactions" placeholderTextColor="#60758a" style={styles.searchInput} value={searchText} onChangeText={setSearchText} />
      </View>
    </View>
    {filterLabel && (
      <View style={styles.filterActiveContainer}>
          <View>
              <Text style={styles.filterActiveText}>Showing transactions for</Text>
              <Text style={styles.filterActiveLabel}>{filterLabel}</Text>
          </View>
          <TouchableOpacity onPress={clearFilter} style={styles.clearButton}>
              <Text style={styles.clearFilterText}>Clear Filter</Text>
          </TouchableOpacity>
      </View>
    )}
    <View style={styles.filtersContainer}>
      <TouchableOpacity style={[styles.filterButton, activeFilter === 'All' && styles.activeFilterButton]} onPress={() => setActiveFilter('All')}><Text style={[styles.filterText, activeFilter === 'All' && styles.activeFilterText]}>All</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.filterButton, activeFilter === 'Income' && styles.activeFilterButton]} onPress={() => setActiveFilter('Income')}><Text style={[styles.filterText, activeFilter === 'Income' && styles.activeFilterText]}>Income</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.filterButton, activeFilter === 'Expenses' && styles.activeFilterButton]} onPress={() => setActiveFilter('Expenses')}><Text style={[styles.filterText, activeFilter === 'Expenses' && styles.activeFilterText]}>Expenses</Text></TouchableOpacity>
      <TouchableOpacity style={styles.sortButton} onPress={cycleSortOrder}><ArrowUpDownIcon /><Text style={styles.filterText}>{getSortLabel()}</Text></TouchableOpacity>
    </View>
  </>
);

TransactionsListHeader.propTypes = {
  searchText: PropTypes.string.isRequired,
  setSearchText: PropTypes.func.isRequired,
  filterLabel: PropTypes.string,
  clearFilter: PropTypes.func.isRequired,
  activeFilter: PropTypes.string.isRequired,
  setActiveFilter: PropTypes.func.isRequired,
  cycleSortOrder: PropTypes.func.isRequired,
  getSortLabel: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  searchInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f2f5', borderRadius: 8, height: 48 },
  searchIcon: { paddingLeft: 16 },
  searchInput: { flex: 1, height: '100%', paddingHorizontal: 8, fontSize: 16, color: '#111418' },
  filterActiveContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f0f2f5', borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#dbe0e6' },
  filterActiveText: { color: '#60758a', fontSize: 14 },
  filterActiveLabel: { color: '#111418', fontSize: 18, fontWeight: 'bold' },
  clearButton: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#dbe0e6' },
  clearFilterText: { color: '#60758a', fontWeight: 'bold' },
  filtersContainer: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 8, flexWrap: 'wrap' },
  filterButton: { backgroundColor: '#f0f2f5', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  activeFilterButton: { backgroundColor: '#0c7ff2' },
  filterText: { color: '#111418', fontSize: 14, fontWeight: '500' },
  activeFilterText: { color: '#fff' },
  sortButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f2f5', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, gap: 4 },
});

export default TransactionsListHeader;