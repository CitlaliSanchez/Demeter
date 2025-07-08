const mongoose = require('mongoose');
const sensores = require('./sensores-extendido.json'); // importa tu JSON

async function run() {
  try {
    await mongoose.connect('mongodb+srv://yesi:dayana123@yesigarnez.tvrkrzp.mongodb.net/Demeter');
    console.log('Conectado a MongoDB');

    // Esquema flexible (puedes poner strict:false para evitar errores si la estructura varía)
    const SensorSchema = new mongoose.Schema({}, { strict: false, collection: 'sensors_reading' });
    const Sensor = mongoose.model('SensorReading', SensorSchema);

    // Insertar documentos
    const result = await Sensor.insertMany(sensores);
    console.log(`Insertados ${result.length} sensores`);

    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  } catch (error) {
    console.error(' Error al insertar sensores:', error);
  }
}

run();
