// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import Providers
import { TransactionProvider } from './context/TransactionContext';
import { SettingsProvider } from './context/SettingsContext';
import { BudgetProvider } from './context/BudgetContext'; // Import the new provider

// --- Import All Screens ---
import OverviewScreen from './screens/OverviewScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import BudgetScreen from './screens/BudgetScreen';
import ReportsScreen from './screens/ReportsScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import EditTransactionScreen from './screens/EditTransactionScreen';
import SetBudgetScreen from './screens/SetBudgetScreen'; // Import the new screen

// --- Icon Components ---
const HouseIcon = ({ color }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" /></Svg>);
const ListBulletsIcon = ({ color }) => ( <Svg width="24" height="24" viewBox="0 0 256 256" fill={color}><Path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z" /></Svg>);
const ChartBarIcon = ({ color }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z"></Path></Svg>);
const PresentationChartIcon = ({ color }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM104,144a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></Path></Svg>);
const TagIcon = ({ color }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M213.58,118.12,137.88,42.42a28,28,0,0,0-39.6,0L22.42,118.12a28,28,0,0,0,0,39.6l75.7,75.7a28,28,0,0,0,39.6,0l75.7-75.7a28,28,0,0,0,0-39.6ZM128,152a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z"></Path></Svg>);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          if (route.name === 'OverviewTab') return <HouseIcon color={color} />;
          if (route.name === 'TransactionsTab') return <ListBulletsIcon color={color} />;
          if (route.name === 'BudgetTab') return <ChartBarIcon color={color} />;
          if (route.name === 'ReportsTab') return <PresentationChartIcon color={color} />;
          if (route.name === 'CategoriesTab') return <TagIcon color={color} />;
        },
        tabBarActiveTintColor: '#0c7ff2',
        tabBarInactiveTintColor: '#60758a',
      })}
    >
      <Tab.Screen name="OverviewTab" component={OverviewScreen} options={{ tabBarLabel: 'Overview' }} />
      <Tab.Screen name="TransactionsTab" component={TransactionsScreen} options={{ tabBarLabel: 'Transactions' }}/>
      <Tab.Screen name="BudgetTab" component={BudgetScreen} options={{ tabBarLabel: 'Budget' }}/>
      <Tab.Screen name="ReportsTab" component={ReportsScreen} options={{ tabBarLabel: 'Reports' }}/>
      <Tab.Screen name="CategoriesTab" component={CategoriesScreen} options={{ tabBarLabel: 'Categories' }}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TransactionProvider>
        <SettingsProvider>
          <BudgetProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ headerShown: false, presentation: 'modal' }} />
                <Stack.Screen name="EditTransaction" component={EditTransactionScreen} options={{ headerShown: false, presentation: 'modal' }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SetBudget" component={SetBudgetScreen} options={{ headerShown: false, presentation: 'modal' }} />
              </Stack.Navigator>
            </NavigationContainer>
          </BudgetProvider>
        </SettingsProvider>
      </TransactionProvider>
    </GestureHandlerRootView>
  );
}
