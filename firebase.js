// firebase.js

// Import the compatibility layer
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Import the necessary modules for React Native persistence
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN8o2lB4Lwn9GjpJ-2IMI0JJk3kW3ShMM",
  authDomain: "budgettracker-8263b.firebaseapp.com",
  projectId: "budgettracker-8263b",
  storageBucket: "budgettracker-8263b.appspot.com",
  messagingSenderId: "984211561050",
  appId: "1:984211561050:web:b2db5ddb95d4d256d85663",
  measurementId: "G-849FTWWDHC"
};

// Initialize Firebase App
let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

// Initialize Auth with persistence to save the user's session.
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Now, we can get the compat instances which will use the configured services.
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db, firebase };
