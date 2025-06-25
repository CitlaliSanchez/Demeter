import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

import HomeScreen from '../screens/HomeScreen';
import AreaCultivos from '../screens/CropsScreen';
import ReportScreen from '../screens/ReportScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 12,
        },
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Crops') iconName = 'seedling';
          else if (route.name === 'Report') iconName = 'edit';

          return <FontAwesome5 name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#547326',
        tabBarInactiveTintColor: 'darkgreen',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Crops" component={AreaCultivos} />
      <Tab.Screen name="Report" component={ReportScreen} />
    </Tab.Navigator>
  );
}