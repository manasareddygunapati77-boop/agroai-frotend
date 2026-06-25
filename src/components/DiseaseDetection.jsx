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
      console.log("Backend response:", response); // debug log
      setResult(response);
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

      {/* Always render DiagnosisCard and let it handle states */}
      <DiagnosisCard
        result={result}
        selectedLanguage={selectedLanguage}
        loading={loading}
      />
    </div>
  );
}

export default DiseaseDetection;
