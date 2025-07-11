// screens/ReportsScreen.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useTransactions } from '../context/TransactionContext';
import { ArrowLeftIcon } from '../components/icons';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#f9f9f9',
  backgroundGradientFrom: '#f9f9f9',
  backgroundGradientTo: '#f9f9f9',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(12, 127, 242, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(96, 117, 138, ${opacity})`,
  style: {
    borderRadius: 8,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#0c7ff2',
  },
};

const ReportsScreen = ({ route, navigation }) => {
  const { transactions } = useTransactions();
  const [activeTab, setActiveTab] = useState(route.params?.initialTab || 'Spending');

  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route.params?.initialTab]);

  const expenses = transactions.filter(t => t.amount < 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);

  const categoryData = expenses.reduce((acc, { category, amount }) => {
    const parentCategory = category.split('_')[0];
    acc[parentCategory] = (acc[parentCategory] || 0) + Math.abs(amount);
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(categoryData).map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [{
      data: Object.values(categoryData),
    }],
  };
  
  // 1. Calculate a dynamic width for the bar chart to allow for scrolling.
  // We'll give each bar ~60 pixels of space.
  const barChartWidth = Math.max(screenWidth - 32, barChartData.labels.length * 60);

  const spendingByDay = expenses.reduce((acc, { date, amount }) => {
    const day = new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    acc[day] = (acc[day] || 0) + Math.abs(amount);
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(spendingByDay).reverse(),
    datasets: [{
      data: Object.values(spendingByDay).reverse(),
    }],
    legend: ["Spending Over Time"],
  };

  const renderSpendingTab = () => (
    <>
      <View style={styles.chartCard}>
        <Text style={styles.chartCardTitle}>Spending by Category</Text>
        <Text style={styles.chartCardSubtitleText}>This Month</Text>
        {expenses.length > 0 ? (
          // 2. Wrap the BarChart in a horizontal ScrollView.
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={barChartData}
              width={barChartWidth} // Use the dynamic width
              height={220}
              yAxisLabel="$"
              chartConfig={chartConfig}
              verticalLabelRotation={30} // Keep rotation for long labels
              style={styles.chartStyle}
              fromZero={true}
            />
          </ScrollView>
        ) : <Text style={styles.noDataText}>No expense data available.</Text>}
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartCardTitle}>Spending Over Time</Text>
        <Text style={styles.chartCardSubtitleText}>This Month</Text>
        {expenses.length > 0 ? (
          <LineChart
            data={lineChartData}
            width={screenWidth - 32} // Line chart can remain fixed width
            height={220}
            yAxisLabel="$"
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
            fromZero={true}
          />
        ) : <Text style={styles.noDataText}>No expense data available.</Text>}
      </View>
    </>
  );

  const renderIncomeTab = () => (
    <View style={styles.chartCard}>
      <Text style={styles.chartCardTitle}>Total Income</Text>
      <Text style={styles.chartCardAmount}>${totalIncome.toFixed(2)}</Text>
      <Text style={styles.chartCardSubtitleText}>This month</Text>
    </View>
  );

  const renderSavingsTab = () => (
    <View style={styles.chartCard}>
      <Text style={styles.chartCardTitle}>Net Savings</Text>
      <Text style={styles.chartCardAmount}>${(totalIncome + totalExpenses).toFixed(2)}</Text>
      <Text style={styles.chartCardSubtitleText}>This month</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reports</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.topTabsContainer}>
          <TouchableOpacity onPress={() => setActiveTab('Spending')} style={[styles.topTab, activeTab === 'Spending' && styles.activeTopTab]}>
            <Text style={[styles.topTabText, activeTab === 'Spending' && styles.activeTopTabText]}>Spending</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Income')} style={[styles.topTab, activeTab === 'Income' && styles.activeTopTab]}>
            <Text style={[styles.topTabText, activeTab === 'Income' && styles.activeTopTabText]}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Savings')} style={[styles.topTab, activeTab === 'Savings' && styles.activeTopTab]}>
            <Text style={[styles.topTabText, activeTab === 'Savings' && styles.activeTopTabText]}>Savings</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'Spending' && renderSpendingTab()}
        {activeTab === 'Income' && renderIncomeTab()}
        {activeTab === 'Savings' && renderSavingsTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8 },
    backButton: { width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center' },
    headerTitle: { color: '#111418', fontSize: 18, fontWeight: 'bold' },
    topTabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#dbe0e6', paddingHorizontal: 16, gap: 32 },
    topTab: { paddingVertical: 16, borderBottomWidth: 3, borderBottomColor: 'transparent' },
    activeTopTab: { borderBottomColor: '#111418' },
    topTabText: { color: '#60758a', fontSize: 14, fontWeight: 'bold' },
    activeTopTabText: { color: '#111418' },
    chartCard: { marginHorizontal: 16, padding: 16, borderRadius: 8, backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#f0f2f5', marginTop: 16 },
    chartCardTitle: { color: '#111418', fontSize: 16, fontWeight: '500' },
    chartCardAmount: { color: '#111418', fontSize: 32, fontWeight: 'bold', marginVertical: 4 },
    chartCardSubtitleText: { color: '#60758a', fontSize: 16, marginBottom: 8 },
    chartStyle: {
        marginVertical: 8,
        borderRadius: 8,
    },
    noDataText: {
        textAlign: 'center',
        paddingVertical: 40,
        color: '#60758a',
    }
});

export default ReportsScreen;