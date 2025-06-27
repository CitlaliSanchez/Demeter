import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Font from 'expo-font';

const AREAS = ['A', 'B', 'C'];

async function loadFonts() {
  await Font.loadAsync({
    [fonts.regular]: {
      uri: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
      display: Font.FontDisplay.FALLBACK,
    },
    [fonts.medium]: {
      uri: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2',
      display: Font.FontDisplay.FALLBACK,
    },
    [fonts.bold]: {
      uri: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLBT5Z1xlFQ.woff2',
      display: Font.FontDisplay.FALLBACK,
    },
  });
}

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
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
    const allData = AREAS.flatMap((area) => generateMockData(area));
    setData(allData);
  }, []);

  const handlePDF = async (areaData, areaLabel) => {
    const html = `
      <html>
        <head>
          <style>
            @font-face {
              font-family: 'Poppins';
              src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
            }
            @font-face {
              font-family: 'Poppins';
              src: url('https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2') format('woff2');
              font-weight: 500;
              font-style: normal;
            }
            @font-face {
              font-family: 'Poppins';
              src: url('https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLBT5Z1xlFQ.woff2') format('woff2');
              font-weight: 700;
              font-style: normal;
            }
            
            body { 
              font-family: 'Poppins', sans-serif; 
              padding: 30px; 
              background: ${colors.background}; 
              color: ${colors.text}; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid ${colors.border};
            }
            h1 { 
              color: ${colors.forest}; 
              margin-bottom: 8px; 
              font-weight: 700;
              font-size: 24px;
            }
            h2 { 
              font-weight: 500; 
              margin-bottom: 0; 
              color: ${colors.textSecondary}; 
              font-size: 16px;
            }
            .report-info {
              display: flex;
              justify-content: space-between;
              margin-top: 15px;
              color: ${colors.textSecondary};
              font-size: 14px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th, td { 
              border: 1px solid ${colors.border}; 
              padding: 12px 15px; 
              text-align: center; 
              font-size: 14px; 
            }
            th { 
              background-color: ${colors.forest}; 
              color: ${colors.white}; 
              font-weight: 700;
              letter-spacing: 0.5px;
            }
            tr:nth-child(even) { 
              background-color: #f9fafb; 
            }
            tr:hover {
              background-color: #f3f4f6;
            }
            .footer { 
              text-align: center; 
              margin-top: 40px; 
              font-size: 12px; 
              color: ${colors.textSecondary};
              padding-top: 20px;
              border-top: 1px solid ${colors.border};
            }
            .logo {
              color: ${colors.olive};
              font-weight: 700;
              font-size: 14px;
              letter-spacing: 1px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Demeter Hydroponics Report</h1>
            <h2>Measurement History - Area ${areaLabel}</h2>
            <div class="report-info">
              <span>Generated: ${new Date().toLocaleDateString()}</span>
              <span>Total Records: ${areaData.length}</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Temp (°C)</th>
                <th>pH</th>
                <th>EC (dS/m)</th>
                <th>Water Level</th>
              </tr>
            </thead>
            <tbody>
              ${areaData
                .map(
                  (item) => `
                    <tr>
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
          
          <div class="footer">
            <div class="logo">DEMETER</div>
            <div>Smart Hydroponics Monitoring System</div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ 
        html,
        width: 595,
        height: 842,
      });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Share Area ${areaLabel} Report`,
        UTI: 'com.adobe.pdf'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const renderCard = (item) => (
    <View style={styles.card} key={item.id}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{item.date}</Text>
        <View style={[styles.areaBadge, { backgroundColor: getAreaColor(item.area) }]}>
          <Text style={styles.areaText}>Area {item.area}</Text>
        </View>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Temperature</Text>
          <Text style={styles.metricValue}>{item.temp}°C</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>pH Level</Text>
          <Text style={styles.metricValue}>{item.ph}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>EC</Text>
          <Text style={styles.metricValue}>{item.ec}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Water</Text>
          <Text style={styles.metricValue}>{item.water}</Text>
        </View>
      </View>
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
          <View style={[styles.areaHeader, { borderLeftColor: getAreaColor(area) }]}>
            <Text style={styles.sectionTitle}>Area {area}</Text>
            <Text style={styles.recordCount}>{filtered.length} records</Text>
          </View>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => handlePDF(filtered, area)}
          >
            <Text style={styles.exportButtonText}>Export PDF</Text>
          </TouchableOpacity>
        </View>
        
        {filtered.length > 0 ? (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderCard(item)}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No data available</Text>
          </View>
        )}
      </View>
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontFamily: fonts.regular }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>Measurement History</Text>
        <Text style={styles.subtitle}>Track your hydroponics system metrics</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Filter by date (YYYY-MM-DD)"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={searchDate}
          onChangeText={setSearchDate}
        />
        {searchDate ? (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchDate('')}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      
      {AREAS.map((area) => renderSection(area))}
    </ScrollView>
  );
}

const getAreaColor = (area) => {
  const colors = {
    'A': '#4F772D',
    'B': '#66A649',
    'C': '#8C5F37'
  };
  return colors[area] || '#4F772D';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.forest,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.text,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  clearButton: {
    marginLeft: 10,
    padding: 10,
  },
  clearButtonText: {
    fontFamily: fonts.medium,
    color: colors.forest,
    fontSize: fontSizes.md,
  },
  section: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  areaHeader: {
    borderLeftWidth: 4,
    paddingLeft: 12,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.lg,
    color: colors.text,
    marginBottom: 2,
  },
  recordCount: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 0,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  date: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  areaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  areaText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  metricItem: {
    width: '50%',
    padding: 8,
  },
  metricLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.lg,
    color: colors.text,
  },
  exportButton: {
    backgroundColor: colors.forest,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  exportButtonText: {
    fontFamily: fonts.medium,
    color: colors.white,
    fontSize: fontSizes.sm,
    marginLeft: 6,
  },
  listContent: {
    paddingTop: 8,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  emptyText: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontSize: fontSizes.md,
  },
});