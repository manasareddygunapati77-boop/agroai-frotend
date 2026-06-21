import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Dashboard from "./pages/Dashboard";

function App() {
  console.log("🔥 APP RENDERED");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return loading ? <SplashScreen /> : <Dashboard />;
}

export default App;