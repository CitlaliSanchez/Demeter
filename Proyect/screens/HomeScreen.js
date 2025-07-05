import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  ImageBackground,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AlertEmergente from './AlertEmergente';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

export default function HomeScreen() {
  const [connected, setConnected] = useState(false);
  const [readings, setReadings] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [mensaje, setMensaje] = useState('');

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
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Alerta Hidropónica',
        body: mensaje,
        sound: 'default',
      },
      trigger: null,
    });
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
    setReadings(generateReadings());

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
        programarAlerta(); // vuelve a programar
      }, tiempo);
    };

    programarAlerta();

    return () => {
      clearInterval(lecturaInterval);
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.timestamp}>{item.timestamp} - {item.area}</Text>
      <Text style={styles.label}>pH: <Text style={styles.value}>{item.ph}</Text></Text>
      <Text style={styles.label}>EC: <Text style={styles.value}>{item.ec}</Text></Text>
      <Text style={styles.label}>Temp: <Text style={styles.value}>{item.temp} °C</Text></Text>
      <Text style={styles.label}>Nivel: <Text style={styles.value}>{item.nivel}</Text></Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/plants3.jpg')}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <Image style={styles.logo} source={require('../assets/logo.png')} />
        <Text style={styles.bannerText}>Welcome!</Text>
      </ImageBackground>

      <Text style={[styles.status, { color: connected ? colors.lime : colors.danger }]}>Estado MQTT: {connected ? 'Conectado' : 'Desconectado'}</Text>
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
    backgroundColor: colors.background,
  },
  banner: {
    width: '100%',
    height: 130,
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
    paddingVertical: 4,
    borderRadius: 10,
  },
  logo: {
    width: 320,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  status: {
    fontSize: fontSizes.md,
    fontFamily: fonts.medium,
    marginBottom: 10,
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    marginBottom: 12,
    color: colors.forest,
  },
  card: {
    backgroundColor: colors.sand,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  timestamp: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  value: {
    fontFamily: fonts.bold,
    color: colors.forest,
  },
});
