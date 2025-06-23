import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

// Simularemos conexión y datos al inicio
export default function SettingsScreen() {


  return (
    <View>
        <Text><h1>Settings</h1></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  }
});
