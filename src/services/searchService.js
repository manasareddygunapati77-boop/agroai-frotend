const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// 🔍 Search Crop / Disease
import API from "./api";

export const searchCropOrDisease = async (query) => {
  const res = await API.post("/ai-query", {
    query,
  });

  return res.data;
};

// 🌾 Crop Recommendation
export const recommendCrop = async (
  data
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Recommendation error:",
      error
    );
    throw error;
  }
};

// 🌱 Get all crops
export const getAllCrops = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/crops`
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Get crops error:",
      error
    );
    throw error;
  }
};

// 🌿 Get crop details
export const getCropDetails = async (
  cropName
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/crops/${encodeURIComponent(
        cropName
      )}`
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Crop details error:",
      error
    );
    throw error;
  }
};