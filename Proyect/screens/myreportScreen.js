import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Linking,
  StyleSheet, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../sbClient';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const AREAS = ['area-a', 'area-b', 'area-c'];

export default function MisReportesScreen() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArea, setSelectedArea] = useState('area-a');

  const fetchReportes = async (area = selectedArea) => {
    setLoading(true);
    const { data, error } = await supabase
      .storage.from('reportes')
      .list(area, { limit: 100, sortBy: { column: 'name', order: 'desc' } });

    if (!error && data) {
      const archivos = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = supabase
            .storage.from('reportes')
            .getPublicUrl(`${area}/${file.name}`);
          if (urlData?.publicUrl) {
            return { name: file.name, url: urlData.publicUrl };
          }
          return null;
        })
      );
      setReportes(archivos.filter(item => item !== null));
    } else {
      console.error('Error al obtener reportes:', error?.message);
      Alert.alert('Error', 'No se pudieron cargar los reportes.');
      setReportes([]);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReportes(selectedArea);
  }, [selectedArea]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReportes(selectedArea);
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
            const { error } = await supabase.storage.from('reportes').remove([`${selectedArea}/${fileName}`]);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reports PDF</Text>

      {/* Selector de área */}
      <View style={styles.tabs}>
        {AREAS.map(area => (
          <TouchableOpacity
            key={area}
            style={[styles.tab, selectedArea === area && styles.activeTab]}
            onPress={() => setSelectedArea(area)}
          >
            <Text style={[styles.tabText, selectedArea === area && styles.activeTabText]}>
              {area.toUpperCase().replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.olive} />
      ) : reportes.length === 0 ? (
        <Text style={styles.noReportsText}>No hay reportes para {selectedArea.toUpperCase().replace('-', ' ')}.</Text>
      ) : (
        <FlatList
          data={reportes}
          keyExtractor={(item) => item.name}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
  },
  activeTab: {
    backgroundColor: colors.olive,
  },
  tabText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  noReportsText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
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
});
