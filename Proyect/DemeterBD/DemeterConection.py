from fastapi import FastAPI, Request
from pymongo import MongoClient
from datetime import datetime
import uvicorn
#ip de mi laptop  192.168.0.130
#descargar las dependencia de pip install fastapi uvicorn pymongo
#
#python C:\Users\ServiteC\DemeterBD\DemeterConection.py para correr el servidos y los datos

app = FastAPI()

# Conexión a MongoDB (local en la laptop servidor)
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["demeter"]
collection = db["sensor_readings"]

@app.post("/sensor_readings")
async def receive_data(request: Request):
    data = await request.json()
    temperature = data["temperature"]
    
    # Guardar en MongoDB
    document = {
        "temperature": temperature,
        "timestamp": datetime.now(),
        "sensor_type": "DS18B20",
        "unit": "°C"
    }
    collection.insert_one(document)
    print(f"Dato guardado en MongoDB: {temperature}°C")

    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)  # Escucha en todas las IPs de la red