import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image} from 'react-native';

// Simularemos conexión y datos al inicio
export default function HomeScreen() {
  const [connected, setConnected] = useState(false);
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    // Simula la conexión MQTT después de 2 segundos
    const timeout = setTimeout(() => {
      setConnected(true);
    }, 2000);

    // Simula la llegada de lecturas con el random 
    const simulatedReadings = Array.from({ length: 2 }, (_, i) => ({
      id: i.toString(),
      timestamp: new Date(Date.now() - i * 60000).toLocaleTimeString(),
      ph: (6.5 + Math.random()).toFixed(2),
      ec: (1.2 + Math.random()).toFixed(2),
      temp: (22 + Math.random() * 5).toFixed(1),
      nivel: `${Math.floor(Math.random() * 100)}%`,
    }));
    setReadings(simulatedReadings);

    return () => clearTimeout(timeout);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      <Text>pH: {item.ph}</Text>
      <Text>EC: {item.ec}</Text>
      <Text>Temp: {item.temp} °C</Text>
      <Text>Nivel: {item.nivel}</Text>
    </View>
  );

  return (
    
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
      <Image source={require('../assets/dimitri-02.png')}
            style={styles.logo}/>
      <Text>Banner</Text>
      </View>

      <Text style={[styles.status, { color: connected ? 'green' : 'red' }]}>
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
    backgroundColor: '#fff',
    paddingTop: 55,
  },
    banner: {
    backgroundColor: '#FFF8E1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  timestamp: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logo: {
    width: 400,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 12,
  },
});
