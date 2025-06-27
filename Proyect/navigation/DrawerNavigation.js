import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

import HistoryScreen from '../screens/HistoryScreen';
import ChartsScreen from '../screens/ChartsScreen';

async function loadFonts() {
  await Font.loadAsync({
    'Poppins-Regular': {
      uri: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
      display: Font.FontDisplay.FALLBACK,
    },
    'Poppins-Medium': {
      uri: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2',
      display: Font.FontDisplay.FALLBACK,
    },
    'Poppins-SemiBold': {
      uri: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2',
      display: Font.FontDisplay.FALLBACK,
    },
    'Poppins-Bold': {
      uri: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2',
      display: Font.FontDisplay.FALLBACK,
    },
  });
}

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