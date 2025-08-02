// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './styles/theme';

// Import Providers
import { TransactionProvider } from './context/TransactionContext';
import { SettingsProvider } from './context/SettingsContext';
import { BudgetProvider } from './context/BudgetContext';
import { CategoryProvider } from './context/CategoryContext'; // Import the new provider

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
import SetBudgetScreen from './screens/SetBudgetScreen';
import AddCategoryScreen from './screens/AddCategoryScreen';

// --- Import Icons from central file ---
import {
  HouseIcon,
  ListBulletsIcon,
  ChartBarIcon,
  PresentationChartIcon,
  TagIcon,
} from './components/icons';

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
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
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
        <PaperProvider theme={theme}>
            <TransactionProvider>
                <SettingsProvider>
                <BudgetProvider>
                    <CategoryProvider>
                    <NavigationContainer>
                        <Stack.Navigator>
                        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
                        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ headerShown: false, presentation: 'modal' }} />
                        <Stack.Screen name="EditTransaction" component={EditTransactionScreen} options={{ headerShown: false, presentation: 'modal' }} />
                        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="SetBudget" component={SetBudgetScreen} options={{ headerShown: false, presentation: 'modal' }} />
                        <Stack.Screen name="AddCategory" component={AddCategoryScreen} options={{ headerShown: false, presentation: 'modal' }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                    </CategoryProvider>
                </BudgetProvider>
                </SettingsProvider>
            </TransactionProvider>
        </PaperProvider>
    </GestureHandlerRootView>
  );
}