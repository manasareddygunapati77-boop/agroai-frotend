import axios from "axios";

export async function getIrrigationRecommendation(payload) {
  try {
    const res = await axios.post(
      "https://agritech-real-time-ai-backend.onrender.com/irrigation-recommendation",
     
    );
    return res.data;
  } catch (err) {
    console.error("Irrigation API error:", err);
    throw err;
  }
}
