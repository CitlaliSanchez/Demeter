import * as Font from 'expo-font';

export const loadFonts = () => {
  return Font.loadAsync({
    'Poppins-Black': require('./Poppins-Black.ttf'),
    'Poppins-BlackItalic': require('./Poppins-BlackItalic.ttf'),
    'Poppins-Bold': require('./Poppins-Bold.ttf'),
    'Poppins-BoldItalic': require('./Poppins-BoldItalic.ttf'),
    'Poppins-ExtraBold': require('./Poppins-ExtraBold.ttf'),
    'Poppins-Italic': require('./Poppins-Italic.ttf'),
    'Poppins-Light': require('./Poppins-Light.ttf'),
    'Poppins-LightItalic': require('./Poppins-LightItalic.ttf'),
    'Poppins-Medium': require('./Poppins-Medium.ttf'),
    'Poppins-MediumItalic': require('./Poppins-MediumItalic.ttf'),
    'Poppins-Regular': require('./Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('./Poppins-Thin.ttf'),
  });
};
