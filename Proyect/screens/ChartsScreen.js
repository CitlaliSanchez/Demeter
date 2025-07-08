//ChartScreen.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { colors, fonts, fontSizes } from '../assets/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import config from '../utils/configIP';


const { width: windowWidth } = Dimensions.get('window');
const chartWidth = windowWidth - 40;

const ChartBox = ({ data, labels, color, title, unit, type = 'line', minRange, maxRange }) => {
  const { width } = useWindowDimensions();
  const currentValue = data[data.length - 1];
  const isInRange = currentValue >= minRange && currentValue <= maxRange;
  const isMonthly = labels.length > 15;
  const chartWidthAdjusted = width - 40;
  const chartHeight = 220;
  const labelRotation = isMonthly ? -45 : 0;

  const formatXLabel = (value, index) => {
    if (isMonthly) {
      return index % 5 === 0 ? value : '';
    }
    
    // Simplificamos las etiquetas de dispositivos
    if (typeof value === 'string') {
      if (value.startsWith('D')) { // Si ya está simplificado (D1, D2, etc.)
        return value;
      }
      if (value.startsWith('DEV')) { // Si es DEV04, DEV05, etc.
        return value.replace('DEV', 'D');
      }
      if (value === 'Unknown') { // Si no tiene deviceId
        return `S${index + 1}`;
      }
    }
    
    return value;
  };

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name={type === 'line' ? 'trending-up' : 'bar-chart'} 
            size={20} 
            color={color} 
            style={styles.chartIcon}
          />
          <Text style={styles.chartTitle}>{title}</Text>
        </View>
        <View style={styles.valueContainer}>
          <View style={styles.currentValueContainer}>
            <Text style={[styles.currentValue, { color: isInRange ? colors.olive : colors.danger }]}>
              {currentValue}
            </Text>
            <Text style={styles.unitText}>{unit}</Text>
          </View>
          <View style={styles.rangeContainer}>
            <Ionicons name="information-circle" size={14} color={colors.textSecondary} />
            <Text style={styles.rangeText}>
              Ideal: {minRange}-{maxRange} {unit}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.chartScrollView}
      >
        {type === 'line' ? (
          <LineChart
            data={{ 
              labels, 
              datasets: [{ 
                data,
                color: () => color,
                strokeWidth: 2
              }] 
            }}
            width={isMonthly ? Math.max(chartWidthAdjusted * 2, labels.length * 30) : chartWidthAdjusted}
            height={chartHeight}
            yAxisSuffix={` ${unit}`}
            fromZero={false}
            chartConfig={{
              backgroundColor: colors.white,
              backgroundGradientFrom: colors.white,
              backgroundGradientTo: colors.white,
              decimalPlaces: 1,
              color: () => color,
              labelColor: () => colors.textSecondary,
              propsForDots: {
                r: isMonthly ? 3 : 5,
                strokeWidth: 2,
                stroke: color,
                fill: colors.white,
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: colors.lightGray,
                strokeWidth: 0.5,
              },
              propsForLabels: {
                fontFamily: fonts.regular,
                fontSize: isMonthly ? 9 : 10,
              },
            }}
            bezier
            withHorizontalLines={true}
            withVerticalLines={!isMonthly}
            withShadow={false}
            style={styles.chartStyle}
            formatXLabel={formatXLabel}
            verticalLabelRotation={labelRotation}
            xLabelsOffset={isMonthly ? 10 : 0}
          />
        ) : (
          <BarChart
            data={{ 
              labels, 
              datasets: [{ 
                data,
                color: () => color,
              }] 
            }}
            width={isMonthly ? Math.max(chartWidthAdjusted * 2, labels.length * 30) : chartWidthAdjusted}
            height={chartHeight}
            yAxisSuffix={` ${unit}`}
            fromZero={true}
            chartConfig={{
              backgroundColor: colors.white,
              backgroundGradientFrom: colors.white,
              backgroundGradientTo: colors.white,
              decimalPlaces: 0,
              color: () => color,
              labelColor: () => colors.textSecondary,
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: colors.lightGray,
                strokeWidth: 0.5,
              },
              propsForLabels: {
                fontFamily: fonts.regular,
                fontSize: isMonthly ? 9 : 10,
              },
              barPercentage: isMonthly ? 0.3 : 0.6,
            }}
            style={styles.chartStyle}
            showBarTops={false}
            formatXLabel={formatXLabel}
            verticalLabelRotation={labelRotation}
            xLabelsOffset={isMonthly ? 10 : 0}
          />
        )}
      </ScrollView>

      {!isMonthly && (
        <View style={styles.chartFooter}>
          <Text style={styles.lastUpdateText}>Last update: {new Date().toLocaleTimeString()}</Text>
          <View style={styles.legendContainer}>
            <View style={[styles.legendItem, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{title} values</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const AreaCharts = ({ area }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [chartData, setChartData] = useState({ ph: [], ec: [], temp: [], water: [] });
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isWeekly = timeRange === 'week';
  const points = isWeekly ? 7 : 30;

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get(`${config.API_BASE_URL}/api/sensors/area/${area}?points=${points}`)
      .then(({ data }) => {
        if (!data || data.length === 0) {
          setChartData({ ph: [], ec: [], temp: [], water: [] });
          setLabels([]);
          setError('No data available');
          setLoading(false);
          return;
        }

        // Simplificamos los labels de los dispositivos
        const newLabels = data.map((d, index) => {
          if (d.deviceId && d.deviceId.startsWith('DEV')) {
            return d.deviceId.replace('DEV', 'D'); // DEV04 -> D4
          }
          return `S${index + 1}`; // Si no tiene deviceId, usamos S1, S2, etc.
        });

        setLabels(newLabels);

        const phArr = data.map(d => d.values?.ph ?? 0);
        const ecArr = data.map(d => d.values?.conductivity ?? 0);
        const tempArr = data.map(d => d.values?.water_temp ?? 0);
        const waterArr = data.map(d => d.values?.water_level ?? 0);

        setChartData({ ph: phArr, ec: ecArr, temp: tempArr, water: waterArr });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data from API', err);
        setError('Failed to load data from server');
        setLoading(false);
      });
  }, [area, timeRange, points]);

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <View style={styles.headerContainer}>
        <View style={styles.areaHeader}>
          <Ionicons name="leaf" size={24} color={colors.olive} />
          <Text style={styles.areaLabel}>Area {area} Monitoring</Text>
        </View>
        
        <View style={styles.timeRangeContainer}>
          {['week', 'month'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.timeRangeButton, timeRange === range && styles.activeTimeRange]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[styles.timeRangeText, timeRange === range && styles.activeTimeRangeText]}
              >
                {range === 'week' ? 'Weekly' : 'Monthly'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={24} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.olive} />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      ) : (
        <>
          <ChartBox 
            data={chartData.ph} 
            labels={labels} 
            color={colors.olive} 
            title="pH Level" 
            unit="pH" 
            type="line" 
            minRange={5.8} 
            maxRange={6.5} 
          />
          <ChartBox 
            data={chartData.ec} 
            labels={labels} 
            color={colors.lime} 
            title="Conductivity" 
            unit="dS/m" 
            type="line" 
            minRange={1.5} 
            maxRange={2.0} 
          />
          <ChartBox 
            data={chartData.temp} 
            labels={labels} 
            color={colors.clay} 
            title="Water Temp" 
            unit="°C" 
            type="line" 
            minRange={22} 
            maxRange={26} 
          />
          <ChartBox 
            data={chartData.water} 
            labels={labels} 
            color={colors.forest} 
            title="Water Level" 
            unit="%" 
            type="bar" 
            minRange={70} 
            maxRange={90} 
          />
        </>
      )}
    </ScrollView>
  );
};

export default function ChartsScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'A', title: 'Area A' },
    { key: 'B', title: 'Area B' },
    { key: 'C', title: 'Area C' },
  ]);

  const renderScene = SceneMap({
    A: () => <AreaCharts area="A" />,
    B: () => <AreaCharts area="B" />,
    C: () => <AreaCharts area="C" />,
  });

  return (
    <View style={styles.mainContainer}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: colors.olive, height: 3, borderRadius: 3 }}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            activeColor={colors.olive}
            inactiveColor={colors.textSecondary}
            pressColor={colors.lightOlive}
            renderIcon={({ route, focused }) => (
              <Ionicons 
                name="analytics" 
                size={18} 
                color={focused ? colors.olive : colors.textSecondary} 
                style={styles.tabIcon}
              />
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabLabel: {
    fontFamily: fonts.medium,
    color: colors.text,
    fontSize: fontSizes.md,
    textTransform: 'none',
    marginTop: -2,
  },
  tabIcon: {
    marginRight: 5,
  },
  tabContent: {
    padding: 16,
    backgroundColor: colors.background,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  areaLabel: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xl,
    color: colors.forest,
    marginLeft: 8,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    ...Platform.select({ 
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
      }, 
      android: { elevation: 2 } 
    }),
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  activeTimeRange: {
    backgroundColor: colors.olive,
  },
  timeRangeText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  activeTimeRangeText: {
    color: colors.white,
  },
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({ 
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 6 
      }, 
      android: { elevation: 3 } 
    }),
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartIcon: {
    marginRight: 8,
  },
  chartTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.lg,
    color: colors.text,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  currentValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentValue: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xl,
    marginRight: 4,
  },
  unitText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rangeText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  chartScrollView: {
    paddingBottom: 10,
  },
  chartStyle: {
    borderRadius: 12,
    marginVertical: 8,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  lastUpdateText: {
    fontFamily: fonts.light,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendItem: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.danger,
    marginTop: 8,
    textAlign: 'center',
  },
  infoText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
});