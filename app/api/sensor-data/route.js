// app/api/sensor-data/route.js
let sensorDataStore = [];

export async function GET() {
    return Response.json({ storedData: sensorDataStore });
}

export async function POST(req) {
    try {
        const body = await req.json(); // Parse incoming JSON data
        
        if (!body.sensorValue) {
            return Response.json({ error: "Missing sensorValue" }, { status: 400 });
        }

        // Store the sensor data
        sensorDataStore.push(body);
        console.log("Received sensor data:", body);

        return Response.json({ message: "Sensor data received successfully", receivedData: body });
    } catch (error) {
        return Response.json({ error: "Invalid request" }, { status: 400 });
    }
}

