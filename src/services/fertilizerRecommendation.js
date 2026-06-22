import API from "./api";

export async function getFertilizerRecommendation(payload) {
  try {
    const res = await fetch(
      "https://agritech-real-time-ai-backend.onrender.com/fertilizer-recommendation",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: Number(payload.temperature || 0),
          humidity: Number(payload.humidity || 0),
          moisture: Number(payload.moisture || 0),
          nitrogen: Number(payload.nitrogen || 0),
          potassium: Number(payload.potassium || 0),
          phosphorous: Number(payload.phosphorous || 0), // ✅ spelling matches backend
          soil_type: String(payload.soil_type || ""),
          crop_type: String(payload.crop_type || ""),
        }),
      }
    );

    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("Fertilizer API error:", err);
    throw err;
  }
}
