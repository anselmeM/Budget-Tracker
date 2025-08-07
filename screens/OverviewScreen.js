// screens/OverviewScreen.js

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Svg, { Path, G, Text as SvgText, TSpan } from 'react-native-svg';
import PropTypes from 'prop-types';
import { useTransactions } from '../context/TransactionContext';
import { useSettings } from '../context/SettingsContext';
import { GearIcon, ArrowUpIcon, ArrowDownIcon, PiggyBankIcon } from '../components/icons';

const SummaryCard = ({ title, icon, currentAmount, previousAmount, onPress }) => {
  let percentageChange = 0;
  if (previousAmount > 0) {
    percentageChange = ((currentAmount - previousAmount) / previousAmount) * 100;
  } else if (currentAmount > 0) {
    percentageChange = 100;
  }
  const isPositive = title === 'Income' || title === 'Savings' ? percentageChange >= 0 : percentageChange <= 0;
  const changeColor = isPositive ? '#2ecc71' : '#e74c3c';
  const changeText = `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(0)}% from last month`;

  return (
    <TouchableOpacity style={styles.summaryBox} onPress={onPress}>
      <View style={[styles.summaryIconContainer, { backgroundColor: isPositive ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)' }]}>
        {icon}
      </View>
      <View>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={styles.summaryAmount}>${Math.abs(currentAmount).toFixed(2)}</Text>
        {previousAmount > 0 && <Text style={{ color: changeColor, fontSize: 12 }}>{changeText}</Text>}
      </View>
    </TouchableOpacity>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  currentAmount: PropTypes.number.isRequired,
  previousAmount: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
};

const DonutChart = ({ data, totalSpending }) => {
  const size = 180;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#34495e'];
  let cumulativePercentage = 0;

  const getCoordinatesForPercent = (percent) => [Math.cos(2 * Math.PI * percent) * radius, Math.sin(2 * Math.PI * percent) * radius];

  const formatCurrencyCompact = (num) => {
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}k`;
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formattedSpending = formatCurrencyCompact(Math.abs(totalSpending));
  const dynamicFontSize = formattedSpending.length > 7 ? 18 : formattedSpending.length > 5 ? 20 : 22;

  return (
    <View style={styles.donutChartContainer}>
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        <G transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
          {data.map((item, index) => {
            const percentage = totalSpending > 0 ? item.amount / totalSpending : 0;
            const [startX, startY] = getCoordinatesForPercent(cumulativePercentage);
            cumulativePercentage += percentage;
            const [endX, endY] = getCoordinatesForPercent(cumulativePercentage);
            const largeArcFlag = percentage > 0.5 ? 1 : 0;
            return <Path key={item.name} d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`} fill="none" stroke={colors[index % colors.length]} strokeWidth={strokeWidth} />;
          })}
        </G>
        <SvgText x="50%" y="50%" textAnchor="middle" fill="#111418">
          <TSpan x="50%" dy="-0.5em" fontSize={dynamicFontSize} fontWeight="bold">{formattedSpending}</TSpan>
          <TSpan x="50%" dy="1.4em" fontSize="14" fill="#60768a">Spent</TSpan>
        </SvgText>
      </Svg>
    </View>
  );
};

DonutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })).isRequired,
  totalSpending: PropTypes.number.isRequired,
};

const ChartLegend = ({ data, navigation }) => (
  <View style={styles.legendContainer}>
    {data.map((item, index) => (
      <TouchableOpacity
        key={item.name}
        style={styles.legendItem}
        onPress={() => {
          if (item.name === 'Other') {
            navigation.navigate('TransactionsTab');
          } else {
            navigation.navigate('TransactionsTab', {
              filterType: 'parent',
              filterValue: item.rawName,
              filterLabel: item.name,
              filteredTotal: item.amount,
            });
          }
        }}
      >
        <View style={[styles.legendColor, { backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#34495e'][index % 6] }]} />
        <Text style={styles.legendText}>{item.name} ({item.percentage}%)</Text>
      </TouchableOpacity>
    ))}
  </View>
);

ChartLegend.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    percentage: PropTypes.string.isRequired,
  })).isRequired,
  navigation: PropTypes.object.isRequired,
};

const OverviewScreen = ({ navigation }) => {
  const { transactions, monthlyTotals, isLoading: isTransactionsLoading } = useTransactions();
  const { userName, isLoading: isSettingsLoading } = useSettings();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (isTransactionsLoading || isSettingsLoading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0c7ff2" /></View>;
  }

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  const spendingByCategory = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const parentCategory = t.category.split('_')[0];
      acc[parentCategory] = (acc[parentCategory] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const sortedSpending = Object.entries(spendingByCategory).sort(([, a], [, b]) => b - a);
  const finalSpendingData = {};
  const maxCategoriesToShow = 5;

  if (sortedSpending.length > maxCategoriesToShow) {
    const topCategories = sortedSpending.slice(0, maxCategoriesToShow - 1);
    topCategories.forEach(([category, amount]) => (finalSpendingData[category] = amount));
    finalSpendingData['Other'] = sortedSpending.slice(maxCategoriesToShow - 1).reduce((sum, [, amount]) => sum + amount, 0);
  } else {
    sortedSpending.forEach(([category, amount]) => (finalSpendingData[category] = amount));
  }

  const chartData = Object.entries(finalSpendingData).map(([category, amount]) => ({
    rawName: category.toLowerCase(),
    name: category.charAt(0).toUpperCase() + category.slice(1),
    amount: amount,
    percentage: monthlyTotals.current.expenses === 0 ? 0 : ((amount / Math.abs(monthlyTotals.current.expenses)) * 100).toFixed(0),
  }));
  
  const greetingText = `${getGreeting()}, ${userName.split(' ')[0]}`;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollableContent}>
        <View style={styles.header}>
          <View style={styles.headerIconPlaceholder} />
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}><GearIcon /></TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <Text style={styles.profileName}>{greetingText}</Text>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
        </View>

        <View style={styles.summaryContainer}>
          <SummaryCard title="Income" icon={<ArrowUpIcon />} currentAmount={monthlyTotals.current.income} previousAmount={monthlyTotals.previous.income} onPress={() => navigation.navigate('ReportsTab', { initialTab: 'Income' })} />
          <SummaryCard title="Expenses" icon={<ArrowDownIcon />} currentAmount={monthlyTotals.current.expenses} previousAmount={monthlyTotals.previous.expenses} onPress={() => navigation.navigate('ReportsTab', { initialTab: 'Spending' })} />
          <SummaryCard title="Savings" icon={<PiggyBankIcon />} currentAmount={monthlyTotals.current.income + monthlyTotals.current.expenses} previousAmount={monthlyTotals.previous.income + monthlyTotals.previous.expenses} onPress={() => navigation.navigate('ReportsTab', { initialTab: 'Savings' })} />
        </View>

        <Text style={styles.sectionTitle}>Spending Breakdown</Text>
        <View style={styles.chartSectionContainer}>
          {chartData.length > 0 ? (
            <>
              <DonutChart data={chartData} totalSpending={Math.abs(monthlyTotals.current.expenses)} />
              <ChartLegend data={chartData} navigation={navigation} />
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <PiggyBankIcon color="#dbe0e6" size={64} />
              <Text style={styles.noDataText}>No Spending Data</Text>
              <Text style={styles.noDataSubText}>Add your first expense to see your spending breakdown here!</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AddTransaction')}><Text style={styles.primaryButtonText}>Add Expense</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('TransactionsTab')}><Text style={styles.secondaryButtonText}>View Transactions</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

OverviewScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  scrollableContent: { paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8 },
  headerIconPlaceholder: { width: 48 },
  headerTitle: { color: '#111418', fontSize: 18, fontWeight: 'bold' },
  settingsButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  profileSection: { alignItems: 'center', padding: 16, paddingTop: 24 },
  profileName: { color: '#111418', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  balanceLabel: { color: '#60758a', fontSize: 16, marginBottom: 4 },
  balanceAmount: { color: '#111418', fontSize: 28, fontWeight: 'bold' },
  summaryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, padding: 16 },
  summaryBox: { flex: 1, minWidth: 158, gap: 4, borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#dbe0e6', backgroundColor: '#fff' },
  summaryIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  summaryTitle: { color: '#111418', fontSize: 16, fontWeight: '500' },
  summaryAmount: { color: '#111418', fontSize: 24, fontWeight: 'bold' },
  sectionTitle: { color: '#111418', fontSize: 22, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  chartSectionContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 24, flexWrap: 'wrap', gap: 24 },
  donutChartContainer: { alignItems: 'center', justifyContent: 'center' },
  legendContainer: { flex: 1, minWidth: 150 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { color: '#111418', fontSize: 14 },
  noDataContainer: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  noDataText: { fontSize: 16, fontWeight: '500', color: '#111418' },
  noDataSubText: { color: '#60758a', textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, gap: 16 },
  primaryButton: { flex: 1, height: 40, borderRadius: 8, backgroundColor: '#0c7ff2', justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  secondaryButton: { flex: 1, height: 40, borderRadius: 8, backgroundColor: '#f0f2f5', justifyContent: 'center', alignItems: 'center' },
  secondaryButtonText: { color: '#111418', fontSize: 14, fontWeight: 'bold' },
});

export default OverviewScreen;
