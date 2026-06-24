import { useState } from "react";
import { getIrrigationRecommendation } from "../services/irrigationRecommendation";
import { translations } from "../utils/translations";
import "../styles/IrrigationRecommendation.css";

function IrrigationRecommendation({ location, weather, selectedLanguage = "en", onBack }) {
  const [inputs, setInputs] = useState({
    crop_type: "",
    soil_type: "Loam",
    region: "",
    season: "",
    farm_size_acres: "",
    soil_moisture_percent: "",
    groundwater_availability: "",
    rainfall_mm: "",
  });

  const [result, setResult] = useState(null);
  const t = translations[selectedLanguage];

  const handleChange = (field, value) => {
    setInputs({ ...inputs, [field]: value });
  };

  const handleIrrigationRecommendation = async () => {
    if (
      !inputs.crop_type ||
      !inputs.region ||
      !inputs.season ||
      !inputs.groundwater_availability
    ) {
      alert(
        selectedLanguage === "ta"
          ? "⚠️ அனைத்து தேர்வுகளையும் தேர்ந்தெடுக்கவும்!"
          : "⚠️ Please select Crop Type, Region, Season, and Groundwater Availability before submitting!"
      );
      return;
    }

    try {
      const payload = {
        crop_type: inputs.crop_type,
        soil_type: inputs.soil_type,
        region: inputs.region,
        season: inputs.season,
        farm_size_acres: Number(inputs.farm_size_acres || 0),
        soil_moisture_percent: Number(inputs.soil_moisture_percent || 0),
        groundwater_availability: inputs.groundwater_availability,
        rainfall_mm: Number(inputs.rainfall_mm || weather?.rainfall || 0),
        temperature_C: weather?.temperature || 0,
        humidity_percent: weather?.humidity || 0,
        location: location?.village || "Unknown",
      };

      console.log("Payload being sent:", payload);

      const res = await getIrrigationRecommendation(payload);
      setResult(res);
    } catch (err) {
      console.error("Irrigation API error:", err);
      if (err.response) {
        console.error("Backend Response:", err.response.data);
      }
      alert(
        selectedLanguage === "ta"
          ? "நீர்ப்பாசன பரிந்துரை தோல்வியடைந்தது"
          : "Irrigation recommendation failed"
      );
    }
  };

  return (
    <div className="irrigation-card">
      {/* Back header */}
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>💧 {t.irrigation}</h2>
      </div>

      {/* Crop Type */}
      <label>{selectedLanguage === "ta" ? "பயிர் வகை:" : "Crop Type:"}</label>
      <select value={inputs.crop_type} onChange={(e) => handleChange("crop_type", e.target.value)}>
        <option value="">{selectedLanguage === "ta" ? "பயிரைத் தேர்ந்தெடுக்கவும்" : "Select Crop"}</option>
        <option value="Rice">Rice → water-heavy paddy</option>
        <option value="Wheat">Wheat → winter grain</option>
        <option value="Cotton">Cotton → dry climate crop</option>
        <option value="Maize">Maize → food & fodder</option>
        <option value="Sugarcane">Sugarcane → high water need</option>
        <option value="Barley">Barley → drought tolerant</option>
        <option value="Grapes">Grapes → drip suited fruit</option>
        <option value="Vegetable">Vegetable → tomato, onion etc</option>
      </select>

      {/* Soil Type */}
      <label>{selectedLanguage === "ta" ? "மண் வகை:" : "Soil Type:"}</label>
      <select value={inputs.soil_type} onChange={(e) => handleChange("soil_type", e.target.value)}>
        <option value="Sandy">Sandy → drains fast</option>
        <option value="Clay">Clay → holds water</option>
        <option value="Loam">Loam → best for crops</option>
        <option value="Silty">Silty → fine, near rivers</option>
        <option value="Clayey Loam">Clayey Loam → clay-loam mix</option>
      </select>

      {/* Region */}
      <label>{selectedLanguage === "ta" ? "பகுதி:" : "Region:"}</label>
      <select value={inputs.region} onChange={(e) => handleChange("region", e.target.value)}>
        <option value="">{selectedLanguage === "ta" ? "தேர்ந்தெடுக்கவும்" : "Select Region"}</option>
        <option value="Humid">Humid → high rainfall</option>
        <option value="Arid">Arid → very dry</option>
        <option value="Semi-Arid">Semi-Arid → moderately dry</option>
        <option value="Sub-Humid">Sub-Humid → mild rainfall</option>
      </select>

      {/* Season */}
      <label>{selectedLanguage === "ta" ? "பருவம்:" : "Season:"}</label>
      <select value={inputs.season} onChange={(e) => handleChange("season", e.target.value)}>
        <option value="">{selectedLanguage === "ta" ? "தேர்ந்தெடுக்கவும்" : "Select Season"}</option>
        <option value="Kharif">Kharif → Jun – Oct</option>
        <option value="Rabi">Rabi → Nov – Mar</option>
        <option value="Zaid">Zaid → Apr – Jun</option>
      </select>

      {/* Farm Size */}
      <label>{selectedLanguage === "ta" ? "பண்ணை அளவு (ஏக்கர்)" : "Farm Size (acres)"}</label>
      <input
        type="number"
        min="0.5"
        max="50"
        step="0.1"
        placeholder="0.5 – 50 acres"
        value={inputs.farm_size_acres}
        onChange={(e) => handleChange("farm_size_acres", e.target.value)}
      />

      {/* Soil Moisture */}
      <label>{selectedLanguage === "ta" ? "மண் ஈரப்பதம் (%)" : "Soil Moisture (%)"}</label>
      <input
        type="number"
        min="10"
        max="80"
        placeholder="10 – 80 %"
        value={inputs.soil_moisture_percent}
        onChange={(e) => handleChange("soil_moisture_percent", e.target.value)}
      />

      {/* Rainfall (optional override) */}
      <label>{selectedLanguage === "ta" ? "மழை (மிமீ)" : "Rainfall (mm)"}</label>
      <input
        type="number"
        min="0"
        max="1120"
        placeholder={`Auto: ${weather?.rainfall || 0} mm`}
        value={inputs.rainfall_mm}
        onChange={(e) => handleChange("rainfall_mm", e.target.value)}
      />

      {/* Groundwater Availability */}
      <label>{selectedLanguage === "ta" ? "நிலத்தடி நீர் கிடைக்கும் நிலை:" : "Groundwater Availability:"}</label>
      <select
        value={inputs.groundwater_availability}
        onChange={(e) => handleChange("groundwater_availability", e.target.value)}
      >
        <option value="">{selectedLanguage === "ta" ? "தேர்ந்தெடுக்கவும்" : "Select"}</option>
        <option value="Low">Low → scarce</option>
        <option value="Medium">Medium → moderate</option>
        <option value="High">High → plenty</option>
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
