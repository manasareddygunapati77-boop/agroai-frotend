// src/services/irrigationService.js
import axios from "axios";
export async function getIrrigationRecommendation(payload) {
  try {
    const res = await fetch(
      "https://agritech-real-time-ai-backend.onrender.com/irrigation-recommendation",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: String(payload.location || "Unknown"),
          crop_type: String(payload.crop_type || ""),
          soil_type: String(payload.soil_type || ""),
          region: String(payload.region || ""),
          season: String(payload.season || ""),
          farm_size_acres: Number(payload.farm_size_acres || 0),
          soil_moisture_percent: Number(payload.soil_moisture_percent || 0),
          groundwater_availability: String(payload.groundwater_availability || ""),
          temperature_C: Number(payload.temperature_c || 0),
          rainfall_mm: Number(payload.rainfall_mm || 0),
          humidity_percent: Number(payload.humidity_percent || 0),
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Irrigation API error:", err);
    throw err;
  }
}
