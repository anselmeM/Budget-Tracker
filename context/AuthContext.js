// context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth'; 
import { doc, setDoc } from 'firebase/firestore'; // 1. Import Firestore functions
import { Alert } from 'react-native';
import { auth, db } from '../firebase'; // 2. Import db instance
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Login Error", error.message);
      console.error("Login error:", error);
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // 3. After creating the user, create a document for them in Firestore
      if (newUser) {
        await setDoc(doc(db, "users", newUser.uid), {
          uid: newUser.uid,
          name: name,
          email: email,
          createdAt: new Date(),
        });
      }

      console.log("Account created for:", newUser.email);
    } catch (error) {
      Alert.alert("Sign Up Error", error.message);
      console.error("Sign up error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset", "A password reset link has been sent to your email address.");
    } catch (error) {
      Alert.alert("Password Reset Error", error.message);
      console.error("Password reset error:", error);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signUp,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
