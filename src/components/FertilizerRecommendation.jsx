import { useState } from "react";

import { getWeather } from "../services/weather";
import { getFertilizerRecommendation } from "../services/fertilizerRecommendation";

function FertilizerRecommendation({
  location,
}) {
  const [formData, setFormData] =
    useState({
      nitrogen: "",
      phosphorous: "",
      potassium: "",
      soil_type: "",
      crop_type: "",
    });

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const weather =
        await getWeather(location);

      const payload = {
        temperature:
          weather.temperature,

        humidity:
          weather.humidity,

        moisture:
          weather.soil_moisture_0_1cm ??
          weather.humidity,

        nitrogen:
          Number(
            formData.nitrogen
          ),

        phosphorous:
          Number(
            formData.phosphorous
          ),

        potassium:
          Number(
            formData.potassium
          ),

        soil_type:
          formData.soil_type,

        crop_type:
          formData.crop_type,
      };

      const response =
        await getFertilizerRecommendation(
          payload
        );

      setResult(response);

    } catch (error) {
      console.error(error);

      alert(
        "Failed to get fertilizer recommendation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fertilizer-card">

      <h2>
        Fertilizer Recommendation
      </h2>

      <p>
        Location:
        {" "}
        {location || "Not selected"}
      </p>

      <input
        type="number"
        name="nitrogen"
        placeholder="Nitrogen (N)"
        onChange={handleChange}
      />

      <input
        type="number"
        name="phosphorous"
        placeholder="Phosphorous (P)"
        onChange={handleChange}
      />

      <input
        type="number"
        name="potassium"
        placeholder="Potassium (K)"
        onChange={handleChange}
      />

      <input
        type="text"
        name="soil_type"
        placeholder="Soil Type"
        onChange={handleChange}
      />

      <input
        type="text"
        name="crop_type"
        placeholder="Crop Type"
        onChange={handleChange}
      />

      <button
        onClick={handleSubmit}
      >
        {loading
          ? "Loading..."
          : "Get Recommendation"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <h3>
            Recommended Fertilizer
          </h3>

          <p>
            {
              result.recommended_fertilizer
            }
          </p>

          <p>
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default FertilizerRecommendation;