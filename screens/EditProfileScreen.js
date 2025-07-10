// screens/EditProfileScreen.js

import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';

import { useSettings } from '../context/SettingsContext';

// --- Icon Components ---
const ArrowLeftIcon = ({ color = '#111518' }) => ( <Svg width="24" height="24" fill={color} viewBox="0 0 256 256"><Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></Path></Svg>);

// --- Main Screen Component ---
const EditProfileScreen = ({ navigation }) => {
  const { userName, profileImageUri, updateSetting } = useSettings();

  // Local state to manage edits before saving
  const [currentName, setCurrentName] = useState(userName);
  const [currentImageUri, setCurrentImageUri] = useState(profileImageUri);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your photos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setCurrentImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Update the global context with the new values
    updateSetting('userName', currentName);
    updateSetting('profileImageUri', currentImageUri);
    // Go back to the settings screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}><ArrowLeftIcon /></TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handlePickImage}>
            <Image 
              style={styles.profileImage} 
              source={{ uri: currentImageUri || 'https://i.pravatar.cc/300' }} 
            />
            <Text style={styles.changePictureText}>Change Picture</Text>
          </TouchableOpacity>
        </View>

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

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  headerButton: { minWidth: 48, justifyContent: 'center', alignItems: 'center', height: 48 },
  headerTitle: { color: '#111518', fontSize: 18, fontWeight: 'bold' },
  saveText: { color: '#0c7ff2', fontSize: 16, fontWeight: 'bold' },
  profileSection: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  profileImage: { width: 160, height: 160, borderRadius: 80 },
  changePictureText: { color: '#0c7ff2', fontSize: 16, fontWeight: '500', marginTop: 8, textAlign: 'center' },
  inputSection: { paddingHorizontal: 24 },
  inputLabel: { color: '#60768a', fontSize: 14, marginBottom: 8 },
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
