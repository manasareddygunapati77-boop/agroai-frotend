import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import { translations } from "../utils/translations"; // import dictionary
import "../styles/MapComponent.css";

function MapComponent({ lat, lng, selectedLanguage = "en" }) {
  const t = translations[selectedLanguage];

  if (!lat || !lng) {
    return (
      <div className="map-placeholder">
        {selectedLanguage === "ta" ? "இடம் கிடைக்கவில்லை" : "No location available"}
      </div>
    );
  }

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="map-container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}>
          <Popup>
            {selectedLanguage === "ta" ? "உங்கள் தற்போதைய இடம்" : "Your Current Location"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
