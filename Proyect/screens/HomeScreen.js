import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image, ImageBackground } from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

export default function HomeScreen() {
  const [connected, setConnected] = useState(false);
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setConnected(true);
    }, 2000);

    const simulatedReadings = Array.from({ length: 2 }, (_, i) => ({
      id: i.toString(),
      timestamp: new Date(Date.now() - i * 60000).toLocaleTimeString(),
      ph: (6.5 + Math.random()).toFixed(2),
      ec: (1.2 + Math.random()).toFixed(2),
      temp: (22 + Math.random() * 5).toFixed(1),
      nivel: `${Math.floor(Math.random() * 100)}%`,
    }));
    setReadings(simulatedReadings);

    const alerta = simulatedReadings.some(r => parseFloat(r.ph) < 5.5 || parseFloat(r.ph) > 7.0);
    if (alerta) {
      console.warn('¡Alerta de pH fuera de rango!');
    }
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      <Text style={styles.data}>pH: {item.ph}</Text>
      <Text style={styles.data}>EC: {item.ec}</Text>
      <Text style={styles.data}>Temp: {item.temp} °C</Text>
      <Text style={styles.data}>Nivel: {item.nivel}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/plants3.jpg')}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <Image style={styles.logo} />
        <Text style={styles.bannerText}>¡Bienvenido!</Text>
      </ImageBackground>

      <Text style={[styles.status, { color: connected ? colors.olive : colors.danger }]}>
        Estado MQTT: {connected ? 'Conectado' : 'Desconectado'}
      </Text>

      <Text style={styles.title}>Últimas Lecturas</Text>

      <FlatList
        data={readings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
    paddingTop: 0,
  },
  banner: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: fontSizes.xl,
    color: colors.white,
    fontFamily: fonts.bold,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  status: {
    fontSize: fontSizes.md,
    fontFamily: fonts.medium,
    marginBottom: 12,
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    marginBottom: 12,
    color: colors.text,
  },
  card: {
    backgroundColor: '#dff5e1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  timestamp: {
    fontFamily: fonts.medium,
    marginBottom: 5,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  data: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  logo: {
    width: 400,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 12,
  },
});
