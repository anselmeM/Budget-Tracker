// screens/SettingsScreen.js

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Import our custom hook to use the settings context
import { useSettings } from '../context/SettingsContext';
import { useTransactions } from '../context/TransactionContext';

// --- Icon Components ---
const ArrowLeftIcon = ({ color = '#111518' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></Path></Svg>);
const CloudArrowUpIcon = ({ color = '#111518' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M248,128a87.34,87.34,0,0,1-17.6,52.81,8,8,0,1,1-12.8-9.62A71.34,71.34,0,0,0,232,128a72,72,0,0,0-144,0,8,8,0,0,1-16,0,88,88,0,0,1,3.29-23.88C74.2,104,73.1,104,72,104a48,48,0,0,0,0,96H96a8,8,0,0,1,0,16H72A64,64,0,1,1,81.29,88.68,88,88,0,0,1,248,128Zm-90.34-5.66a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L144,147.31V208a8,8,0,0,0,16,0V147.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z"></Path></Svg>);
const CloudArrowDownIcon = ({ color = '#111518' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M248,128a87.34,87.34,0,0,1-17.6,52.81,8,8,0,1,1-12.8-9.62A71.34,71.34,0,0,0,232,128a72,72,0,0,0-144,0,8,8,0,0,1-16,0,88,88,0,0,1,3.29-23.88C74.2,104,73.1,104,72,104a48,48,0,0,0,0,96H96a8,8,0,0,1,0,16H72A64,64,0,1,1,81.29,88.68,88,88,0,0,1,248,128Zm-69.66,42.34L160,188.69V128a8,8,0,0,0-16,0v60.69l-18.34-18.35a8,8,0,0,0-11.32,11.32l32,32a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"></Path></Svg>);
const CaretRightIcon = ({ color = '#111518' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></Path></Svg>);

// --- Reusable Setting Item Component ---
const SettingItem = ({ label, value, type = 'text', onValueChange, isEnabled, onPress }) => {
  const renderValue = () => {
    switch (type) {
      case 'switch':
        return <Switch trackColor={{ false: '#f0f2f5', true: '#0b80ee' }} thumbColor={'#fff'} onValueChange={onValueChange} value={isEnabled} />;
      case 'icon':
        return value;
      default:
        return <Text style={styles.itemValue}>{value}</Text>;
    }
  };

  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <Text style={styles.itemLabel}>{label}</Text>
      {renderValue()}
    </TouchableOpacity>
  );
};

// --- Main Screen Component ---
const SettingsScreen = ({ navigation }) => {
  const {
    userName,
    profileImageUri,
    notificationsEnabled,
    appLockEnabled,
    biometricLockEnabled,
    updateSetting,
  } = useSettings();

  const { transactions } = useTransactions();

  const handleBackup = () => {
    const dataToBackup = JSON.stringify(transactions);
    Alert.alert('Backup Data', `You have ${transactions.length} transactions to back up.`);
    console.log(dataToBackup);
  };

  const handleRestore = () => {
    Alert.alert('Restore Data', 'This feature is not yet implemented.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><ArrowLeftIcon /></TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Image 
            style={styles.profileImage} 
            source={{ uri: profileImageUri || 'https://i.pravatar.cc/300' }} 
          />
          <Text style={styles.profileName}>{userName}</Text>
          {/* This button now navigates to the EditProfile screen */}
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.profileActionText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>General</Text>
        <SettingItem label="Currency" value="USD" />
        <SettingItem label="Date Format" value="MM/DD/YYYY" />
        <SettingItem label="Notifications" type="switch" isEnabled={notificationsEnabled} onValueChange={(value) => updateSetting('notificationsEnabled', value)} />
        
        <Text style={styles.sectionTitle}>Data</Text>
        <SettingItem label="Backup Data" type="icon" value={<CloudArrowUpIcon />} onPress={handleBackup} />
        <SettingItem label="Restore Data" type="icon" value={<CloudArrowDownIcon />} onPress={handleRestore} />

        <Text style={styles.sectionTitle}>Security</Text>
        <SettingItem label="App Lock" type="switch" isEnabled={appLockEnabled} onValueChange={(value) => updateSetting('appLockEnabled', value)} />
        <SettingItem label="Biometric Lock" type="switch" isEnabled={biometricLockEnabled} onValueChange={(value) => updateSetting('biometricLockEnabled', value)} />

        <Text style={styles.sectionTitle}>Appearance</Text>
        <SettingItem label="Theme" value="System" />
        
        <Text style={styles.sectionTitle}>About</Text>
        <SettingItem label="About & Help" type="icon" value={<CaretRightIcon />} onPress={() => Alert.alert('Help', 'This feature is not yet implemented.')} />
      </ScrollView>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  backButton: { width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { color: '#111518', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', marginRight: 48 },
  profileSection: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  profileImage: { width: 128, height: 128, borderRadius: 64 },
  profileName: { color: '#111518', fontSize: 22, fontWeight: 'bold' },
  profileActionText: { color: '#60768a', fontSize: 16 },
  sectionTitle: { color: '#111518', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, minHeight: 56, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  itemLabel: { color: '#111518', fontSize: 16, flex: 1 },
  itemValue: { color: '#111518', fontSize: 16 },
});

export default SettingsScreen;
