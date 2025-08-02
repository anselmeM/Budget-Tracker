// screens/SplashScreen.js

import React from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { theme } from '../styles/theme';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* You can replace this with your app's logo */}
      <Image 
        source={require('../assets/splash-icon.png')} 
        style={styles.logo}
      />
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Or your app's background color
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
