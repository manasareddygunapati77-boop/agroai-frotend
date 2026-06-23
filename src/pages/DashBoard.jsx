import { useState, useEffect } from "react";
import LocationSelector from "../components/LocationSelector";
import SearchBar from "../components/SearchBar";
import CropRecommendation from "../components/CropRecommendation";
import FertilizerRecommendation from "../components/FertilizerRecommendation";
import IrrigationRecommendation from "../components/IrrigationRecommendation";
import UploadCard from "../components/UploadCard";
import DiagnosisCard from "../components/DiagnosisCard";
import Sidebar from "../components/Sidebar";
import { translations } from "../utils/translations";
import { searchCropOrDisease } from "../services/searchService";
import { predictDisease } from "../services/disease";
import { getWeather } from "../services/weather";
import "../styles/Dashboard.css";

function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
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
  const [activePage, setActivePage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔹 Fetch weather when location changes
  const handleLocationChange = async (selectedLocation) => {
    setLocation(selectedLocation);
    try {
      const locString =
        selectedLocation?.mandal ||
        selectedLocation?.district ||
        selectedLocation?.state ||
        "Unknown";
      const res = await getWeather(locString);
      setWeather(res);
    } catch (err) {
      console.error("Weather fetch failed:", err);
    }
  };

  // 🔹 Search logic
  const handleSearch = async (searchText = query) => {
    if (!searchText?.trim()) return;
    try {
      setIsSearching(true);
      const results = await searchCropOrDisease(searchText);
      setSearchResults(results.answer);

      const saved = JSON.parse(localStorage.getItem("advisories")) || [];
      saved.unshift({
        query: searchText,
        answer: results.answer,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem("advisories", JSON.stringify(saved));

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

  // 🔹 Translate to Tamil
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

  // 🔹 Image upload + disease detection
  const handleImageUpload = async (file) => {
    setUploadedImage(URL.createObjectURL(file));
    try {
      const response = await predictDisease(file);
      const prediction = response.disease_prediction || "";
      const lines = prediction.split("\n");
      let disease =
        lines[0]?.replace("Disease: ", "").replaceAll("__", " - ").replaceAll("_", " ") || "Unknown";
      let confidence = lines[1]?.replace("Confidence: ", "") || "N/A";

      if (selectedLanguage === "ta") disease = await handleTranslateToTamil(disease);
      setDiagnosisResult({ disease, confidence, status: response.status });
    } catch (error) {
      console.error(error);
      setDiagnosisResult({ disease: "Detection Failed", confidence: "-", status: "error" });
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        selectedLanguage={selectedLanguage}
        setActivePage={setActivePage}
        setSelectedLanguage={setSelectedLanguage}
      />

      {/* Header */}
      <div className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        <div className="logo">🌾 AgroAI</div>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>{selectedLanguage === "ta" ? "வணக்கம்! 👋" : "Vanakkam! 👋"}</h2>
        <p className="subtitle">
          {selectedLanguage === "ta" ? "செயற்கை நுண்ணறிவு விவசாய உதவியாளர்" : "Smart Farming Assistant"}
        </p>
        <div className="location-weather">
          <span>📍 {location?.district || "Select Location"}</span>
          <span>☀️ {weather?.temperature || "Loading..."}</span>
        </div>
      </div>

      {/* Location Selector */}
      <LocationSelector
        onLocationChange={handleLocationChange}
        selectedLanguage={selectedLanguage}
      />

      {/* Search Section */}
      <div className="search-section">
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          selectedLanguage={selectedLanguage}
          isRecording={isRecording}
          toggleRecording={() => setIsRecording(!isRecording)}
        />
      </div>

      {/* Feature Tabs */}
      <div className="feature-tabs">
        <button onClick={() => setActivePage("crop")}>🌱 {t.crop}</button>
        <button onClick={() => setActivePage("fertilizer")}>🧪 {t.fertilizer}</button>
        <button onClick={() => setActivePage("irrigation")}>💧 {t.irrigation}</button>
        <button onClick={() => setActivePage("disease")}>🐛 {t.disease}</button>
      </div>

      {/* Pages */}
      {activePage === "crop" && <CropRecommendation location={location} selectedLanguage={selectedLanguage} />}
      {activePage === "fertilizer" && <FertilizerRecommendation weather={weather} selectedLanguage={selectedLanguage} />}
      {activePage === "irrigation" && <IrrigationRecommendation location={location} weather={weather} selectedLanguage={selectedLanguage} />}
      {activePage === "disease" && (
        <div className="disease-section">
          <UploadCard onImageUpload={handleImageUpload} uploadedImage={uploadedImage} selectedLanguage={selectedLanguage} />
          <DiagnosisCard result={diagnosisResult} selectedLanguage={selectedLanguage} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
