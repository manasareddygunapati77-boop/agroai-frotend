const API_BASE_URL = "https://agritech-real-time-ai-backend.onrender.com";

export const predictCrop = async ({ location, nitrogen, phosphorus, potassium, ph }) => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: location || "Unknown",   // must be a string
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),   // ✅ spelling fixed
      potassium: Number(potassium),
      ph: Number(ph),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  return await response.json();
};
