import API from "./api";

export const getWeather = async (locationName) => {
  const response = await API.get(
    `/weather?location=${locationName}`
  );

  return response.data;
};