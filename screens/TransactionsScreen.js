// screens/TransactionsScreen.js

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Swipeable } from 'react-native-gesture-handler';

import { useTransactions } from '../context/TransactionContext';

// --- Icon Components ---
const PlusIcon = ({ color = '#111418' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></Path></Svg>);
const MagnifyingGlassIcon = ({ color = '#60758a' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></Path></Svg>);
const CaretDownIcon = ({ color = '#111418' }) => ( <Svg width="20" height="20" fill={color} viewBox="0 0 256 256"><Path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></Path></Svg>);
const ReceiptIcon = ({ color = '#111418' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M72,104a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,104Zm8,40h96a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16ZM232,56V208a8,8,0,0,1-11.58,7.15L192,200.94l-28.42,14.21a8,8,0,0,1-7.16,0L128,200.94,99.58,215.15a8,8,0,0,1-7.16,0L64,200.94,35.58,215.15A8,8,0,0,1,24,208V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V195.06l20.42-10.22a8,8,0,0,1,7.16,0L96,199.06l28.42-14.22a8,8,0,0,1,7.16,0L160,199.06l28.42-14.22a8,8,0,0,1,7.16,0L216,195.06Z"></Path></Svg>);

const RightSwipeActions = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.deleteBox}><Text style={styles.deleteText}>Delete</Text></View>
  </TouchableOpacity>
);

const TransactionItem = ({ item, onDelete, onEdit }) => {
  const transactionDate = new Date(item.date);
  return (
    <Swipeable renderRightActions={() => <RightSwipeActions onPress={onDelete} />}>
      {/* Wrap the item in a TouchableOpacity to handle edits */}
      <TouchableOpacity onPress={onEdit}>
        <View style={styles.transactionItem}>
          <View style={styles.transactionDetails}>
            <View style={styles.receiptIconContainer}><ReceiptIcon /></View>
            <View>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionCategory}>{item.category} ・ {transactionDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text>
            </View>
          </View>
          <Text style={[styles.transactionAmount, { color: item.amount > 0 ? '#28a745' : '#111418' }]}>
            {item.amount > 0 ? `+$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const TransactionsScreen = ({ navigation }) => {
  const { transactions, deleteTransaction } = useTransactions();
  const [searchText, setSearchText] = useState('');

  // This function returns the JSX for the header content of the list.
  const renderListHeader = () => (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <View style={styles.searchIcon}>
            <MagnifyingGlassIcon />
          </View>
          <TextInput
            placeholder="Search transactions"
            placeholderTextColor="#60758a"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>All</Text>
          <CaretDownIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Income</Text>
          <CaretDownIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Expenses</Text>
          <CaretDownIcon />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Transactions</Text><TouchableOpacity style={styles.plusButton} onPress={() => navigation.navigate('AddTransaction')}><PlusIcon /></TouchableOpacity></View>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem 
            item={item} 
            onDelete={() => deleteTransaction(item.id)}
            // Pass the navigation function to the item
            onEdit={() => navigation.navigate('EditTransaction', { transaction: item })}
          />
        )}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderListHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff'},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:40,paddingBottom:8},headerTitle:{color:'#111418',fontSize:18,fontWeight:'bold',flex:1,textAlign:'center'},plusButton:{width:48,height:48,alignItems:'center',justifyContent:'center'},searchContainer:{paddingHorizontal:16,paddingVertical:12},searchInputWrapper:{flexDirection:'row',alignItems:'center',backgroundColor:'#f0f2f5',borderRadius:8,height:48},searchIcon:{paddingLeft:16},searchInput:{flex:1,height:'100%',paddingHorizontal:8,fontSize:16,color:'#111418'},filtersContainer:{flexDirection:'row',gap:12,paddingHorizontal:12,paddingBottom:8},filterButton:{flexDirection:'row',alignItems:'center',backgroundColor:'#f0f2f5',borderRadius:8,paddingVertical:8,paddingHorizontal:16,gap:8},filterText:{color:'#111418',fontSize:14,fontWeight:'500'},
  transactionItem:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:16,minHeight:72,borderBottomWidth:1,borderBottomColor:'#f0f2f5', backgroundColor: 'white'},
  transactionDetails:{flexDirection:'row',alignItems:'center',gap:16},receiptIconContainer:{width:48,height:48,borderRadius:8,backgroundColor:'#f0f2f5',alignItems:'center',justifyContent:'center'},transactionTitle:{color:'#111418',fontSize:16,fontWeight:'500'},transactionCategory:{color:'#60758a',fontSize:14},transactionAmount:{fontSize:16},
  deleteBox: { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 100, height: '100%' },
  deleteText: { color: 'white', fontWeight: 'bold' }
});

export default TransactionsScreen;
