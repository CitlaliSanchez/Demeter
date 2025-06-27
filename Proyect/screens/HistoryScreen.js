import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const AREAS = ['A', 'B', 'C'];

const generateMockData = (area) => {
  const today = new Date();
  return Array.from({ length: 15 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    return {
      id: `${area}-${i}`,
      area,
      date: date.toISOString().split('T')[0],
      ph: (5.8 + Math.random() * 2).toFixed(2),
      ec: (1.0 + Math.random() * 1.2).toFixed(2),
      temp: (22 + Math.random() * 5).toFixed(1),
      water: `${Math.floor(Math.random() * 41 + 60)}%`,
    };
  });
};

export default function HistoryScreen() {
  const [data, setData] = useState([]);
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const allData = AREAS.flatMap((area) => generateMockData(area));
    setData(allData);
  }, []);

  const handlePDF = async (areaData, areaLabel) => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { text-align: center; color: ${colors.olive}; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            th { background-color: ${colors.forest}; color: white; }
            tr:nth-child(even) { background-color: ${colors.sand}; }
          </style>
        </head>
        <body>
          <h1>Measurement Report - Area ${areaLabel}</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Temp (°C)</th>
                <th>pH</th>
                <th>EC</th>
                <th>Water Level</th>
              </tr>
            </thead>
            <tbody>
              ${areaData
                .map(
                  (item) =>
                    `<tr>
                      <td>${item.date}</td>
                      <td>${item.temp}</td>
                      <td>${item.ph}</td>
                      <td>${item.ec}</td>
                      <td>${item.water}</td>
                    </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  const renderCard = (item) => (
    <View style={styles.card} key={item.id}>
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.row}><Text style={styles.label}>Temperature:</Text><Text style={styles.value}>{item.temp} °C</Text></View>
      <View style={styles.row}><Text style={styles.label}>pH:</Text><Text style={styles.value}>{item.ph}</Text></View>
      <View style={styles.row}><Text style={styles.label}>EC:</Text><Text style={styles.value}>{item.ec}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Water Level:</Text><Text style={styles.value}>{item.water}</Text></View>
    </View>
  );

  const renderSection = (area) => {
    const areaData = data.filter((d) => d.area === area);
    const filtered = searchDate
      ? areaData.filter((d) => d.date === searchDate)
      : areaData;

    return (
      <View style={styles.section} key={area}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Area {area}</Text>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => handlePDF(filtered, area)}
          >
            <Text style={styles.exportButtonText}>Export PDF</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderCard(item)}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Measurement History</Text>

      <TextInput
        placeholder="Filter by date (YYYY-MM-DD)"
        style={styles.input}
        value={searchDate}
        onChangeText={setSearchDate}
        placeholderTextColor={colors.text}
      />

      {AREAS.map((area) => renderSection(area))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.forest,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.clay,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.lg,
    color: colors.olive,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: colors.lime,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  date: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.md,
    color: colors.clay,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontFamily: fonts.medium,
    color: colors.text,
  },
  value: {
    fontFamily: fonts.bold,
    color: colors.forest,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exportButton: {
    backgroundColor: colors.olive,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exportButtonText: {
    fontFamily: fonts.medium,
    color: colors.white,
    fontSize: fontSizes.sm,
  },
});
