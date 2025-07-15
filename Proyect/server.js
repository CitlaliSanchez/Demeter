//server.js
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
.then(() => console.log('MongoDB conectado'))
.catch((err) => console.error('Error de conexión:', err));

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

//agregamos el endpoint para las soluciones
const Solucion = mongoose.model(
  'SolutionHealth',
  new mongoose.Schema({
    area: {
      type: String,
      enum: ['A', 'B', 'C'],
      required: true
    },
    type: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    concentration: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(\d+(\.\d+)?\s?(EC|pH))$/.test(v); // acepta "2.5 EC" o "6.2 pH"
        },
        message: props => `${props.value} is not a valid concentration format`
      }
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 1000
    },
    date: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      maxlength: 200,
      default: ""
    }
  }, { collection: 'Solutions' })
);
//ESTE ES EL POSTTTT
api.post('/Solutions', async (req, res) => {
  try {
    const nueva = new Solucion(req.body);
    await nueva.save();
    res.status(201).json({ message: 'Saved in MongoDB', data: nueva });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Not Support' });
  }
});

//ESTE ES EL GETTTT
api.get('/Solutions', async (req, res) => {
  try {
    const soluciones = await Solucion.find().sort({ date: -1 });
    res.status(200).json(soluciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching solutions' });
  }
});


// 👇 Montar el grupo de rutas
app.use('/api', api);

// Puerto
app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
