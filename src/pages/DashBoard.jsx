import { useState, useEffect } from "react";
import LocationSelector from "../components/LocationSelector";
import SearchBar from "../components/SearchBar";
import CropRecommendation from "../components/CropRecommendation";
import FertilizerRecommendation from "../components/FertilizerRecommendation";
import IrrigationRecommendation from "../components/IrrigationRecommendation";
import UploadCard from "../components/UploadCard";
import DiagnosisCard from "../components/DiagnosisCard";
import Sidebar from "../components/SideBar";
import BottomNav from "../components/BottomNav";
import { translations } from "../utils/translations";
import { searchCropOrDisease } from "../services/searchService";
import { predictDisease } from "../services/disease";
import { getWeather } from "../services/weather";
import "../styles/Dashboard.css";
import Settings from "../components/Settings";
import RecentHistory from "../components/RecentHistory";

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
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        selectedLanguage={selectedLanguage}
        setActivePage={setActivePage}
        setSelectedLanguage={setSelectedLanguage}
        activePage={activePage}
      />

      <div className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        <div className="logo">🌾 AgroAI</div>
      </div>

      {activePage === "home" && (
        <>
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

          <LocationSelector
            onLocationChange={handleLocationChange}
            selectedLanguage={selectedLanguage}
          />

          <div className="feature-tabs">
            <button onClick={() => setActivePage("crop")}><span style={{ fontSize: "1.6rem" }}>🌱</span> {t.crop}</button>
            <button onClick={() => setActivePage("fertilizer")}><span style={{ fontSize: "1.6rem" }}>🧪</span> {t.fertilizer}</button>
            <button onClick={() => setActivePage("irrigation")}><span style={{ fontSize: "1.6rem" }}>💧</span> {t.irrigation}</button>
            <button onClick={() => setActivePage("disease")}><span style={{ fontSize: "1.6rem" }}>🐛 </span>{t.disease}</button>
          </div>
        </>
        
      )}
<RecentHistory selectedLanguage={selectedLanguage} />
      {activePage === "crop" && (
        <CropRecommendation
          location={location}
          selectedLanguage={selectedLanguage}
          onBack={() => setActivePage("home")}
        />
      )}
      {activePage === "fertilizer" && (
        <FertilizerRecommendation
          weather={weather}
          selectedLanguage={selectedLanguage}
          onBack={() => setActivePage("home")}
        />
      )}
      {activePage === "irrigation" && (
        <IrrigationRecommendation
          location={location}
          weather={weather}
          selectedLanguage={selectedLanguage}
          onBack={() => setActivePage("home")}
        />
      )}
      {activePage === "disease" && (
  <div className="disease-section">
    <div className="page-header">
      <button className="back-btn" onClick={() => setActivePage("home")}>←</button>
      <h2>🐛 {selectedLanguage === "ta" ? "நோய் கண்டறிதல்" : "Disease Detection"}</h2>
    </div>
    <UploadCard onImageUpload={handleImageUpload} uploadedImage={uploadedImage} selectedLanguage={selectedLanguage} />
    <DiagnosisCard result={diagnosisResult} selectedLanguage={selectedLanguage} />
  </div>
)}
      {activePage === "settings" && (
  <Settings
    selectedLanguage={selectedLanguage}
    setSelectedLanguage={setSelectedLanguage}
    onBack={() => setActivePage("home")}
  />
)}
      <BottomNav activePage={activePage} setActivePage={setActivePage} selectedLanguage={selectedLanguage} />
    </div>
  );
}

export default Dashboard;