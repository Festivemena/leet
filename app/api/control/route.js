// app/api/control/route.js
export async function POST(req) {
    const { command } = await req.json();
    console.log(`Executing command: ${command}`);
    return Response.json({ success: true, command });
  }
  