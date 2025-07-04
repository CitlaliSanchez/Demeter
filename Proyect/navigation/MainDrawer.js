import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainTabs from './MainTabs';
import HistoryScreen from '../screens/HistoryScreen';
import ChartsScreen from '../screens/ChartsScreen';
import MisReportesScreen from '../screens/myreportScreen';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
  return (
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
    </Drawer.Navigator>
  );
}
