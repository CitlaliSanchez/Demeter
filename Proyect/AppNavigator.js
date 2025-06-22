import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import login from './screens/login';
import home from './screens/home';
import TestAlert from './screens/testAlert';
import ReportScreen from './screens/ReportScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen
          name="login"
          component={login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home"
          component={home}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen
          name="TestAlert"
          component={TestAlert}
          options={{ title: 'Alerta de Prueba' }}
        />
<Stack.Screen
  name="ReportScreen"
  component={ReportScreen}
  options={{ title: 'Reporte' }}
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}