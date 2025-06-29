import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { colors, fonts } from '../assets/styles/theme';

import HistoryScreen from '../screens/HistoryScreen';
import ChartsScreen from '../screens/ChartsScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: colors.olive,
        drawerActiveTintColor: colors.olive,
        drawerLabelStyle: {
          fontFamily: fonts.medium,
        },
      }}
    >
      <Drawer.Screen name="Historial de Mediciones" component={HistoryScreen} />
      <Drawer.Screen name="Gráficas" component={ChartsScreen} />
    </Drawer.Navigator>
  );
}
