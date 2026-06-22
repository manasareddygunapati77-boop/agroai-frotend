import { useState } from "react";
import { translations } from "../utils/translations"; // import dictionary
import "../styles/Locationselector.css";

function LocationSelector({ onLocationChange, selectedLanguage = "en" }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const t = translations[selectedLanguage]; // pick labels based on language

  const locations = {
    // ... your existing states/districts/villages
  };

  // GPS LOCATION
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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();

          const currentLocation = {
            lat,
            lng,
            village:
              data.address.village ||
              data.address.hamlet ||
              data.address.suburb ||
              "Unknown",
            district:
              data.address.county ||
              data.address.city ||
              data.address.state_district ||
              "Unknown",
            state: data.address.state || "Unknown",
            source: "GPS",
          };

          setLocation(currentLocation);
          onLocationChange?.(currentLocation);
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

  // STATE CHANGE
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedDistrict("");
    setSelectedVillage("");
  };

  // DISTRICT CHANGE
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedVillage("");
  };

  // VILLAGE CHANGE
  const handleVillageChange = (e) => {
    const villageName = e.target.value;
    setSelectedVillage(villageName);

    const villageData = locations[selectedState][selectedDistrict].find(
      (item) => item.village === villageName
    );

    const manualLocation = {
      state: selectedState,
      district: selectedDistrict,
      village: villageData.village,
      lat: villageData.lat,
      lng: villageData.lng,
      source: "Manual",
    };

    setLocation(manualLocation);
    onLocationChange?.(manualLocation);
  };

  return (
    <div className="location-selector">
      <h2>{t.locationSelection}</h2>

      {/* GPS BUTTON */}
      <button className="gps-btn" onClick={getCurrentLocation}>
        {selectedLanguage === "ta" ? "தற்போதைய இடத்தைப் பயன்படுத்தவும்" : "Use Current Location"}
      </button>

      <div className="divider">
        <span>{selectedLanguage === "ta" ? "அல்லது" : "OR"}</span>
      </div>

      {/* STATE */}
      <select value={selectedState} onChange={handleStateChange}>
        <option value="">
          {selectedLanguage === "ta" ? "மாநிலத்தைத் தேர்ந்தெடுக்கவும்" : "Select State"}
        </option>
        {Object.keys(locations).map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      {/* DISTRICT */}
      {selectedState && (
        <select value={selectedDistrict} onChange={handleDistrictChange}>
          <option value="">
            {selectedLanguage === "ta" ? "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்" : "Select District"}
          </option>
          {Object.keys(locations[selectedState]).map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      )}

      {/* VILLAGE */}
      {selectedDistrict && (
        <select value={selectedVillage} onChange={handleVillageChange}>
          <option value="">
            {selectedLanguage === "ta" ? "கிராமத்தைத் தேர்ந்தெடுக்கவும்" : "Select Village"}
          </option>
          {locations[selectedState][selectedDistrict].map((village) => (
            <option key={village.village} value={village.village}>
              {village.village}
            </option>
          ))}
        </select>
      )}

      {/* ERROR */}
      {error && <p className="error-text">{error}</p>}

      {/* LOCATION DETAILS */}
      {location && (
        <div className="location-details">
          <h3>{selectedLanguage === "ta" ? "தேர்ந்தெடுக்கப்பட்ட இடம்" : "Selected Location"}</h3>
          <p>
            <strong>{selectedLanguage === "ta" ? "மாநிலம்:" : "State:"}</strong> {location.state}
          </p>
          <p>
            <strong>{selectedLanguage === "ta" ? "மாவட்டம்:" : "District:"}</strong> {location.district}
          </p>
          <p>
            <strong>{selectedLanguage === "ta" ? "கிராமம்:" : "Village:"}</strong> {location.village}
          </p>
          <p>
            <strong>{selectedLanguage === "ta" ? "அட்சரேகை:" : "Latitude:"}</strong> {location.lat.toFixed(6)}
          </p>
          <p>
            <strong>{selectedLanguage === "ta" ? "நெடுவரை:" : "Longitude:"}</strong> {location.lng.toFixed(6)}
          </p>
          <p>
            <strong>{selectedLanguage === "ta" ? "மூலம்:" : "Source:"}</strong> {location.source}
          </p>
        </div>
      )}
    </div>
  );
}

export default LocationSelector;
