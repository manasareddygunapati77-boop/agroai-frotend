import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar({ open, setOpen, selectedLanguage = "en", setActivePage, setSelectedLanguage }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${open ? "active" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <h2>🌾 AgroAI</h2>
          <button
            className="close-btn"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <ul className="sidebar-menu">
          <li>
            <Link to="/" onClick={() => setOpen(false)}>
              🏠 {selectedLanguage === "ta" ? "முகப்பு" : "Home"}
            </Link>
          </li>

          <li>
            <button onClick={() => { setActivePage("crop"); setOpen(false); }}>
              🌱 {selectedLanguage === "ta" ? "பயிர் பரிந்துரை" : "Crop Recommendation"}
            </button>
          </li>

          <li>
            <button onClick={() => { setActivePage("fertilizer"); setOpen(false); }}>
              🧪 {selectedLanguage === "ta" ? "உர பரிந்துரை" : "Fertilizer Recommendation"}
            </button>
          </li>

          <li>
            <button onClick={() => { setActivePage("irrigation"); setOpen(false); }}>
              💧 {selectedLanguage === "ta" ? "நீர்ப்பாசனம்" : "Irrigation Recommendation"}
            </button>
          </li>

          <li>
            <button onClick={() => { setActivePage("disease"); setOpen(false); }}>
              🐛 {selectedLanguage === "ta" ? "நோய் கண்டறிதல்" : "Disease Detection"}
            </button>
          </li>

          <li>
            <Link to="/history" onClick={() => setOpen(false)}>
              📜 {selectedLanguage === "ta" ? "வரலாறு" : "History"}
            </Link>
          </li>

          {/* Settings with language selector */}
          <li className="settings-item">
            <span>⚙ {selectedLanguage === "ta" ? "அமைப்புகள்" : "Settings"}</span>
            <div className="language-selector">
              <button onClick={() => { setSelectedLanguage("ta"); setOpen(false); }}>
                தமிழ்
              </button>
             
              <button onClick={() => { setSelectedLanguage("en"); setOpen(false); }}>
                English
              </button>
            </div>
          </li>
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <p>🌱 Smart Farming Assistant</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
