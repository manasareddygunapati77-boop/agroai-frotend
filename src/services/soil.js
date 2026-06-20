import API from "./api";

export const getSoil = async (lat, lon) => {
  const response = await API.get(
    `/soil?lat=${lat}&lon=${lon}`
  );

  return response.data;
};