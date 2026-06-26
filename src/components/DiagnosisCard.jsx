import "../styles/DiagnosisCard.css";
import { translations } from "../utils/translations";

function DiagnosisCard({ result, selectedLanguage = "en" }) {
  const t = translations[selectedLanguage];

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
  <h3>{result.disease}</h3>

  <pre>{JSON.stringify(result, null, 2)}</pre>

  <p>
    <strong>Advice:</strong> {result.advice}
  </p>

  <p>
    <strong>{t.confidence}:</strong> {result.confidence}
  </p>

  <p>
    <strong>{t.status}:</strong> {result.status}
  </p>
</div>
    </div>
  );
}

export default DiagnosisCard;
