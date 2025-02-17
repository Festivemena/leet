import { useState, useEffect } from "react";
import axios from "axios";

export default function IoTControl() {
  const [sensorData, setSensorData] = useState(null);
  const [mode, setMode] = useState("auto");

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await axios.get("/api/sensor-data");
        setSensorData(response.data);
      } catch (error) {
        console.error("Error fetching sensor data", error);
      }
    };
    
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const toggleMode = async () => {
    const newMode = mode === "auto" ? "manual" : "auto";
    setMode(newMode);
    await axios.post("/api/mode", { mode: newMode });
  };

  const sendCommand = async (command) => {
    await axios.post("/api/control", { command });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">IoT Control Dashboard</h1>
      <div className="bg-white p-4 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-lg font-semibold">Sensor Values</h2>
        {sensorData ? (
          <p className="text-xl mt-2">{sensorData.value}</p>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
      
      <button
        onClick={toggleMode}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
      >
        Mode: {mode.toUpperCase()}
      </button>
      
      <div className="flex space-x-4 mt-6">
        <button onClick={() => sendCommand("action1")} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md">Action 1</button>
        <button onClick={() => sendCommand("action2")} className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md">Action 2</button>
        <button onClick={() => sendCommand("action3")} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md">Action 3</button>
      </div>
    </div>
  );
}
