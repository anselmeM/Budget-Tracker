// screens/ReportsScreen.js

import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

// --- Icon Components ---
const ArrowLeftIcon = ({ color = '#111418' }) => (
  <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
    <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></Path>
  </Svg>
);

// --- Chart Components ---
const SpendingBarChart = () => {
    const categories = [
        { name: 'Food', percent: '20%' },
        { name: 'Transportation', percent: '20%' },
        { name: 'Entertainment', percent: '100%' },
        { name: 'Utilities', percent: '70%' },
        { name: 'Shopping', percent: '60%' },
    ];
    return (
        <View style={styles.barChartContainer}>
            {categories.map((cat, index) => (
                <React.Fragment key={index}>
                    <Text style={styles.barChartLabel}>{cat.name}</Text>
                    <View style={styles.barWrapper}>
                        <View style={[styles.bar, { width: cat.percent }]} />
                    </View>
                </React.Fragment>
            ))}
        </View>
    );
};

const SpendingLineChart = () => (
    <View style={styles.lineChartContainer}>
        <Svg height="150" width="100%" viewBox="-3 0 478 150" preserveAspectRatio="none">
            <Defs>
                <LinearGradient id="paint0_linear" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
                    <Stop stopColor="#f0f2f5" />
                    <Stop offset="1" stopColor="#f0f2f5" stopOpacity="0" />
                </LinearGradient>
            </Defs>
            <Path
                d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                fill="url(#paint0_linear)"
            />
            <Path
                d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                stroke="#60758a"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </Svg>
        <View style={styles.lineChartLabels}>
            <Text style={styles.barChartLabel}>Jan</Text>
            <Text style={styles.barChartLabel}>Feb</Text>
            <Text style={styles.barChartLabel}>Mar</Text>
            <Text style={styles.barChartLabel}>Apr</Text>
            <Text style={styles.barChartLabel}>May</Text>
            <Text style={styles.barChartLabel}>Jun</Text>
        </View>
    </View>
);

// --- Main Screen Component ---
const ReportsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Spending');

  return (
    <View style={styles.container}>
        <ScrollView>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reports</Text>
            </View>

            {/* Top Tab Navigator */}
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

            {/* Content based on active tab */}
            {activeTab === 'Spending' && (
                <>
                    <Text style={styles.sectionTitle}>Spending by category</Text>
                    <View style={styles.chartCard}>
                        <Text style={styles.chartCardTitle}>Spending by category</Text>
                        <Text style={styles.chartCardAmount}>$1,234</Text>
                        <View style={styles.chartCardSubtitle}>
                            <Text style={styles.chartCardSubtitleText}>This month</Text>
                            <Text style={[styles.chartCardSubtitleText, { color: '#078838' }]}>+12%</Text>
                        </View>
                        <SpendingBarChart />
                    </View>

                    <Text style={styles.sectionTitle}>Spending over time</Text>
                    <View style={styles.chartCard}>
                         <Text style={styles.chartCardTitle}>Spending over time</Text>
                        <Text style={styles.chartCardAmount}>$1,234</Text>
                        <View style={styles.chartCardSubtitle}>
                            <Text style={styles.chartCardSubtitleText}>This month</Text>
                            <Text style={[styles.chartCardSubtitleText, { color: '#078838' }]}>+12%</Text>
                        </View>
                        <SpendingLineChart />
                    </View>
                </>
            )}
            {/* You can add content for 'Income' and 'Savings' tabs here */}
        </ScrollView>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8 },
    backButton: { width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center' },
    headerTitle: { color: '#111418', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', marginRight: 48 },
    topTabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#dbe0e6', paddingHorizontal: 16, gap: 32 },
    topTab: { paddingVertical: 16, borderBottomWidth: 3, borderBottomColor: 'transparent' },
    activeTopTab: { borderBottomColor: '#111418' },
    topTabText: { color: '#60758a', fontSize: 14, fontWeight: 'bold' },
    activeTopTabText: { color: '#111418' },
    sectionTitle: { color: '#111418', fontSize: 22, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 28, paddingBottom: 12 },
    chartCard: { marginHorizontal: 16, padding: 16, borderRadius: 8, backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#f0f2f5' },
    chartCardTitle: { color: '#111418', fontSize: 16, fontWeight: '500' },
    chartCardAmount: { color: '#111418', fontSize: 32, fontWeight: 'bold', marginVertical: 4 },
    chartCardSubtitle: { flexDirection: 'row', gap: 8 },
    chartCardSubtitleText: { color: '#60758a', fontSize: 16 },
    barChartContainer: { marginVertical: 12, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center' },
    barChartLabel: { color: '#60758a', fontSize: 13, fontWeight: 'bold' },
    barWrapper: { backgroundColor: '#f0f2f5', height: 16, borderRadius: 8, overflow: 'hidden' },
    bar: { height: '100%', backgroundColor: '#60758a', borderTopRightRadius: 8, borderBottomRightRadius: 8 },
    lineChartContainer: { marginVertical: 16 },
    lineChartLabels: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }
});

export default ReportsScreen;
