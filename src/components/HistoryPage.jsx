import React from "react";
import { useNavigate } from "react-router-dom";

function HistoryPage() {
  const advisories = JSON.parse(localStorage.getItem("advisories")) || [];
  const navigate = useNavigate();

  return (
    <div className="history-page">
      <h2>📜 Full Search History</h2>
      {advisories.length === 0 ? (
        <p>No saved searches yet.</p>
      ) : (
        <ul>
          {advisories.map((item, index) => (
            <li key={index}>
              <strong>❓ {item.query}</strong><br />
              💡 {item.answer}<br />
              🕒 {item.date}
            </li>
          ))}
        </ul>
      )}

      {/* 🚀 Back button */}
      <button onClick={() => navigate("/")}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default HistoryPage;
