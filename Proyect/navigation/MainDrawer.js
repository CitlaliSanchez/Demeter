import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

import MainTabs from './MainTabs';
import HistoryScreen from '../screens/HistoryScreen';
import MyReportsScreen from '../screens/myreportScreen';
import HistorySolutions from '../screens/HistorySolutions';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = () => {
    signOut(getAuth())
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Log out"
        onPress={handleLogout}
        labelStyle={{ color: 'red' }}
      />
    </DrawerContentScrollView>
  );
}

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: '#547326',
        drawerLabelStyle: {
          fontFamily: fonts.semiBold,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={MainTabs}
        options={{ drawerLabel: 'Main Screen' }}
      />
      <Drawer.Screen
        name="Measurement History"
        component={HistoryScreen}
      />
      <Drawer.Screen
        name="My Reports"
        component={MyReportsScreen}
        options={{ drawerLabel: 'My PDF Reports' }}
      />
      <Drawer.Screen
        name="Solutions History"
        component={HistorySolutions}
        options={{ drawerLabel: 'Solutions Record' }}
/>
    </Drawer.Navigator>
  );
}
