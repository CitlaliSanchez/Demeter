import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useState } from 'react';

import mainNav from '../navigation/MainTabs'

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí puedes poner tu lógica de autenticación pero aun se quedara asi, aun sin login completo//
    if (username === 'admin' && password === '1234') {
      alert('Login exitoso');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
   //Titulo e imagen del login, debajo los inputs de usuario y contraseña
   <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>
       <Image
            source={require('../assets/dimitri-01.png')}
            style={styles.logo}
          />

      <TextInput
        style={styles.input}
        placeholder="User"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(mainNav)}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
   },   
    logo: {
    width: 400,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 12,
  }
});
