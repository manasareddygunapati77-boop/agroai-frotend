import { useState, useEffect } from "react";

import Header from "../components/Header";
import LocationSelector from "../components/LocationSelector";
import SearchBar from "../components/SearchBar";
import CropRecommendation from "../components/CropRecommendation";
import FertilizerRecommendation from "../components/FertilizerRecommendation";
import IrrigationRecommendation from "../components/IrrigationRecommendation";
import UploadCard from "../components/UploadCard";
import DiagnosisCard from "../components/DiagnosisCard";
import FloatingMic from "../components/FloatingMic";
import { translations } from "../utils/translations";

import { searchCropOrDisease } from "../services/searchService";
import { predictDisease } from "../services/disease";
import { getWeather } from "../services/weather";

import "../styles/Dashboard.css";

function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // single source of truth
  const [showSettings, setShowSettings] = useState(false);
  const t = translations[selectedLanguage];

  const [location, setLocation] = useState(null);
  const [query, setQuery] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [weather, setWeather] = useState(null);

  // LOCATION
  const handleLocationChange = async (selectedLocation) => {
    setLocation(selectedLocation);
    try {
      const locString =
        selectedLocation?.village ||
        selectedLocation?.district ||
        selectedLocation?.state ||
        "Unknown";

      const res = await getWeather(locString);
      setWeather(res);
    } catch (err) {
      console.error("Weather fetch failed:", err);
    }
  };

  // SEARCH
  const handleSearch = async (searchText = query) => {
    if (!searchText?.trim()) return;
    try {
      setIsSearching(true);
      const results = await searchCropOrDisease(searchText);
      setSearchResults(results.answer);

      // Save advisory locally
      const saved = JSON.parse(localStorage.getItem("advisories")) || [];
      saved.unshift({
        query: searchText,
        answer: results.answer,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem("advisories", JSON.stringify(saved));

      // Auto-translate if Tamil selected
      if (selectedLanguage === "ta") {
        await handleTranslateToTamil(results.answer);
      }
    } catch (error) {
      console.error(error);
      setSearchResults("Failed to fetch AI response.");
    } finally {
      setIsSearching(false);
    }
  };

  // TRANSLATE
  const handleTranslateToTamil = async (text) => {
    if (!text) return;
    try {
      const res = await fetch(
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ta&dt=t&q=" +
          encodeURIComponent(text)
      );
      const data = await res.json();
      const tamilText = data[0].map((item) => item[0]).join(" ");
      setTranslatedText(tamilText);
      return tamilText;
    } catch (err) {
      console.error(err);
      alert("Translation failed");
      return text;
    }
  };

  // VOICE SEARCH
  const handleVoiceSearch = async (spokenText) => {
    setQuery(spokenText);
    await handleSearch(spokenText);
  };

  // IMAGE UPLOAD + DISEASE DETECTION
  const handleImageUpload = async (file) => {
    setUploadedImage(URL.createObjectURL(file));
    try {
      const response = await predictDisease(file);
      const prediction = response.disease_prediction || "";
      const lines = prediction.split("\n");
      let disease =
        lines[0]
          ?.replace("Disease: ", "")
          .replaceAll("__", " - ")
          .replaceAll("_", " ") || "Unknown";
      let confidence = lines[1]?.replace("Confidence: ", "") || "N/A";

      if (selectedLanguage === "ta") {
        disease = await handleTranslateToTamil(disease);
      }

      setDiagnosisResult({ disease, confidence, status: response.status });
    } catch (error) {
      console.error(error);
      setDiagnosisResult({
        disease: "Detection Failed",
        confidence: "-",
        status: "error",
      });
    }
  };

  return (
    <div className="dashboard">
      <Header selectedLanguage={selectedLanguage} />
      <LocationSelector onLocationChange={handleLocationChange} selectedLanguage={selectedLanguage} />

      {/* Settings Button */}
      <button 
        className="settings-btn" 
        onClick={() => setShowSettings(!showSettings)}
      >
        ⚙ {selectedLanguage === "ta" ? "அமைப்புகள்" : "Settings"}
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <h3>{selectedLanguage === "ta" ? "அமைப்புகள்" : "Settings"}</h3>
          <div className="language-selector">
            <label>{selectedLanguage === "ta" ? "மொழியைத் தேர்ந்தெடுக்கவும்:" : "Select Language:"}</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
        </div>
      )}

      {/* Search */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        isSearching={isSearching}
         selectedLanguage={selectedLanguage}
      />

      {/* Advisory Results */}
      {searchResults && (
        <div className="search-result-card">
          <h2>{t.advisory}</h2>
          <div className="advisory-content">
            {(selectedLanguage === "ta" ? translatedText : searchResults)
              .split("\n")
              .filter((line) => line.trim())
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
          <button onClick={() => handleTranslateToTamil(searchResults)}>
            {t.translate}
          </button>
        </div>
      )}

      {/* Crop Recommendation */}
      <CropRecommendation location={location} selectedLanguage={selectedLanguage} />
      <FertilizerRecommendation weather={weather} selectedLanguage={selectedLanguage} />

      {/* Irrigation Recommendation */}
      <IrrigationRecommendation
        location={location}
        weather={weather}
        selectedLanguage={selectedLanguage}
      />

      {/* Disease Detection */}
      <UploadCard uploadedImage={uploadedImage} onImageUpload={handleImageUpload} selectedLanguage={selectedLanguage} />
      <DiagnosisCard result={diagnosisResult} selectedLanguage={selectedLanguage} />

      {/* Voice Assistant */}
      <FloatingMic
        onSearch={handleVoiceSearch}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        language={selectedLanguage === "ta" ? "ta-IN" : "en-IN"}
      />
    </div>
  );
}

export default Dashboard;
