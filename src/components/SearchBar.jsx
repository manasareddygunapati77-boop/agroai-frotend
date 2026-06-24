import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { translations } from "../utils/translations";
import "../styles/SearchBar.css";

function SearchBar({
  query,
  setQuery,
  onSearch,
  selectedLanguage = "en",
}) {
  const t = translations[selectedLanguage];
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const initRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage === "ta" ? "ta-IN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      console.log("🎤 Listening started (" + recognition.lang + ")");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      console.log("VOICE:", text);
      setQuery(text); // ✅ put transcript into search bar
    };

    recognition.onerror = (event) => {
      console.log("Error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log("🎤 Listening ended");
    };

    return recognition;
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.log("Recognition Start Error:", error);
      }
    }
  };

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
u try to change thhis in githhub
