import { Platform } from 'react-native';

// Detecta si estás en desarrollo o producción
const isDev = process.env.NODE_ENV !== 'production';


const localIP = '172.18.3.34:3000'; //CAMBIA ESTO UNA VEZ si tu IP cambia

// Detecta si estás en emulador Android local
const isAndroidEmulator = Platform.OS === 'android' && isDev;

const API_BASE_URL = isAndroidEmulator
  ? `http://${localIP}`
  : `http://${localIP}`; // Puedes cambiar esto por prodIP si subes a producción

export default {
  API_BASE_URL,
};
