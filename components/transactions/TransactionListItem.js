import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { ReceiptIcon } from '../icons';

const RightSwipeActions = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.deleteBox}>
    <Text style={styles.deleteText}>Delete</Text>
  </TouchableOpacity>
);

const TransactionListItem = ({ item, onDelete, onEdit, categoryLabel }) => (
  <Swipeable renderRightActions={() => <RightSwipeActions onPress={onDelete} />}>
    <TouchableOpacity onPress={onEdit}>
      <View style={styles.transactionItem}>
        <View style={styles.transactionDetails}>
          <View style={styles.receiptIconContainer}><ReceiptIcon /></View>
          <View>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionCategory}>{categoryLabel}</Text>
          </View>
        </View>
        <Text style={[styles.transactionAmount, { color: item.amount > 0 ? '#2ecc71' : '#111418' }]}>
          {item.amount > 0 ? `+$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}
        </Text>
      </View>
    </TouchableOpacity>
  </Swipeable>
);

const styles = StyleSheet.create({
  deleteBox: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, minHeight: 72, borderBottomWidth: 1, borderBottomColor: '#f0f2f5', backgroundColor: 'white' },
  transactionDetails: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  receiptIconContainer: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#f0f2f5', alignItems: 'center', justifyContent: 'center' },
  transactionTitle: { color: '#111418', fontSize: 16, fontWeight: '500' },
  transactionCategory: { color: '#60758a', fontSize: 14 },
  transactionAmount: { fontSize: 16, fontWeight: '500' },
});

export default TransactionListItem;