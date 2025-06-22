import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [connected, setConnected] = useState(false);
  const [readings, setReadings] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setConnected(true);
    }, 2000);

    const simulatedReadings = Array.from({ length: 20 }, (_, i) => ({
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
      <Text style={[styles.status, { color: connected ? 'green' : 'red' }]}>
        Estado MQTT: {connected ? 'Conectado' : 'Desconectado'}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TestAlert')}
      >
        <Text style={styles.buttonText}>Ir a TestAlert</Text>
      </TouchableOpacity>
<TouchableOpacity
  style={[styles.button, { backgroundColor: '#28a745' }]}
  onPress={() => navigation.navigate('ReportScreen')}
>
  <Text style={styles.buttonText}>Ir a Reporte</Text>
</TouchableOpacity>

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
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});