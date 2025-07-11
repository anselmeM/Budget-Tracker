import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ReceiptIcon } from './icons';

const EmptyState = ({ filterLabel }) => (
    <View style={styles.emptyContainer}>
      <ReceiptIcon size={48} color="#dbe0e6" />
      <Text style={styles.emptyText}>{filterLabel ? `No transactions for ${filterLabel}` : 'No Transactions Yet'}</Text>
      <Text style={styles.emptySubText}>Your recent transactions will appear here.</Text>
    </View>
);

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#111418' },
  emptySubText: { fontSize: 14, color: '#60758a', textAlign: 'center' },
});

export default EmptyState;