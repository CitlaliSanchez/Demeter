import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native-reanimated';
import { registerUser, loginUser } from '../FireBase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleAuth = async () => {
    setErrors({ email: '', password: '', general: '' });

    if (!email || !password) {
      setErrors({
        email: !email ? 'Correo requerido' : '',
        password: !password ? 'Contraseña requerida' : '',
        general: ''
      });
      shakeAnimation();
      return;
    }

    if (!email.includes('@')) {
      setErrors({
        email: 'Correo electrónico inválido',
        password: '',
        general: ''
      });
      shakeAnimation();
      return;
    }

    if (password.length < 6) {
      setErrors({
        email: '',
        password: 'La contraseña debe tener al menos 6 dígitos',
        general: ''
      });
      shakeAnimation();
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        await registerUser(email, password);
        Alert.alert('Éxito', 'Usuario registrado correctamente. Por favor verifica tu email.');
      } else {
        await loginUser(email, password);
        // NO navegues manualmente. AppNavigator hará el cambio automáticamente.
      }
    } catch (error) {
      let errorMessage = 'Error de credenciales';
      if (isRegistering && error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo ya está registrado';
      }
      setErrors({
        email: '',
        password: '',
        general: errorMessage
      });
      shakeAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  const shakeAnimation = () => {
    const shake = new Animated.Value(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <Animated.View
        style={[
          styles.authContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.title}>{isRegistering ? 'Create an Account' : 'Welcome'}</Text>
        <Image source={require('../assets/dimitri-01.png')} style={styles.image} />
        <Text style={styles.subtitle}>
          {isRegistering ? 'Register to get started' : 'Log in to continue'}
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail address"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
              style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        {errors.general ? (
          <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 10 }]}>
            {errors.general}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.authButton}
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <Ionicons name="refresh-outline" size={24} color="white" style={styles.loadingIcon} />
          ) : (
            <Text style={styles.authButtonText}>
              {isRegistering ? 'Register' : 'Log in'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsRegistering(!isRegistering)}
        >
          <Text style={styles.switchButtonText}>
            {isRegistering ?
              'Already have an account? Sign In' :
              "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#dff5e1',
  },
  authContainer: {
    padding: 24,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  inputIcon: {
    marginRight: 10,
  },
  passwordIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  authButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  switchButtonText: {
    color: '#27ae60',
    fontSize: 14,
  },
  loadingIcon: {
    transform: [{ rotate: '360deg' }],
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginVertical: 'auto',
    marginTop: 20,
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 20,
    marginTop: -10,
    marginBottom: 10,
  }
});
