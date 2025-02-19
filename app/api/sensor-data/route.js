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

        // Get the latest entry
        const latestData = await collection.find().sort({ _id: -1 }).limit(1).toArray();

        return new Response(JSON.stringify({ latestData: latestData.length > 0 ? latestData[0] : null }), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "No data available" }), {
            status: 404,
            headers: { "Access-Control-Allow-Origin": "*" },
        });
    } finally {
        await client.close();
    }
}

export async function POST(req) {
    try {
        const body = await req.json(); // Parse incoming JSON data
        
        if (!body.sensorValue) {
            return new Response(JSON.stringify({ error: "Missing sensorValue" }), {
                status: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
            });
        }

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert new sensor data
        const result = await collection.insertOne(body);
        console.log("Received sensor data:", body);

        return new Response(JSON.stringify({ message: "Sensor data received successfully", insertedId: result.insertedId }), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
        });
    } finally {
        await client.close();
    }
}

// Handle preflight requests
export async function OPTIONS() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
