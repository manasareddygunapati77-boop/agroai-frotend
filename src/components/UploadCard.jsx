import { useRef } from "react";
import { translations } from "../utils/translations";
import "../styles/Uploadcard.css";

function UploadCard({ onImageUpload, uploadedImage, selectedLanguage = "en" }) {
  const fileRef = useRef();
  const cameraRef = useRef();
  const t = translations[selectedLanguage];

  const handleFileClick = () => fileRef.current.click();
  const handleCameraClick = () => cameraRef.current.click();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <div className="upload-card">
      {uploadedImage ? (
        <img src={uploadedImage} alt="crop" className="preview" />
      ) : (
        <div className="upload-icon">📤</div>
      )}

      <h3>
        {selectedLanguage === "ta" ? "பயிர் படத்தை பதிவேற்றவும்" : "Upload Crop Image"}
      </h3>

      <div className="upload-buttons">
        <button onClick={handleFileClick}>
          {selectedLanguage === "ta" ? "படத்தைத் தேர்ந்தெடுக்கவும்" : "Choose Image"}
        </button>
        <button onClick={handleCameraClick}>
          {selectedLanguage === "ta" ? "கேமராவிலிருந்து எடுக்கவும்" : "Capture from Camera"}
        </button>
      </div>

      {/* File input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />

      {/* Camera input */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"  // opens rear camera on mobile
        hidden
        onChange={handleChange}
      />
    </div>
  );
}

export default UploadCard;
