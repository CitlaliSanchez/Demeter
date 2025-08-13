const mqtt = require('mqtt');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yesi:dayana123@yesigarnez.tvrkrzp.mongodb.net/Demeter?retryWrites=true&w=majority&appName=YesiGarnez', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const SensorSchema = new mongoose.Schema({}, { collection: 'sensors_reading', strict: false });
const Sensor = mongoose.model('Sensor', SensorSchema);

const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
  console.log('Conectado al broker MQTT');
  client.subscribe('demeter/devices/#');
});

client.on('message', async (topic, message) => {
  const data = JSON.parse(message.toString());
  const { deviceId } = data;

  await Sensor.updateOne(
    { deviceId },
    { $set: { ...data, updatedAt: new Date() } },
    { upsert: true }
  );

  console.log(`Datos guardados para ${deviceId}`);
});
