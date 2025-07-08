// archivo donde se accede a los screens, es el menú que tendrá los accesos en la parte inferior
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReportScreen from '../screens/ReportScreen';
import ChartsScreen from '../screens/ChartsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    // sección de los iconos y cómo se van marcando cuando cambia de pantalla
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Charts') {
            iconName = focused ? 'seedling' : 'seedling';
          } else if (route.name === 'Report') {
            iconName = focused ? 'edit' : 'edit';
          }

          return <FontAwesome5 name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#547326',
        tabBarInactiveTintColor: 'darkGreen',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Charts" component={ChartsScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
    </Tab.Navigator>
  );
}
