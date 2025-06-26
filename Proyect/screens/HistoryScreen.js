import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const generarHistorialAleatorio = (cantidad = 50) => {
  const hoy = new Date();
  return Array.from({ length: cantidad }, (_, i) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);

    return {
      id: i.toString(),
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
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Temperatura</Text>
          <Text style={styles.value}>{item.temp} °C</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>pH</Text>
          <Text style={styles.value}>{item.ph}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>EC</Text>
          <Text style={styles.value}>{item.ec}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Nivel de Agua</Text>
          <Text style={styles.value}>{item.nivel}</Text>
        </View>
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
        contentContainerStyle={{ paddingBottom: 16 }}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.sand,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  date: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.lg,
    color: colors.clay,
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  box: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: 4,
  },
  value: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.md,
    color: colors.forest,
  },
});
