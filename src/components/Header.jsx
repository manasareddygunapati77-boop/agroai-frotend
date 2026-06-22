import "../styles/Header.css";
import { translations } from "../utils/translations"; // import dictionary

function Header({ selectedLanguage = "en" }) {
  console.log("HEADER RENDERED");

  const t = translations[selectedLanguage];

  return (
    <header className="header">
      <div className="header-content">
        <h1>🌾 AgroAI</h1>
        <p>
          {selectedLanguage === "ta"
            ? "பயிர் பரிந்துரை மற்றும் நோய் கண்டறிதலுக்கான சمار்ட் விவசாய உதவியாளர்"
            : "Smart Farming Assistant for Crop Recommendation & Disease Detection"}
        </p>
      </div>
    </header>
  );
}

export default Header;
