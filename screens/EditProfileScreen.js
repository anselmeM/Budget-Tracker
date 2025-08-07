// screens/EditProfileScreen.js

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

import { useSettings } from '../context/SettingsContext';

// --- Icon Components ---
const ArrowLeftIcon = ({ color = '#111518' }) => ( 
  <Svg width="24" height="24" fill={color} viewBox="0 0 256 256">
    <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></Path>
  </Svg>
);

ArrowLeftIcon.propTypes = {
  color: PropTypes.string,
};

// --- Main Screen Component ---
const EditProfileScreen = ({ navigation }) => {
  // 1. Get user settings from the context
  const { userName, updateSetting } = useSettings();

  // 2. Create local state to manage edits within this screen
  const [currentName, setCurrentName] = useState(userName);

  // 3. Sync local state if context changes while screen is open
  useEffect(() => {
    setCurrentName(userName);
  }, [userName]);


  // 4. Save changes back to the context
  const handleSave = () => {
    updateSetting('userName', currentName);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Name Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={currentName}
            onChangeText={setCurrentName}
            placeholder="Enter your name"
          />
        </View>
      </ScrollView>
    </View>
  );
};

EditProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  scrollContent: { 
    paddingVertical: 32, // Added padding to the top
    paddingBottom: 40 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: 40, 
    paddingBottom: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f2f5' 
  },
  headerButton: { 
    minWidth: 48, 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: 48 
  },
  headerTitle: { 
    color: '#111518', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  saveText: { 
    color: '#0c7ff2', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  inputSection: { 
    paddingHorizontal: 24 
  },
  inputLabel: { 
    color: '#60768a', 
    fontSize: 14, 
    marginBottom: 8 
  },
  input: {
    height: 56,
    borderRadius: 8,
    color: '#111518',
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

export default EditProfileScreen;
