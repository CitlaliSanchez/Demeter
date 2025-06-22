import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';
import { generarPDF } from '../utils/pdfGenerador';

export default function ReportScreen() {
  const generarLecturasAleatorias = () => {
    const now = new Date();
    const lecturas = [];

    for (let i = 0; i < 10; i++) {
      const fecha = new Date(now.getTime() - i * 3600000);
      lecturas.push({
        date: fecha.toLocaleString('es-MX'),
        ph: (6.2 + Math.random() * 0.6).toFixed(2),
        ec: (1.2 + Math.random() * 0.5).toFixed(2),
        temp: (22 + Math.random() * 5).toFixed(1),
        nivel: `${Math.floor(Math.random() * 41) + 60}%`,
      });
    }

    return lecturas;
  };

  const handleGenerar = async () => {
    const reportData = generarLecturasAleatorias();
    await generarPDF(reportData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Generar Reporte</Text>
      <Text style={styles.paragraph}>
        Genera un Reporte PDF con lecturas simuladas de pH, EC, temperatura y nivel de agua.
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