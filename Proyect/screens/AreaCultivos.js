import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const areasSimuladas = [
  {
    id: 'A',
    nombre: 'Área A',
    estado: 'Exceso de agua',
    ph: 6.3,
    temperatura: 25.1,
    nivelAgua: '90%',
  },
  {
    id: 'B',
    nombre: 'Área B',
    estado: 'pH fuera de rango',
    ph: 7.5,
    temperatura: 24.3,
    nivelAgua: '70%',
  },
  {
    id: 'C',
    nombre: 'Área C',
    estado: 'Óptimo',
    ph: 6.6,
    temperatura: 23.8,
    nivelAgua: '75%',
  },
];

// Imagen y color por estado
const obtenerColorYAvatar = (estado) => {
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('óptimo')) {
    return { fondo: colors.lime, imagen: require('../assets/dimitri-02.png') };
  } else if (estadoLower.includes('ph')) {
    return { fondo: colors.olive, imagen: require('../assets/dimitri-04.png') };
  } else if (estadoLower.includes('agua')) {
    return { fondo: colors.danger, imagen: require('../assets/dimitri-06.png') };
  } else {
    return { fondo: colors.clay, imagen: require('../assets/dimitri-06.png') };
  }
};

export default function AreaCultivos() {
  const [modalVisible, setModalVisible] = useState(false);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);

  const abrirDetalle = (area) => {
    setAreaSeleccionada(area);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vista del Cultivo</Text>

      <View style={styles.field}>
        {areasSimuladas.map((area) => {
          const { fondo, imagen } = obtenerColorYAvatar(area.estado);

          return (
            <TouchableOpacity
              key={area.id}
              onPress={() => abrirDetalle(area)}
              style={[styles.areaContainer, { backgroundColor: fondo }]}
            >
              <Image source={imagen} style={styles.areaImage} />
              <Text style={styles.areaText}>{area.nombre}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal Detalles */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{areaSeleccionada?.nombre}</Text>
            <Text>Estado: {areaSeleccionada?.estado}</Text>
            <Text>Temperatura: {areaSeleccionada?.temperatura} °C</Text>
            <Text>pH: {areaSeleccionada?.ph}</Text>
            <Text>Nivel de Agua: {areaSeleccionada?.nivelAgua}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.forest,
    marginBottom: 20,
  },
  field: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  areaContainer: {
    width: 140,
    height: 160,
    borderRadius: 16,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    elevation: 3,
  },
  areaImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  areaText: {
    fontSize: fontSizes.md,
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    marginBottom: 12,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: colors.clay,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modalButtonText: {
    color: colors.white,
    fontFamily: fonts.medium,
  },
});
