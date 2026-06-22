import { useRef } from "react";
import { translations } from "../utils/translations"; // import dictionary
import "../styles/Uploadcard.css";

function UploadCard({ onImageUpload, uploadedImage, selectedLanguage = "en" }) {
  const fileRef = useRef();
  const t = translations[selectedLanguage];

  const handleClick = () => {
    fileRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
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

      <button onClick={handleClick}>
        {selectedLanguage === "ta" ? "படத்தைத் தேர்ந்தெடுக்கவும்" : "Choose Image"}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />
    </div>
  );
}

export default UploadCard;
