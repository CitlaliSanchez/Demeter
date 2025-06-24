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

const generateArea = (id) => {
  const ph = (5.5 + Math.random() * 2).toFixed(2);
  const temperature = (21 + Math.random() * 9).toFixed(1);
  const level = Math.floor(Math.random() * 51) + 50;
  let status = 'Optimal';

  if (ph < 5.5 || ph > 7.0) status = 'pH Issue';
  if (level < 65) status = 'Low water level';
  if (level > 90) status = 'Excess water';
  if (temperature > 28) status = 'High Temp';

  return {
    id,
    name: `Area ${id}`,
    status,
    ph,
    temperature,
    waterLevel: `${level}%`,
  };
};

const getStyleByStatus = ({ ph, temperature, waterLevel }) => {
  const water = parseInt(waterLevel);
  const phNum = parseFloat(ph);
  const temp = parseFloat(temperature);

  if (phNum < 5.5 || phNum > 7.0 || water < 65 || water > 90) {
    return { color: '#920000', image: require('../assets/dimitri-06.png') };
  }

  if (temp > 28) {
    return { color: '#388e3c', image: require('../assets/dimitri-05.png') };
  }

  return { color: '#006600', image: require('../assets/dimitri-02.png') };
};

export default function CropAreas() {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const newAreas = ['A', 'B', 'C', 'D'].map((id) => generateArea(id));
    setAreas(newAreas);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Area Status</Text>

      {areas.map((area) => {
        const { color, image } = getStyleByStatus(area);

        return (
          <View key={area.id} style={styles.areaBoxWrapper}>
            <ImageBackground
              source={require('../assets/plants.jpg')}
              resizeMode="cover"
              imageStyle={{
                borderRadius: 16,
                opacity: 0.3,
              }}
              style={[styles.areaBox, { backgroundColor: color }]}
            >
              <View style={styles.leftSection}>
                <Image source={image} style={styles.avatar} />
                <View>
                  <Text style={styles.areaName}>{area.name}</Text>
                  <Text style={styles.status}>{area.status}</Text>
                </View>
              </View>

              <View style={styles.rightSection}>
                <Text style={styles.dataText}>Temp: {area.temperature} °C</Text>
                <Text style={styles.dataText}>pH: {area.ph}</Text>
                <Text style={styles.dataText}>Water: {area.waterLevel}</Text>
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
  areaName: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.lg,
    color: colors.white,
  },
  status: {
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