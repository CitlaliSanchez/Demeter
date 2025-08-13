import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Animated,
  Platform,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AlertEmergente from './AlertEmergente';
import { colors, fonts, fontSizes } from '../assets/styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [connected, setConnected] = useState(false);
  const [readings, setReadings] = useState([]);
  const [filteredReadings, setFilteredReadings] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const animatedValues = readings.map(() => new Animated.Value(0));

  const alertMessages = [
    'pH out of range detected!',
    'Critical water level!',
    'Temperature too high!',
  ];

  const generateRandomMessage = () => {
    const index = Math.floor(Math.random() * alertMessages.length);
    return alertMessages[index];
  };

  const sendPushNotification = async (message) => {
    if (Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hydroponic Alert',
          body: message,
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
        const hasAnomaly = Math.random() < 0.1;
        
        const ph = hasAnomaly 
          ? (Math.random() < 0.5 ? (4 + Math.random() * 1.5) : (7 + Math.random() * 1.5)).toFixed(2)
          : (5.5 + Math.random() * 1.5).toFixed(2);
          
        const temp = hasAnomaly 
          ? (28 + Math.random() * 5).toFixed(1)
          : (22 + Math.random() * 5).toFixed(1);
          
        const level = hasAnomaly 
          ? `${Math.floor(Math.random() * 20)}%`
          : `${20 + Math.floor(Math.random() * 80)}%`;

        simulated.push({
          id: `${a}-${i}`,
          timestamp: new Date(Date.now() - (i + a * 5) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ph,
          temp,
          level,
          area: areas[a],
        });
      }
    }
    return simulated;
  };

  useEffect(() => {
    setTimeout(() => setConnected(true), 2000);
    const data = generateReadings();
    setReadings(data);
    setFilteredReadings(data);

    const readingInterval = setInterval(() => {
      const newData = generateReadings();
      setReadings(newData);
      applyFilter(activeFilter, newData);
    }, 60000);

    const scheduleAlert = () => {
      const time = 300000; // 5 minutos en milisegundos
      setTimeout(() => {
        const newMessage = generateRandomMessage();
        setMessage(newMessage);
        setAlertVisible(true);
        sendPushNotification(newMessage);
        scheduleAlert();
      }, time);
    };

    scheduleAlert();

    return () => {
      clearInterval(readingInterval);
    };
  }, []);

  const applyFilter = (filter, data = readings) => {
    setActiveFilter(filter);
    switch(filter) {
      case 'anomalies':
        setFilteredReadings(data.filter(item => 
          parseFloat(item.ph) < 5.5 ||
          parseFloat(item.ph) > 7.0 ||
          parseFloat(item.temp) > 28 ||
          parseInt(item.level) < 20
        ));
        break;
      case 'areaA':
        setFilteredReadings(data.filter(item => item.area === 'Area A'));
        break;
      case 'areaB':
        setFilteredReadings(data.filter(item => item.area === 'Area B'));
        break;
      case 'areaC':
        setFilteredReadings(data.filter(item => item.area === 'Area C'));
        break;
      default:
        setFilteredReadings(data);
    }
  };

  const startFadeIn = (index) => {
    Animated.timing(animatedValues[index], {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const renderItem = ({ item, index }) => {
    const fadeAnim = animatedValues[index] || new Animated.Value(0);
    startFadeIn(index);

    const isAnomaly =
      parseFloat(item.ph) < 5.5 ||
      parseFloat(item.ph) > 7.0 ||
      parseFloat(item.temp) > 28 ||
      parseInt(item.level) < 20;

    const getValueStyle = (value, thresholds) => {
      if ((thresholds.low !== undefined && value < thresholds.low) || 
          (thresholds.high !== undefined && value > thresholds.high)) {
        return { color: colors.danger, fontFamily: fonts.semiBold };
      }
      return { color: colors.forest, fontFamily: fonts.medium };
    };

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={[styles.card, isAnomaly && styles.cardAnomaly]}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons 
                name="leaf" 
                size={18} 
                color={colors.olive} 
                style={{ marginRight: 8 }} 
              />
              <Text style={styles.areaText}>{item.area}</Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Ionicons name="water" size={18} color={colors.fern} />
              <Text style={styles.label}>pH: 
                <Text style={getValueStyle(parseFloat(item.ph), { low: 5.5, high: 7.0 })}>
                  {' '}{item.ph}
                </Text>
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Ionicons name="thermometer" size={18} color={colors.clay} />
              <Text style={styles.label}>Temp: 
                <Text style={getValueStyle(parseFloat(item.temp), { high: 28 })}>
                  {' '}{item.temp}°C
                </Text>
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Ionicons name="speedometer" size={18} color={colors.forest} />
              <Text style={styles.label}>Level: 
                <Text style={getValueStyle(parseInt(item.level), { low: 20 })}>
                  {' '}{item.level}
                </Text>
              </Text>
            </View>
          </View>
          
          {isAnomaly && (
            <View style={styles.alertBadge}>
              <Ionicons name="warning" size={16} color={colors.danger} />
              <Text style={[styles.alertText, { marginLeft: 8 }]}>Attention needed</Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <ImageBackground
        source={require('../assets/banner.jpg')}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <View style={styles.bannerContent}>
        </View>
      </ImageBackground>

      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: connected ? colors.lime : colors.danger }]} />
        <Text style={styles.statusText}>
          {connected ? 'Connected to MQTT server' : 'Connecting to MQTT server...'}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest Readings</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={16} color={colors.forest} />
          <Text style={styles.filterText}> Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredReadings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Readings</Text>
            
            <Pressable 
              style={[styles.filterOption, activeFilter === 'all' && styles.activeFilter]}
              onPress={() => {
                applyFilter('all');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.filterOptionText}>All Readings</Text>
              {activeFilter === 'all' && <Ionicons name="checkmark" size={18} color={colors.forest} />}
            </Pressable>
            
            <Pressable 
              style={[styles.filterOption, activeFilter === 'anomalies' && styles.activeFilter]}
              onPress={() => {
                applyFilter('anomalies');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.filterOptionText}>Only Anomalies</Text>
              {activeFilter === 'anomalies' && <Ionicons name="checkmark" size={18} color={colors.forest} />}
            </Pressable>
            
            <Pressable 
              style={[styles.filterOption, activeFilter === 'areaA' && styles.activeFilter]}
              onPress={() => {
                applyFilter('areaA');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.filterOptionText}>Area A Only</Text>
              {activeFilter === 'areaA' && <Ionicons name="checkmark" size={18} color={colors.forest} />}
            </Pressable>
            
            <Pressable 
              style={[styles.filterOption, activeFilter === 'areaB' && styles.activeFilter]}
              onPress={() => {
                applyFilter('areaB');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.filterOptionText}>Area B Only</Text>
              {activeFilter === 'areaB' && <Ionicons name="checkmark" size={18} color={colors.forest} />}
            </Pressable>
            
            <Pressable 
              style={[styles.filterOption, activeFilter === 'areaC' && styles.activeFilter]}
              onPress={() => {
                applyFilter('areaC');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.filterOptionText}>Area C Only</Text>
              {activeFilter === 'areaC' && <Ionicons name="checkmark" size={18} color={colors.forest} />}
            </Pressable>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AlertEmergente
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        mensaje={message}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  banner: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  bannerImage: {
    resizeMode: 'cover',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    shadowColor: colors.dark,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: fontSizes.lg + 2,
    fontFamily: fonts.semiBold,
    color: colors.forest,
    letterSpacing: 0.5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.forest,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
    paddingTop: 5,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
    marginHorizontal: 15,
    shadowColor: colors.dark,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardAnomaly: {
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 5,
    borderLeftColor: colors.danger,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  areaText: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.forest,
  },
  timestamp: {
    fontSize: fontSizes.sm - 1,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.text,
    marginLeft: 8,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#FFEEEE',
    justifyContent: 'center',
  },
  alertText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.danger,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 25,
    shadowColor: colors.dark,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.semiBold,
    color: colors.forest,
    marginBottom: 20,
    textAlign: 'center',
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  activeFilter: {
    backgroundColor: '#EDF5EE',
    borderWidth: 1.5,
    borderColor: colors.fern,
  },
  filterOptionText: {
    fontSize: fontSizes.md,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.forest,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
});