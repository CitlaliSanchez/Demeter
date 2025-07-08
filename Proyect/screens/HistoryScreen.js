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
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import config from '../utils/configIP';

const AREAS = ['A', 'B', 'C'];

export default function HistoryScreen() {
  const [data, setData] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get historical data from MongoDB
      const response = await axios.get(`${config.API_BASE_URL}/api/sensors`);
      
      if (response.data && response.data.length > 0) {
        // Format data to match expected structure
        
        const formattedData = response.data.map(item => {
  const values = item.values || item; // Si no hay `values`, usa el objeto directo
  return {
    id: item._id,
    area: item.area.replace('Area ', ''),
    date: new Date(item.createdAt).toISOString().split('T')[0],
    ph: values.ph ? values.ph.toFixed(2) : '0.00',
    ec: values.conductivity ? values.conductivity.toFixed(2) : '0.00',
    temp: values.water_temp ? values.water_temp.toFixed(1) : '0.0',
    water: values.water_level ? `${Math.round(values.water_level)}%` : '0%'
  };
});
        
        setData(formattedData);
      } else {
        setData([]);
        setError('No historical data available');
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Error loading historical data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handlePDF = async (areaData, areaLabel) => {
    const html = `
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 30px; 
              background: #f8f9fa; 
              color: #333; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #ddd;
            }
            h1 { 
              color: #4F772D; 
              margin-bottom: 8px; 
              font-weight: bold;
              font-size: 24px;
            }
            h2 { 
              font-weight: 500; 
              margin-bottom: 0; 
              color: #6c757d; 
              font-size: 16px;
            }
            .report-info {
              display: flex;
              justify-content: space-between;
              margin-top: 15px;
              color: #6c757d;
              font-size: 14px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px 15px; 
              text-align: center; 
              font-size: 14px; 
            }
            th { 
              background-color: #4F772D; 
              color: white; 
              font-weight: bold;
            }
            tr:nth-child(even) { 
              background-color: #f9f9f9; 
            }
            .footer { 
              text-align: center; 
              margin-top: 40px; 
              font-size: 12px; 
              color: #6c757d;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .logo {
              color: #6A994E;
              font-weight: bold;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Demeter Hydroponics Report</h1>
            <h2>Measurement History - Area ${areaLabel}</h2>
            <div class="report-info">
              <span>Generated: ${new Date().toLocaleDateString()}</span>
              <span>Records: ${areaData.length}</span>
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
            <div>Hydroponic Monitoring System</div>
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
        dialogTitle: `Area ${areaLabel} Report`,
        UTI: 'com.adobe.pdf'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const renderCard = (item) => (
    <View style={styles.card} key={item.id}>
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar" size={16} color={colors.textSecondary} />
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={[styles.areaBadge, { backgroundColor: getAreaColor(item.area) }]}>
          <Text style={styles.areaText}>Area {item.area}</Text>
        </View>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Ionicons name="thermometer" size={14} color={colors.clay} />
            <Text style={styles.metricLabel}>Temperature</Text>
          </View>
          <Text style={styles.metricValue}>{item.temp}°C</Text>
        </View>
        
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Ionicons name="water" size={14} color={colors.olive} />
            <Text style={styles.metricLabel}>pH Level</Text>
          </View>
          <Text style={[
            styles.metricValue,
            (parseFloat(item.ph) < 5.8 || parseFloat(item.ph) > 6.5) ? { color: colors.danger } : null
          ]}>{item.ph}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Ionicons name="flash" size={14} color={colors.lime} />
            <Text style={styles.metricLabel}>Conductivity</Text>
          </View>
          <Text style={[
            styles.metricValue,
            (parseFloat(item.ec) < 1.5 || parseFloat(item.ec) > 2.0) ? { color: colors.danger } : null
          ]}>{item.ec} dS/m</Text>
        </View>
        
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Ionicons name="beaker" size={14} color={colors.forest} />
            <Text style={styles.metricLabel}>Water Level</Text>
          </View>
          <Text style={[
            styles.metricValue,
            (parseInt(item.water) < 70 || parseInt(item.water) > 90) ? { color: colors.danger } : null
          ]}>{item.water}</Text>
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
            style={[
              styles.exportButton,
              filtered.length === 0 && styles.disabledButton
            ]}
            onPress={() => handlePDF(filtered, area)}
            disabled={filtered.length === 0}
          >
            <Ionicons name="download" size={16} color={colors.white} />
            <Text style={styles.exportButtonText}>Export</Text>
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
            <Ionicons name="alert-circle" size={24} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No data available</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.olive} />
        <Text style={styles.loadingText}>Loading historical data...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scroll}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.olive]}
          tintColor={colors.olive}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Measurement History</Text>
        <Text style={styles.subtitle}>Hydroponic system metrics record</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
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
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      {error && !loading ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={24} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        AREAS.map((area) => renderSection(area))
      )}
    </ScrollView>
  );
}

const getAreaColor = (area) => {
  const colors = {
    'A': '#4F772D',  // Dark green
    'B': '#66A649',  // Light green
    'C': '#8C5F37'   // Brown
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
    backgroundColor: colors.background,
  },
  loadingText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: 16,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: fontSizes.xxl,
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
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
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
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  clearButton: {
    marginLeft: 8,
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
    flex: 1,
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
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.text,
    marginLeft: 8,
  },
  areaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    padding: 16,
  },
  metricItem: {
    width: '50%',
    padding: 8,
    marginBottom: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: 6,
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
  disabledButton: {
    backgroundColor: colors.textSecondary,
    opacity: 0.7,
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
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontFamily: fonts.medium,
    color: colors.danger,
    fontSize: fontSizes.md,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.olive,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: fonts.medium,
    color: colors.white,
    fontSize: fontSizes.md,
  },
});