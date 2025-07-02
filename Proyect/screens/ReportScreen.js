import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Buffer } from 'buffer';

import { generarPDF } from '../utils/pdfGenerador';
import { supabase } from '../sbClient';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

export default function ReportScreen() {
  const [image, setImage] = useState(null);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    generarDatosSimulados(); // cargar últimas 15 mediciones
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Activa el permiso de cámara para tomar fotos del cultivo.');
      }
    })();
  }, []);

  const generarDatosSimulados = () => {
    const hoy = new Date();
    const datos = [];

    for (let i = 14; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      datos.push({
        date: fecha.toISOString().split('T')[0],
        ph: (6.5 + Math.random() * 0.4).toFixed(2),
        ec: (1.2 + Math.random() * 0.5).toFixed(2),
        temp: (23 + Math.random() * 3).toFixed(1),
        nivel: `${70 + Math.floor(Math.random() * 10)}%`,
      });
    }
    setReportData(datos);
  };

  const pickImage = async () => {
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
  };

  const handleGenerar = async () => {
    try {
      console.log('Generando PDF...');
      const pdfUri = await generarPDF(reportData, image);

      if (Platform.OS === 'web') {
        Alert.alert('Aviso', 'PDF generado y descargado en web. La subida a Supabase no está disponible en navegador.');
        return;
      }

      const fileBase64 = await FileSystem.readAsStringAsync(pdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileName = `reporte-area-a-${Date.now()}.pdf`;

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
      Alert.alert('Error', 'Ocurrió un problema al generar o subir el PDF.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Generar Reporte del Área A</Text>
      <Text style={styles.paragraph}>Agrega una foto del cultivo y genera un PDF con las últimas 15 mediciones.</Text>

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