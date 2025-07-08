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

import { colors, fonts, fontSizes } from '../assets/styles/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const logoAnim = useState(new Animated.Value(0))[0];

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
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1200,
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
        {/* LOGO ANIMADO */}
        <Animated.Image
          source={require('../assets/logodemujer.png')}
          style={[
            styles.logo,
            {
              opacity: logoAnim,
              transform: [
                {
                  scale: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }
              ]
            }
          ]}
        />

        {/* SLOGAN */}
        <Text style={styles.slogan}>Smart farming, better future</Text>

        {/* TÍTULO */}
        <Text style={styles.title}>
          {isRegistering ? 'Join Demeter' : 'Welcome to Demeter'}
        </Text>

        {/* IMAGEN DE CULTIVO */}
        <Image source={require('../assets/dimitri-01.png')} style={styles.image} />

        {/* SUBTÍTULO */}
        <Text style={styles.subtitle}>
          {isRegistering ? 'Register to start monitoring your crops' : 'Log in to manage your crops'}
        </Text>

        {/* INPUT EMAIL */}
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

        {/* INPUT PASSWORD */}
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

        {/* BOTÓN PRINCIPAL */}
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

        {/* CAMBIO DE MODO */}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsRegistering(!isRegistering)}
        >
          <Text style={styles.switchButtonText}>
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
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
    backgroundColor: colors.white, // Color de fondo
  },
  authContainer: {
    padding: 24,
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 6,
  },
  slogan: {
    fontSize: fontSizes.sm,
    color: colors.clay,
    textAlign: 'center',
    fontFamily: fonts.italic,
    marginBottom: 8,
  },
  title: {
    fontSize: fontSizes.xl + 6,
    fontFamily: fonts.bold,
    color: colors.forest,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.lime,
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
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  authButton: {
    backgroundColor: colors.lime,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  authButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontFamily: fonts.semiBold,
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  switchButtonText: {
    color: colors.lime,
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSizes.sm - 2,
    marginLeft: 20,
    marginTop: -10,
    marginBottom: 10,
    fontFamily: fonts.regular,
  },
  loadingIcon: {
    transform: [{ rotate: '360deg' }],
  },
});
