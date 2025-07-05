import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  ImageBackground,
  Animated,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AlertEmergente from './AlertEmergente';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

export default function HomeScreen() {
  const [connected, setConnected] = useState(false);
  const [readings, setReadings] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const animatedValues = readings.map(() => new Animated.Value(0));

  const mensajesDeAlerta = [
    '¡pH fuera de rango detectado!',
    '¡Nivel de agua crítico!',
    '¡Temperatura demasiado alta!',
    '¡EC fuera de lo esperado!',
  ];

  const generarMensajeAleatorio = () => {
    const index = Math.floor(Math.random() * mensajesDeAlerta.length);
    return mensajesDeAlerta[index];
  };

  const sendPushNotification = async (mensaje) => {
    if (Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Alerta Hidropónica',
          body: mensaje,
          sound: 'default',
        },
        trigger: null,
      });
    }
  };

  const generateReadings = () => {
    const areas = ['Area A', 'Area B', 'Area C'];
    let simulated = [];
    for (let a = 0; a < 3; a++) {
      for (let i = 0; i < 5; i++) {
        const ph = (5 + Math.random() * 3).toFixed(2);
        simulated.push({
          id: `${a}-${i}`,
          timestamp: new Date(Date.now() - (i + a * 5) * 60000).toLocaleTimeString(),
          ph,
          ec: (1 + Math.random() * 2).toFixed(2),
          temp: (22 + Math.random() * 5).toFixed(1),
          nivel: `${Math.floor(Math.random() * 100)}%`,
          area: areas[a],
        });
      }
    }
    return simulated;
  };

  useEffect(() => {
    setTimeout(() => setConnected(true), 2000);
    const datos = generateReadings();
    setReadings(datos);

    const lecturaInterval = setInterval(() => {
      setReadings(generateReadings());
    }, 60000);

    const programarAlerta = () => {
      const tiempo = Math.floor(Math.random() * (30000 - 12000) + 12000);
      setTimeout(() => {
        const nuevoMensaje = generarMensajeAleatorio();
        setMensaje(nuevoMensaje);
        setAlertVisible(true);
        sendPushNotification(nuevoMensaje);
        programarAlerta();
      }, tiempo);
    };

    programarAlerta();

    return () => {
      clearInterval(lecturaInterval);
    };
  }, []);

  const startFadeIn = (index) => {
    Animated.timing(animatedValues[index], {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item, index }) => {
    const fadeAnim = animatedValues[index] || new Animated.Value(0);
    startFadeIn(index);

    const isAnomaly =
      parseFloat(item.ph) < 5.5 ||
      parseFloat(item.ph) > 7.0 ||
      parseFloat(item.ec) > 2.5 ||
      parseFloat(item.temp) > 28 ||
      parseInt(item.nivel) < 20;

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={[styles.card, isAnomaly && styles.cardAnomaly]}>
          <Text style={styles.timestamp}>{item.timestamp} - {item.area}</Text>
          <Text style={styles.label}>pH: <Text style={styles.value}>{item.ph}</Text></Text>
          <Text style={styles.label}>EC: <Text style={styles.value}>{item.ec}</Text></Text>
          <Text style={styles.label}>Temp: <Text style={styles.value}>{item.temp} °C</Text></Text>
          <Text style={styles.label}>Nivel: <Text style={styles.value}>{item.nivel}</Text></Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/banner.jpg')}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
      </ImageBackground>

      <Text style={[styles.status, { color: connected ? colors.lime : colors.danger }]}>
        Estado MQTT: {connected ? 'Conectado' : 'Desconectado'}
      </Text>
      <Text style={styles.title}>Latest Readings</Text>

      <FlatList
        data={readings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <AlertEmergente
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        mensaje={mensaje}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6f5',
  },
  banner: {
    width: '100%',
    height: 160,
    marginBottom: 24,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  bannerImage: {
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bannerText: {
    fontSize: fontSizes.xl + 2,
    color: colors.white,
    fontFamily: fonts.extraBold,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
    borderRadius: 6,
    textAlign: 'center',
  },
  logo: {
    width: 260,
    height: 55,
    resizeMode: 'contain',
    position: 'absolute',
    top: 12,
  },
  status: {
    fontSize: fontSizes.md,
    fontFamily: fonts.medium,
    marginBottom: 10,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.semiBold,
    marginBottom: 16,
    color: colors.forest,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.lime,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  cardAnomaly: {
    backgroundColor: '#ffecec',
    borderLeftColor: colors.danger,
  },
  timestamp: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: 2,
  },
  value: {
    fontFamily: fonts.semiBold,
    color: colors.forest,
  },
});
