// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa los archivos tal como los nombraste (en minúsculas)
import login from './screens/login';
import home from './screens/home';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen
          name="login"
          component={login}
          options={{ headerShown: false }} // Ocultar encabezado si quieres
        />
        <Stack.Screen
          name="home"
          component={home}
          options={{ title: 'Inicio' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
