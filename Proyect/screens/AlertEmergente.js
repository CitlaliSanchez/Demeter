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
          {/* Logo principal */}
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
          {/* Imagen adicional (dimitri-06.png) */}
          <Image
            source={require('../assets/dimitri-06.png')}
            style={styles.avatar}
          />
          <Ionicons name="warning" size={40} color="#fff" style={{ marginBottom: 8 }} />
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
    width: 200,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    resizeMode: 'cover',
    backgroundColor: 'transparent',

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