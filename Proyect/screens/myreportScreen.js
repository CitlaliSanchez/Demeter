// screens/MisReportesScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Linking,
  StyleSheet, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../sbClient';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

export default function MisReportesScreen() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReportes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .storage.from('reportes')
      .list('area-a', { limit: 100, sortBy: { column: 'name', order: 'desc' } });

    if (!error && data) {
      const archivos = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = supabase
            .storage.from('reportes')
            .getPublicUrl(`area-a/${file.name}`);
          if (urlData?.publicUrl) {
            return { name: file.name, url: urlData.publicUrl };
          }
          return null;
        })
      );
      setReportes(archivos.filter(item => item !== null));
    } else {
      console.error('Error al obtener reportes:', error?.message);
    }
    setLoading(false);
  };

  const handleDelete = (fileName) => {
    Alert.alert(
      'Eliminar reporte',
      `¿Seguro que deseas eliminar el archivo "${fileName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.storage.from('reportes').remove([`area-a/${fileName}`]);
            if (error) {
              Alert.alert('Error', 'No se pudo eliminar el archivo');
              return;
            }
            setReportes((prev) => prev.filter((r) => r.name !== fileName));
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Reportes PDF</Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.olive} />
      ) : (
        <FlatList
          data={reportes}
          keyExtractor={(item) => item.name}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchReportes} />
          }
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                style={styles.item}
                onPress={() => Linking.openURL(item.url)}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.name)}
              >
                <FontAwesome5 name="eraser" size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.forest,
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  item: {
    flex: 1,
    backgroundColor: colors.olive,
    padding: 12,
    borderRadius: 10,
  },
  itemText: {
    color: colors.white,
    fontFamily: fonts.medium,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#d9534f',
    borderRadius: 8,
  },
  deleteText: {
    color: 'white',
    fontSize: 16,
  },
});
