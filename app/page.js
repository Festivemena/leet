"use client"
import { useState, useEffect } from "react";

export default function IoTControl() {
  const [sensorData, setSensorData] = useState(null);
  const [mode, setMode] = useState("auto");

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("https://leet-ten.vercel.app/api/sensor-data");
        const data = await response.json();
        setSensorData(data.latestData.sensorValue);
        console.log(data.latestData.sensorValue);
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
    await fetch("https://leet-ten.vercel.app/api/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: newMode })
    });
  };

  const sendCommand = async (command) => {
    await fetch("https://leet-ten.vercel.app/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command })
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl text-black font-bold mb-4">Automated Window Blind</h1>
      <div className="bg-white p-4 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-lg text-black font-semibold">UV value</h2>
        {sensorData ? (
          <p className="text-xl text-black mt-2">{sensorData}</p>
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
        <button onClick={() => sendCommand("open")} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md">Open</button>
        <button onClick={() => sendCommand("close")} className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md">Close</button>
        {/* <button onClick={() => sendCommand("action3")} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md">Action 3</button> */}
      </div>
    </div>
  );
}
