import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://festusekuruemu:73rjiX8vhIH0wdYR@clusweer.lrsqv.mongodb.net/?retryWrites=true&w=majority&appName=Clusweer";
const client = new MongoClient(uri);
const dbName = "deviceDatabase";
const collectionName = "commands";

export async function GET() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Get the latest command
        const latestCommand = await collection.findOne({}, { sort: { _id: -1 } });

        if (!latestCommand) {
            return new Response(JSON.stringify({ message: "No command available" }), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        // Delete the command after fetching
        await collection.findOneAndDelete({ _id: latestCommand._id });

        return new Response(JSON.stringify({ success: true, command: latestCommand.command }), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "No command available" }), {
            status: 404,
            headers: { "Access-Control-Allow-Origin": "*" },
        });
    } finally {
        await client.close();
    }
}

export async function POST(req) {
    try {
        const { command } = await req.json();

        if (!command || (command !== "open" && command !== "close")) {
            return new Response(JSON.stringify({ error: "Invalid command. Use 'open' or 'close'." }), {
                status: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
            });
        }

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Store the new command
        const result = await collection.insertOne({ command, timestamp: new Date() });

        console.log(`Command stored: ${command}`);

        return new Response(JSON.stringify({ success: true, command, insertedId: result.insertedId }), {
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

// Handle CORS preflight requests
export async function OPTIONS() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
