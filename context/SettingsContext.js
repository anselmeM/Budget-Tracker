// context/SettingsContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_STORAGE_KEY = '@app_settings';

// 1. Create the Context
const SettingsContext = createContext();

// 2. Create the Provider
export const SettingsProvider = ({ children }) => {
  // State for each setting with default values
  const [userName, setUserName] = useState('Sophia Carter');
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- Load settings from storage when the app starts ---
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings !== null) {
          const settings = JSON.parse(storedSettings);
          setUserName(settings.userName || 'Sophia Carter');
          setProfileImageUri(settings.profileImageUri || null);
          setNotificationsEnabled(settings.notificationsEnabled || false);
          setAppLockEnabled(settings.appLockEnabled || false);
          setBiometricLockEnabled(settings.biometricLockEnabled || false);
        }
      } catch (error) {
        console.error('Failed to load settings.', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // --- This useEffect automatically saves settings whenever they change ---
  useEffect(() => {
    // We don't want to save during the initial load
    if (isLoading) {
      return;
    }

    const saveSettings = async () => {
      try {
        const settings = {
          userName,
          profileImageUri,
          notificationsEnabled,
          appLockEnabled,
          biometricLockEnabled,
        };
        const jsonValue = JSON.stringify(settings);
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, jsonValue);
      } catch (error) {
        console.error('Failed to save settings.', error);
      }
    };

    saveSettings();
  }, [userName, profileImageUri, notificationsEnabled, appLockEnabled, biometricLockEnabled, isLoading]); // Dependency array ensures this runs when any setting changes

  // --- Simplified function to only update the state ---
  // The useEffect above will handle the saving automatically.
  const updateSetting = (key, value) => {
    switch (key) {
      case 'userName': setUserName(value); break;
      case 'profileImageUri': setProfileImageUri(value); break;
      case 'notificationsEnabled': setNotificationsEnabled(value); break;
      case 'appLockEnabled': setAppLockEnabled(value); break;
      case 'biometricLockEnabled': setBiometricLockEnabled(value); break;
      default: break;
    }
  };
  
  const value = {
    userName,
    profileImageUri,
    notificationsEnabled,
    appLockEnabled,
    biometricLockEnabled,
    isLoading,
    updateSetting,
  };

  if (isLoading) {
    return null; 
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};