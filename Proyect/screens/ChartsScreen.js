import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const screenWidth = Dimensions.get('window').width - 32;

const dataSimulada = {
  labels: ['Jun 21', 'Jun 22', 'Jun 23', 'Jun 24', 'Jun 25', 'Jun 26'],
  datasets: [
    {
      data: [6.5, 6.7, 6.4, 6.6, 6.8, 6.5],
      color: () => colors.olive,
      strokeWidth: 2,
    },
  ],
  legend: ['pH en Área A'],
};

const chartConfig = {
  backgroundColor: colors.background,
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: () => colors.forest,
  labelColor: () => colors.text,
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: colors.forest,
  },
};

export default function ChartsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gráfica de pH</Text>
      <LineChart
        data={dataSimulada}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      <Text style={styles.subtitle}>Rango Ideal: 5.5 - 7.0</Text>
      {/* Aquí podrías repetir otras gráficas: EC, temperatura, etc. */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xl,
    color: colors.forest,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.text,
    marginTop: 10,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
});
