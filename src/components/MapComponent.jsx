import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "../styles/MapComponent.css";

function MapComponent({ lat, lng }) {

  if (!lat || !lng) {
    return (
      <div className="map-placeholder">
        No location available
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
            Your Current Location
          </Popup>
        </Marker>

      </MapContainer>

    </div>
  );
}

export default MapComponent;