import "../styles/DiagnosisCard.css";
import { translations } from "../utils/translations";

function DiagnosisCard({ result, selectedLanguage = "en", loading = false }) {
  const t = translations[selectedLanguage];

  if (loading) {
    return (
      <div className="diagnosis-card">
        <h2>{t.disease}</h2>
        <div className="loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>
          {selectedLanguage === "ta"
            ? "🔍 நோய் கண்டறியப்படுகிறது..."
            : "🔍 Detecting disease..."}
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="diagnosis-card">
        <h2>{t.disease}</h2>
        <p>
          {selectedLanguage === "ta"
            ? "பயிர் நோயை கண்டறிய படத்தை பதிவேற்றவும்."
            : "Upload an image to diagnose crop disease."}
        </p>
      </div>
    );
  }

  return (
    <div className="diagnosis-card">
      <h2>{t.disease}</h2>
      <div className="diagnosis-result">
  <h3>{result.disease_prediction.replaceAll("__", " - ").replaceAll("_", " ")}</h3>
  <p><strong>Advice:</strong> {result.advice}</p>
  <p>{t.confidence}: {(result.confidence_score * 100).toFixed(2)}%</p>
  <p>{t.status}: {result.status}</p>
</div>

    </div>
  );
}

export default DiagnosisCard;
