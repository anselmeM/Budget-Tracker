// screens/CategoriesScreen.js

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// --- Icon Components ---
const ArrowLeftIcon = ({ color = '#111418' }) => (
  <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
    <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></Path>
  </Svg>
);
const CurrencyDollarIcon = ({ color = '#111418' }) => (
  <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
    <Path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"></Path>
  </Svg>
);
const ChartLineIcon = ({ color = '#111418' }) => (
  <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
    <Path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></Path>
  </Svg>
);
const QuestionIcon = ({ color = '#111418' }) => (
  <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
    <Path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></Path>
  </Svg>
);
const PizzaIcon = ({ color = '#111418' }) => (
  <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
    <Path d="M239.54,63a15.91,15.91,0,0,0-7.25-9.9,201.49,201.49,0,0,0-208.58,0,16,16,0,0,0-5.37,22l96,157.27a16,16,0,0,0,27.36,0l96-157.27A15.82,15.82,0,0,0,239.54,63ZM63.59,118.5a24,24,0,1,1,24.47,40.09Zm87.92,66.95A24,24,0,0,1,176,145.37Zm32.93-53.93a40,40,0,0,0-41.38,67.77L128,224,96.5,172.43a40,40,0,1,0-41.35-67.76L48.8,94.26a152,152,0,0,1,158.39,0Zm31.1-50.93a168.12,168.12,0,0,0-175.08,0L32,66.77a185.6,185.6,0,0,1,192,0Z"></Path>
  </Svg>
);
const ShoppingBagIcon = ({ color = '#111418' }) => (
  <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
    <Path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></Path>
  </Svg>
);
const HouseIcon = ({ color = '#111418' }) => (
  <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
    <Path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></Path>
  </Svg>
);
const CarIcon = ({ color = '#111418' }) => (
  <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
    <Path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24.89,56H44.31ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,152a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,152Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,152Z"></Path>
  </Svg>
);
const PlusIcon = ({ color = '#fff' }) => (
    <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
        <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></Path>
    </Svg>
);

// --- Reusable Category Item Component ---
const CategoryItem = ({ Icon, label }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.iconContainer}>
      <Icon />
    </View>
    <Text style={styles.categoryLabel}>{label}</Text>
  </TouchableOpacity>
);

// --- Main Screen Component ---
const CategoriesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      {/* List of Categories */}
      <ScrollView>
        <Text style={styles.sectionTitle}>Income</Text>
        <CategoryItem Icon={CurrencyDollarIcon} label="Salary" />
        <CategoryItem Icon={ChartLineIcon} label="Investments" />
        <CategoryItem Icon={QuestionIcon} label="Other" />

        <Text style={styles.sectionTitle}>Expenses</Text>
        <CategoryItem Icon={PizzaIcon} label="Food & Drinks" />
        <CategoryItem Icon={ShoppingBagIcon} label="Shopping" />
        <CategoryItem Icon={HouseIcon} label="Housing" />
        <CategoryItem Icon={CarIcon} label="Transportation" />
        {/* Add other expense categories as needed */}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <PlusIcon />
      </TouchableOpacity>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#111418',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 48, // Balance the back button
  },
  sectionTitle: {
    color: '#111418',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 56,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    color: '#111418',
    fontSize: 16,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#0c7ff2',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CategoriesScreen;
