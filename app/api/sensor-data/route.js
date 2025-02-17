// app/api/sensor-data/route.js
export async function GET() {
    const sensorValue = Math.random() * 100; // Simulated sensor data
    return Response.json({ value: sensorValue.toFixed(2) });
  }