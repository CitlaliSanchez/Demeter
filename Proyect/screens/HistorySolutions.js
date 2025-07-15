import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, fontSizes } from '../assets/styles/theme';
import Config from '../utils/configIP';
import { supabase } from '../sbClient';

const AREAS = ['A', 'B', 'C'];
const SOLUTION_TYPES = ['General', 'Flowering', 'pH Correction', 'Flush'];

const SolutionRecordScreen = () => {
  const [area, setArea] = useState('A');
  const [type, setType] = useState('General');
  const [concentration, setConcentration] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');

  const handleConcentrationChange = (text) => {
    // If user is deleting text
    if (text.length < concentration.length) {
      setConcentration(text);
      return;
    }
    
    // If input is empty
    if (text.trim() === '') {
      setConcentration('');
      return;
    }
    
    // If user is typing a number or decimal
    if (/^[\d.]*$/.test(text)) {
      setConcentration(text);
      return;
    }
    
    // If user is adding EC or PH suffix manually
    const upperText = text.toUpperCase();
    if (upperText.endsWith('EC') || upperText.endsWith('PH')) {
      setConcentration(upperText);
      return;
    }
  };

  const handleConcentrationBlur = () => {
    if (concentration.trim() === '') {
      return;
    }
    
    // Check if it already has EC or PH
    const upperValue = concentration.toUpperCase();
    if (upperValue.endsWith('EC') || upperValue.endsWith('PH')) {
      return;
    }
    
    // Add EC by default if it's a number
    if (/^[\d.]+$/.test(concentration)) {
      setConcentration(`${concentration} EC`);
    }
  };

  const handleSubmit = async () => {
    if (!concentration || !quantity) {
      Alert.alert('Required fields', 'Please fill in all required fields.');
      return;
    }

    // Ensure concentration has proper format before submitting
    let finalConcentration = concentration;
    if (!finalConcentration.toUpperCase().endsWith('EC') && 
        !finalConcentration.toUpperCase().endsWith('PH')) {
      finalConcentration = `${finalConcentration} EC`;
    }

    const payload = {
      area,
      type,
      concentration: finalConcentration.toUpperCase(),
      quantity: parseFloat(quantity),
      date,
      created_at: new Date(),
      notes,
    };

    try {
      const resMongo = await fetch(`${Config.API_BASE_URL}/api/Solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resMongo.ok) throw new Error('MongoDB save error');

      const { error } = await supabase.from('solutions').insert([payload]);
      if (error) {
        console.error('Supabase error:', error);
        Alert.alert('Error', error.message);
        return;
      }

      Alert.alert('Success', 'Solution successfully saved');
      setConcentration('');
      setQuantity('');
      setDate(new Date());
      setNotes('');

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save the solution');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Solution Record</Text>
          <Ionicons name="water" size={28} color={colors.fern} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Application Details</Text>

          <Text style={styles.label}>Area</Text>
          <View style={styles.selectContainer}>
            {AREAS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.optionButton, area === item && styles.optionSelected]}
                onPress={() => setArea(item)}>
                <Text style={[styles.optionText, area === item && styles.optionTextSelected]}>Area {item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Solution Type</Text>
          <View style={styles.selectContainer}>
            {SOLUTION_TYPES.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.optionButton, type === item && styles.optionSelected]}
                onPress={() => setType(item)}>
                <Text style={[styles.optionText, type === item && styles.optionTextSelected]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Application Date</Text>
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)} 
            style={styles.dateButton}
          >
            <Ionicons name="calendar" size={20} color={colors.fern} style={styles.dateIcon} />
            <Text style={styles.dateText}>
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Solution Details</Text>

          <Text style={styles.label}>Concentration</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="speedometer" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="e.g., 2.5 EC or 6.2 PH"
              value={concentration}
              onChangeText={handleConcentrationChange}
              onBlur={handleConcentrationBlur}
              style={styles.input}
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.label}>Quantity (Liters)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="flask" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="e.g., 10"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Notes (optional)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="document-text" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="e.g., Post-fertilizer cleanse"
              value={notes}
              onChangeText={setNotes}
              style={[styles.input, { height: 80 }]}
              multiline
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Save Record</Text>
          <Ionicons name="save" size={20} color={colors.white} style={styles.submitIcon} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F9F5',
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.forest,
    marginBottom: 5,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.semiBold,
    color: colors.olive,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.sand,
  },
  label: {
    fontSize: fontSizes.md,
    fontFamily: fonts.medium,
    marginTop: 12,
    marginBottom: 6,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 5,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.text,
    paddingVertical: 12,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 5,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
  },
  optionSelected: {
    backgroundColor: colors.fern,
    borderColor: colors.olive,
  },
  optionText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.white,
    fontFamily: fonts.medium,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fern,
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
  },
  submitIcon: {
    marginLeft: 10,
  },
});

export default SolutionRecordScreen;