import { useLocation, useNavigate } from "react-router-dom";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌾 AI Agriculture Result</h1>

      <button onClick={() => navigate("/")}>
        ⬅ Back
      </button>

      <pre style={{ marginTop: "20px" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default ResultsPage;