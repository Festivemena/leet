import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://festusekuruemu:73rjiX8vhIH0wdYR@clusweer.lrsqv.mongodb.net/?retryWrites=true&w=majority&appName=Clusweer";
const client = new MongoClient(uri);
const dbName = "sensorDatabase";
const collectionName = "sensorData";

export async function GET() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const latestData = await collection.find().sort({ timestamp: -1 }).limit(1).toArray();
        return Response.json({ latestData: latestData.length > 0 ? latestData[0] : null });
    } catch (error) {
        return Response.json({ error: "No data available" }, { status: 404 });
    } finally {
        await client.close();
    }
}

export async function POST(req) {
    try {
        const body = await req.json(); // Parse incoming JSON data
        
        if (!body.sensorValue) {
            return Response.json({ error: "Missing sensorValue" }, { status: 400 });
        }

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert new sensor data
        const result = await collection.insertOne(body);
        console.log("Received sensor data:", body);

        return Response.json({ message: "Sensor data received successfully", insertedId: result.insertedId });
    } catch (error) {
        return Response.json({ error: "Invalid request" }, { status: 400 });
    } finally {
        await client.close();
    }
}
