import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

// Get responsive dimensions
const { width: windowWidth } = Dimensions.get('window');
const chartWidth = windowWidth - 40;

const generateChartData = (min, max, points = 7) => {
  return Array.from({ length: points }, () =>
    Number((Math.random() * (max - min) + min).toFixed(2))
  );
};

const generateLabels = (points = 7) => {
  return Array.from({ length: points }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (points - 1 - i));
    if (points === 30) {
      const day = date.getDate();
      if ([1, 8, 15, 22, 29].includes(day)) {
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }
      return '';
    }
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
};

const ChartBox = ({ data, labels, color, title, unit, type = 'line', minRange, maxRange }) => {
  const { width } = useWindowDimensions();
  const currentValue = data[data.length - 1];
  const isInRange = currentValue >= minRange && currentValue <= maxRange;
  const isMonthly = labels.length > 7;
  const chartWidthAdjusted = width - 40;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.currentValue, { color: isInRange ? colors.olive : colors.danger }]}>
            {currentValue} {unit}
          </Text>
          <Text style={styles.rangeText}>
            Ideal: {minRange}-{maxRange} {unit}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={isMonthly}
        contentContainerStyle={styles.chartScrollView}
      >
        {type === 'line' ? (
          <LineChart
            data={{ labels, datasets: [{ data }] }}
            width={isMonthly ? chartWidthAdjusted * 1.5 : chartWidthAdjusted}
            height={220}
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
                stroke: colors.border,
                strokeWidth: 1,
              },
              propsForLabels: {
                fontFamily: fonts.regular,
                fontSize: isMonthly ? 8 : 10,
              },
            }}
            bezier
            withHorizontalLines
            withVerticalLines={!isMonthly}
            withShadow={false}
            style={styles.chartStyle}
            formatXLabel={(value) => value || ''}
          />
        ) : (
          <BarChart
            data={{ labels, datasets: [{ data }] }}
            width={isMonthly ? chartWidthAdjusted * 1.5 : chartWidthAdjusted}
            height={220}
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
                stroke: colors.border,
                strokeWidth: 1,
              },
              propsForLabels: {
                fontFamily: fonts.regular,
                fontSize: isMonthly ? 8 : 10,
              },
              barPercentage: isMonthly ? 0.4 : 0.6,
            }}
            style={styles.chartStyle}
            showBarTops={false}
            formatXLabel={(value) => value || ''}
          />
        )}
      </ScrollView>

      {!isMonthly && (
        <View style={styles.chartLabels}>
          {labels.filter(label => label !== '').map((label, index) => (
            <Text key={index} style={styles.labelText}>
              {label}
            </Text>
          ))}
        </View>
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
      <View style={styles.headerContainer}>
        <Text style={styles.areaLabel}>Area {area} Monitoring</Text>
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

      <ChartBox data={chartData.ph} labels={labels} color={colors.olive} title="pH" unit="pH" type="line" minRange={5.8} maxRange={6.5} />
      <ChartBox data={chartData.ec} labels={labels} color={colors.lime} title="Conductivity" unit="dS/m" type="line" minRange={1.5} maxRange={2.0} />
      <ChartBox data={chartData.temp} labels={labels} color={colors.clay} title="Temperature" unit="°C" type="line" minRange={22} maxRange={26} />
      <ChartBox data={chartData.water} labels={labels} color={colors.forest} title="Water Level" unit="%" type="bar" minRange={70} maxRange={90} />
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
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: colors.olive, height: 3, borderRadius: 3 }}
          style={{
            backgroundColor: colors.white,
            elevation: 2,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
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
  tabContent: {
    padding: 16,
    backgroundColor: colors.background,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  areaLabel: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xl,
    color: colors.forest,
    marginBottom: 12,
    textAlign: 'center',
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
    marginBottom: 20,
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
  chartScrollView: {
    paddingBottom: 10,
  },
  chartStyle: {
    borderRadius: 12,
    marginVertical: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.lg,
    color: colors.text,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  currentValue: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xl,
  },
  rangeText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  labelText: {
    fontFamily: fonts.light,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    width: `${100 / 5}%`,
    textAlign: 'center',
  },
  monthlyChart: {
    height: 240,
  },
});
