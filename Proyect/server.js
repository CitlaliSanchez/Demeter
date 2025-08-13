const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://yesi:dayana123@yesigarnez.tvrkrzp.mongodb.net/Demeter?retryWrites=true&w=majority')
  .then(() => console.log(' MongoDB conectado'))
  .catch((err) => console.error('Error al conectar MongoDB:', err));

// Modelo de sensor
const Sensor = mongoose.model(
  'SensorReading',
  new mongoose.Schema({
    deviceId: String,
    clientId: String,
    name: String,
    area: String,
    status: String,
    createdAt: Date,
    updatedAt: Date,
    values: {
      water_temp: Number,
      water_level: Number,
      //conductivity: Number,
      ph: Number
    }
  }, { collection: 'sensors_reading' })
);

// Modelo de soluciones
const Solucion = mongoose.model(
  'SolutionHealth',
  new mongoose.Schema({
    area: { type: String, enum: ['A', 'B', 'C'], required: true },
    type: String,
    concentration: String,
    quantity: Number,
    date: Date,
    createdAt: { type: Date, default: Date.now },
    notes: { type: String, default: "" }
  }, { collection: 'Solutions' })
);

// ---------- API Routes ----------
const api = express.Router();

// --- SENSORS --- //
api.get('/sensors', async (req, res) => {
  try {
    const sensores = await Sensor.find().sort({ createdAt: -1 });
    res.json(sensores);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener datos de sensores' });
  }
});

api.get('/sensors/area/:area', async (req, res) => {
  const areaName = `Area ${req.params.area.toUpperCase()}`;
  const points = parseInt(req.query.points) || 7;
  const sensores = await Sensor.find({ area: areaName }).sort({ createdAt: -1 }).limit(points);
  res.json(sensores.reverse());
});

api.get('/sensors/temp', async (req, res) => {
  try {
    const datos = await Sensor.find({}, { 'values.water_temp': 1, deviceId: 1, createdAt: 1 }).sort({ createdAt: -1 });
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener temperaturas' });
  }
});

// ✔ POST de sensores desde Arduino o frontend
api.post('/sensors', async (req, res) => {
  try {
    let data = req.body;

    // Asignar timestamps si no vienen
    data.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    data.updatedAt = new Date();

    // Asegurar estructura values aunque venga vacío
    if (!data.values) data.values = {};

    const lectura = new Sensor(data);
    await lectura.save();

    console.log('Sensor guardado:', lectura);
    res.status(201).json({ message: 'Lectura guardada', data: lectura });
  } catch (err) {
    console.error('Error al guardar lectura:', err);
    res.status(500).json({ error: 'No se pudo guardar la lectura' });
  }
});

// --- SOLUCIONES --- //
api.post('/Solutions', async (req, res) => {
  try {
    const nueva = new Solucion(req.body);
    await nueva.save();
    console.log(' Solución registrada:', nueva);
    res.status(201).json({ message: 'Solución guardada', data: nueva });
  } catch (err) {
    console.error(' Error al guardar solución:', err);
    res.status(500).json({ error: 'No se pudo guardar la solución' });
  }
});

api.get('/Solutions', async (req, res) => {
  try {
    const soluciones = await Solucion.find().sort({ date: -1 });
    res.status(200).json(soluciones);
  } catch (err) {
    console.error('Error al obtener soluciones:', err);
    res.status(500).json({ error: 'Error al obtener soluciones' });
  }
});

app.use('/api', api);

const puertoSerial = new SerialPort({
  path: 'COM3',
  baudRate: 115200
});

const parser = puertoSerial.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', async (linea) => {
  try {
    const datos = JSON.parse(linea);
    datos.createdAt = new Date();
    datos.updatedAt = new Date();

    const lectura = new Sensor(datos);
    await lectura.save();

    console.log(' Lectura serial guardada:', datos);
  } catch (err) {
    console.error(' Error en datos serial:', err.message);
  }
});

// -------- INICIAR SERVIDOR --------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
