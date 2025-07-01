import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../sbClient';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

export default function MisReportesScreen() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportes = async () => {
    setLoading(true);
              const { data: urlData, error: urlError } = supabase.storage
            .from('reportes')
            .getPublicUrl(`area-a/${file.name}`);
          if (urlError) {
            console.error('Error al obtener URL pública:', urlError.message);
            return null;
          }
          return { name: file.name, url: urlData.publicUrl };
    if (!error) {
const archivos = (await Promise.all(
  data.map(async (file) => {
    const { data: urlData, error: urlError } = supabase.storage
      .from('reportes')
      .getPublicUrl(`area-a/${file.name}`);

    if (urlError) {
      console.error('Error al obtener URL pública:', urlError.message);
      return null;
    }

    return { name: file.name, url: urlData.publicUrl };
  })
)).filter(item => item !== null);

setReportes(archivos);
    } else {
      console.error('Error al obtener reportes:', error.message);
    }
    setLoading(false);
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
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => Linking.openURL(item.url)}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
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
  item: {
    backgroundColor: colors.olive,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    color: colors.white,
    fontFamily: fonts.medium,
  },
});
