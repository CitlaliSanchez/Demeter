import { Platform } from 'react-native';

// Detecta si estás en desarrollo o producción
const isDev = process.env.NODE_ENV !== 'production';


//const localIP = '172.18.3.34:3000'; //IP de mi casa
//const localIP = '192.168.0.108:3000'; //ip de la escuela
const localIP = '192.168.0.108:3000'; //ip de mi casa
//


// Detecta si estás en emulador Android local
const isAndroidEmulator = Platform.OS === 'android' && isDev;

const API_BASE_URL = isAndroidEmulator
  ? `http://${localIP}`
  : `http://${localIP}`; // Puedes cambiar esto por prodIP si subes a producción

export default {
  API_BASE_URL,
};
