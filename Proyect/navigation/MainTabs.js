//archivo donde se accede a los screens, es el menu que tendra los accesos en la parte inferior
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReportScreen from '../screens/ReportScreen';
import AreaCultivos from '../screens/AreaCultivos';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    //seccion de los iconos y como se van marcando cuando cambia de pantalla
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Crops') {
            iconName = focused ? 'seedling' : 'seedling';
          } else if (route.name === 'Report') {
            iconName = focused ? 'edit' : 'edit';
          } else if (route.name === 'Extras') {
            iconName = focused ? 'bars' : 'bars';
          }

          return <FontAwesome5 name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#547326',
        tabBarInactiveTintColor: 'darkGreen',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Crops" component={AreaCultivos} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Extras" component={SettingsScreen} />
    </Tab.Navigator>
  );//cambio de las pantallas, el nombre es el nombre correcto del archivo 
}
