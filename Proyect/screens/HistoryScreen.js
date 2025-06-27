import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const AREAS = ['A', 'B', 'C'];

export default function HistoryMainScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial por Área</Text>
      {AREAS.map((area) => (
        <TouchableOpacity
          key={area}
          style={styles.button}
          onPress={() => navigation.navigate('HistorialArea', { area })}
        >
          <Text style={styles.buttonText}>Ver Área {area}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xl,
    color: colors.forest,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.clay,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.white,
  },
});
