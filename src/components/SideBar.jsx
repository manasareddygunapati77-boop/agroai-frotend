import React from "react";
import { Link } from "react-router-dom";
import "../styles/SideBar.css";

function Sidebar({
  open,
  setOpen,
  selectedLanguage = "en",
  setActivePage,
  setSelectedLanguage,
  activePage,
}) {
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
            <Link
              to="/"
              className={activePage === "home" ? "active-link" : ""}
              onClick={() => {
                setActivePage("home");
                setOpen(false);
              }}
            >
              🏠 {selectedLanguage === "ta" ? "முகப்பு" : "Home"}
            </Link>
          </li>

          <li>
            <button
              className={activePage === "crop" ? "active-link" : ""}
              onClick={() => {
                setActivePage("crop");
                setOpen(false);
              }}
            >
              🌱 {selectedLanguage === "ta" ? "பயிர் பரிந்துரை" : "Crop Recommendation"}
            </button>
          </li>

          <li>
            <button
              className={activePage === "fertilizer" ? "active-link" : ""}
              onClick={() => {
                setActivePage("fertilizer");
                setOpen(false);
              }}
            >
              🧪 {selectedLanguage === "ta" ? "உர பரிந்துரை" : "Fertilizer Recommendation"}
            </button>
          </li>

          <li>
            <button
              className={activePage === "irrigation" ? "active-link" : ""}
              onClick={() => {
                setActivePage("irrigation");
                setOpen(false);
              }}
            >
              💧 {selectedLanguage === "ta" ? "நீர்ப்பாசனம்" : "Irrigation Recommendation"}
            </button>
          </li>

          <li>
            <button
              className={activePage === "disease" ? "active-link" : ""}
              onClick={() => {
                setActivePage("disease");
                setOpen(false);
              }}
            >
              🐛 {selectedLanguage === "ta" ? "நோய் கண்டறிதல்" : "Disease Detection"}
            </button>
          </li>

          <li>
            <Link
              to="/history"
              className={activePage === "history" ? "active-link" : ""}
              onClick={() => {
                setActivePage("history");
                setOpen(false);
              }}
            >
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
          <p>v1.0.0</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;