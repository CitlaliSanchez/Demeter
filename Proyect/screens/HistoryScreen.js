import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const mockData = [
  { id: '1', date: '2025-06-24', ph: 6.5, ec: 1.4, temp: 24.5, nivel: '80%' },
  { id: '2', date: '2025-06-23', ph: 6.6, ec: 1.5, temp: 25.1, nivel: '78%' },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Mediciones</Text>
      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.date}</Text>
            <Text>pH: {item.ph}</Text>
            <Text>EC: {item.ec}</Text>
            <Text>Temp: {item.temp} °C</Text>
            <Text>Nivel: {item.nivel}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.forest,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.sand,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
});
