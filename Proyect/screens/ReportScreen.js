import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Alert, Platform, TextInput, KeyboardAvoidingView
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Buffer } from 'buffer';
import { getAuth } from 'firebase/auth';

import { generarPDF } from '../utils/pdfGenerador';
import { supabase } from '../sbClient';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

export default function ReportScreen() {
  const [image, setImage] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const area = 'Area A'; // You could make this dynamic later

  useEffect(() => {
    generateMockData();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) setUserEmail(currentUser.email);

    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please enable camera access to take crop photos.');
      }
    })();
  }, []);

  const generateMockData = () => {
    const today = new Date();
    const data = [];
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        ph: (6.5 + Math.random() * 0.4).toFixed(2),
        ec: (1.2 + Math.random() * 0.5).toFixed(2),
        temp: (23 + Math.random() * 3).toFixed(1),
        nivel: `${70 + Math.floor(Math.random() * 10)}%`,
      });
    }
    setReportData(data);
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

  const handleGenerate = async () => {
    try {
      const pdfUri = await generarPDF(reportData, image, observaciones, userEmail, area);
      if (Platform.OS === 'web') {
        Alert.alert('Notice', 'PDF generated. Upload to Supabase is not available on web browser.');
        return;
      }

      const fileBase64 = await FileSystem.readAsStringAsync(pdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileName = `report-${area.toLowerCase().replace(' ', '-')}-${Date.now()}.pdf`;

      const { error } = await supabase.storage
        .from('reportes')
        .upload(`${area.toLowerCase().replace(' ', '-')}/${fileName}`, Buffer.from(fileBase64, 'base64'), {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (error) {
        Alert.alert('Error', 'Failed to upload report: ' + error.message);
      } else {
        Alert.alert('Success', `Report uploaded as ${fileName}`);
      }
    } catch (err) {
      console.error('Error in handleGenerate:', err);
      Alert.alert('Error', 'There was a problem generating or uploading the PDF.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Generate Report {area}</Text>
        <Text style={styles.paragraph}>Add a photo of the crop, write your observations, and generate a PDF</Text>

        {image && <Image source={{ uri: image }} style={styles.preview} />}

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Take a photo of the crop</Text>
        </TouchableOpacity>

        <Text style={styles.inputLabel}>Farmer's observations</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={5}
          value={observaciones}
          onChangeText={setObservaciones}
          placeholder="Write your comments here..."
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>Generate and Upload PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    width: 260,
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.text,
    marginBottom: 6,
  },
  textArea: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 12,
    fontFamily: fonts.regular,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.clay,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    fontFamily: fonts.medium,
    color: colors.white,
    fontSize: fontSizes.md,
  },
});
