import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';
import { generarPDF } from '../utils/pdfGenerador';

export default function ReportScreen() {
  const reportData = [
    { date: '2025-06-21', ph: 6.5, ec: 1.4, temp: 24.2, nivel: '80%' },
    { date: '2025-06-22', ph: 6.7, ec: 1.5, temp: 25.1, nivel: '77%' },
    { date: '2025-06-23', ph: 6.4, ec: 1.3, temp: 23.8, nivel: '82%' },
    { date: '2025-06-24', ph: 6.6, ec: 1.6, temp: 24.5, nivel: '75%' },
    { date: '2025-06-25', ph: 6.8, ec: 1.7, temp: 25.0, nivel: '78%' },
    { date: '2025-06-26', ph: 6.5, ec: 1.4, temp: 24.2, nivel: '80%' },
  ];

  const handleGenerar = async () => {
    await generarPDF(reportData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Generar Reporte</Text>
      <Text style={styles.paragraph}>
        Aquí puedes generar un reporte PDF con las últimas lecturas de tus cultivos.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleGenerar}>
        <Text style={styles.buttonText}>Generar y Compartir PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xl,
    color: colors.forest,
    marginBottom: 10,
  },
  paragraph: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.clay,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: fonts.medium,
    color: colors.white,
    fontSize: fontSizes.md,
  },
});