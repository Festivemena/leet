// app/api/mode/route.js
let currentMode = "auto";
export async function POST(req) {
  const { mode } = await req.json();
  currentMode = mode;
  return Response.json({ mode: currentMode });
}