import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const AREAS = ['A', 'B', 'C'];

const generarHistorialAleatorio = (cantidad = 50) => {
  const hoy = new Date();
  return Array.from({ length: cantidad }, (_, i) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);

    return {
      id: i.toString(),
      area: AREAS[Math.floor(Math.random() * AREAS.length)],
      date: fecha.toISOString().split('T')[0],
      ph: (5.8 + Math.random() * 2).toFixed(2),
      ec: (1.0 + Math.random() * 1.2).toFixed(2),
      temp: (22 + Math.random() * 5).toFixed(1),
      nivel: `${Math.floor(Math.random() * 41 + 60)}%`,
    };
  });
};

export default function HistoryScreen() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const historial = generarHistorialAleatorio();
    setDatos(historial);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.area}>Área {item.area}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Temp:</Text>
        <Text style={styles.value}>{item.temp} °C</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>pH:</Text>
        <Text style={styles.value}>{item.ph}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>EC:</Text>
        <Text style={styles.value}>{item.ec}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Nivel:</Text>
        <Text style={styles.value}>{item.nivel}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Mediciones</Text>
      <FlatList
        data={datos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.forest,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  area: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.lg,
    color: colors.clay,
  },
  date: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.olive,
  },
  value: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
    color: colors.forest,
  },
});
