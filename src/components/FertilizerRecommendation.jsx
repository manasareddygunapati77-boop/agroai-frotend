import { useState } from "react";
import { getFertilizerRecommendation } from "../services/fertilizerRecommendation";
import { translations } from "../utils/translations";
import "../styles/FertilizerRecommendation.css";

function FertilizerRecommendation({ weather, selectedLanguage = "en" }) {
  const [inputs, setInputs] = useState({
    crop_type: "",
    soil_type: "Loamy",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    moisture: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // NEW state
  const t = translations[selectedLanguage];

  const handleChange = (field, value) => {
    setInputs({ ...inputs, [field]: value });
  };

  const handleFertilizerRecommendation = async () => {
    if (!inputs.crop_type || !inputs.soil_type) {
      alert(
        selectedLanguage === "ta"
          ? "🌱 முதலில் பயிர் மற்றும் மண் வகையைத் தேர்ந்தெடுக்கவும்!"
          : "🌱 Please select crop and soil type!"
      );
      return;
    }

    setLoading(true);   // start loader
    setResult(null);    // clear old result

    try {
      const res = await getFertilizerRecommendation({
        temperature: weather?.temperature || 0,
        humidity: weather?.humidity || 0,
        moisture: Number(inputs.moisture || 0),
        nitrogen: Number(inputs.nitrogen || 0),
        potassium: Number(inputs.potassium || 0),
        phosphorous: Number(inputs.phosphorus || 0),
        soil_type: inputs.soil_type,
        crop_type: inputs.crop_type,
      });
      setResult(res);
    } catch (err) {
      console.error("Fertilizer API error:", err);
      setResult({
        recommended_fertilizer:
          selectedLanguage === "ta"
            ? "உர பரிந்துரை தோல்வியடைந்தது"
            : "Fertilizer recommendation failed",
      });
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="fertilizer-card">
      <h2>🧪 {t.fertilizer}</h2>

      {/* Crop Type Dropdown */}
      <label>{selectedLanguage === "ta" ? "பயிர் வகை:" : "Crop Type:"}</label>
      <select
        value={inputs.crop_type}
        onChange={(e) => handleChange("crop_type", e.target.value)}
      >
        <option value="">
          {selectedLanguage === "ta" ? "பயிரைத் தேர்ந்தெடுக்கவும்" : "Select Crop"}
        </option>
        {[
          "Maize",
          "Sugarcane",
          "Cotton",
          "Tobacco",
          "Paddy",
          "Barley",
          "Wheat",
          "Millets",
          "Oil seeds",
          "Pulses",
          "Ground Nuts",
        ].map((crop) => (
          <option key={crop} value={crop}>
            {crop}
          </option>
        ))}
      </select>

      {/* Soil Type Dropdown */}
      <label>{selectedLanguage === "ta" ? "மண் வகை:" : "Soil Type:"}</label>
      <select
        value={inputs.soil_type}
        onChange={(e) => handleChange("soil_type", e.target.value)}
      >
        {["Sandy", "Loamy", "Black", "Red", "Clayey"].map((soil) => (
          <option key={soil} value={soil}>
            {soil}
          </option>
        ))}
      </select>

      {/* Nutrient Inputs */}
      <div className="fertilizer-inputs">
        <input
          type="number"
          min="4"
          max="42"
          placeholder="Nitrogen (4–42)"
          value={inputs.nitrogen}
          onChange={(e) => handleChange("nitrogen", e.target.value)}
        />
        <input
          type="number"
          min="0"
          max="42"
          placeholder="Phosphorus (0–42)"
          value={inputs.phosphorus}
          onChange={(e) => handleChange("phosphorus", e.target.value)}
        />
        <input
          type="number"
          min="0"
          max="19"
          placeholder="Potassium (0–19)"
          value={inputs.potassium}
          onChange={(e) => handleChange("potassium", e.target.value)}
        />
        <input
          type="number"
          min="25"
          max="65"
          placeholder="Moisture (25–65)"
          value={inputs.moisture}
          onChange={(e) => handleChange("moisture", e.target.value)}
        />
      </div>

      <button onClick={handleFertilizerRecommendation}>
        {selectedLanguage === "ta" ? "பரிந்துரையை பெறவும்" : "Get Recommendation"}
      </button>

      {/* Loader */}
      {loading && (
        <div className="loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="fertilizer-result">
          <h3>✅ {selectedLanguage === "ta" ? "பரிந்துரை" : "Recommendation"}</h3>
          <p>
            {result.recommended_fertilizer ||
              (selectedLanguage === "ta"
                ? "பரிந்துரை கிடைக்கவில்லை"
                : "No recommendation available")}
          </p>
        </div>
      )}
    </div>
  );
}

export default FertilizerRecommendation;
