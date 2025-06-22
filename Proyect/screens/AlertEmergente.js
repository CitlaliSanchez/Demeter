import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AlertEmergente({ visible, onClose, mensaje }) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Ionicons name="warning" size={40} color="#fff" />
          <Text style={styles.mensaje}>{mensaje}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: colors.danger,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%'
  },
  mensaje: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fonts.med,
    marginVertical: 16,
    textAlign: 'center'
  },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12
  },
  buttonText: {
    fontFamily: fonts.med,
    color: colors.danger
  }
});
