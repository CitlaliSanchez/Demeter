import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

import MainTabs from './MainTabs';
import HistoryScreen from '../screens/HistoryScreen';
import ChartsScreen from '../screens/ChartsScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = () => {
    signOut(getAuth())
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Cerrar sesión"
        onPress={handleLogout}
        labelStyle={{ color: 'red' }}
      />
    </DrawerContentScrollView>
  );
}

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
    </Drawer.Navigator>
  );
}
