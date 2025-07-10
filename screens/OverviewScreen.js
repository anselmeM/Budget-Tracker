// screens/OverviewScreen.js

import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Import our custom hooks
import { useTransactions } from '../context/TransactionContext';
import { useSettings } from '../context/SettingsContext';

// --- Icon Components ---
const GearIcon = () => ( <Svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><Path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87,26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" /></Svg>);

const OverviewScreen = ({ navigation }) => {
  const { transactions } = useTransactions();
  const { userName, profileImageUri } = useSettings(); // Get user info from settings

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome + totalExpenses;

  const spendingByCategory = transactions.filter(t => t.amount < 0).reduce((acc, t) => {
      const category = t.category || 'Other';
      const amount = Math.abs(t.amount);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

  const maxSpending = Math.max(...Object.values(spendingByCategory), 1);

  const chartData = Object.entries(spendingByCategory).map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      height: `${(amount / maxSpending) * 100}%`,
    }));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollableContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Overview</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}><GearIcon /></TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <Image style={styles.profileImage} source={{ uri: profileImageUri || 'https://i.pravatar.cc/300' }} />
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>${totalBalance.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}><Text style={styles.summaryTitle}>Income</Text><Text style={styles.summaryAmount}>${totalIncome.toFixed(2)}</Text></View>
          <View style={styles.summaryBox}><Text style={styles.summaryTitle}>Expenses</Text><Text style={styles.summaryAmount}>${Math.abs(totalExpenses).toFixed(2)}</Text></View>
          <View style={styles.summaryBox}><Text style={styles.summaryTitle}>Savings</Text><Text style={styles.summaryAmount}>${netSavings.toFixed(2)}</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Spending Breakdown</Text>

        <View style={styles.spendingContainer}>
          <View style={styles.spendingInfo}><Text style={styles.spendingMonth}>This Month</Text><Text style={styles.spendingAmount}>${Math.abs(totalExpenses).toFixed(2)}</Text><Text style={styles.spendingLabel}>Current</Text></View>
          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              chartData.map(item => (
                <View key={item.name} style={styles.barContainer}>
                  <View style={[styles.bar, { height: item.height }]} />
                  <Text style={styles.barLabel}>{item.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No spending data for this period.</Text>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AddTransaction')}><Text style={styles.primaryButtonText}>Add Expense</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>View Transactions</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff'},
  scrollableContent:{paddingBottom: 120},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:40,paddingBottom:8},
  headerTitle:{color:'#111418',fontSize:18,fontWeight:'bold',textAlign:'center',flex:1,marginLeft:48},
  settingsButton:{width:48,height:48,alignItems:'center',justifyContent:'center'},
  profileSection:{alignItems:'center',padding:16},
  profileImage:{width:128,height:128,borderRadius:64,marginBottom:16},
  profileName:{color:'#111418',fontSize:22,fontWeight:'bold'},
  balanceLabel:{color:'#60758a',fontSize:16},
  balanceAmount:{color:'#60758a',fontSize:16, fontWeight: 'bold'},
  summaryContainer:{flexDirection:'row',flexWrap:'wrap',gap:16,padding:16},
  summaryBox:{flex:1,minWidth:158,gap:8,borderRadius:8,padding:24,borderWidth:1,borderColor:'#dbe0e6'},
  summaryTitle:{color:'#111418',fontSize:16,fontWeight:'500'},
  summaryAmount:{color:'#111418',fontSize:24,fontWeight:'bold'},
  sectionTitle:{color:'#111418',fontSize:22,fontWeight:'bold',paddingHorizontal:16,paddingTop:20,paddingBottom:12},
  spendingContainer:{flexDirection:'row',flexWrap:'wrap',gap:16,paddingHorizontal:16,paddingVertical:24},
  spendingInfo:{flex:1,minWidth:288,gap:8},
  spendingMonth:{color:'#111418',fontSize:16,fontWeight:'500'},
  spendingAmount:{color:'#111418',fontSize:32,fontWeight:'bold'},
  spendingLabel:{color:'#60758a',fontSize:16},
  chartContainer:{minHeight:180,flexDirection:'row',gap:24,alignItems:'flex-end',paddingHorizontal:12,flex:1,minWidth:288},
  barContainer:{flex:1,alignItems:'center',justifyContent:'flex-end',gap:4,height:'100%'},
  bar:{backgroundColor:'#f0f2f5',borderTopWidth:2,borderColor:'#60758a',width:'100%'},
  barLabel:{color:'#60758a',fontSize:13,fontWeight:'bold'},
  noDataText: { color: '#60758a', fontStyle: 'italic', textAlign: 'center', width: '100%' },
  buttonContainer:{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16,paddingVertical:12,gap:16},
  primaryButton:{flex:1,height:40,borderRadius:8,backgroundColor:'#0c7ff2',justifyContent:'center',alignItems:'center'},
  primaryButtonText:{color:'#fff',fontSize:14,fontWeight:'bold'},
  secondaryButton:{flex:1,height:40,borderRadius:8,backgroundColor:'#f0f2f5',justifyContent:'center',alignItems:'center'},
  secondaryButtonText:{color:'#111418',fontSize:14,fontWeight:'bold'},
});

export default OverviewScreen;
