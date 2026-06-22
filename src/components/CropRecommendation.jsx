import { useState } from "react";
import { predictCrop } from "../services/cropService";
import { translations } from "../utils/translations"; // import dictionary
import "../styles/CropRecommendation.css";

function CropRecommendation({ location, selectedLanguage = "en" }) {
  const [soilInputs, setSoilInputs] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
  });

  const [cropResult, setCropResult] = useState(null);

  const t = translations[selectedLanguage]; // pick labels based on language

  // 🌾 Crop Recommendation
  const handleCropRecommendation = async () => {
    if (!location) {
      alert(selectedLanguage === "ta" ? "📍 முதலில் இடத்தைத் தேர்ந்தெடுக்கவும்!" : "📍 Please select a location first!");
      return;
    }

    try {
      const res = await predictCrop({
        location: location.village || location.district || location.state,
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
      <h2>{t.cropRecommendation}</h2>

      {/* Soil Inputs */}
      <input
        type="number"
        placeholder={selectedLanguage === "ta" ? "நைட்ரஜன்" : "Nitrogen"}
        value={soilInputs.nitrogen}
        onChange={(e) =>
          setSoilInputs({ ...soilInputs, nitrogen: e.target.value })
        }
      />
      <input
        type="number"
        placeholder={selectedLanguage === "ta" ? "பாஸ்பரஸ்" : "Phosphorus"}
        value={soilInputs.phosphorus}
        onChange={(e) =>
          setSoilInputs({ ...soilInputs, phosphorus: e.target.value })
        }
      />
      <input
        type="number"
        placeholder={selectedLanguage === "ta" ? "பொட்டாசியம்" : "Potassium"}
        value={soilInputs.potassium}
        onChange={(e) =>
          setSoilInputs({ ...soilInputs, potassium: e.target.value })
        }
      />
      <input
        type="number"
        placeholder={selectedLanguage === "ta" ? "pH" : "pH"}
        value={soilInputs.ph}
        onChange={(e) =>
          setSoilInputs({ ...soilInputs, ph: e.target.value })
        }
      />

      <button onClick={handleCropRecommendation}>
        {selectedLanguage === "ta" ? "பயிரை கணிக்கவும்" : "Predict Crop"}
      </button>

      {cropResult && (
        <div className="crop-result">
          <h3>🌱 {selectedLanguage === "ta" ? "பயிர்" : "Crop"}: {cropResult.prediction}</h3>
          <p>🌡 {selectedLanguage === "ta" ? "வெப்பநிலை" : "Temp"}: {cropResult.features?.temperature}</p>
          <p>💧 {selectedLanguage === "ta" ? "ஈரப்பதம்" : "Humidity"}: {cropResult.features?.humidity}</p>
          <p>🌧 {selectedLanguage === "ta" ? "மழை" : "Rainfall"}: {cropResult.features?.rainfall}</p>
        </div>
      )}
    </div>
  );
}

export default CropRecommendation;
