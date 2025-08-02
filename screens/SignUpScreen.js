// screens/SignUpScreen.js

import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    ActivityIndicator, 
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

// --- Icon Components ---
const AppLogo = ({ color = '#000', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth="16">
        <Path d="M128 24L224 88V168L128 232L32 168V88L128 24Z" />
        <Path d="M32 88L128 128L224 88" />
        <Path d="M128 128V232" />
    </Svg>
);
const AppleIcon = () => <Svg width="20" height="20" viewBox="0 0 24 24" fill="black"><Path d="M19.3,5.63a4.88,4.88,0,0,0-4.3-2.5C13.13,3.12,12.26,4,12,4s-.93-.88-2.7-.88A4.83,4.83,0,0,0,4.7,5.63C2.1,8.5.6,12.5,2.6,15.8,3.7,17.5,5.5,19,7.3,19a3.13,3.13,0,0,0,2.1-.75,1,1,0,0,0,.5-.75c0-.38,0-1.63,0-1.63a5.5,5.5,0,0,1-1.5-3.88,5.13,5.13,0,0,1,5.25-5.12,4.88,4.88,0,0,1,4.5,5.25,5.45,5.45,0,0,1-1.5,3.75s0,1.25,0,1.63a1,1,0,0,0,.5.75,3.13,3.13,0,0,0,2.1.75c1.8,0,3.6-1.5,4.7-3.2C24.6,12.5,21.9,8.5,19.3,5.63ZM12,1.5A2.88,2.88,0,0,0,9.5,3.25,2.5,2.5,0,0,0,12,5a2.5,2.5,0,0,0,2.5-1.75A2.88,2.88,0,0,0,12,1.5Z"/></Svg>;
const GoogleIcon = () => <Svg width="20" height="20" viewBox="0 0 24 24" fill="none"><Path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM11.49 15.75V12.75H9V10.5H11.49V8.25H13.47V10.5H15.75V12.75H13.47V15.75H11.49Z" fill="#4285F4"/><Path fillRule="evenodd" clipRule="evenodd" d="M21.8,12.01C21.8,11.31,21.74,10.64,21.62,10H12V13.48H17.64C17.4,14.52,16.8,15.4,15.91,16L15.9,18.48H18.4C19.89,17.07,20.8,15.12,20.8,12.84C20.8,12.56,20.78,12.28,20.74,12H21.8V12.01Z" fill="#4285F4"/><Path fillRule="evenodd" clipRule="evenodd" d="M12 22C14.63,22,16.94,21.1,18.4,19.6L15.9,17.1C15.01,17.7,13.63,18.2,12,18.2C9.43,18.2,7.24,16.5,6.44,14.2H3.88V16.7C5.29,19.5,8.39,22,12,22Z" fill="#34A853"/><Path fillRule="evenodd" clipRule="evenodd" d="M6.44 14.2C6.2 13.5,6.06 12.76,6.06 12C6.06 11.24,6.2 10.5,6.44 9.8L3.88 7.3C2.88 9.1,2.3 10.5,2.3 12C2.3 13.5,2.88 14.9,3.88 16.7L6.44 14.2Z" fill="#FBBC05"/><Path fillRule="evenodd" clipRule="evenodd" d="M12 5.8C13.26 5.8 14.36 6.2 15.2 7L17.7 4.5C16.1 3 14.1 2 12 2C8.39 2 5.29 4.5 3.88 7.3L6.44 9.8C7.24 7.5 9.43 5.8 12 5.8Z" fill="#EA4335"/></Svg>;
const FacebookIcon = () => <Svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><Path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></Svg>;

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
    }
    setLoading(true);
    await signUp(name, email, password);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <AppLogo size={32} />
                        <TouchableOpacity><Text style={styles.skipText}>Skip</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.headerTitle}>Create an Account</Text>
                    <Text style={styles.headerSubtitle}>Join us for an exceptional experience.</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />

                    <Text style={styles.label}>Phone/Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone/Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                    </TouchableOpacity>
                </View>

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialButton}><AppleIcon /></TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}><GoogleIcon /></TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}><FacebookIcon /></TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.switchText}>
                        Already have an account? <Text style={styles.signInText}>Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  keyboardAvoidingView: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24 },
  scrollViewContent: {
    paddingTop: 60, // Adjust this value to control the space from the top
  },
  header: { 
    marginBottom: 40, // Adjust this value to control space between header and form
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  skipText: { fontSize: 16, color: theme.colors.placeholder },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: theme.colors.placeholder },
  formContainer: {},
  label: { fontSize: 14, color: theme.colors.text, marginBottom: 8, fontWeight: '500' },
  input: { height: 50, borderRadius: 8, color: theme.colors.text, backgroundColor: '#f7f7f7', paddingHorizontal: 16, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#eee' },
  button: { borderRadius: 12, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary, marginTop: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { marginHorizontal: 16, color: theme.colors.placeholder },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
  footer: { paddingVertical: 20, alignItems: 'center' },
  switchText: { color: theme.colors.placeholder, fontSize: 16 },
  signInText: { color: theme.colors.primary, fontWeight: 'bold' },
});

export default SignUpScreen;
