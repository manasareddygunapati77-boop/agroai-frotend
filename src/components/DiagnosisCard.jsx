import "../styles/DiagnosisCard.css";

function DiagnosisCard({
  result,
}) {
  if (!result) {
    return (
      <div className="diagnosis-card">
        <h2>
          AI Diagnosis Results
        </h2>

        <p>
          Upload an image to
          diagnose crop disease.
        </p>
      </div>
    );
  }

  return (
    <div className="diagnosis-card">
      <h2>
        AI Diagnosis Results
      </h2>

      <div className="diagnosis-result">
        <h3>
          {result.disease}
        </h3>

        <p>
          Confidence:
          {" "}
          {result.confidence}
        </p>

        <p>
          Status:
          {" "}
          {result.status}
        </p>
      </div>
    </div>
  );
}

export default DiagnosisCard;