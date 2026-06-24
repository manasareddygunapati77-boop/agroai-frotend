import { useState } from "react";
import { predictCrop } from "../services/cropService";
import { translations } from "../utils/translations";
import "../styles/CropRecommendation.css";

function CropRecommendation({ location, selectedLanguage = "en" }) {
  const [soilInputs, setSoilInputs] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
  });

  const [cropResult, setCropResult] = useState(null);
  const t = translations[selectedLanguage];

  const handleCropRecommendation = async () => {
    if (!location) {
      alert(
        selectedLanguage === "ta"
          ? "📍 முதலில் இடத்தைத் தேர்ந்தெடுக்கவும்!"
          : "📍 Please select a location first!"
      );
      return;
    }

    try {
      const res = await predictCrop({
        location: location.mandal || location.district || location.state,
        nitrogen: Number(soilInputs.nitrogen),
        phosphorus: Number(soilInputs.phosphorus),
        potassium: Number(soilInputs.potassium),
        ph: Number(soilInputs.ph),
      });
      setCropResult(res);
    } catch (err) {
      console.error(err.response?.data || err);
      setCropResult({
        error:
          selectedLanguage === "ta"
            ? "பயிர் கணிப்பு தோல்வியடைந்தது"
            : "Crop prediction failed",
      });
    }
  };

  return (
    <div className="crop-card">
      <h2>{t.cropRecommendation}</h2>

      <div className="inputs-grid">
        <input
          type="number"
          min="0"
          max="140"
          placeholder="Nitrogen (0–140)"
          title="Enter Nitrogen between 0 and 140"
          value={soilInputs.nitrogen}
          onChange={(e) =>
            setSoilInputs({ ...soilInputs, nitrogen: e.target.value })
          }
        />
        <input
          type="number"
          min="5"
          max="145"
          placeholder="Phosphorus (5–145)"
          title="Enter Phosphorus between 5 and 145"
          value={soilInputs.phosphorus}
          onChange={(e) =>
            setSoilInputs({ ...soilInputs, phosphorus: e.target.value })
          }
        />
        <input
          type="number"
          min="5"
          max="205"
          placeholder="Potassium (5–205)"
          title="Enter Potassium between 5 and 205"
          value={soilInputs.potassium}
          onChange={(e) =>
            setSoilInputs({ ...soilInputs, potassium: e.target.value })
          }
        />
        <input
          type="number"
          step="0.01"
          min="3.5"
          max="9.93"
          placeholder="pH (3.5–9.93)"
          title="Enter pH between 3.5 and 9.93"
          value={soilInputs.ph}
          onChange={(e) =>
            setSoilInputs({ ...soilInputs, ph: e.target.value })
          }
        />
      </div>

      <button onClick={handleCropRecommendation}>
        {selectedLanguage === "ta" ? "பயிரை கணிக்கவும்" : "Predict Crop"}
      </button>

      {cropResult && (
        <div className="crop-result">
          <h3>🌱 Crop: {cropResult.prediction}</h3>
          <p>🌡 Temp: {cropResult.features?.temperature}</p>
          <p>💧 Humidity: {cropResult.features?.humidity}</p>
          <p>🌧 Rainfall: {cropResult.features?.rainfall}</p>
        </div>
      )}
    </div>
  );
}

export default CropRecommendation;
