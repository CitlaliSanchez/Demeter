// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa los archivos tal como los nombraste (en minúsculas)
import Login from '../screens/LoginScreen';
import MainTabs from '../navigation/MainTabs';
import ReportScreen from '../screens/ReportScreen';
import AreaCultivos from '../screens/AreaCultivos';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={Login}
          options={{ headerShown: false }} //oculta los encabezados
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReportScreen" //aqui se manda a la navegacion principal para el menu y que acceda a los screens
          component={ReportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AreaCultivos"
          component={AreaCultivos}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
