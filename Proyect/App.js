import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { colors, fonts, fontSizes } from './assets/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando fuentes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.bold}>Demeter</Text>
        <Text style={styles.regular}> en proceso!</Text>
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    fontSize: fontSizes.md,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  title: {
    fontSize: fontSizes.lg,
    color: colors.clay,
  },
  bold: {
    fontFamily: fonts.bold,
  },
  regular: {
    fontFamily: fonts.regular,
  },
});