import "../styles/Header.css";
function Header() {
  console.log("HEADER RENDERED");

  return (
    <header className="header">
      <div className="header-content">
        <h1>🌾 AgroAI</h1>
        <p>
          Smart Farming Assistant for Crop Recommendation &
          Disease Detection
        </p>
      </div>
    </header>
  );
}

export default Header;