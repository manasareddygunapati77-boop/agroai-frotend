import { useState } from "react";
import { predictCrop } from "../services/cropService";
import { translations } from "../utils/translations";
import "../styles/CropRecommendation.css";

function CropRecommendation({ location, selectedLanguage = "en", onBack }) {
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
      alert(selectedLanguage === "ta" ? "📍 முதலில் இடத்தைத் தேர்ந்தெடுக்கவும்!" : "📍 Please select a location first!");
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
      setCropResult({ error: selectedLanguage === "ta" ? "பயிர் கணிப்பு தோல்வியடைந்தது" : "Crop prediction failed" });
    }
  };

  return (
    <div className="crop-card">
      {/* Back header */}
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>{t.cropRecommendation}</h2>
      </div>

      <div className="inputs-grid">
        <input type="number" placeholder="Nitrogen" value={soilInputs.nitrogen} onChange={(e)=>setSoilInputs({...soilInputs,nitrogen:e.target.value})}/>
        <input type="number" placeholder="Phosphorus" value={soilInputs.phosphorus} onChange={(e)=>setSoilInputs({...soilInputs,phosphorus:e.target.value})}/>
        <input type="number" placeholder="Potassium" value={soilInputs.potassium} onChange={(e)=>setSoilInputs({...soilInputs,potassium:e.target.value})}/>
        <input type="number" placeholder="pH" value={soilInputs.ph} onChange={(e)=>setSoilInputs({...soilInputs,ph:e.target.value})}/>
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