import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

import MainTabs from './MainTabs';
import HistoryScreen from '../screens/HistoryScreen';
import ChartsScreen from '../screens/ChartsScreen';
import MisReportesScreen from '../screens/myreportScreen';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: '#547326',
          drawerLabelStyle: {
            fontFamily: 'Poppins_500Medium',
          },
        }}
      >
        <Drawer.Screen
          name="Inicio"
          component={MainTabs}
          options={{ drawerLabel: 'Pantalla Principal' }}
        />
        <Drawer.Screen
          name="Historial de Mediciones"
          component={HistoryScreen}
        />
        <Drawer.Screen
          name="Gráficas"
          component={ChartsScreen}
        />
        <Drawer.Screen
          name="Mis Reportes"
          component={MisReportesScreen}
          options={{ drawerLabel: 'Mis Reportes PDF' }}
        />
        {/* Aquí agregas más pantallas extras si quieres */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}