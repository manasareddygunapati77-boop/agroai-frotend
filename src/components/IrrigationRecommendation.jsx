import { useState } from "react";
import { getIrrigationRecommendation } from "../services/irrigationRecommendation";
import { translations } from "../utils/translations"; // import dictionary
import "../styles/IrrigationRecommendation.css";

function IrrigationRecommendation({ location, weather, selectedLanguage = "en" }) {
  const [inputs, setInputs] = useState({
    crop_type: "",
    soil_type: "Loam",
    region: "",
    season: "",
    farm_size_acres: "",
    soil_moisture_percent: "",
    groundwater_availability: "",
  });

  const [result, setResult] = useState(null);
  const t = translations[selectedLanguage];

  const handleChange = (field, value) => {
    setInputs({ ...inputs, [field]: value });
  };

  const handleIrrigationRecommendation = async () => {
    try {
      const payload = {
        crop_type: inputs.crop_type,
        soil_type: inputs.soil_type,
        region: inputs.region,
        season: inputs.season,
        farm_size_acres: Number(inputs.farm_size_acres || 0),
        soil_moisture_percent: Number(inputs.soil_moisture_percent || 0),
        groundwater_availability: inputs.groundwater_availability,
        temperature_c: weather?.temperature || 0,
        rainfall_mm: weather?.rainfall || 0,
        humidity_percent: weather?.humidity || 0,
        location: location?.village || "Unknown",
      };

      const res = await getIrrigationRecommendation(payload);
      setResult(res);
    } catch (err) {
      console.error("Irrigation API error:", err);
      alert(
        selectedLanguage === "ta"
          ? "நீர்ப்பாசன பரிந்துரை தோல்வியடைந்தது"
          : "Irrigation recommendation failed"
      );
    }
  };

  return (
    <div className="irrigation-card">
      <h2>💧 {t.irrigation}</h2>

      {/* Crop Type */}
      <label>{selectedLanguage === "ta" ? "பயிர் வகை:" : "Crop Type:"}</label>
      <select value={inputs.crop_type} onChange={(e) => handleChange("crop_type", e.target.value)}>
        <option value="">
          {selectedLanguage === "ta" ? "பயிரைத் தேர்ந்தெடுக்கவும்" : "Select Crop"}
        </option>
        {["Maize","Grapes","Sugarcane","Cotton","Rice","Barley","Vegetable","Wheat"].map(crop => (
          <option key={crop} value={crop}>{crop}</option>
        ))}
      </select>

      {/* Soil Type */}
      <label>{selectedLanguage === "ta" ? "மண் வகை:" : "Soil Type:"}</label>
      <select value={inputs.soil_type} onChange={(e) => handleChange("soil_type", e.target.value)}>
        {["Sandy","Clay","Silty","Clayey Loam","Loam"].map(soil => (
          <option key={soil} value={soil}>{soil}</option>
        ))}
      </select>

      {/* Region */}
      <label>{selectedLanguage === "ta" ? "பகுதி:" : "Region:"}</label>
      <select value={inputs.region} onChange={(e) => handleChange("region", e.target.value)}>
        {["Humid","Arid","Semi-Arid","Sub-Humid"].map(region => (
          <option key={region} value={region}>{region}</option>
        ))}
      </select>

      {/* Season */}
      <label>{selectedLanguage === "ta" ? "பருவம்:" : "Season:"}</label>
      <select value={inputs.season} onChange={(e) => handleChange("season", e.target.value)}>
        {["Rabi","Zaid","Kharif"].map(season => (
          <option key={season} value={season}>{season}</option>
        ))}
      </select>

      {/* Farm Size */}
      <div className="irrigation-inputs">
      <input
        type="number"
        placeholder={selectedLanguage === "ta" ? "பண்ணை அளவு (ஏக்கர்)" : "Farm Size (acres)"}
        value={inputs.farm_size_acres}
        onChange={(e) => handleChange("farm_size_acres", e.target.value)}
      />

      {/* Soil Moisture */}
      <input
        type="number"
        placeholder={selectedLanguage === "ta" ? "மண் ஈரப்பதம் (%)" : "Soil Moisture (%)"}
        value={inputs.soil_moisture_percent}
        onChange={(e) => handleChange("soil_moisture_percent", e.target.value)}
      /></div>

      {/* Groundwater Availability */}
      <label>{selectedLanguage === "ta" ? "நிலத்தடி நீர் கிடைக்கும் நிலை:" : "Groundwater Availability:"}</label>
      <select
        value={inputs.groundwater_availability}
        onChange={(e) => handleChange("groundwater_availability", e.target.value)}
      >
        {["High","Medium","Low"].map(level => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>

      <button onClick={handleIrrigationRecommendation}>
        {selectedLanguage === "ta" ? "பரிந்துரையை பெறவும்" : "Get Recommendation"}
      </button>

      {result && (
        <div className="irrigation-result">
          <h3>✅ {selectedLanguage === "ta" ? "பரிந்துரை" : "Recommendation"}</h3>
          <p>
            {result.recommended_irrigation ||
              (selectedLanguage === "ta"
                ? "பரிந்துரை கிடைக்கவில்லை"
                : "No recommendation available")}
          </p>
        </div>
      )}
    </div>
  );
}

export default IrrigationRecommendation;
