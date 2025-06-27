import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { colors, fonts, fontSizes } from '../assets/styles/theme';
import * as Font from 'expo-font';

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

const screenWidth = Dimensions.get('window').width - 32;

const generateChartData = (min, max, points = 7) => {
  return Array.from({ length: points }, () =>
    Number((Math.random() * (max - min) + min).toFixed(2))
  );
};

const generateLabels = (points = 7) => {
  return Array.from({ length: points }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (points - 1 - i));
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
};

const ChartBox = ({ data, labels, color, title, unit, type = 'line' }) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartValueContainer}>
        <Text style={styles.chartCurrentValue}>
          {data[data.length - 1]} {unit}
        </Text>
        <Text style={styles.chartRange}>
          {Math.min(...data)} - {Math.max(...data)} {unit}
        </Text>
      </View>
      {type === 'line' ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={screenWidth}
          height={220}
          yAxisSuffix={` ${unit}`}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: () => color,
            labelColor: () => '#666',
            propsForDots: {
              r: '4',
              strokeWidth: '1',
              stroke: color,
            },
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
      ) : (
        <BarChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={screenWidth}
          height={220}
          yAxisSuffix={` ${unit}`}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: () => color,
            labelColor: () => '#666',
          }}
          style={{ borderRadius: 16 }}
        />
      )}
    </View>
  );
};

const AreaCharts = ({ area }) => {
  const [timeRange, setTimeRange] = useState('week');
  const isWeekly = timeRange === 'week';
  const points = isWeekly ? 7 : 30;
  const labels = generateLabels(points);

  const chartData = {
    ph: generateChartData(5.5, 7.2, points),
    ec: generateChartData(1.2, 2.2, points),
    temp: generateChartData(20, 28, points),
    water: generateChartData(60, 100, points),
  };

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <Text style={styles.areaLabel}>Monitoring for Area {area}</Text>

      <View style={styles.timeRangeContainer}>
        {['week', 'month'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              timeRange === range && styles.activeTimeRange,
            ]}
            onPress={() => setTimeRange(range)}
          >
            <Text
              style={[
                styles.timeRangeText,
                timeRange === range && styles.activeTimeRangeText,
              ]}
            >
              {range === 'week' ? 'Weekly' : 'Monthly'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ChartBox
        data={chartData.ph}
        labels={labels}
        color={colors.olive}
        title="pH Level"
        unit="pH"
        type="line"
      />
      <ChartBox
        data={chartData.ec}
        labels={labels}
        color={colors.lime}
        title="EC Value"
        unit="dS/m"
        type="line"
      />
      <ChartBox
        data={chartData.temp}
        labels={labels}
        color={colors.clay}
        title="Temperature"
        unit="°C"
        type="line"
      />
      <ChartBox
        data={chartData.water}
        labels={labels}
        color={colors.forest}
        title="Water Level"
        unit="%"
        type="bar"
      />
    </ScrollView>
  );
};

export default function ChartsScreen() {
  const layout = useWindowDimensions();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

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

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontFamily: fonts.regular }}>Loading...</Text>
      </View>
    );
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: colors.olive, height: 3 }}
          style={{ backgroundColor: colors.white }}
          labelStyle={{
            fontFamily: fonts.medium,
            color: colors.text,
            fontSize: fontSizes.md,
            textTransform: 'none',
          }}
          activeColor={colors.olive}
          inactiveColor={colors.textSecondary}
          pressColor={colors.sand}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  tabContent: {
    padding: 16,
    backgroundColor: colors.background,
    paddingBottom: 40,
  },
  areaLabel: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xl,
    color: colors.forest,
    marginBottom: 20,
    textAlign: 'center',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
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
     },
});
