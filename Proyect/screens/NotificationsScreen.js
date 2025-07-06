import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

const notifications = [
  { id: '1', message: 'Low level in Area B', type: 'warning' },
  { id: '2', message: 'Critical pH in Area A', type: 'danger' },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: item.type === 'danger' ? colors.danger : colors.clay },
            ]}
          >
            <Text style={styles.text}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    marginBottom: 12,
    color: colors.forest,
  },
  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
  },
});
