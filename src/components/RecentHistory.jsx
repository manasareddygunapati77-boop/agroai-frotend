import React, { useEffect, useState } from "react";
import { getRecentByFeature } from "../services/history";
import "../styles/RecentHistory.css";

const FEATURES = [
  { type: "crop", icon: "🌱", labelEn: "Crop", labelTa: "பயிர்" },
  { type: "fertilizer", icon: "🧪", labelEn: "Fertilizer", labelTa: "உரம்" },
  { type: "irrigation", icon: "💧", labelEn: "Irrigation", labelTa: "நீர்ப்பாசனம்" },
  { type: "disease", icon: "🔬", labelEn: "Disease", labelTa: "நோய்" },
];

function getResultSummary(feature) {
  const result = feature.result_data || {};
  switch (feature.feature_type) {
    case "crop":
      return result.prediction || null;
    case "fertilizer":
      return result.recommended_fertilizer || null;
    case "irrigation":
      return result.recommended_irrigation || null;
    case "disease":
      return result.disease_prediction || null;
    default:
      return null;
  }
}

function RecentHistory({ selectedLanguage = "en" }) {
  const [recentItems, setRecentItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getRecentByFeature();
        setRecentItems(data);
      } catch (err) {
        console.error("Failed to fetch recent history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const hasAnyHistory = Object.values(recentItems).some((item) => item);

  if (loading) return null;
  if (!hasAnyHistory) return null;

  return (
    <div className="recent-history">
      <h3 className="recent-history-title">
        {selectedLanguage === "ta" ? "சமீபத்தியவை" : "Recent"}
      </h3>
      <div className="recent-history-grid">
        {FEATURES.map((f) => {
          const item = recentItems[f.type];
          const summary = item ? getResultSummary(item) : null;

          return (
            <div className="recent-history-card" key={f.type}>
              <div className="recent-history-icon">{f.icon}</div>
              <div className="recent-history-label">
                {selectedLanguage === "ta" ? f.labelTa : f.labelEn}
              </div>
              <div className="recent-history-value">
                {summary || (selectedLanguage === "ta" ? "தரவு இல்லை" : "No data yet")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentHistory;