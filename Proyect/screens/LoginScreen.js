import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useState } from 'react';
import mainNav from '../navigation/MainTabs';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      alert('Login exitoso');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.header}></Image>
      <Text style={styles.subheader}>Inicia sesión en Demeter :)</Text>

      <Image
        source={require('../assets/dimitri-01.png')}
        style={styles.logo}
      />

      <TextInput
        style={styles.input}
        placeholder="User"
        placeholderTextColor={colors.text}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.text}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(mainNav)}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgot}>¿Olvidaste tu contraseña? <Text style={styles.click}>Haz clic aquí</Text></Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#dff5e1',
  },
  header: {
    color: colors.olive,
    marginBottom: 4,
    width:110,
    height:60,
  },
  subheader: {
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 14,
    paddingLeft: 20,
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lime,
  },
  button: {
    backgroundColor: colors.lime,
    padding: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fonts.medium,
  },
  forgot: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  click: {
    color: colors.forest,
    fontFamily: fonts.bold,
  },
});
