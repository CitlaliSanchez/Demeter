import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AlertEmergente({ visible, onClose, mensaje }) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
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
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.danger,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  mensaje: {
    color: '#fff',
    fontSize: fontSizes.md,
    fontFamily: fonts.medium,
    marginVertical: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: fonts.medium,
    color: colors.danger,
  },
});