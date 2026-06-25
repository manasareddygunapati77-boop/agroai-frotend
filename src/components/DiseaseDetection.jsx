import { useState } from "react";
import UploadCard from "../components/UploadCard";
import DiagnosisCard from "../components/DiagnosisCard";
import { translations } from "../utils/translations";
import { predictDisease } from "../services/disease";
import "../styles/DiagnosisCard.css";

function DiseaseDetection({ selectedLanguage = "en" }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const t = translations[selectedLanguage];

  const handleImageUpload = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDetect = async () => {
    if (!imageFile) {
      alert(selectedLanguage === "ta" ? "படத்தை பதிவேற்றவும்" : "Please upload an image");
      return;
    }
    try {
      setLoading(true);
      setResult(null); // clear old result

      const response = await predictDisease(imageFile);

      // Convert backend JSON into line-based format
      const lines = [
        response.disease_prediction || "N/A",
        response.advice || "N/A",
        response.confidence_score != null
          ? (response.confidence_score * 100).toFixed(2) + "%"
          : "N/A",
        response.status || "N/A",
      ];

      const disease = lines[0].replaceAll("__", " - ").replaceAll("_", " ");
      const advice = lines[1];
      const confidence = lines[2];
      const status = lines[3];

      setResult({ disease, advice, confidence, status });
    } catch (error) {
      console.error(error);
      alert(
        selectedLanguage === "ta"
          ? "நோய் கண்டறிதல் தோல்வியடைந்தது"
          : "Disease detection failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>{t.diseaseDetection}</h2>

      <UploadCard
        onImageUpload={handleImageUpload}
        uploadedImage={imagePreview}
        selectedLanguage={selectedLanguage}
      />

      <button onClick={handleDetect}>
        {loading
          ? selectedLanguage === "ta"
            ? "கண்டறியப்படுகிறது..."
            : "Detecting..."
          : selectedLanguage === "ta"
          ? "நோயை கண்டறியவும்"
          : "Detect Disease"}
      </button>

      <DiagnosisCard result={result} selectedLanguage={selectedLanguage} />
    </div>
  );
}

export default DiseaseDetection;
