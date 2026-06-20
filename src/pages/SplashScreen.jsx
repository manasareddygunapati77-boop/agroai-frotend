import "../styles/SplashScreen.css";

function SplashScreen() {
  return (
    <div className="splash">
      <div className="logo-box">
        <svg
          width="90"
          height="90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo"
        >
          <path d="M2 22c1.591 1 7 -1 7 -8V8c0-7-5.408-9-7-8"></path>
          <path d="M22 22c-1.591 1-7-1-7-8V8c0-7 5.408-9 7-8"></path>
        </svg>
      </div>

      <h1 className="title">AgroAI</h1>
      <p className="subtitle">Smart Crop Advisory for Farmers</p>

      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default SplashScreen;