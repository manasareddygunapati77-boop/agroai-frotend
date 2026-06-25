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
  const [loading, setLoading] = useState(false); // NEW state
  const t = translations[selectedLanguage];

  const handleChange = (field, value) => {
    setInputs({ ...inputs, [field]: value });
  };

  const handleIrrigationRecommendation = async () => {
    if (!inputs.crop_type || !inputs.region || !inputs.season || !inputs.groundwater_availability) {
      alert(
        selectedLanguage === "ta"
          ? "⚠️ அனைத்து தேர்வுகளையும் தேர்ந்தெடுக்கவும்!"
          : "⚠️ Please select Crop Type, Region, Season, and Groundwater Availability before submitting!"
      );
      return;
    }

    setLoading(true);   // start loader
    setResult(null);    // clear old result

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
      setResult({
        recommended_irrigation:
          selectedLanguage === "ta"
            ? "நீர்ப்பாசன பரிந்துரை தோல்வியடைந்தது"
            : "Irrigation recommendation failed",
      });
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="irrigation-card">
      {/* Back header */}
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>💧 {t.irrigation}</h2>
      </div>

      {/* Inputs same as before... */}

      <button onClick={handleIrrigationRecommendation}>
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
