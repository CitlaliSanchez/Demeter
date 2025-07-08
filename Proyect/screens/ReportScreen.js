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
import { Picker } from '@react-native-picker/picker';

import { generarPDF } from '../utils/pdfGenerador';
import { supabase } from '../sbClient';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const AREAS = ['Area A', 'Area B', 'Area C'];

export default function ReportScreen() {
  const [image, setImage] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedArea, setSelectedArea] = useState(AREAS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateMockData();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) setUserEmail(currentUser.email);

    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please enable camera access to take crop photos.');
    }
  };

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
      Alert.alert('Error', 'Failed to take photo: ' + error.message);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const pdfUri = await generarPDF(reportData, image, observaciones, userEmail, selectedArea);
      
      if (Platform.OS === 'web') {
        Alert.alert('Notice', 'PDF generated. Upload to Supabase is not available on web browser.');
        return;
      }

      const fileBase64 = await FileSystem.readAsStringAsync(pdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileName = `report-${selectedArea.toLowerCase().replace(' ', '-')}-${Date.now()}.pdf`;

      const { error } = await supabase.storage
        .from('reportes')
        .upload(`${selectedArea.toLowerCase().replace(' ', '-')}/${fileName}`, Buffer.from(fileBase64, 'base64'), {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      Alert.alert('Success', `Report for ${selectedArea} uploaded successfully!`);
      setImage(null);
      setObservaciones('');
    } catch (err) {
      console.error('Error in handleGenerate:', err);
      Alert.alert('Error', 'There was a problem generating or uploading the PDF: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={require('../assets/logodemujer.png')} style={styles.logo} />
          <Image source={require('../assets/dimitri-01.png')} style={styles.avatar} />
        </View>
        
        <Text style={styles.title}>Generate Crop Report</Text>
        <Text style={styles.paragraph}>Add a photo, write observations, and generate PDF report</Text>

        <View style={styles.areaSelector}>
          <Text style={styles.inputLabel}>Select Area:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedArea}
              onValueChange={(itemValue) => setSelectedArea(itemValue)}
              style={styles.picker}
              dropdownIconColor={colors.forest}
              mode="dropdown"
            >
              {AREAS.map(area => (
                <Picker.Item key={area} label={area} value={area} />
              ))}
            </Picker>
          </View>
        </View>

        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.preview} />
            <TouchableOpacity 
              style={styles.removeImageButton} 
              onPress={() => setImage(null)}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>
            {image ? 'Retake Photo' : 'Take Photo of Crop'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.inputLabel}>Farmer's Observations</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={5}
          value={observaciones}
          onChangeText={setObservaciones}
          placeholder="Write your comments here..."
          placeholderTextColor="#888"
          textAlignVertical="top"
        />

        <TouchableOpacity 
          style={[styles.button, styles.generateButton, isGenerating && styles.disabledButton]} 
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          <Text style={styles.buttonText}>
            {isGenerating ? 'Generating...' : 'Generate and Upload PDF'}
          </Text>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
  },
  avatar: {
    width: 60,
    height: 60,
    resizeMode: 'contain', // Cambiado para mostrar la imagen completa
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xl,
    color: colors.forest,
    marginBottom: 10,
    textAlign: 'center',
  },
  paragraph: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  areaSelector: {
    width: '100%',
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 6,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  preview: {
    width: 280,
    height: 180,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 25,
    minHeight: 120,
    fontSize: fontSizes.md,
  },
  button: {
    backgroundColor: colors.clay,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  generateButton: {
    backgroundColor: colors.forest,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: fonts.medium,
    color: colors.white,
    fontSize: fontSizes.md,
  },
});