const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://yesi:dayana123@yesigarnez.tvrkrzp.mongodb.net/Demeter', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB conectado'))
.catch((err) => console.error('❌ Error de conexión:', err));

// Modelo
const Sensor = mongoose.model(
  'SensorReading',
  new mongoose.Schema({}, { strict: false, collection: 'sensors_reading' })
);

// Agrupar rutas bajo /api
const api = express.Router();

api.get('/sensors', async (req, res) => {
  const sensores = await Sensor.find().sort({ createdAt: -1 });
  res.json(sensores);
});

api.get('/sensors/area/:area', async (req, res) => {
  const areaName = `Area ${req.params.area.toUpperCase()}`;
  const points = parseInt(req.query.points) || 7;
  const sensores = await Sensor.find({ area: areaName }).sort({ createdAt: -1 }).limit(points);
  res.json(sensores.reverse());
});

// 👇 Montar el grupo de rutas
app.use('/api', api);

// Puerto
app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
