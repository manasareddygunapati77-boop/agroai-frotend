import React from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";

function SearchHistory({ selectedLanguage = "en" }) {
  const advisories = JSON.parse(localStorage.getItem("advisories")) || [];
  const t = translations[selectedLanguage];
  const navigate = useNavigate();

  return (
    <div className="history-card">
      {/* Only one button */}
      <button onClick={() => navigate("/history")}>
        {selectedLanguage === "ta" ? "முழு வரலாற்றைப் பார்க்கவும்" : "View Full History"}
      </button>
    </div>
  );
}

export default SearchHistory;
