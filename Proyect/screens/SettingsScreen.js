import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import HistoryScreen from './HistoryScreen';
import ChartsScreen from './ChartsScreen';
import NotificationsScreen from './NotificationsScreen';
import AlertasScreen from './testAlert';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const Stack = createStackNavigator();

export default function SettingsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Menú" component={SidebarMenu} options={{ headerShown: false }} />
      <Stack.Screen name="Historial de mediciones" component={HistoryScreen} />
      <Stack.Screen name="Gráficas" component={ChartsScreen} />
      <Stack.Screen name="Notificaciones" component={NotificationsScreen} />
      <Stack.Screen name="Alertas Emergentes" component={AlertasScreen} />
    </Stack.Navigator>
  );
}

function SidebarMenu({ navigation }) {
  const options = [
    { label: 'Historial de mediciones', screen: 'Historial de mediciones' },
    { label: 'Gráficas', screen: 'Gráficas' },
    { label: 'Notificaciones', screen: 'Notificaciones' },
    { label: 'Alertas Emergentes', screen: 'Alertas Emergentes' },
  ];

  return (
    <ScrollView style={styles.menu}>
      <Text style={styles.title}>Sección Extras</Text>
      {options.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={styles.button}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Text style={styles.buttonText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    marginBottom: 20,
    color: colors.forest,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.lime,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    fontFamily: fonts.medium,
    color: colors.white,
    fontSize: fontSizes.md,
  },
});
