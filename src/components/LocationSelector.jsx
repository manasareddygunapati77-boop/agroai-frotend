import { useState } from "react";
import "../styles/LocationSelector.css";

function LocationSelector({ onLocationChange }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const locations = {
    "Andhra Pradesh": {
      Nellore: [
        { village: "Kovur", lat: 14.5000, lng: 79.9800 },
        { village: "Allipuram", lat: 14.4600, lng: 79.9500 },
        { village: "Buchireddypalem", lat: 14.5100, lng: 79.8800 },
      ],

      Guntur: [
        { village: "Pedapalakaluru", lat: 16.3300, lng: 80.4300 },
        { village: "Mangalagiri", lat: 16.4300, lng: 80.5600 },
        { village: "Tadikonda", lat: 16.3800, lng: 80.4500 },
      ],
    },

    Telangana: {
      Hyderabad: [
        { village: "Gachibowli", lat: 17.4400, lng: 78.3500 },
        { village: "Madhapur", lat: 17.4500, lng: 78.3900 },
      ],

      Warangal: [
        { village: "Hanamkonda", lat: 18.0000, lng: 79.5800 },
        { village: "Kazipet", lat: 17.9700, lng: 79.5200 },
      ],
    },
    TamilNadu: {
  Chennai: [
    { village: "Adyar", lat: 13.0067, lng: 80.2570 },
    { village: "Velachery", lat: 12.9790, lng: 80.2200 },
  ],

  Coimbatore: [
    { village: "Peelamedu", lat: 11.0330, lng: 77.0430 },
    { village: "Sulur", lat: 11.0250, lng: 77.1330 },
  ],

  Madurai: [
    { village: "Thiruparankundram", lat: 9.8820, lng: 78.0730 },
    { village: "Melur", lat: 10.0330, lng: 78.3330 },
  ],

  Thanjavur: [
    { village: "Kumbakonam", lat: 10.9600, lng: 79.3800 },
    { village: "Papanasam", lat: 10.9300, lng: 79.2700 },
  ],
}

  };

  // GPS LOCATION
  const getCurrentLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
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
            "Unable to identify location details."
          );
        }
      },
      (error) => {
        console.error(error);

        setError(
          "Unable to get GPS location. Use manual selection."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
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

    const villageData =
      locations[selectedState][selectedDistrict].find(
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
      <h2>📍 Location Selection</h2>

      {/* GPS BUTTON */}
      <button
        className="gps-btn"
        onClick={getCurrentLocation}
      >
        Use Current Location
      </button>

      <div className="divider">
        <span>OR</span>
      </div>

      {/* STATE */}
      <select
        value={selectedState}
        onChange={handleStateChange}
      >
        <option value="">
          Select State
        </option>

        {Object.keys(locations).map((state) => (
          <option
            key={state}
            value={state}
          >
            {state}
          </option>
        ))}
      </select>

      {/* DISTRICT */}
      {selectedState && (
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
        >
          <option value="">
            Select District
          </option>

          {Object.keys(
            locations[selectedState]
          ).map((district) => (
            <option
              key={district}
              value={district}
            >
              {district}
            </option>
          ))}
        </select>
      )}

      {/* VILLAGE */}
      {selectedDistrict && (
        <select
          value={selectedVillage}
          onChange={handleVillageChange}
        >
          <option value="">
            Select Village
          </option>

          {locations[selectedState][
            selectedDistrict
          ].map((village) => (
            <option
              key={village.village}
              value={village.village}
            >
              {village.village}
            </option>
          ))}
        </select>
      )}

      {/* ERROR */}
      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      {/* LOCATION DETAILS */}
      {location && (
        <div className="location-details">
          <h3>Selected Location</h3>

          <p>
            <strong>State:</strong>{" "}
            {location.state}
          </p>

          <p>
            <strong>District:</strong>{" "}
            {location.district}
          </p>

          <p>
            <strong>Village:</strong>{" "}
            {location.village}
          </p>

          <p>
            <strong>Latitude:</strong>{" "}
            {location.lat.toFixed(6)}
          </p>

          <p>
            <strong>Longitude:</strong>{" "}
            {location.lng.toFixed(6)}
          </p>

          <p>
            <strong>Source:</strong>{" "}
            {location.source}
          </p>
        </div>
      )}
    </div>
  );
}

export default LocationSelector;