import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const estados = ['Óptimo', 'pH fuera de rango', 'Exceso de agua'];

const generarArea = (id) => {
  const ph = (5.5 + Math.random() * 2).toFixed(2); // 5.5 a 7.5
  const temperatura = (21 + Math.random() * 9).toFixed(1); // 21 a 30 °C
  const nivel = Math.floor(Math.random() * 51) + 50; // 50% a 100%
  let estado = 'Óptimo';

  if (ph < 5.5 || ph > 7.0) estado = 'pH fuera de rango';
  if (nivel < 65) estado = 'Falta de agua';
  if (nivel > 90) estado = 'Exceso de agua';
  if (temperatura > 28) estado = 'Temperatura elevada';

  return {
    id,
    nombre: `Área ${id}`,
    estado,
    ph,
    temperatura,
    nivelAgua: `${nivel}%`,
  };
};

const obtenerEstilosEstado = ({ ph, temperatura, nivelAgua }) => {
  const agua = parseInt(nivelAgua);
  const phNum = parseFloat(ph);
  const temp = parseFloat(temperatura);

  if (phNum < 5.5 || phNum > 7.0 || agua < 65 || agua > 90) {
    return { color: '#e53935', imagen: require('../assets/dimitri-06.png') }; // rojo
  }

  if (temp > 28) {
    return { color: '#388e3c', imagen: require('../assets/dimitri-05.png') };
  }

  return { color: '#81c784', imagen: require('../assets/dimitri-02.png') };
};

export default function AreaCultivos() {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const nuevasAreas = ['A', 'B', 'C', 'D'].map((id) => generarArea(id));
    setAreas(nuevasAreas);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Estado de Áreas</Text>

      {areas.map((area) => {
const { color, imagen } = obtenerEstilosEstado(area);

        return (
          <View key={area.id} style={[styles.areaBoxWrapper]}>
<ImageBackground
  source={require('../assets/plants.jpg')}
  resizeMode="contain"
  imageStyle={{
    borderRadius: 16,
    opacity: 0.3,
  }}
  style={[styles.areaBox, { backgroundColor: color }]}
>
              <View style={styles.leftSection}>
                <Image source={imagen} style={styles.avatar} />
                <View>
                  <Text style={styles.areaNombre}>{area.nombre}</Text>
                  <Text style={styles.estado}>{area.estado}</Text>
                </View>
              </View>

              <View style={styles.rightSection}>
                <Text style={styles.dataText}>Temp: {area.temperatura} °C</Text>
                <Text style={styles.dataText}>pH: {area.ph}</Text>
                <Text style={styles.dataText}>Water: {area.nivelAgua}</Text>
              </View>
            </ImageBackground>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.forest,
    marginBottom: 20,
    textAlign: 'center',
  },
  areaBoxWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  areaBox: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  avatar: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 30,
  },
  areaNombre: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.lg,
    color: colors.white,
  },
  estado: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.white,
  },
  dataText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
});
