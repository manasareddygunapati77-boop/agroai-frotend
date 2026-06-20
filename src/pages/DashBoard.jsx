import { useState } from "react";

import Header from "../components/Header";
import LocationSelector from "../components/LocationSelector";
import SearchBar from "../components/SearchBar";
import CropRecommendation from "../components/CropRecommendation";
import UploadCard from "../components/UploadCard";
import DiagnosisCard from "../components/DiagnosisCard";
import FloatingMic from "../components/FloatingMic";

import { searchCropOrDisease } from "../services/searchService";
import { predictDisease } from "../services/disease";

import "../styles/Dashboard.css";

function Dashboard() {
  const [location, setLocation] = useState(null);
  const [query, setQuery] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");

  // LOCATION
  const handleLocationChange = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  // SEARCH
  const handleSearch = async (searchText = query) => {
    if (!searchText?.trim()) return;

    try {
      setIsSearching(true);

      const results = await searchCropOrDisease(searchText);
      console.log("RESULTS =", results);
      setSearchResults(results.answer);

      // Save Advisory locally
      const saved = JSON.parse(localStorage.getItem("advisories")) || [];
      saved.unshift({
        query: searchText,
        answer: results.answer,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem("advisories", JSON.stringify(saved));

      // 🔥 Save Advisory to backend history
      await fetch("https://agritech-real-time-ai-backend.onrender.com/history/history_get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchText,
          answer: results.answer,
          location: location || "Unknown",
          date: new Date().toISOString(),
        }),
      });

    } catch (error) {
      console.error(error);
      setSearchResults("Failed to fetch AI response.");
    } finally {
      setIsSearching(false);
    }
  };

  // 🌐 Translate to Tamil
  const handleTranslateToTamil = async () => {
    if (!searchResults) return;
    try {
      const res = await fetch(
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ta&dt=t&q=" +
          encodeURIComponent(searchResults)
      );
      const data = await res.json();
      const tamilText = data[0].map(item => item[0]).join(" ");
      setTranslatedText(tamilText);
    } catch (err) {
      console.error(err);
      alert("Translation failed");
    }
  };

  // 🔊 Read Original Advisory line by line
  const handleReadOriginalLineByLine = () => {
    if (!searchResults) {
      alert("No advisory content to read!");
      return;
    }
    const lines = searchResults
      .split("\n")
      .map(line => line.replace(/[*•]/g, "").replace(/^\d+\.\s*/gm, "").trim())
      .filter(line => line.length > 0);

    let index = 0;
    const speakNextLine = () => {
      if (index < lines.length) {
        const utterance = new SpeechSynthesisUtterance(lines[index]);
        utterance.lang = "en-IN";
        utterance.onend = () => {
          index++;
          setTimeout(speakNextLine, 600);
        };
        speechSynthesis.speak(utterance);
      }
    };
    speechSynthesis.cancel();
    speakNextLine();
  };

  // 🔊 Read Tamil line by line
  const handleReadTamilLineByLine = () => {
    const textToRead = translatedText || searchResults;
    if (!textToRead) {
      alert("No content to read!");
      return;
    }
    const lines = textToRead
      .split("\n")
      .map(line => line.replace(/[*•]/g, "").replace(/^\d+\.\s*/gm, "").trim())
      .filter(line => line.length > 0);

    let index = 0;
    const speakNextLine = () => {
      if (index < lines.length) {
        const utterance = new SpeechSynthesisUtterance(lines[index]);
        utterance.lang = "ta-IN";
        utterance.onend = () => {
          index++;
          setTimeout(speakNextLine, 600);
        };
        speechSynthesis.speak(utterance);
      }
    };
    speechSynthesis.cancel();
    speakNextLine();
  };

  // Playback controls
  const handleStopReading = () => {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
  };
  const handlePauseReading = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) speechSynthesis.pause();
  };
  const handleResumeReading = () => {
    if (speechSynthesis.paused) speechSynthesis.resume();
  };

  // VOICE SEARCH
  const handleVoiceSearch = async (spokenText) => {
    setQuery(spokenText);
    await handleSearch(spokenText);
  };

  // DISEASE DETECTION
  const handleImageUpload = async (file) => {
    setUploadedImage(URL.createObjectURL(file));
    try {
      const response = await predictDisease(file);
      const prediction = response.disease_prediction || "";
      const lines = prediction.split("\n");
      const disease = lines[0]?.replace("Disease: ", "").replaceAll("__", " - ").replaceAll("_", " ") || "Unknown";
      const confidence = lines[1]?.replace("Confidence: ", "") || "N/A";
      setDiagnosisResult({ disease, confidence, status: response.status });
    } catch (error) {
      console.error(error);
      setDiagnosisResult({ disease: "Detection Failed", confidence: "-", status: "error" });
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <LocationSelector onLocationChange={handleLocationChange} />

      {/* Language Selector */}
      <div className="language-selector">
        <label>🎤 Voice Language</label>
        <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
          <option value="ta-IN">Tamil</option>
          <option value="en-IN">English</option>
        </select>
      </div>

      {/* Search */}
      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} isSearching={isSearching} />

      {/* Search Results */}
      {searchResults && (
        <div className="search-result-card">
          <h2>🌾 AI Advisory</h2>
          <div className="advisory-content">
            {searchResults.split("\n").filter(line => line.trim()).map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          
          <button onClick={handleTranslateToTamil}>🌐 Translate to Tamil</button>
          <button onClick={handleReadTamilLineByLine}>🔊 Read Tamil (Line by Line)</button>
          <button onClick={handlePauseReading}>⏸ Pause</button>
          <button onClick={handleResumeReading}>▶ Resume</button>
          <button onClick={handleStopReading}>⏹ Stop</button>

          {translatedText && <p className="translated-text">🇮🇳 {translatedText}</p>}
        </div>
      )}

      <CropRecommendation location={location} />
      <UploadCard uploadedImage={uploadedImage} onImageUpload={handleImageUpload} />
      <DiagnosisCard result={diagnosisResult} />
      <FloatingMic onSearch={handleVoiceSearch} isRecording={isRecording} setIsRecording={setIsRecording} language={selectedLanguage} />
    </div>
  );
}

export default Dashboard;
