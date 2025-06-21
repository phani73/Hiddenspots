import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      const response = await axios.post('https://4ef2-163-223-49-198.ngrok-free.app/api/auth/signup', {
        name,
        email,
        password,
      });

      await AsyncStorage.setItem('token', response.data.token);
      Alert.alert('Signup Successful');
      router.replace('/auth/Signin');
    } catch (error: any) {
      console.error('Signup error:', error.response?.data);
      Alert.alert('Signup Failed', error.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.brand}>HiddenSpots</Text>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={24} color="#0000cd" /> : <Eye size={24} color="#0000cd" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/Signin')}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#eef3f9' },
  brand: { fontSize: 28, fontWeight: '900', color: '#0000cd', marginBottom: 10 },
  formContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { width: '100%', padding: 15, borderWidth: 1, borderColor: '#0000cd', borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#0000cd', borderRadius: 8, backgroundColor: '#fff', paddingHorizontal: 10, marginBottom: 15 },
  passwordInput: { flex: 1, padding: 15 },
  button: { backgroundColor: '#0000cd', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#0000cd', marginTop: 15, textAlign: 'center' },
});
