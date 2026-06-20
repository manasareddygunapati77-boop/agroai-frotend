import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MapComponent({ lat, lng }) {
  if (!lat || !lng) return <p>No location selected</p>;

  return (
    <MapContainer center={[lat, lng]} zoom={10} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[lat, lng]}>
        <Popup>Selected Location</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapComponent;
