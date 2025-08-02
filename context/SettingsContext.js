// context/SettingsContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore instance
import { useAuth } from './AuthContext'; // Import useAuth to get the current user

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth(); // Get the currently logged-in user

  // State for each setting with default values
  const [userName, setUserName] = useState('Guest'); // Default to 'Guest'
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // This effect listens for real-time updates to the user's settings in Firestore
  useEffect(() => {
    let unsubscribe = () => {};

    if (user) {
      setIsLoading(true);
      const userSettingsDoc = doc(db, 'users', user.uid);

      unsubscribe = onSnapshot(userSettingsDoc, (docSnap) => {
        if (docSnap.exists()) {
          const settings = docSnap.data();
          // Update state with data from Firestore, providing defaults if fields are missing
          setUserName(settings.name || 'User');
          setProfileImageUri(settings.profileImageUri || null);
          setNotificationsEnabled(settings.notificationsEnabled || false);
          setAppLockEnabled(settings.appLockEnabled || false);
          setBiometricLockEnabled(settings.biometricLockEnabled || false);
        } else {
          // This case can happen for a brief moment for new users.
          // The signUp function in AuthContext will create this doc.
          console.log("User settings document does not exist yet.");
        }
        setIsLoading(false);
      }, (error) => {
        console.error("Failed to load settings from Firestore.", error);
        setIsLoading(false);
      });
    } else {
      // If no user is logged in, reset settings to default and stop loading
      setUserName('Guest');
      setProfileImageUri(null);
      setNotificationsEnabled(false);
      setAppLockEnabled(false);
      setBiometricLockEnabled(false);
      setIsLoading(false);
    }

    // Cleanup subscription on unmount or when user changes
    return () => unsubscribe();
  }, [user]); // Rerun this effect when the user logs in or out

  // This function now updates the settings in Firestore
  const updateSetting = async (key, value) => {
    if (!user) return;

    try {
      const userSettingsDoc = doc(db, 'users', user.uid);
      // Use setDoc with { merge: true } to update or create fields without overwriting the whole doc
      await setDoc(userSettingsDoc, { [key]: value }, { merge: true });
    } catch (error) {
      console.error('Failed to save setting to Firestore.', error);
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

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
