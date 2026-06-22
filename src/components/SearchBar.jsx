// SearchBar.jsx
import React from "react";
import { translations } from "../utils/translations"; // import dictionary
import "../styles/SearchBar.css";

function SearchBar({ query, setQuery, onSearch, selectedLanguage = "en" }) {
  const t = translations[selectedLanguage];

  return (
    <div className="search-bar">
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
      <button onClick={() => onSearch(query)}>
        {selectedLanguage === "ta" ? "தேடல்" : "Search"}
      </button>
      
    </div>
  );
}

export default SearchBar;
