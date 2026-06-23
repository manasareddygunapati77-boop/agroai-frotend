import React from "react";
import "../styles/Settings.css";

function Settings({ selectedLanguage = "en", setSelectedLanguage, onBack }) {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>{selectedLanguage === "ta" ? "அமைப்புகள்" : "Settings"}</h2>
      </div>

      {/* Language Card */}
      <div className="settings-card">
        <h3>🌐 {selectedLanguage === "ta" ? "மொழி" : "Language"}</h3>
        <div className="language-toggle">
          <button
            className={selectedLanguage === "ta" ? "active" : ""}
            onClick={() => setSelectedLanguage("ta")}
          >
            தமிழ் (Tamil)
          </button>
          <button
            className={selectedLanguage === "en" ? "active" : ""}
            onClick={() => setSelectedLanguage("en")}
          >
            English
          </button>
        </div>
      </div>

      {/* About Card */}
      <div className="settings-card">
        <h3>ℹ️ {selectedLanguage === "ta" ? "செயலி பற்றி" : "About"}</h3>
        <p className="about-text">
          🌾 <strong>AgroAI</strong> —{" "}
          {selectedLanguage === "ta"
            ? "செயற்கை நுண்ணறிவு விவசாய உதவியாளர்"
            : "Smart Farming Assistant"}
        </p>
        <p className="version-text">v1.0.0</p>
      </div>
    </div>
  );
}

export default Settings;