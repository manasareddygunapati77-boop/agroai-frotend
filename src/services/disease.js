import API from "./api";

export const predictDisease = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post("/predict-disease", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};