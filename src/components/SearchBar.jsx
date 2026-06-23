import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { translations } from "../utils/translations";
import "../styles/SearchBar.css";

function SearchBar({
  query,
  setQuery,
  onSearch,
  selectedLanguage = "en",
  isRecording,
  toggleRecording,
}) {
  const t = translations[selectedLanguage];

  return (
    <div className="search-section">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder={
            selectedLanguage === "ta"
              ? "பயிர்கள், நோய்கள், உரங்களைத் தேடவும்..."
              : "Search crops, diseases, fertilizers..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Microphone icon inside input */}
        <FontAwesomeIcon
          icon={faMicrophone}
          className={`mic-icon ${isRecording ? "recording" : ""}`}
          onClick={toggleRecording}
          title={selectedLanguage === "ta" ? "மைக் அழுத்தவும்" : "Click to speak"}
        />
      </div>

      <button onClick={() => onSearch(query)}>
        {selectedLanguage === "ta" ? "தேடல்" : "Search"}
      </button>
    </div>
  );
}

export default SearchBar;
