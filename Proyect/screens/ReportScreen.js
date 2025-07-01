import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Buffer } from 'buffer';

import { generarPDF } from '../utils/pdfGenerador';
import { supabase } from '../sbClient';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

export default function ReportScreen() {
  const [image, setImage] = useState(null);

  const reportData = [
    { date: '2025-06-21', ph: 6.5, ec: 1.4, temp: 24.2, nivel: '80%' },
    { date: '2025-06-22', ph: 6.7, ec: 1.5, temp: 25.1, nivel: '77%' },
    { date: '2025-06-23', ph: 6.4, ec: 1.3, temp: 23.8, nivel: '82%' },
    { date: '2025-06-24', ph: 6.6, ec: 1.6, temp: 24.5, nivel: '75%' },
    { date: '2025-06-25', ph: 6.8, ec: 1.7, temp: 25.0, nivel: '78%' },
    { date: '2025-06-26', ph: 6.5, ec: 1.4, temp: 24.2, nivel: '80%' },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Activa el permiso de cámara para tomar fotos del cultivo.');
      }
    })();
  }, []);

const pickImage = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a la cámara');
    return;
  }

  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(manipResult.uri);
    }
  } catch (error) {
    Alert.alert('Error', 'No se pudo abrir la cámara: ' + error.message);
  }
};

const handleGenerar = async () => {
  try {
    if (!image) {
      Alert.alert('Atención', 'Por favor toma una foto antes de generar el reporte.');
      return;
    }

    console.log('Generando PDF...');
    const pdfUri = await generarPDF(reportData, image);
    console.log('PDF generado en:', pdfUri);

    if (!pdfUri) {
      throw new Error('No se generó URI del PDF');
    }

    const fileBase64 = await FileSystem.readAsStringAsync(pdfUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log('PDF leído en base64, tamaño:', fileBase64.length);

    const fileName = `reporte-${Date.now()}.pdf`;

    const { error } = await supabase.storage
      .from('reportes')
      .upload(`area-a/${fileName}`, Buffer.from(fileBase64, 'base64'), {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      console.error('Error al subir PDF:', error);
      Alert.alert('Error', 'No se pudo subir el reporte: ' + error.message);
    } else {
      Alert.alert('Éxito', `Reporte subido como ${fileName}`);
    }
  } catch (err) {
    console.error('Error en handleGenerar:', err);
    Alert.alert('Error', 'Ocurrió un problema al generar o subir el PDF: ' + err.message);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Generar Reporte</Text>
      <Text style={styles.paragraph}>
        Agrega una foto del cultivo y genera un PDF con las últimas mediciones.
      </Text>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Tomar Foto del Cultivo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGenerar}>
        <Text style={styles.buttonText}>Generar y Subir PDF</Text>
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
  preview: {
    width: 280,
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.clay,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: fonts.medium,
    color: colors.white,
    fontSize: fontSizes.md,
  },
});
