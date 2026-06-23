import React from "react";
import { Link } from "react-router-dom";
import "../styles/BottomNav.css";

function BottomNav({ activePage, setActivePage, selectedLanguage = "en" }) {
  return (
    <div className="bottom-nav">
      <button
        className={activePage === "home" ? "active" : ""}
        onClick={() => setActivePage("home")}
      >
        🏠
        <span>{selectedLanguage === "ta" ? "முகப்பு" : "Home"}</span>
      </button>

      {/* History is a real route, so use Link, not activePage state */}
      <Link to="/history" className="bottom-nav-link">
        🕘
        <span>{selectedLanguage === "ta" ? "வரலாறு" : "History"}</span>
      </Link>

      <button
        className={activePage === "settings" ? "active" : ""}
        onClick={() => setActivePage("settings")}
      >
        ⚙️
        <span>{selectedLanguage === "ta" ? "அமைப்புகள்" : "Settings"}</span>
      </button>
    </div>
  );
}

export default BottomNav;