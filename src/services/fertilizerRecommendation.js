import API from "./api";

export const getFertilizerRecommendation = async (data) => {
  const response = await API.post(
    "/fertilizer-recommendation",
    data
  );

  return response.data;
};