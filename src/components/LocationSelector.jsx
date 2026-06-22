import { useState, useEffect } from "react";
import { translations } from "../utils/translations";
import "../styles/Locationselector.css";

function LocationSelector({ onLocationChange, selectedLanguage = "en" }) {
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [location, setLocation] = useState(null);

  const t = translations[selectedLanguage];
  const getCurrentLocation = () => {
  setError("");

  if (!navigator.geolocation) {
    setError(
      selectedLanguage === "ta"
        ? "புவியியல் இடம் ஆதரிக்கப்படவில்லை."
        : "Geolocation is not supported."
    );
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        // Reverse geocode using Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();

        const detectedDistrict =
          data.address.county ||
          data.address.city ||
          data.address.state_district ||
          "Unknown";

        const detectedMandal =
          data.address.suburb ||
          data.address.town ||
          data.address.village ||
          "Unknown";

        const currentLocation = {
          state: data.address.state || "TamilNadu",
          district: detectedDistrict,
          mandal: detectedMandal,
          lat,
          lng,
          source: "GPS",
        };

        setLocation(currentLocation);
        onLocationChange?.(currentLocation);

        // Optionally: auto‑select dropdowns
        setSelectedDistrict(detectedDistrict);
        setSelectedMandal(detectedMandal);
      } catch (err) {
        console.error(err);
        setError(
          selectedLanguage === "ta"
            ? "இட விவரங்களை கண்டறிய முடியவில்லை."
            : "Unable to identify location details."
        );
      }
    },
    (error) => {
      console.error(error);
      setError(
        selectedLanguage === "ta"
          ? "GPS இடத்தை பெற முடியவில்லை. கையேடு தேர்வைப் பயன்படுத்தவும்."
          : "Unable to get GPS location. Use manual selection."
      );
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
};


  // 🔹 Fetch districts once
  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://agritech-real-time-ai-backend.onrender.com/tn-districts"
        ); // ✅ districts API
        const data = await res.json();
        setDistricts(data.districts || []); // API should return { "districts": ["Thanjavur", "Madurai", ...] }
      } catch (err) {
        console.error(err);
        setError(
          selectedLanguage === "ta"
            ? "மாவட்டங்களை ஏற்ற முடியவில்லை."
            : "Failed to load districts."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, [selectedLanguage]);

  // 🔹 When district changes, fetch mandals
  const handleDistrictChange = async (e) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    setSelectedMandal("");
    setMandals([]);
    setLocation(null);

    if (!districtName) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://agritech-real-time-ai-backend.onrender.com/tn-taluks/${encodeURIComponent(
          districtName
        )}`
      ); // ✅ mandals API
      const data = await res.json();
      setMandals(data.taluks || []); // API should return { "taluks": ["Kumbakonam", "Orathanadu", ...] }
    } catch (err) {
      console.error(err);
      setError(
        selectedLanguage === "ta"
          ? "தாலுகாவை ஏற்ற முடியவில்லை."
          : "Failed to load mandals."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 When mandal selected
  const handleMandalChange = (e) => {
    const mandalName = e.target.value;
    setSelectedMandal(mandalName);

    const manualLocation = {
      state: "TamilNadu",
      district: selectedDistrict,
      mandal: mandalName,
      source: "Manual",
    };

    setLocation(manualLocation);
    onLocationChange?.(manualLocation);
  };

  return (
    <div className="location-selector">
      <h2>{t.locationSelection}</h2>

      {loading && (
        <p>{selectedLanguage === "ta" ? "ஏற்றுகிறது..." : "Loading..."}</p>
      )}
      {error && <p className="error-text">{error}</p>}

      {/* DISTRICT */}
      <select value={selectedDistrict} onChange={handleDistrictChange}>
        <option value="">
          {selectedLanguage === "ta"
            ? "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்"
            : "Select District"}
        </option>
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>

      {/* TALUKA / MANDAL */}
      {selectedDistrict && (
        <select value={selectedMandal} onChange={handleMandalChange}>
          <option value="">
            {selectedLanguage === "ta"
              ? "தாலுகாவைத் தேர்ந்தெடுக்கவும்"
              : "Select Taluka"}
          </option>
          {mandals.map((mandal) => (
            <option key={mandal} value={mandal}>
              {mandal}
            </option>
          ))}
        </select>
      )}

      {/* LOCATION DETAILS */}
      {location && (
        <div className="location-details">
          <h3>
            {selectedLanguage === "ta"
              ? "தேர்ந்தெடுக்கப்பட்ட இடம்"
              : "Selected Location"}
          </h3>
          <p>
            <strong>{selectedLanguage === "ta" ? "மாநிலம்:" : "State:"}</strong>{" "}
            {location.state}
          </p>
          <p>
            <strong>
              {selectedLanguage === "ta" ? "மாவட்டம்:" : "District:"}
            </strong>{" "}
            {location.district}
          </p>
          <p>
            <strong>
              {selectedLanguage === "ta" ? "தாலுகா:" : "Taluka:"}
            </strong>{" "}
            {location.mandal}
          </p>
          <p>
            <strong>
              {selectedLanguage === "ta" ? "மூலம்:" : "Source:"}
            </strong>{" "}
            {location.source}
          </p>
        </div>
      )}
      <button className="gps-btn" onClick={getCurrentLocation}>
  {selectedLanguage === "ta"
    ? "தற்போதைய இடத்தைப் பயன்படுத்தவும்"
    : "Use Current Location"}
</button>

    </div>
  );
}

export default LocationSelector;
