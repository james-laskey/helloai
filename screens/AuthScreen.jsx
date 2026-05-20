import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { authApi } from '../services/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthScreen = ({ onAuthComplete, onSwitchToSignup, isSignupMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState(isSignupMode ? 'signup' : 'login');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      
      if (response.success) {
        // Store tokens and user data
        await AsyncStorage.setItem('accessToken', response.accessToken);
        await AsyncStorage.setItem('refreshToken', response.refreshToken);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        onAuthComplete(response.user);
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.signup(name, email, password);
      
      if (response.success) {
        // Store tokens and user data
        
        Alert.alert('Success', 'Account created successfully!');
        onAuthComplete(response.user);
      } else {
        Alert.alert('Signup Failed', response.message || 'Could not create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Signup failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Image source={require('../assets/logoAlt.png')} style={styles.headerImg}/>
            </View>
            <Text style={styles.title}>Hello Ai</Text>
            <Text style={styles.subtitle}>The "speak easy" Language Learning App</Text>
          </View>

          <View style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#666"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            {mode === 'signup' && (
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#666"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={mode === 'login' ? handleLogin : handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleMode} style={styles.switchMode}>
              <Text style={styles.switchModeText}>
                {mode === 'login' 
                  ? "Don't have an account? Sign Up" 
                  : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6C67F2' },
  keyboardView: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoEmoji: { fontSize: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)' },
  form: { gap: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 16, height: 50 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#fff', fontSize: 16 },
  button: { backgroundColor: '#53C691', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  switchMode: { alignItems: 'center', marginTop: 16 },
  switchModeText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  headerImg: {width: 64, height: 100}
});