import { useState } from "react";
import { predictCrop } from "../services/cropService";
import { getFertilizerRecommendation } from "../services/fertilizerRecommendation";
import "../styles/CropRecommendation.css";

function CropRecommendation({ location }) {
  const [soilInputs, setSoilInputs] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
  });

  const [fertInputs, setFertInputs] = useState({
    moisture: "",
    soil_type: "Loamy",
    crop_type: "",
  });

  const [cropResult, setCropResult] = useState(null);

  // 🌾 Crop Recommendation
  const handleCropRecommendation = async () => {
    if (!location) {
      alert("📍 Please select a location first!");
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
      setCropResult({ error: "Crop prediction failed" });
    }
  };

const handleFertilizerRecommendation = async () => {
  if (!fertInputs.crop_type) {
    alert("🌱 Please select a crop from the dropdown!");
    return;
  }
  if (!cropResult) {
    alert("🌾 Please run crop prediction first!");
    return;
  }

  try {
    const res = await getFertilizerRecommendation({
      temperature: cropResult?.features?.temperature || 0,
      humidity: cropResult?.features?.humidity || 0,
      moisture: Number(fertInputs.moisture) || 0,
      nitrogen: Number(soilInputs.nitrogen) || 0,
      potassium: Number(soilInputs.potassium) || 0,
      phosphorous: Number(soilInputs.phosphorus) || 0, // ✅ spelling fixed
      soil_type: fertInputs.soil_type,
      crop_type: fertInputs.crop_type,
    });

    alert(`🧪 Recommended Fertilizer: ${res?.fertilizer || "N/A"}`);
  } catch (err) {
    console.error(err.response?.data || err);
    alert("Fertilizer prediction failed");
  }
};


  return (
    <div className="crop-card">
      <h2>🌾 Crop Recommendation</h2>

      {/* Soil Inputs */}
      <input
        type="number"
        placeholder="Nitrogen"
        value={soilInputs.nitrogen}
        onChange={(e) =>
          setSoilInputs({ ...soilInputs, nitrogen: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Phosphorus"
        value={soilInputs.phosphorus}
        onChange={(e) =>
          setSoilInputs({ ...soilInputs, phosphorus: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Potassium"
        value={soilInputs.potassium}
        onChange={(e) =>
          setSoilInputs({ ...soilInputs, potassium: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="pH"
        value={soilInputs.ph}
        onChange={(e) =>
          setSoilInputs({ ...soilInputs, ph: e.target.value })
        }
      />

      <button onClick={handleCropRecommendation}>Predict Crop</button>

      {cropResult && (
        <div className="crop-result">
          <h3>🌱 Crop: {cropResult.prediction}</h3>
          <p>🌡 Temp: {cropResult.features?.temperature}</p>
          <p>💧 Humidity: {cropResult.features?.humidity}</p>
          <p>🌧 Rainfall: {cropResult.features?.rainfall}</p>
        </div>
      )}

      {/* Fertilizer Recommendation */}
      <h2>🧪 Fertilizer Recommendation</h2>
      <input
        type="number"
        placeholder="Moisture"
        value={fertInputs.moisture}
        onChange={(e) =>
          setFertInputs({ ...fertInputs, moisture: e.target.value })
        }
      />
      <select
        value={fertInputs.soil_type}
        onChange={(e) =>
          setFertInputs({ ...fertInputs, soil_type: e.target.value })
        }
      >
        <option>Loamy</option>
        <option>Clay</option>
        <option>Sandy</option>
      </select>
      <select
        value={fertInputs.crop_type}
        onChange={(e) =>
          setFertInputs({ ...fertInputs, crop_type: e.target.value })
        }
      >
        <option value="">Select Crop</option>
        <option value="Paddy">Paddy</option>
        <option value="Wheat">Wheat</option>
        <option value="Maize">Maize</option>
        <option value="Sugarcane">Sugarcane</option>
        <option value="Cotton">Cotton</option>
        <option value="Groundnut">Groundnut</option>
        <option value="Soybean">Soybean</option>
        <option value="Chickpea">Chickpea</option>
        <option value="Pigeonpea">Pigeonpea (Red Gram)</option>
        <option value="Millets">Millets (Ragi/Bajra)</option>
      </select>
      <button onClick={handleFertilizerRecommendation}>
        Get Fertilizer
      </button>
    </div>
  );
}

export default CropRecommendation;
