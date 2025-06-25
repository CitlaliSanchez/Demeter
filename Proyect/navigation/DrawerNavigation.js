import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

import HistoryScreen from '../screens/HistoryScreen';
import ChartsScreen from '../screens/ChartsScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: '#547326',
        drawerActiveTintColor: '#547326',
        drawerLabelStyle: {
          fontFamily: 'Poppins_500Medium',
        },
      }}
    >
      <Drawer.Screen name="Historial de Mediciones" component={HistoryScreen} />
      <Drawer.Screen name="Gráficas" component={ChartsScreen} />
    </Drawer.Navigator>
  );
}
