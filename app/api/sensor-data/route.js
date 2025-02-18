import { promises as fs } from 'fs';
const filePath = './sensorData.json';

export async function GET() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const sensorData = JSON.parse(data);
        const latestData = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;
        return Response.json({ latestData });
    } catch (error) {
        return Response.json({ error: "No data available" }, { status: 404 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json(); // Parse incoming JSON data
        
        if (!body.sensorValue) {
            return Response.json({ error: "Missing sensorValue" }, { status: 400 });
        }

        let sensorData = [];
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            sensorData = JSON.parse(data);
            if (!Array.isArray(sensorData)) sensorData = [];
        } catch (error) {
            sensorData = [];
        }

        // Add new entry to the array
        sensorData.push(body);

        // Store the updated sensor data array in the file
        await fs.writeFile(filePath, JSON.stringify(sensorData, null, 2));
        console.log("Received sensor data:", body);

        return Response.json({ message: "Sensor data received successfully", receivedData: body });
    } catch (error) {
        return Response.json({ error: "Invalid request" }, { status: 400 });
    }
}
