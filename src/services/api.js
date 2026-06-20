import axios from "axios";

const API = axios.create({
  baseURL: "https://agritech-real-time-ai-backend.onrender.com",
});

export default API;