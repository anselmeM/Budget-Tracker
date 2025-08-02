// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './styles/theme';

// --- Import Providers ---
import { AuthProvider, useAuth } from './context/AuthContext'; // Import new Auth context
import { TransactionProvider } from './context/TransactionContext';
import { SettingsProvider } from './context/SettingsContext';
import { BudgetProvider } from './context/BudgetContext';
import { CategoryProvider } from './context/CategoryContext';

// --- Import All Screens ---
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
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

// --- Import Icons ---
import {
  HouseIcon,
  ListBulletsIcon,
  ChartBarIcon,
  PresentationChartIcon,
  TagIcon,
} from './components/icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- Main App Navigator (Tabs) ---
// This is what the user sees after they log in.
function MainAppTabs() {
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

// --- Root Navigator ---
// This component decides which navigator to show.
function RootNavigator() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                // User is signed in, show the main app with all its screens
                <>
                    <Stack.Screen name="MainTabs" component={MainAppTabs} />
                    <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ presentation: 'modal' }} />
                    <Stack.Screen name="EditTransaction" component={EditTransactionScreen} options={{ presentation: 'modal' }} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                    <Stack.Screen name="SetBudget" component={SetBudgetScreen} options={{ presentation: 'modal' }} />
                    <Stack.Screen name="AddCategory" component={AddCategoryScreen} options={{ presentation: 'modal' }} />
                </>
            ) : (
                // No user is signed in, show the auth flow screens
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          {/* All other providers are now nested inside AuthProvider */}
          <TransactionProvider>
            <SettingsProvider>
              <BudgetProvider>
                <CategoryProvider>
                  <NavigationContainer>
                    <RootNavigator />
                  </NavigationContainer>
                </CategoryProvider>
              </BudgetProvider>
            </SettingsProvider>
          </TransactionProvider>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
